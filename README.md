<p align="center">
  <img src="assets/logo-trybiut.png" alt="TryBiut logo" width="120" />
</p>

<h1 align="center">🟡 TryBiut MCP</h1>

<p align="center">
  <b>El servidor MCP oficial de TryBiut</b> — deja que los agentes de IA usen TryBiut 🧠<br />
  Impuestos 🧾 · Facturas · Movimientos 💸 · Pricing 🌍 · Informes 📈
</p>

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>
  <img alt="Node >= 18" src="https://img.shields.io/badge/node-%3E%3D18-green.svg" />
  <img alt="MCP" src="https://img.shields.io/badge/MCP-Stdio-blueviolet.svg" />
  <img alt="Tools: 14" src="https://img.shields.io/badge/tools-14-orange.svg" />
</p>

<p align="center">
  🌐 <a href="https://trybiut.com">trybiut.com</a> ·
  📝 <a href="https://trybiut.com/register">Registro</a> ·
  🔑 <a href="https://trybiut.com/login">Login</a> ·
  💳 <a href="https://trybiut.com/pricing">Planes</a>
</p>

---

## ✨ ¿Qué es esto? / What is this?

> 🇪🇸 **Español:** Este paquete expone la API de **TryBiut** como herramientas **MCP (Model Context Protocol)** para que asistentes como **Claude, Cursor, Windsurf, OpenCode o Cline** puedan responder preguntas fiscales, consultar calendarios, estimar impuestos y —si el usuario inicia sesión— trabajar con **sus propios datos** (facturas, movimientos, dashboard, informes).
>
> 🇬🇧 **English:** This package exposes the **TryBiut** API as **MCP** tools so AI assistants can answer tax questions, check calendars, estimate taxes and —when logged in— work with the user's **own private data**.

## 🔓 Modelo de acceso / Access tiers

