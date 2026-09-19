# TryBiut MCP — API notes

Base: `TRYBIUT_BASE_URL` (default `https://trybiut.com`).

## Public (no `Authorization` header)

- `GET /api/taxes/health` → `{ status, mode, timestamp }`
- `POST /api/taxes/calculate-preview` `{ income, country, legalForm }` → `{ estimatedSavings, message }`
- `GET /api/tax/calculate?amount&region&businessType&includeSocialSecurity&period` → breakdown
- `GET /api/taxes/calendar/[year]` → obligations
- `GET /api/pricing/countries` → coverage list

## Private (`Authorization: Bearer <token>`)

- `GET /api/user/debug` → token check / profile
- `GET /api/taxes/dashboard` → aggregates
- `GET /api/invoices` → invoices
- `GET /api/movements` → movements
- `GET /api/tax/history` → filed forms
- `GET /api/reports/taxes` → full report

## Status codes

| Code | Meaning in MCP |
|---|---|
| 200 | JSON forwarded to the agent |
| 401 | → `Login required` |
| 402/403 | → `Active subscription required` |
| 4xx/5xx | → `Error: TryBiut API <code> on <path>: <body…>` |

Product surface: https://trybiut.com/developers
