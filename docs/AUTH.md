# 🔑 TryBiut MCP — auth & subscription

## Model

1. **Anonymous** → only 🟢 public tools (basic previews, calendar, status).
2. **Logged in (`TRYBIUT_API_TOKEN`)** → + 🔒 private tools (your invoices, movements, dashboard, reports).
3. **Subscribed** → full data on paid endpoints. Without a plan you still get basic queries + a friendly upgrade message, never someone else's data.

## Get a token (2 min)

1. Register: https://trybiut.com/register
2. Log in: https://trybiut.com/login
3. Copy token: https://trybiut.com/dashboard/api-tokens
4. Put it in your MCP client config as `TRYBIUT_API_TOKEN` (env var) and restart.

> The MCP tool `trybiut_auth_register` explains the same steps to the agent.
> The MCP **never** asks for, receives, or stores passwords — only the token.

## Client config

```json
{
  "mcpServers": {
    "trybiut": {
      "command": "npx",
      "args": ["-y", "@trybiut/mcp"],
      "env": {
        "TRYBIUT_BASE_URL": "https://trybiut.com",
        "TRYBIUT_API_TOKEN": "PASTE_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

Local dev variant: `"command": "node", "args": ["/absolute/path/trybiut-mcp/dist/index.js"]`.

## Rotation & revocation

- Tokens can be revoked from the dashboard at any time.
- After revoking, private tools immediately return `🔒 Login required` (API answers `401`).

## `TRYBIUT_REQUIRE_SUBSCRIPTION`

- `false` (default): private tools try the API and surface `402/403` as an upgrade hint.
- `true`: reserved for strict deployments (checked server-side by TryBiut; the MCP passes the token through and never bypasses it).
