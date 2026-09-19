---
name: trybiut
description: Operate TryBiut (taxes, invoices, movements, pricing, reports) from an AI agent via the TryBiut MCP. Public basic queries without login; private finance data requires TRYBIUT_API_TOKEN.
version: 0.2.0
author: TryBiut
license: MIT
---

# TryBiut Skill (generic loader)

> Full skill: [`trybiut-mcp/skills/trybiut/SKILL.md`](trybiut-mcp/skills/trybiut/SKILL.md).
> Copy that folder to your agent's skills dir (`~/.codex/skills/`, `.cursor/skills/`, Claude skills, …).

**When to use:** user mentions TryBiut, impuestos, autonomos, invoices, movimientos, tax calendar, pricing, fiscal reports.

**Tiers:** anonymous basic tools work always; private tools need `TRYBIUT_API_TOKEN` (via `npx -y github:JMonde/trybiut-cli login`); full data needs subscription.

**Never:** ask for passwords, print tokens, or access private data without login.
