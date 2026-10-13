# AGENTS.md

Interactive OpenCode skill installer: `pnpm start` → pick target + skills from the catalog → cloned as `<target>/<name>/`.

## Quick path

1. `pnpm install`
2. `pnpm check` (syntax) then `pnpm start` — requires an interactive terminal
3. Answer the destination prompt, pick skills, verify `<target>/<skill>/SKILL.md` exists

## Details

| Topic | Decision |
|-------|----------|
| Package manager | pnpm only — commit `pnpm-lock.yaml`, never `package-lock.json` |
| Runtime | ESM only (`"type": "module"`), no build step, single file `cli.js` |
| Node | >= 20 (`engines`) |
| This repo | `pa-ku/pakuskills` — the installer |
| Catalog repo | `pa-ku/paku-skills` — the skills, hardcoded as `REPO_OWNER`/`REPO_NAME` in `cli.js` |
| Flow | Octokit lists catalog root dirs → `@clack/prompts` multiselect → `degit` clones `owner/repo/<skill>` |
| Destination | Chosen at runtime via `p.select` (`TARGETS` in `cli.js`). Default `.opencode/skills/`. `PAKU_SKILLS_TARGET` skips the prompt (`opencode`, `opencode-global`, `generic`, `generic-global`, `claude`, `claude-global`) |
| UI copy | Spanish (existing convention in `cli.js`) |
| Dependencies | `@clack/prompts` (UI), `@octokit/rest` (catalog), `degit` (clone). No `execa`/`npx` at runtime |

## Gotchas

- **Never call `process.exit()`** inside the clack flow. On Windows it triggers a libuv assertion and a bogus `0xC0000409` exit code. Set `process.exitCode` and `return`.
- `degit` ships CJS with `{ __esModule, default }` — the ESM **default import** is the callable function. `require('degit')` would return the object, not a function.
- `*-global` targets write **outside the repo** (`~/.config/opencode/skills`, `~/.agents/skills`, `~/.claude/skills`). The overwrite `confirm` is the only guard — do not remove it.
- Skill folders must satisfy the Agent Skills rule: frontmatter `name` == directory name, or VS Code and opencode silently skip them. Enforced in the catalog repo, not here.
- Unauthenticated GitHub API is 60 req/h; `fetchCatalog` honors `GITHUB_TOKEN` if set.
- The catalog lists **only root directories** as skills; keep skill folders flat and free of dot-prefixed names.
- PowerShell 5.1 `Get-Content`/`Set-Content` default to ANSI and will corrupt the UTF-8 accents in `cli.js`. Use `-Encoding UTF8` explicitly or edit with a proper editor.
- `pnpm start` cannot run in a pipeline — there is an explicit `!process.stdin.isTTY` guard that exits 1 with a friendly message.

## Checklist

- [ ] `pnpm check` passes
- [ ] `node cli.js < nul` prints the TTY guard message and exits 1
- [ ] A real run installs to `.opencode/skills/<name>/SKILL.md`
- [ ] `pnpm-lock.yaml` updated; no `package-lock.json` in the tree
- [ ] Error paths print a `p.cancel(...)` reason instead of a stack trace
