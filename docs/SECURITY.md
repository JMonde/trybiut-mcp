# TryBiut MCP — security

1. **No data without login.** Every private tool calls `requireAuth()` first. With no `TRYBIUT_API_TOKEN`, the call is rejected locally — no request carrying user data leaves the machine.
2. **Bearer only.** Auth is `Authorization: Bearer <token>` (Supabase session token). No passwords, no cookies, no scraping.
3. **No token leaks.** The token lives only in the MCP host env, is sent only to `TRYBIUT_BASE_URL`, and is redacted from errors/logs (`Bearer ***`).
4. **Least privilege.** Public tools use `public: true` (no `Authorization` header even if a token exists). Private tools hit the narrowest endpoint needed and truncate lists (`limit <= 100`).
5. **Subscription gating is server-side.** The MCP surfaces `402/403` as upgrade hints; it cannot and does not bypass entitlements.
6. **Audit-friendly.** All calls are plain REST (`GET/POST /api/...`) visible in TryBiut server logs; invalidating the session cuts access at once.

## Threat model

| Threat | Mitigation |
|---|---|
| Anonymous agent reads someone's invoices | Impossible: endpoints need Bearer; MCP refuses without token |
| Token stolen from chat | Token never printed; outputs are JSON data only |
| Agent phishes password | Documented flow forbids passwords; only CLI-issued session tokens |
| Token reuse after logout | Session invalidation turns API into `401` → MCP `Login required` |
