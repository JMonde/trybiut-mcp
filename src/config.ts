/** Shared config — env only, passwords are never handled here. */
export interface TrybiutConfig {
  baseUrl: string;
  apiToken?: string;
  requireSubscription: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): TrybiutConfig {
  const baseUrl = (env.TRYBIUT_BASE_URL ?? 'https://trybiut.com').replace(/\/+$/, '');
  const raw = (env.TRYBIUT_API_TOKEN ?? '').trim();
  return {
    baseUrl,
    apiToken: raw ? raw : undefined,
    requireSubscription: (env.TRYBIUT_REQUIRE_SUBSCRIPTION ?? 'false').toLowerCase() === 'true',
  };
}

/** Real pages on trybiut.com (verified against pages/). */
export const PUBLIC_URLS = {
  getStarted: 'https://trybiut.com/onboarding/chat',
  login: 'https://trybiut.com/connect/login',
  pricing: 'https://trybiut.com/pricing',
  developers: 'https://trybiut.com/developers',
  dashboard: 'https://trybiut.com/dashboard',
  integrations: 'https://trybiut.com/dashboard/integrations',
} as const;

export const TOKEN_HELP =
  'Create your account at https://trybiut.com/onboarding/chat, then create a token at https://trybiut.com/dashboard/integrations (API Tokens tab) ' +
  'or via CLI: `npx -y github:JMonde/trybiut-cli login`. Set TRYBIUT_API_TOKEN and restart the MCP client.';
