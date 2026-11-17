#!/usr/bin/env node

import * as p from '@clack/prompts';
import { Octokit } from '@octokit/rest';
import degit from 'degit';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { createRequire } from 'node:module';

const { version: VERSION } = createRequire(import.meta.url)('./package.json');

const REPO_OWNER = 'pa-ku';
const REPO_NAME = 'pakuskills';
const SKILLS_PATH = 'SKILLS';
const GENERAL_GROUP = 'General';

const HOME = os.homedir();

const TARGETS = [
  {
    value: 'agents',
    label: 'Proyecto (local)',
    hint: '.agents/skills/ — VS Code, Copilot, Codex, opencode',
    dir: path.join('.agents', 'skills'),
  },
  {
    value: 'agents-global',
    label: 'Global (usuario)',
    hint: '~/.agents/skills/ — todos los proyectos',
    dir: path.join(HOME, '.agents', 'skills'),
  },
];

function resolveTarget() {
  const fromEnv = process.env.PAKU_SKILLS_TARGET;
  if (!fromEnv) return null;

  const match = TARGETS.find((t) => t.value === fromEnv);
  if (!match) {
    throw new Error(
      `PAKU_SKILLS_TARGET inválido: '${fromEnv}'. Valores válidos: ${TARGETS.map((t) => t.value).join(', ')}`,
    );
  }
  return match;
}

async function fetchCatalog() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const { data } = await octokit.git.getTree({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    tree_sha: 'HEAD',
    recursive: '1',
  });

  const prefix = `${SKILLS_PATH}/`;
  const skills = [];
  const skipped = [];

  for (const entry of data.tree) {
    if (entry.type !== 'blob' || !entry.path.startsWith(prefix)) continue;
    if (!entry.path.endsWith('/SKILL.md')) continue;

    // Layout: SKILLS/<GRUPO>/<skill>/SKILL.md o SKILLS/<skill>/SKILL.md
    const parts = entry.path.slice(prefix.length).split('/');
    let group;
    let name;

    if (parts.length === 3) {
      [group, name] = parts;
    } else if (parts.length === 2) {
      group = GENERAL_GROUP;
      name = parts[0];
    } else {
      continue;
    }

    skills.push({
      value: `${group}/${name}`,
      group,
      name,
      repoPath: entry.path.slice(0, -'/SKILL.md'.length),
    });
  }

  const skillPaths = new Set(skills.map((skill) => skill.repoPath));

  for (const entry of data.tree) {
    if (entry.type !== 'tree' || !entry.path.startsWith(prefix)) continue;

    // Solo carpetas de skill candidatas: <GRUPO>/<skill>
    const parts = entry.path.slice(prefix.length).split('/');
    if (parts.length !== 2) continue;

    if (!skillPaths.has(entry.path)) {
      skipped.push(entry.path.slice(prefix.length));
    }
  }

  skills.sort(
    (a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name),
  );
  skipped.sort();

  return { skills, skipped, truncated: Boolean(data.truncated) };
}

function groupOptions(skills) {
  const groups = {};

  for (const skill of skills) {
    (groups[skill.group] ??= []).push({
      value: skill.value,
      label: skill.name,
    });
  }

  return groups;
}

function duplicatedNames(skills) {
  const counts = new Map();
  for (const skill of skills) {
    counts.set(skill.name, (counts.get(skill.name) ?? 0) + 1);
  }
  return [...counts].filter(([, count]) => count > 1).map(([name]) => name);
}

// Wordmark "PAKUSKILLS" en bloques ▀▄█ (4 filas, ~61 columnas).
const BANNER = [
  '▄▀▀▀▄ ▄▀▀▀▄ █  ▄▀ █   █ ▄▀▀▀▀ █  ▄▀ ▀▀█▀▀ █     █     ▄▀▀▀▀',
  '█▄▄▄▀ █▄▄▄█ █▄▀   █   █ ▀▄▄▄  █▄▀     █   █     █     ▀▄▄▄',
  '█     █   █ █ ▀▄  █   █     █ █ ▀▄    █   █     █         █',
  '▀     ▀   ▀ ▀   ▀  ▀▀▀  ▀▀▀▀  ▀   ▀ ▀▀▀▀▀ ▀▀▀▀▀ ▀▀▀▀▀ ▀▀▀▀',
];
const BANNER_INDENT = '  ';
const BANNER_WIDTH = BANNER[0].length;

