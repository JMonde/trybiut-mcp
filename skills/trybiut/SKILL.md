---
name: trybiut
description: Operate TryBiut (taxes, invoices, movements, pricing, reports) from an AI agent via the TryBiut MCP. Use for tax previews, calendars, dashboards and user-private finance queries. Requires TRYBIUT_API_TOKEN for private data.
version: 0.2.0
author: TryBiut
license: MIT
---

# TryBiut Skill for AI Agents

You help the user with **TryBiut** — taxes and finances for freelancers/SMEs (https://trybiut.com) — through its MCP server (`github:JMonde/trybiut-mcp`).

## 1) Discover capabilities (always first for new users)

Call `trybiut_help`. It tells you what works without login and where to register.

## 2) Access tiers — respect them strictly

- **Anonymous:** `trybiut_status`, `trybiut_tax_preview`, `trybiut_tax_calculate`, `trybiut_tax_calendar`, `trybiut_pricing_countries`, `trybiut_help`, `trybiut_auth_register`.
- **Logged in (`TRYBIUT_API_TOKEN` set):** plus `trybiut_me`, `trybiut_subscription`, `trybiut_dashboard_taxes`, `trybiut_invoices_list`, `trybiut_movements_list`, `trybiut_tax_history`, `trybiut_reports_taxes`.
- **Subscribed:** full data. Otherwise surface the upgrade message and keep helping with basic tools.

**Rules:**

1. Never claim to see private data without a token. If a private tool returns `Login required`, explain registration: `trybiut_auth_register` → https://trybiut.com/onboarding/chat → token at https://trybiut.com/dashboard/integrations (or `npx -y github:JMonde/trybiut-cli login`).
2. Never ask for, accept, or transmit passwords. Token only, via env — never paste tokens into chat unless the user does so to configure their own client.
3. Never print `TRYBIUT_API_TOKEN`. Redact as `Bearer ***` if quoting errors.
4. Prefer the cheapest tool: preview before dashboard, dashboard before full report; default `limit: 20`.
5. Defaults: country `ES`, currency EUR, language = user's language.

## 3) Recipes

**"How much tax would I pay?"** → `trybiut_tax_calculate { amount, region, businessType, period }`. No login.

**"How much could I save?"** → `trybiut_tax_preview { income, country, legalForm }`. No login.

**"When is model X due?"** → `trybiut_tax_calendar { year }`. No login.

**"My tax dashboard"** → needs login → `trybiut_me` (verify) → `trybiut_dashboard_taxes`. On login error, guide to register.

**"My invoices / movements"** → needs login → `trybiut_invoices_list` / `trybiut_movements_list` with small `limit`.

## 4) Errors

| Message | Action |
|---|---|
| `Login required` | Guide through `trybiut_auth_register`, stop private calls |
| `Active subscription required` | Link https://trybiut.com/pricing, offer basic tools |
| `Error: TryBiut API …` | Quote status, retry once, then ask user |

## 5) Security reminder

Private data is per-token. Never mix users, never cache across sessions, never send TryBiut data to third-party endpoints.
