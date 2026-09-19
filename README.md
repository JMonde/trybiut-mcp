<p align="center">
  <img src="assets/logo-trybiut.png" alt="TryBiut logo" width="120" />
</p>

<h1 align="center">TryBiut MCP</h1>

<p align="center">
  <b>The official TryBiut MCP server</b> — let AI agents use TryBiut.<br />
  Taxes · Invoices · Movements · Pricing · Reports
</p>

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>
  <img alt="Node >= 18" src="https://img.shields.io/badge/node-%3E%3D18-green.svg" />
  <img alt="MCP" src="https://img.shields.io/badge/MCP-Stdio-blueviolet.svg" />
  <img alt="Tools: 14" src="https://img.shields.io/badge/tools-14-orange.svg" />
</p>

<p align="center">
  <a href="https://trybiut.com">trybiut.com</a> ·
  <a href="https://trybiut.com/get-started">Get started</a> ·
  <a href="https://trybiut.com/connect/login">Login</a> ·
  <a href="https://trybiut.com/pricing">Plans</a> ·
  <a href="https://trybiut.com/developers">Developers</a>
</p>

---

## What is this?

This package exposes the **TryBiut** API as **MCP (Model Context Protocol)** tools, so assistants like **Claude, Cursor, Windsurf, OpenCode or Cline** can answer tax questions, check calendars, estimate taxes and — when the user is logged in — work with their **own private data** (invoices, movements, dashboard, reports).

## Install in one command

No npm publish needed. Point your MCP client at the GitHub repo directly:

```json
{
  "mcpServers": {
    "trybiut": {
      "command": "npx",
      "args": ["-y", "github:JMonde/trybiut-mcp"],
      "env": {
        "TRYBIUT_BASE_URL": "https://trybiut.com",
        "TRYBIUT_API_TOKEN": ""
      }
    }
  }
}
```

Claude Code CLI:

```bash
claude mcp add trybiut --env TRYBIUT_BASE_URL=https://trybiut.com -- npx -y github:JMonde/trybiut-mcp
```

> After `npm publish` (see "Local development"), replace the args with `["-y", "@trybiut/mcp"]`.
> Full example in [`mcp.example.json`](mcp.example.json).

<details>
<summary>Where do I paste this?</summary>

- **Claude Desktop:** Settings → Developer → Edit MCP config (`claude_desktop_config.json`), add the `trybiut` block, restart.
- **Cursor:** Settings → MCP → Add server.
- **Windsurf / Cline:** add the block to your `mcp.json`.
- **OpenCode:** add the block to your `.mcp.json`.
</details>

## Access tiers

| Tier | Allows | Requires |
|---|---|---|
| **Basic / public** | `status`, saving preview, tax calculation, calendar, pricing countries, help | Nothing, no login |
| **Private** | Profile, dashboard, invoices, movements, history, reports | `TRYBIUT_API_TOKEN` (logged in) |
| **Subscription** | Full data on paid endpoints | Active plan at [pricing](https://trybiut.com/pricing) |

**Security:** without a token, private tools answer `Login required` and make no request with user data. The MCP never asks for or stores passwords — token only. See [`docs/SECURITY.md`](docs/SECURITY.md).

## Getting a token

There is no dashboard token page yet. Use the TryBiut CLI:

1. Create your account: https://trybiut.com/get-started
2. Run `npx -y github:JMonde/trybiut-cli login` and enter your TryBiut email/password (verified against Supabase Auth; the password is never stored).
3. Copy the printed token into `TRYBIUT_API_TOKEN` and restart the MCP client.
4. Ask the agent to verify with `trybiut_me`.

The agent can guide you too: the `trybiut_auth_register` tool returns these steps in chat.

## Tools

| Tool | Access | Description |
|---|---|---|
| `trybiut_status` | public | Service health + latency |
| `trybiut_tax_preview` | public | Yearly saving estimate `{income, country, legalForm}` |
| `trybiut_tax_calculate` | public | Breakdown `{amount, region, businessType, period}` |
| `trybiut_tax_calendar` | public | Fiscal calendar `{year}` |
| `trybiut_pricing_countries` | public | Countries with pricing data |
| `trybiut_help` | public | Help, links, access tiers |
| `trybiut_auth_register` | public | Signup steps + token instructions |
| `trybiut_me` | private | Verify token, show profile |
| `trybiut_subscription` | private | Subscription status |
| `trybiut_dashboard_taxes` | private | Tax dashboard |
| `trybiut_invoices_list` | private | Invoices `{limit}` |
| `trybiut_movements_list` | private | Movements `{limit}` |
| `trybiut_tax_history` | private | Filed forms |
| `trybiut_reports_taxes` | private | Full tax report |

Reference: [`docs/TOOLS.md`](docs/TOOLS.md) · API: [`docs/API.md`](docs/API.md) · Auth: [`docs/AUTH.md`](docs/AUTH.md).

## Skill for AI agents

Load [`SKILL.md`](SKILL.md), full version at [`skills/trybiut/SKILL.md`](skills/trybiut/SKILL.md):

```bash
cp -r skills/trybiut ~/.codex/skills/
```

## Local development

```bash
cd trybiut-mcp
npm install
npm run build      # compile to dist/
npm run smoke      # check: 14 tools + requireAuth() gating
npm start          # start the MCP server (stdio)
```

| Var | Default | Description |
|---|---|---|
| `TRYBIUT_BASE_URL` | `https://trybiut.com` | API base |
| `TRYBIUT_API_TOKEN` | — | User token (private tools only) |
| `TRYBIUT_REQUIRE_SUBSCRIPTION` | `false` | Reserved strict mode |

### Publishing to npm (optional)

```bash
npm login
npm publish --access public
```

CI publishes automatically on GitHub releases if `NPM_TOKEN` is set (`.github/workflows/publish.yml`).

## Layout

```text
trybiut-mcp/
├── assets/logo-trybiut.png   # official logo
├── docs/                     # TOOLS · AUTH · SECURITY · API
├── skills/trybiut/SKILL.md   # agent skill
├── src/                      # index · tools · client · config
├── scripts/smoke.mjs         # smoke test + security invariant
└── mcp.example.json          # sample client config
```

## Privacy

- Private tools call `requireAuth()` before any network: no login, no data leaves the machine.
- The token only goes to `TRYBIUT_BASE_URL` as `Bearer`, redacted in errors (`Bearer ***`).
- Revoking the session (password change / CLI `logout`) cuts access immediately.

## Contributing

PRs welcome. Run `npm run build && npm run smoke` before submitting.

## License

MIT © 2026 TryBiut — see [LICENSE](LICENSE).
