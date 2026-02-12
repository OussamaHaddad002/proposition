/**
 * Mock data module — loads all data from JSON files served at /api/*.
 *
 * Call `initMockData()` once (in main.tsx) before rendering.
 * After that every named export is available synchronously, exactly
 * like the old hard-coded version.
 *
 * When you add a real backend, swap the fetch URLs in src/services/api.ts
 * and migrate consumers to `useApi()` at your own pace.
 */

import type {
  Lead, Fournisseur, Agent, Acheteur,
  ScoreExplanation, CreditPack, Payment, Notification,
} from '../types';

// ─── Exported stores (mutated in place by initMockData) ─────────────
// Using mutation (push / Object.assign) so the reference that consumers
// imported at module-init time is ALWAYS the same object — guaranteed
// safe across every bundler (Vite, Rollup, esbuild, Webpack …).

export const mockLeads: Lead[] = [];

export const mockFournisseur: Fournisseur = {} as Fournisseur;
export const mockAgent: Agent = {} as Agent;
export const mockAcheteur: Acheteur = {} as Acheteur;

export const creditPacks: CreditPack[] = [];
export const mockPayments: Payment[] = [];
export const mockNotifications: Notification[] = [];

export const monthlyStats: { month: string; leads: number; qualified: number; sold: number; revenue: number }[] = [];
export const sectorDistribution: { name: string; value: number; color: string }[] = [];

export const mockGlobalStats = {
  totalLeads: 0,
  qualifiedLeads: 0,
  soldLeads: 0,
  pendingLeads: 0,
  revenue: 0,
  avgScore: 0,
  conversionRate: 0,
};

let _scoreExplanations: ScoreExplanation[] = [];

// ─── Boot loader — call ONCE before ReactDOM.render ─────────────────
export async function initMockData(): Promise<void> {
  const [leadsRes, usersRes, billingRes, statsRes] = await Promise.all([
    fetch('/api/leads.json'),
    fetch('/api/users.json'),
    fetch('/api/billing.json'),
    fetch('/api/stats.json'),
  ]);

  // Leads — push into the existing array
  const leads: Lead[] = await leadsRes.json();
  mockLeads.push(...leads);

  // Users — patch existing objects
  const users = await usersRes.json();
  Object.assign(mockFournisseur, users.fournisseur);
  Object.assign(mockAgent, users.agent);
  Object.assign(mockAcheteur, users.acheteur);

  // Billing — push into existing arrays
  const billing = await billingRes.json();
  creditPacks.push(...billing.creditPacks);
  mockPayments.push(...billing.payments);
  mockNotifications.push(...billing.notifications);

  // Stats — push / patch existing objects
  const stats = await statsRes.json();
  Object.assign(mockGlobalStats, stats.globalStats);
  monthlyStats.push(...stats.monthlyStats);
  sectorDistribution.push(...stats.sectorDistribution);
  _scoreExplanations = stats.scoreExplanations;
}

// ─── Helper functions (backward-compatible API) ─────────────────────
export function generateScoreExplanation(_score: number): ScoreExplanation[] {
  return _scoreExplanations;
}

export function generateMockLeads(): Lead[] {
  return mockLeads;
}