| Nivel | ¿Qué permite? | ¿Necesita…? |
|---|---|---|
| 🟢 **Básico / público** | `status`, previsión de ahorro 🧮, cálculo 🧾, calendario 📅, países de pricing 🌍, ayuda ❓ | Nada. Sin login |
| 🔒 **Privado** | Tu perfil 👤, dashboard 📊, facturas 🧾, movimientos 💸, historial 🗂️, informes 📈 | `TRYBIUT_API_TOKEN` (estar logueado) |
| 💳 **Suscripción** | Datos completos en endpoints de pago | Plan activo en [pricing](https://trybiut.com/pricing) |

🛡️ **Seguridad:** sin token, las herramientas privadas responden `🔒 Login required` y **no hacen ninguna petición con datos de usuario**. El MCP jamás pide ni guarda contraseñas — solo el token. Detalles en [`docs/SECURITY.md`](docs/SECURITY.md).

## 🚀 Instalación (2 min)

### 1️⃣ Requisito

- Node.js ≥ 18

### 2️⃣ Configura tu cliente MCP

Copia este bloque (Claude Desktop, Cursor, Windsurf, OpenCode, Cline… todos usan el mismo formato):

```json
{
  "mcpServers": {
    "trybiut": {
      "command": "npx",
      "args": ["-y", "@trybiut/mcp"],
      "env": {
        "TRYBIUT_BASE_URL": "https://trybiut.com",
        "TRYBIUT_API_TOKEN": "PEGA_AQUI_TU_TOKEN (opcional)"
      }
    }
  }
}
```

📄 Ejemplo listo en [`mcp.example.json`](mcp.example.json).

<details>
<summary>🖥️ Claude Desktop — ¿dónde pego esto?</summary>

1. Abre `Configuración → Desarrollador → Editar configuración MCP` (`claude_desktop_config.json`).
2. Añade el bloque `trybiut` dentro de `mcpServers`.
3. Reinicia Claude Desktop. Verás 🟡 TryBiut en la lista de herramientas.
</details>

<details>
<summary>⌨️ Cursor / Windsurf / Cline / OpenCode</summary>

- **Cursor:** `Settings → MCP → Add server` y pega el bloque.
- **Windsurf / Cline:** añade el bloque a tu `mcp.json` del proyecto o global.
- **OpenCode:** añade el bloque a tu `.mcp.json`.
</details>

### 3️⃣ Sin token funciona (modo básico) ✅

Sin `TRYBIUT_API_TOKEN` ya puedes: estado del servicio, estimaciones, cálculos, calendario y ayuda.

### 4️⃣ Con token (tus datos) 🔑

1. 📝 Crea tu cuenta: https://trybiut.com/register
2. 🔑 Entra: https://trybiut.com/login
3. 🎟️ Copia tu token: https://trybiut.com/dashboard/api-tokens
4. 📋 Pégalo en `TRYBIUT_API_TOKEN` y reinicia el cliente MCP.
5. ✅ Pide al agente: *“verifica mi login con `trybiut_me`”*.

> 💡 El agente también sabe guiarte: la herramienta `trybiut_auth_register` devuelve estos pasos dentro del chat.

## 🧰 Herramientas / Tools

| # | Tool | 🔓 | Descripción |
|---|---|---|---|
| 1 | `trybiut_status` | 🟢 | 🟢 Estado del servicio + latencia |
| 2 | `trybiut_tax_preview` | 🟢 | 🧮 Estimación de ahorro anual `{income, country, legalForm}` |
| 3 | `trybiut_tax_calculate` | 🟢 | 🧾 Desglose `{amount, region, businessType, period}` |
| 4 | `trybiut_tax_calendar` | 🟢 | 📅 Calendario fiscal `{year}` |
| 5 | `trybiut_pricing_countries` | 🟢 | 🌍 Países con datos de pricing |
| 6 | `trybiut_help` | 🟢 | ❓ Ayuda, enlaces y niveles de acceso |
| 7 | `trybiut_auth_register` | 🟢 | 📝 Pasos para registrarse y obtener token |
| 8 | `trybiut_me` | 🔒 | 👤 Verifica el token y muestra tu perfil |
| 9 | `trybiut_subscription` | 🔒 | 💳 Estado de tu suscripción |
| 10 | `trybiut_dashboard_taxes` | 🔒 | 📊 Tu dashboard fiscal |
| 11 | `trybiut_invoices_list` | 🔒 | 🧾 Tus facturas `{limit}` |
| 12 | `trybiut_movements_list` | 🔒 | 💸 Tus movimientos `{limit}` |
| 13 | `trybiut_tax_history` | 🔒 | 🗂️ Tus modelos presentados |
| 14 | `trybiut_reports_taxes` | 🔒 | 📈 Tu informe fiscal completo |

📖 Referencia completa: [`docs/TOOLS.md`](docs/TOOLS.md) · API: [`docs/API.md`](docs/API.md) · Auth: [`docs/AUTH.md`](docs/AUTH.md).

## 🤖 Skill para agentes de IA

¿Eres un agente? Carga la skill:

📄 [`SKILL.md`](SKILL.md) → completa en [`skills/trybiut/SKILL.md`](skills/trybiut/SKILL.md)

```bash
# copiar a tu carpeta de skills, p. ej.:
cp -r skills/trybiut ~/.codex/skills/
```

La skill enseña al agente: qué herramienta usar en cada caso, los 3 niveles de acceso, recetas (🧮 calcular, 📅 calendario, 📊 dashboard…) y las reglas de seguridad (🔑 nunca pedir contraseñas, 🙈 nunca imprimir el token).

## 💻 Desarrollo local

```bash
cd trybiut-mcp
npm install
npm run build      # compila a dist/
npm run smoke      # ✅ chequeo: 14 tools + gating requireAuth()
npm start          # arranca el servidor MCP (stdio)
```

Variables (`cp .env.example .env`):

| Var | Default | Descripción |
|---|---|---|
| `TRYBIUT_BASE_URL` | `https://trybiut.com` | Base de la API |
| `TRYBIUT_API_TOKEN` | — | Token del usuario (solo privado) |
| `TRYBIUT_REQUIRE_SUBSCRIPTION` | `false` | Reservado: modo estricto |

## 🗂️ Estructura

```text
trybiut-mcp/
├── assets/logo-trybiut.png   🟡 logo oficial
├── docs/                     📖 TOOLS · AUTH · SECURITY · API
├── skills/trybiut/SKILL.md   🤖 skill para agentes
├── src/                      💻 index · tools · client · config
├── scripts/smoke.mjs         ✅ test de humo + invariante de seguridad
├── mcp.example.json          ⚙️ config de ejemplo
└── README.md                 👈 estás aquí
```

## 🔒 Privacidad

- Las herramientas 🔒 exigen `requireAuth()` **antes** de cualquier red: sin login no sale ningún dato.
- El token solo viaja a `TRYBIUT_BASE_URL` como `Bearer`, y se redacta en errores (`Bearer ***`).
- Revocar el token en el dashboard corta el acceso al instante (`401` → `🔒 Login required`).

## 🤝 Contribuir

¡PRs bienvenidos! 🎉 Ejecuta `npm run build && npm run smoke` antes de enviar.

## 📄 Licencia

MIT © 2026 TryBiut — ver [LICENSE](LICENSE).
