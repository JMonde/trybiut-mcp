import { loadConfig, type TrybiutConfig } from './config.js';

/** Error thrown when a tool needs login but no token is configured. */
export class AuthRequiredError extends Error {
  constructor() {
    super(
      'Login required: set TRYBIUT_API_TOKEN to use this tool. ' +
        'Create an account at https://trybiut.com/onboarding/chat, then create a token at https://trybiut.com/dashboard/integrations.'
    );
    this.name = 'AuthRequiredError';
  }
}

export class SubscriptionRequiredError extends Error {
  constructor() {
    super(
      'Active subscription required: this tool needs a paid TryBiut plan. ' +
        'See https://trybiut.com/pricing — basic public tools still work without it.'
    );
    this.name = 'SubscriptionRequiredError';
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  /** Force public call even when a token exists. */
  public?: boolean;
  query?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(base: string, path: string, query?: RequestOptions['query']): string {
  const url = new URL(path, base.endsWith('/') ? base : base + '/');
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

/** Minimal TryBiut REST client used by every MCP tool. */
export class TrybiutClient {
  readonly config: TrybiutConfig;

  constructor(config?: TrybiutConfig) {
    this.config = config ?? loadConfig();
  }

  get isAuthenticated(): boolean {
    return Boolean(this.config.apiToken);
  }

  /** Guard for private tools — rejects when nobody is logged in. */
  requireAuth(): string {
    if (!this.config.apiToken) throw new AuthRequiredError();
    return this.config.apiToken;
  }

  async request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, query } = opts;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (!opts.public && this.config.apiToken) {
      headers.Authorization = `Bearer ${this.config.apiToken}`;
    }
    const res = await fetch(buildUrl(this.config.baseUrl, path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) throw new AuthRequiredError();
    if (res.status === 402 || res.status === 403) throw new SubscriptionRequiredError();
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`TryBiut API ${res.status} on ${path}: ${text.slice(0, 500)}`);
    }
    return (await res.json()) as T;
  }

  /** Never leak the token into logs / tool output. */
  static redact(input: string): string {
    return input.replace(/(Bearer\s+)[A-Za-z0-9._\-~+/=]{8,}/g, '$1***');
  }
}
