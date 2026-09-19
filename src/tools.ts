import { z } from 'zod';
import { TrybiutClient, AuthRequiredError, SubscriptionRequiredError } from './client.js';
import { PUBLIC_URLS } from './config.js';

/**
 * Tool catalogue.
 * - `auth: false` → public, basic queries, work WITHOUT login.
 * - `auth: true`  → private, require TRYBIUT_API_TOKEN (logged-in user).
 */
export interface ToolDef {
  name: string;
  title: string;
  auth: boolean;
  description: string;
  schema: z.ZodRawShape;
  run: (client: TrybiutClient, args: any) => Promise<unknown>;
}

const ok = (data: unknown) => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] });
export const toToolResult = ok;

export function formatGateError(err: unknown) {
  if (err instanceof AuthRequiredError || err instanceof SubscriptionRequiredError) {
    return {
      content: [{ type: 'text', text: (err as Error).message }],
      isError: true,
    };
  }
  return { content: [{ type: 'text', text: `❌ ${err instanceof Error ? err.message : String(err)}` }], isError: true };
}

export const TOOLS: ToolDef[] = [
  // ── PUBLIC (no login) ──────────────────────────────────────────
  {
    name: 'trybiut_status',
    title: '🟢 Service status',
    auth: false,
    description: 'Check that trybiut.com API is reachable. No login needed.',
    schema: {},
    run: async (client) => {
      const started = Date.now();
      try {
        const health = await client.request('/api/taxes/health', { public: true });
        return { service: 'trybiut', reachable: true, latencyMs: Date.now() - started, health };
      } catch (err) {
        return { service: 'trybiut', reachable: false, error: err instanceof Error ? err.message : String(err) };
      }
    },
  },
  {
    name: 'trybiut_tax_preview',
    title: '🧮 Tax saving preview',
    auth: false,
    description: 'Basic estimate of yearly tax savings. Public demo endpoint, no login needed.',
    schema: {
      income: z.number().positive().describe('Yearly income, e.g. 35000'),
      country: z.string().default('ES').describe('ISO country code, e.g. ES, US, DE'),
      legalForm: z.string().default('autonomo').describe('autonomo | sl | freelance | employee'),
    },
    run: async (client, args) =>
      client.request('/api/taxes/calculate-preview', { method: 'POST', public: true, body: args }),
  },
  {
    name: 'trybiut_tax_calculate',
    title: '🧾 Tax calculation',
    auth: false,
    description: 'Basic tax breakdown for an amount/region/business type. No login needed.',
    schema: {
      amount: z.number().positive(),
      region: z.string().default('España'),
      businessType: z.string().default('autonomo'),
      includeSocialSecurity: z.boolean().default(false),
      period: z.enum(['monthly', 'quarterly', 'annual']).default('annual'),
    },
    run: async (client, args) =>
      client.request('/api/tax/calculate', {
        public: true,
        query: { ...args, includeSocialSecurity: String(args.includeSocialSecurity) },
      }),
  },
  {
    name: 'trybiut_tax_calendar',
    title: '📅 Tax calendar',
    auth: false,
    description: 'Public tax obligations calendar for a year. No login needed.',
    schema: { year: z.number().int().min(2020).max(2100).default(new Date().getFullYear()) },
    run: async (client, args) => client.request(`/api/taxes/calendar/${args.year}`, { public: true }),
  },
  {
    name: 'trybiut_pricing_countries',
    title: '🌍 Pricing coverage',
    auth: false,
    description: 'List countries covered by the pricing/market-data module. No login needed.',
    schema: {},
    run: async (client) => client.request('/api/pricing/countries', { public: true }),
  },
  {
    name: 'trybiut_help',
    title: '❓ Help & registration',
    auth: false,
    description: 'How to register, log in and get an API token; what works without subscription.',
    schema: {},
    run: async (client) => ({
      message: '👋 Welcome to TryBiut — taxes & finances for freelancers and SMEs.',
      register: PUBLIC_URLS.register,
      login: PUBLIC_URLS.login,
      getToken: PUBLIC_URLS.apiTokens,
      pricing: PUBLIC_URLS.pricing,
      freeWithoutLogin: ['trybiut_status', 'trybiut_tax_preview', 'trybiut_tax_calculate', 'trybiut_tax_calendar', 'trybiut_pricing_countries'],
      withLoginToken: ['trybiut_me', 'trybiut_subscription', 'trybiut_dashboard_taxes', 'trybiut_invoices_list', 'trybiut_movements_list', 'trybiut_tax_history', 'trybiut_reports_taxes'],
      note: '🔒 Private data tools NEVER work without TRYBIUT_API_TOKEN. The MCP never asks for your password — only the token.',
      baseUrl: client.config.baseUrl,
    }),
  },
  {
    name: 'trybiut_auth_register',
    title: '📝 Register account',
    auth: false,
    description: 'Start registration on trybiut.com so you can later use private tools. Returns the signup link + steps.',
    schema: { email: z.string().email().optional().describe('Optional: only echoed back in the instructions, never sent anywhere.') },
    run: async (client, args) => ({
      step1: `Open ${PUBLIC_URLS.register} and create your account${args.email ? ` for ${args.email}` : ''}.`,
      step2: `Log in at ${PUBLIC_URLS.login}.`,
      step3: `Copy your token from ${PUBLIC_URLS.apiTokens} into TRYBIUT_API_TOKEN (env) and restart the MCP.`,
      step4: 'Call trybiut_me to verify the login.',
      security: '⚠️ The MCP never receives or stores passwords. Only the API token, kept locally in your MCP config.',
    }),
  },

  // ── PRIVATE (login required) ───────────────────────────────────
  {
    name: 'trybiut_me',
    title: '👤 Who am I',
    auth: true,
    description: 'Verify the API token and return the logged-in user profile. Requires login.',
    schema: {},
    run: async (client) => {
      client.requireAuth();
      return client.request('/api/user/debug');
    },
  },
  {
    name: 'trybiut_subscription',
    title: '💳 Subscription status',
    auth: true,
    description: 'Check the current plan/subscription of the logged-in user. Requires login.',
    schema: {},
    run: async (client) => {
      client.requireAuth();
      // Canonical endpoint; falls back to portal-checkout state if the route differs.
      try {
        return await client.request('/api/stripe/create-portal-session', { method: 'POST', body: {} });
      } catch {
        return { subscribed: 'unknown', detail: 'Could not confirm subscription — ask at https://trybiut.com/pricing', pricing: PUBLIC_URLS.pricing };
      }
    },
  },
  {
    name: 'trybiut_dashboard_taxes',
    title: '📊 Tax dashboard',
    auth: true,
    description: 'Aggregated tax dashboard of the logged-in user. Requires login (+ subscription for full data).',
    schema: {},
    run: async (client) => {
      client.requireAuth();
      return client.request('/api/taxes/dashboard');
    },
  },
  {
    name: 'trybiut_invoices_list',
    title: '🧾 My invoices',
    auth: true,
    description: 'List invoices of the logged-in user. Requires login. Never accessible anonymously.',
    schema: { limit: z.number().int().min(1).max(100).default(20) },
    run: async (client, args) => {
      client.requireAuth();
      const data: any = await client.request('/api/invoices');
      return Array.isArray(data) ? data.slice(0, args.limit) : data;
    },
  },
  {
    name: 'trybiut_movements_list',
    title: '💸 My movements',
    auth: true,
    description: 'List bank/income-expense movements of the logged-in user. Requires login.',
    schema: { limit: z.number().int().min(1).max(100).default(20) },
    run: async (client, args) => {
      client.requireAuth();
      const data: any = await client.request('/api/movements');
      return Array.isArray(data?.movements) ? data.movements.slice(0, args.limit) : data;
    },
  },
  {
    name: 'trybiut_tax_history',
    title: '🗂️ Tax history',
    auth: true,
    description: 'Filed tax forms history of the logged-in user. Requires login.',
    schema: {},
    run: async (client) => {
      client.requireAuth();
      return client.request('/api/tax/history');
    },
  },
  {
    name: 'trybiut_reports_taxes',
    title: '📈 Tax report',
    auth: true,
    description: 'Detailed tax report of the logged-in user. Requires login (+ subscription for full data).',
    schema: {},
    run: async (client) => {
      client.requireAuth();
      return client.request('/api/reports/taxes');
    },
  },
];
