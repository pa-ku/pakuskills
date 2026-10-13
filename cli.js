#!/usr/bin/env node

import * as p from '@clack/prompts';
import { Octokit } from '@octokit/rest';
import execa from 'execa';
import path from 'path';

const REPO_OWNER = 'pa-ku';
const REPO_NAME = 'paku-skills';

async function main() {
  p.intro('⚡ PAKU SKILLS INSTALLER');

  const octokit = new Octokit();
  
  const spinner = p.spinner();
  spinner.start('Obteniendo catálogo de skills...');

  // 1. Obtener la lista de carpetas del repositorio en GitHub
  const { data } = await octokit.repos.getContent({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: '',
  });

  // Filtrar solo carpetas (ignorando archivos .skill o .md en la raíz)
  const skills = data
    .filter(item => item.type === 'dir' && !item.name.startsWith('.'))
    .map(item => ({ value: item.name, label: item.name }));

  spinner.stop('Catálogo cargado correctamente.');

  if (skills.length === 0) {
    p.outro('No se encontraron carpetas de skills en el repositorio.');
    return;
  }

  // 2. Mostrar menú de selección múltiple al usuario
  const selectedSkills = await p.multiselect({
    message: 'Selecciona las skills que deseas instalar en tu proyecto:',
    options: skills,
    required: true,
  });

  if (p.isCancel(selectedSkills)) {
    p.cancel('Operación cancelada.');
    process.exit(0);
  }

  // 3. Descargar las skills seleccionadas a .opencode/skills/
  for (const skill of selectedSkills) {
    const installSpinner = p.spinner();
    installSpinner.start(`Instalando ${skill}...`);
    
    const targetDir = path.join('.opencode', 'skills', skill);
    
    // Ejecuta degit para descargar la carpeta exacta sin historial git
    await execa('npx', ['degit', `${REPO_OWNER}/${REPO_NAME}/${skill}`, targetDir, '--force']);
    
    installSpinner.stop(`✓ Skill '${skill}' instalada en ${targetDir}`);
  }

  p.outro('¡Todas las skills seleccionadas se han instalado correctamente!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});