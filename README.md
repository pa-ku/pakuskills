# pakuskills

Interactive installer for the skills shipped in this repo. Pick a destination and some skills, and they land as standard `SKILL.md` folders your agent tools can load.

## Quick start

```bash
npx pakuskills
```

Requires Node.js 20+ and an interactive terminal. `npx pakuskills --version` (or `-v`) prints the version and exits without touching the network.

## What it does

1. Lists the skills published in [`SKILLS/`](https://github.com/pa-ku/pakuskills/tree/main/SKILLS) of this repo, grouped by category (`CODE`, `DESIGN`, …)
2. Asks where you want them installed
3. Lets you pick individual skills; space on a category header toggles the whole group
4. Downloads each one with `degit` (no git history, no full clone) into a flat `<target>/<skill>/` folder

```
◇ Destino: .agents/skills
◇ Instalando atomic-design...
✓ Skill 'atomic-design' instalada en .agents/skills/atomic-design
```

## Install targets

| Target | Path | Loaded by |
|--------|------|-----------|
| Project (local) | `.agents/skills/` | VS Code, Copilot, Codex, opencode in this repo |
| Global (user) | `~/.agents/skills/` | same, all projects |

The default is `.agents/skills/`. Both targets follow the [Agent Skills](https://agentskills.io) open standard — the same `SKILL.md` folder works across tools, so you no longer pick a specific agent.

## Environment variables

| Variable | Effect |
|----------|--------|
| `PAKU_SKILLS_TARGET` | Skips the destination prompt. One of `agents`, `agents-global`. |
| `GITHUB_TOKEN` | Optional. Raises the GitHub API rate limit from 60 to 5000 requests/hour. |
| `DEBUG` | Optional. Prints the full stack trace on unexpected errors. |
| `PAKU_SKILLS_NO_ANIM` | Optional. Skips the banner shine animation and prints the static wordmark. Also implied by `CI` or `NO_COLOR`. |

```bash
# Example: install into ~/.agents/skills without the prompt
PAKU_SKILLS_TARGET=agents-global npx pakuskills
```

## How to add a skill to the catalog

Skills live in the [`SKILLS/`](https://github.com/pa-ku/pakuskills/tree/main/SKILLS) folder of this repo, grouped by category:

```
SKILLS/
  CODE/
    atomic-design/SKILL.md
    design-system-builder/SKILL.md
  DESIGN/
    flyer-digital/SKILL.md
```

The installer reads the repo tree and only lists folders that contain a `SKILL.md`. Each folder needs one whose frontmatter `name` matches the folder name, or VS Code and opencode silently skip it:

```markdown
---
name: my-skill
description: What this skill does and when to use it.
---

## Instructions
...
```

To add a new category, create a folder directly under `SKILLS/`. A skill folder placed directly under `SKILLS/` is listed under the `General` group.

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
| `PAKU_SKILLS_TARGET inválido` | The value does not match any target. Valid values: `agents`, `agents-global`. |
| `GitHub respondió 404` | The repo, the branch, or the `SKILLS/` folder was renamed or moved. Update `SKILLS_PATH` / branch in `cli.js`. |
| `Omitidas por no tener SKILL.md` | A candidate folder under `SKILLS/<category>/` has no `SKILL.md`. Add it (or delete the folder) for the skill to appear in the catalog. |
| Skill installed but not showing up | The frontmatter `name` does not match the folder name, or the file is not named `SKILL.md`. |
| Skill already exists prompt | The installer asks before overwriting. `No` skips that skill. |

## License

MIT © pa-ku
