# pakuskills

Interactive installer for the [pa-ku/paku-skills](https://github.com/pa-ku/paku-skills) catalog. Pick a destination and some skills, and they land as standard `SKILL.md` folders your agent tools can load.

## Quick start

```bash
npx pakuskills
```

Requires Node.js 20+ and an interactive terminal.

## What it does

1. Lists the skill folders published in `pa-ku/paku-skills`
2. Asks where you want them installed
3. Lets you multiselect the skills
4. Downloads each one with `degit` (no git history, no full clone)

```
⚡ PAKU SKILLS INSTALLER
◇ Destino: .opencode/skills
◇ Catálogo cargado correctamente.
◇ Instalando design-system-builder...
✓ Skill 'design-system-builder' instalada
```

## Install targets

| Target | Path | Loaded by |
|--------|------|-----------|
| opencode (project) | `.opencode/skills/` | opencode in this repo |
| opencode (global) | `~/.config/opencode/skills/` | opencode, all projects |
| Generic Agent Skills (project) | `.agents/skills/` | VS Code, Copilot, Codex, opencode |
| Generic Agent Skills (global) | `~/.agents/skills/` | same, all projects |
| Claude Code (project) | `.claude/skills/` | Claude Code in this repo |
| Claude Code (personal) | `~/.claude/skills/` | Claude Code, all projects |

The default is `.opencode/skills/`. The three target families follow the [Agent Skills](https://agentskills.io) open standard — the same `SKILL.md` folder works across tools.

## Environment variables

| Variable | Effect |
|----------|--------|
| `PAKU_SKILLS_TARGET` | Skips the destination prompt. One of `opencode`, `opencode-global`, `generic`, `generic-global`, `claude`, `claude-global`. |
| `GITHUB_TOKEN` | Optional. Raises the GitHub API rate limit from 60 to 5000 requests/hour. |

```bash
# Example: install into ~/.agents/skills without the prompt
PAKU_SKILLS_TARGET=generic-global npx pakuskills
```

## How to add a skill to the catalog

Skills live in [`pa-ku/paku-skills`](https://github.com/pa-ku/paku-skills), one folder per skill at the repository root. The installer only lists root directories, so keep skill folders flat and free of dot-prefixed names.

Each folder needs a `SKILL.md` whose frontmatter `name` matches the folder name, or VS Code and opencode silently skip it:

```markdown
---
name: my-skill
description: What this skill does and when to use it.
---

## Instructions
...
```

## Development

```bash
pnpm install
pnpm check   # syntax check
pnpm start   # run locally (needs an interactive terminal)
```

| | |
|---|---|
| Runtime | ESM only, no build step, single file `cli.js` |
| Package manager | pnpm |
| License | MIT |

## Troubleshooting

| Symptom | Cause |
|---------|-------|
| `✕ Este instalador necesita una terminal interactiva` | You ran it in a pipeline or CI script. Use an interactive shell, or set `PAKU_SKILLS_TARGET` and run from a real terminal. |
| `rate limit de GitHub` | Unauthenticated API is capped at 60 requests/hour. Export `GITHUB_TOKEN`. |
| `GitHub respondió 404` | The catalog repo name or owner changed. Update `REPO_OWNER`/`REPO_NAME` in `cli.js`. |
| Skill installed but not showing up | The frontmatter `name` does not match the folder name, or the file is not named `SKILL.md`. |
| Skill already exists prompt | The installer asks before overwriting. `No` skips that skill. |

## License

MIT © pa-ku
