/**
 * Mock API service layer.
 *
 * Every function fetches JSON from /api/*.json — the same contract a real
 * backend would expose.  When you plug in a real API, swap the base URL
 * (or use an env variable) and the rest of the app stays untouched.
 */

import type {
  Lead,
  Fournisseur,
  Agent,
  Acheteur,
  ScoreExplanation,
  CreditPack,
  Payment,
  Notification,
  AdminImport,
  AgentImport,
  AudioRecord,
  Transaction,
  AdminCreditPack,
  CreditRule,
  FournisseurGain,
  Virement,
} from '../types';

// ─── helpers ────────────────────────────────────────────────────────
const API_BASE = '/api';            // Vite serves `public/` as root
const SIMULATED_DELAY = 200;        // ms – mimics network latency

async function fetchJson<T>(path: string): Promise<T> {
  // Artificial latency so loading states are visible during dev
  await new Promise(r => setTimeout(r, SIMULATED_DELAY));
  const res = await fetch(`${API_BASE}/${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ─── Leads ──────────────────────────────────────────────────────────
export async function getLeads(): Promise<Lead[]> {
  return fetchJson<Lead[]>('leads.json');
}

export interface LeadFilters {
  search?: string;
  sector?: string;
  region?: string;
  minScore?: number;
  status?: string;
}

export async function getFilteredLeads(filters: LeadFilters = {}): Promise<Lead[]> {
  const leads = await getLeads();
  return leads.filter(lead => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matches =
        lead.firstName.toLowerCase().includes(q) ||
        lead.lastName.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.sector.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (filters.sector && filters.sector !== 'all' && lead.sector !== filters.sector) return false;
    if (filters.region && filters.region !== 'all' && lead.region !== filters.region) return false;
    if (filters.minScore && lead.score < filters.minScore) return false;
    if (filters.status && filters.status !== 'all' && lead.status !== filters.status) return false;
    return true;
  });
}

// ─── Auth ────────────────────────────────────────────────────────────
// Stubs — will be replaced by real fetch() calls once the backend is live.

export interface SignupInput {
  email: string;
  hashedPassword: string;
  username: string;
  lastname: string;
  firstname: string;
}

export interface SigninInput {
  username: string;
  hashedPassword: string;
}

export interface SigninResponse {
  userId: string;
}

/** POST /auth/signup */
export async function signup(_input: SignupInput): Promise<{ userId: string; message: string }> {
  await new Promise(r => setTimeout(r, SIMULATED_DELAY));
  return { userId: 'mock-user-id', message: 'Account created' };
}

/** POST /auth/signin */
export async function signin(_input: SigninInput): Promise<SigninResponse> {
  await new Promise(r => setTimeout(r, SIMULATED_DELAY));
  return { userId: 'mock-user-id' };
}

/** POST /auth/signout */
export async function signout(): Promise<void> {
  await new Promise(r => setTimeout(r, SIMULATED_DELAY));
}

/** POST /auth/refresh */
export async function refreshToken(): Promise<{ accessToken: string }> {
  await new Promise(r => setTimeout(r, SIMULATED_DELAY));
  return { accessToken: 'mock-access-token' };
}

// ─── Users ──────────────────────────────────────────────────────────
interface UsersPayload {
  fournisseur: Fournisseur;
  agent: Agent;
  acheteur: Acheteur;
}

/**
 * GET /users/me — returns the profile of the currently-authenticated user.
 *
 * In the mock layer we still read from `users.json` and pick the right
 * role-object. Pass the current role so the mock knows which sub-object
 * to return.  When plugged to a real backend a single GET /users/me is
 * enough (the token carries the role).
 */
export async function getMe(role: 'fournisseur'): Promise<Fournisseur>;
export async function getMe(role: 'agent'): Promise<Agent>;
export async function getMe(role: 'acheteur'): Promise<Acheteur>;
export async function getMe(role: 'fournisseur' | 'agent' | 'acheteur'): Promise<Fournisseur | Agent | Acheteur> {
  const data = await fetchJson<UsersPayload>('users.json');
  return data[role];
}

/** POST /users/me — update profile */
export interface UpdateMeInput {
  bio?: string;
  phone?: string;
  email?: string;
  displayName?: string;
}

export async function updateMe(_input: UpdateMeInput): Promise<Fournisseur | Agent | Acheteur> {
  // For mock, just return the existing fournisseur profile
  const data = await fetchJson<UsersPayload>('users.json');
  return data.fournisseur;
}

/** GET /users/search?username= */
export async function searchUser(_username: string): Promise<Fournisseur | Agent | Acheteur | null> {
  await new Promise(r => setTimeout(r, SIMULATED_DELAY));
  return null; // mock: no matching user
}

/** POST /users/uploadAvatar */
export async function uploadAvatar(_blob: Blob): Promise<{ documentId: string; sharingKey: string }> {
  await new Promise(r => setTimeout(r, SIMULATED_DELAY));
  return { documentId: 'mock-doc-id', sharingKey: 'mock-sharing-key' };
}

// ─── Billing ────────────────────────────────────────────────────────
interface BillingPayload {
  creditPacks: CreditPack[];
  payments: Payment[];
  notifications: Notification[];
}

export async function getCreditPacks(): Promise<CreditPack[]> {
  const data = await fetchJson<BillingPayload>('billing.json');
  return data.creditPacks;
}

export async function getPayments(): Promise<Payment[]> {
  const data = await fetchJson<BillingPayload>('billing.json');
  return data.payments;
}

export async function getNotifications(): Promise<Notification[]> {
  const data = await fetchJson<BillingPayload>('billing.json');
  return data.notifications;
}

// ─── Stats ──────────────────────────────────────────────────────────
interface StatsPayload {
  globalStats: {
    totalLeads: number;
    qualifiedLeads: number;
    soldLeads: number;
    pendingLeads: number;
    revenue: number;
    avgScore: number;
    conversionRate: number;
  };
  monthlyStats: { month: string; leads: number; qualified: number; sold: number; revenue: number }[];
  sectorDistribution: { name: string; value: number; color: string }[];
  regionDistribution: { name: string; value: number }[];
  scoreExplanations: ScoreExplanation[];
}

export async function getGlobalStats() {
  const data = await fetchJson<StatsPayload>('stats.json');
  return data.globalStats;
}

export async function getMonthlyStats() {
  const data = await fetchJson<StatsPayload>('stats.json');
  return data.monthlyStats;
}

export async function getSectorDistribution() {
  const data = await fetchJson<StatsPayload>('stats.json');
  return data.sectorDistribution;
}

export async function getRegionDistribution() {
  const data = await fetchJson<StatsPayload>('stats.json');
  return data.regionDistribution;
}

export async function getScoreExplanations(): Promise<ScoreExplanation[]> {
  const data = await fetchJson<StatsPayload>('stats.json');
  return data.scoreExplanations;
}

// ─── Admin Imports ──────────────────────────────────────────────────
export async function getAdminImports(): Promise<AdminImport[]> {
  return fetchJson<AdminImport[]>('admin-imports.json');
}

// ─── Agent Imports ──────────────────────────────────────────────────
export async function getAgentImports(): Promise<AgentImport[]> {
  return fetchJson<AgentImport[]>('agent-imports.json');
}

// ─── Audio Records ──────────────────────────────────────────────────
export async function getAudioRecords(): Promise<AudioRecord[]> {
  return fetchJson<AudioRecord[]>('audios.json');
}

// ─── Transactions (Paiements) ───────────────────────────────────────
interface TransactionsPayload {
  transactions: Transaction[];
  monthlyRevenue: { month: string; revenus: number; payouts: number }[];
}

export async function getTransactions(): Promise<Transaction[]> {
  const data = await fetchJson<TransactionsPayload>('transactions.json');
  return data.transactions;
}

export async function getMonthlyRevenue() {
  const data = await fetchJson<TransactionsPayload>('transactions.json');
  return data.monthlyRevenue;
}

// ─── Credit Config (Admin) ──────────────────────────────────────────
interface CreditConfigPayload {
  packs: AdminCreditPack[];
  rules: CreditRule[];
}

export async function getAdminCreditPacks(): Promise<AdminCreditPack[]> {
  const data = await fetchJson<CreditConfigPayload>('credit-config.json');
  return data.packs;
}

export async function getCreditRules(): Promise<CreditRule[]> {
  const data = await fetchJson<CreditConfigPayload>('credit-config.json');
  return data.rules;
}

// ─── Fournisseur Gains ──────────────────────────────────────────────
interface GainsPayload {
  gains: FournisseurGain[];
  monthlyGains: { month: string; gains: number; paid: number }[];
}

export async function getFournisseurGains(): Promise<FournisseurGain[]> {
  const data = await fetchJson<GainsPayload>('fournisseur-gains.json');
  return data.gains;
}

export async function getMonthlyGains() {
  const data = await fetchJson<GainsPayload>('fournisseur-gains.json');
  return data.monthlyGains;
}

// ─── Virements ──────────────────────────────────────────────────────
interface VirementsPayload {
  virements: Virement[];
  monthlyAmounts: { month: string; amount: number }[];
}

export async function getVirements(): Promise<Virement[]> {
  const data = await fetchJson<VirementsPayload>('virements.json');
  return data.virements;
}

export async function getMonthlyVirements() {
  const data = await fetchJson<VirementsPayload>('virements.json');
  return data.monthlyAmounts;
}
