#!/usr/bin/env node
/** TryBiut MCP server (Stdio) — public basic tools + gated private tools. */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { TrybiutClient } from './client.js';
import { TOOLS, formatGateError } from './tools.js';

const PKG = { name: '@trybiut/mcp', version: '0.1.0' };

async function main() {
  const config = loadConfig();
  const client = new TrybiutClient(config);
  const server = new McpServer({ name: PKG.name, version: PKG.version });

  for (const tool of TOOLS) {
    server.tool(
      tool.name,
      tool.description,
      tool.schema as any,
      async (args: any) => {
        try {
          const data = await tool.run(client, args ?? {});
          return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
        } catch (err) {
          return formatGateError(err) as any;
        }
      }
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `[trybiut-mcp v${PKG.version}] ready → ${config.baseUrl} | auth: ${client.isAuthenticated ? 'token set ✅' : 'anonymous (public tools only) 🔓'}`
  );
}

main().catch((err) => {
  console.error('[trybiut-mcp] fatal:', err instanceof Error ? err.message : err);
  process.exit(1);
});
