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
  getStarted: 'https://trybiut.com/get-started',
  login: 'https://trybiut.com/connect/login',
  pricing: 'https://trybiut.com/pricing',
  developers: 'https://trybiut.com/developers',
  dashboard: 'https://trybiut.com/dashboard',
} as const;

export const TOKEN_HELP =
  'Get a token with the TryBiut CLI: `npx -y github:JMonde/trybiut-cli login` ' +
  '(stores a local session, no dashboard page needed), then set TRYBIUT_API_TOKEN. ' +
  'Create your account first at https://trybiut.com/get-started';
