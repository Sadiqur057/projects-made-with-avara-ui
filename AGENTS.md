<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Avara UI

This project uses Avara UI (`@avara-ui`), a free shadcn registry of animated React components and website sections.

- Register once: `npx shadcn@latest registry add @avara-ui=https://avaraui.com/r/{name}.json`. Install with `npx shadcn@latest add @avara-ui/<name> --yes`.
- Find components in https://avaraui.com/agent/components.json (or https://avaraui.com/llms.txt). Read an item's Markdown for its props before writing code against it.
- Follow the workflow in https://avaraui.com/skills/avara-ui/SKILL.md: plan, decide, install, read, adapt, check.
- Ask before you pick. An index entry with `choose: true` has several designs of one section (for example the hero). If the user has not named one, ask which they want, with each option's live link, before installing. If they say to choose, pick from `bestFor` / `avoidIf` and say why. Use your client's click-to-pick question tool if it has one, so the user answers by clicking, not typing. Never pick a variant on your own. See https://avaraui.com/skills/avara-ui/variants.md.
- Style with theme tokens only. Install the GSAP or the Motion build of a component, never both.

