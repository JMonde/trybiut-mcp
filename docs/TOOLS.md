# 🧰 TryBiut MCP — tools reference

> 14 tools. 🟢 Public = no login. 🔒 Private = require `TRYBIUT_API_TOKEN`.

## 🟢 Public (basic queries, no subscription)

| Tool | What it does | Endpoint |
|---|---|---|
| `trybiut_status` | 🟢 Health check + latency | `GET /api/taxes/health` |
| `trybiut_tax_preview` | 🧮 Yearly saving estimate `{income, country, legalForm}` | `POST /api/taxes/calculate-preview` |
| `trybiut_tax_calculate` | 🧾 Breakdown `{amount, region, businessType, includeSocialSecurity, period}` | `GET /api/tax/calculate` |
| `trybiut_tax_calendar` | 📅 Obligations calendar `{year}` | `GET /api/taxes/calendar/[year]` |
| `trybiut_pricing_countries` | 🌍 Pricing coverage countries | `GET /api/pricing/countries` |
| `trybiut_help` | ❓ Help + links | local |
| `trybiut_auth_register` | 📝 Signup steps (never handles passwords) | local |

## 🔒 Private (login required)

| Tool | What it does | Endpoint |
|---|---|---|
| `trybiut_me` | 👤 Verify token + profile | `GET /api/user/debug` |
| `trybiut_subscription` | 💳 Plan status | Stripe portal probe |
| `trybiut_dashboard_taxes` | 📊 Tax dashboard | `GET /api/taxes/dashboard` |
| `trybiut_invoices_list` | 🧾 Invoices `{limit}` | `GET /api/invoices` |
| `trybiut_movements_list` | 💸 Movements `{limit}` | `GET /api/movements` |
| `trybiut_tax_history` | 🗂️ Filed forms | `GET /api/tax/history` |
| `trybiut_reports_taxes` | 📈 Full tax report | `GET /api/reports/taxes` |

Without a token, private tools answer:

```text
🔒 Login required: set TRYBIUT_API_TOKEN …
```

With a token but no active plan, paid endpoints answer `402/403` →

```text
💳 Active subscription required …
```
