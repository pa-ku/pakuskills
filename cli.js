#!/usr/bin/env node

import * as p from '@clack/prompts';
import { Octokit } from '@octokit/rest';
import degit from 'degit';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const REPO_OWNER = 'pa-ku';
const REPO_NAME = 'paku-skills';

const HOME = os.homedir();

const TARGETS = [
  {
    value: 'opencode',
    label: 'opencode (proyecto)',
    hint: '.opencode/skills/',
    dir: path.join('.opencode', 'skills'),
  },
  {
    value: 'opencode-global',
    label: 'opencode (global)',
    hint: '~/.config/opencode/skills/',
    dir: path.join(HOME, '.config', 'opencode', 'skills'),
  },
  {
    value: 'generic',
    label: 'Genérico Agent Skills (proyecto)',
    hint: '.agents/skills/ — VS Code, Copilot, Codex, opencode',
    dir: path.join('.agents', 'skills'),
  },
  {
    value: 'generic-global',
    label: 'Genérico Agent Skills (global)',
    hint: '~/.agents/skills/',
    dir: path.join(HOME, '.agents', 'skills'),
  },
  {
    value: 'claude',
    label: 'Claude Code (proyecto)',
    hint: '.claude/skills/',
    dir: path.join('.claude', 'skills'),
  },
  {
    value: 'claude-global',
    label: 'Claude Code (personal)',
    hint: '~/.claude/skills/',
    dir: path.join(HOME, '.claude', 'skills'),
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
  const { data } = await octokit.repos.getContent({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: '',
  });

  return data
    .filter((item) => item.type === 'dir' && !item.name.startsWith('.'))
    .map((item) => ({ value: item.name, label: item.name }));
}

async function main() {
  if (!process.stdin.isTTY) {
    console.error(
      '✕ Este instalador necesita una terminal interactiva. Ejecútalo desde tu shell, no desde un pipeline.',
    );
    process.exitCode = 1;
    return;
  }

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
      initialValue: 'opencode',
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

  let skills;
  try {
    skills = await fetchCatalog();
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

  if (skills.length === 0) {
    p.outro('No se encontraron carpetas de skills en el repositorio.');
    return;
  }

  const selectedSkills = await p.multiselect({
    message: 'Selecciona las skills que deseas instalar:',
    options: skills,
    required: true,
  });

  if (p.isCancel(selectedSkills)) {
    p.cancel('Operación cancelada.');
    process.exitCode = 0;
    return;
  }

  const installed = [];

  for (const skill of selectedSkills) {
    const targetDir = path.join(target.dir, skill);

    if (fs.existsSync(targetDir)) {
      const overwrite = await p.confirm({
        message: `'${skill}' ya existe en ${targetDir}. ¿Sobreescribir?`,
        initialValue: false,
      });

      if (p.isCancel(overwrite)) {
        p.cancel('Operación cancelada.');
        process.exitCode = 0;
        return;
      }

      if (!overwrite) {
        p.log.warn(`Skill '${skill}' omitida (ya existía).`);
        continue;
      }
    }

    const installSpinner = p.spinner();
    installSpinner.start(`Instalando ${skill}...`);

    try {
      const degitInstance = degit(`${REPO_OWNER}/${REPO_NAME}/${skill}`, {
        force: true,
        verbose: false,
      });
      await degitInstance.clone(targetDir);
      installed.push(skill);
      installSpinner.stop(`✓ Skill '${skill}' instalada en ${targetDir}`);
    } catch (err) {
      installSpinner.stop(`✕ Falló la instalación de '${skill}'.`);
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
