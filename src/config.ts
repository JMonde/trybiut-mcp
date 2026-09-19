/** Shared config — env only, no passwords are ever handled here. */
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

export const PUBLIC_URLS = {
  register: 'https://trybiut.com/register',
  login: 'https://trybiut.com/login',
  apiTokens: 'https://trybiut.com/dashboard/api-tokens',
  pricing: 'https://trybiut.com/pricing',
  docs: 'https://trybiut.com/docs',
} as const;