// cyan → indigo → pink
const GRADIENT = [
  [34, 211, 238],
  [129, 140, 248],
  [244, 114, 182],
];

const SHINE_FRAMES = 24;
const SHINE_FRAME_MS = 38;
const SHINE_SIGMA = 8.5;

function supportsColor() {
  if (process.env.NO_COLOR || process.env.TERM === 'dumb') return false;
  return Boolean(process.stdout.isTTY);
}

const COLOR = supportsColor();

function supportsAnimation() {
  if (!COLOR) return false;
  if (process.env.PAKU_SKILLS_NO_ANIM) return false;
  if (process.env.CI) return false;
  return true;
}

function mixRgb(from, to, amount) {
  return from.map((value, index) =>
    Math.round(value + (to[index] - value) * amount),
  );
}

function gradientAt(position) {
  const clamped = Math.min(1, Math.max(0, position));
  const scaled = clamped * (GRADIENT.length - 1);
  const index = Math.min(GRADIENT.length - 2, Math.floor(scaled));
  return mixRgb(GRADIENT[index], GRADIENT[index + 1], scaled - index);
}

function paint(rgb, text) {
  return `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m${text}\x1b[0m`;
}

function versionLine() {
  const label = `v${VERSION}`;
  const padding = ' '.repeat(
    Math.max(0, BANNER_INDENT.length + BANNER_WIDTH - label.length),
  );
  return `${padding}${COLOR ? `\x1b[2m${label}\x1b[0m` : label}`;
}

function renderBanner(shine) {
  if (!COLOR) {
    return [...BANNER.map((line) => `${BANNER_INDENT}${line}`), versionLine()];
  }

  const lines = BANNER.map((line, row) => {
    let output = BANNER_INDENT;

    for (let column = 0; column < line.length; column += 1) {
      const char = line[column];

      if (char === ' ') {
        output += ' ';
        continue;
      }

      const position =
        0.75 * (column / (BANNER_WIDTH - 1)) +
        0.25 * (row / (BANNER.length - 1));
      let rgb = gradientAt(position);

      if (shine) {
        const amount = shine(column, row);

        if (amount > 0) {
          rgb = rgb.map((value) => Math.round(value + (255 - value) * amount));
        }
      }

      output += paint(rgb, char);
    }

    return output;
  });

  lines.push(versionLine());
  return lines;
}

async function printBanner() {
  const columns = process.stdout.columns || 80;

  if (columns < BANNER_WIDTH + BANNER_INDENT.length + 2) {
    const suffix = COLOR ? `\x1b[2mv${VERSION}\x1b[0m` : `v${VERSION}`;
    process.stdout.write(`${BANNER_INDENT}PAKUSKILLS ${suffix}\n\n`);
    return;
  }

  if (!COLOR || !supportsAnimation()) {
    process.stdout.write(`${renderBanner(null).join('\n')}\n\n`);
    return;
  }

  const travel = BANNER_WIDTH + 40;

  process.stdout.write('\x1b[?25l');

  try {
    for (let frame = 0; frame < SHINE_FRAMES; frame += 1) {
      const center = -20 + (travel * frame) / (SHINE_FRAMES - 1);
      const shine =
        frame === SHINE_FRAMES - 1
          ? null
          : (column) =>
              0.85 *
              Math.exp(-((column - center) ** 2) / (2 * SHINE_SIGMA ** 2));
      const lines = renderBanner(shine);

      if (frame > 0) process.stdout.write(`\x1b[${lines.length}A`);
      process.stdout.write(`${lines.join('\n')}\n`);

      if (frame < SHINE_FRAMES - 1) await sleep(SHINE_FRAME_MS);
    }
  } finally {
    process.stdout.write('\x1b[?25h');
  }

  process.stdout.write('\n');
}

async function main() {
  if (process.argv.includes('--version') || process.argv.includes('-v')) {
    process.stdout.write(`PAKUSKILLS v${VERSION}\n`);
    return;
  }

  if (!process.stdin.isTTY) {
    console.error(
      '✕ Este instalador necesita una terminal interactiva. Ejecútalo desde tu shell, no desde un pipeline.',
    );
    process.exitCode = 1;
    return;
  }

  await printBanner();

  let target;
  try {
    target = resolveTarget();
  } catch (err) {
    p.cancel(err.message);
    process.exitCode = 1;
    return;
  }

  if (!target) {
    target = await p.select({
      message: '¿Dónde querés instalar las skills?',
      options: TARGETS.map((t) => ({
        value: t.value,
        label: t.label,
        hint: t.hint,
      })),
      initialValue: 'agents',
    });

    if (p.isCancel(target)) {
      p.cancel('Operación cancelada.');
      process.exitCode = 0;
      return;
    }

    target = TARGETS.find((t) => t.value === target);
  }

  p.log.info(`Destino: ${target.dir}`);

  const spinner = p.spinner();
  spinner.start('Obteniendo catálogo de skills...');

  let catalog;
  try {
    catalog = await fetchCatalog();
  } catch (err) {
    spinner.stop('✕ No se pudo obtener el catálogo.');
    const reason =
      err.status === 403
        ? 'rate limit de GitHub (exporta GITHUB_TOKEN para subirlo)'
        : err.status
          ? `GitHub respondió ${err.status}`
          : 'sin conexión con GitHub';
    p.cancel(`Error consultando ${REPO_OWNER}/${REPO_NAME}: ${reason}.`);
    process.exitCode = 1;
    return;
  }

  spinner.stop('Catálogo cargado correctamente.');

  const { skills, skipped, truncated } = catalog;

  if (truncated) {
    p.log.warn(
      'El árbol del repositorio vino truncado: puede faltar alguna skill.',
    );
  }

  if (skipped.length > 0) {
    p.log.warn(`Omitidas por no tener SKILL.md: ${skipped.join(', ')}`);
  }

  const duplicated = duplicatedNames(skills);
  if (duplicated.length > 0) {
    p.log.warn(
      `Hay skills con el mismo nombre en distintos grupos: ${duplicated.join(', ')}. Se instalaría una sola vez.`,
    );
  }

  if (skills.length === 0) {
    p.outro(`No se encontraron skills con SKILL.md en ${SKILLS_PATH}/.`);
    return;
  }

  const selectedSkills = await p.groupMultiselect({
    message: 'Selecciona las skills que deseas instalar:',
    options: groupOptions(skills),
    required: true,
  });

  if (p.isCancel(selectedSkills)) {
    p.cancel('Operación cancelada.');
    process.exitCode = 0;
    return;
  }

  const byValue = new Map(skills.map((skill) => [skill.value, skill]));
  const installed = [];

  for (const value of selectedSkills) {
    const skill = byValue.get(value);
    const targetDir = path.join(target.dir, skill.name);

    if (fs.existsSync(targetDir)) {
      const overwrite = await p.confirm({
        message: `'${skill.name}' ya existe en ${targetDir}. ¿Sobreescribir?`,
        initialValue: false,
      });

      if (p.isCancel(overwrite)) {
        p.cancel('Operación cancelada.');
        process.exitCode = 0;
        return;
      }

      if (!overwrite) {
        p.log.warn(`Skill '${skill.name}' omitida (ya existía).`);
        continue;
      }
    }

    const installSpinner = p.spinner();
    installSpinner.start(`Instalando ${skill.name}...`);

    try {
      const degitInstance = degit(
        `${REPO_OWNER}/${REPO_NAME}/${skill.repoPath}`,
        {
          force: true,
          verbose: false,
        },
      );
      await degitInstance.clone(targetDir);
      installed.push(skill.name);
      installSpinner.stop(`✓ Skill '${skill.name}' instalada en ${targetDir}`);
    } catch (err) {
      installSpinner.stop(`✕ Falló la instalación de '${skill.name}'.`);
      p.log.error(err.message);
    }
  }

  if (installed.length === 0) {
    p.outro('No se instaló ninguna skill.');
    process.exitCode = 1;
    return;
  }

  p.outro(
    `¡${installed.length} skill${installed.length === 1 ? '' : 's'} instalada${installed.length === 1 ? '' : 's'} en ${target.dir}!`,
  );
}

main().catch((err) => {
  if (process.env.DEBUG) console.error(err);
  console.error(`✕ Error inesperado: ${err.message}`);
  process.exitCode = 1;
});
