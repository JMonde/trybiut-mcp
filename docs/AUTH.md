# TryBiut MCP — auth and subscription

## Model

1. **Anonymous** → only public tools (basic previews, calendar, status).
2. **Logged in (`TRYBIUT_API_TOKEN`)** → plus private tools (invoices, movements, dashboard, reports).
3. **Subscribed** → full data on paid endpoints. Without a plan you still get basic queries plus an upgrade hint, never someone else's data.

## Getting a token

TryBiut has no dashboard token page yet (tracked as a pending feature). Until then:

```bash
npx -y github:JMonde/trybiut-cli login
```

1. Create your account at https://trybiut.com/get-started (or log in at https://trybiut.com/connect/login).
2. Run the CLI `login` command and enter your email/password. Credentials are verified against Supabase Auth and the password is never stored.
3. Copy the printed access token into your MCP client config as `TRYBIUT_API_TOKEN` and restart.

The MCP tool `trybiut_auth_register` explains the same steps to the agent.
The MCP **never** asks for, receives, or stores passwords — only the token.

## Client config

```json
{
  "mcpServers": {
    "trybiut": {
      "command": "npx",
      "args": ["-y", "github:JMonde/trybiut-mcp"],
      "env": {
        "TRYBIUT_BASE_URL": "https://trybiut.com",
        "TRYBIUT_API_TOKEN": "PASTE_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

Local dev variant: `"command": "node"`, `"args": ["/absolute/path/trybiut-mcp/dist/index.js"]`.

## Rotation and revocation

- Change your password or run `trybiut logout` in the CLI to invalidate the session.
- After that, private tools immediately return `Login required` (API answers `401`).

## `TRYBIUT_REQUIRE_SUBSCRIPTION`

- `false` (default): private tools call the API and surface `402/403` as an upgrade hint.
- `true`: reserved for strict deployments (enforced server-side by TryBiut; the MCP passes the token through and never bypasses it).
