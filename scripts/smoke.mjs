// Smoke test: boots the tool catalogue without network.
// Usage: npm run build && npm run smoke
import { TOOLS } from '../dist/tools.js';

const pub = TOOLS.filter((t) => !t.auth).map((t) => t.name);
const priv = TOOLS.filter((t) => t.auth).map((t) => t.name);
console.log(`🧰 tools: ${TOOLS.length} (${pub.length} public, ${priv.length} private)`);
console.log('🟢', pub.join(', '));
console.log('🔒', priv.join(', '));

// Security invariant: every private tool must call requireAuth (count-based check).
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../src/tools.ts', import.meta.url), 'utf8');
const privateCount = (src.match(/^\s*auth: true,/gm) ?? []).length;
const guardCount = (src.match(/requireAuth\(\)/g) ?? []).length;
if (privateCount === 0 || guardCount < privateCount) {
  console.error(`❌ SECURITY: ${privateCount} auth:true tools but only ${guardCount} requireAuth() guards`);
  process.exit(1);
}
console.log('✅ smoke ok: private tools gated by requireAuth()');
