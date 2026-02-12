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

// ─── Users ──────────────────────────────────────────────────────────
interface UsersPayload {
  fournisseur: Fournisseur;
  agent: Agent;
  acheteur: Acheteur;
}

export async function getFournisseur(): Promise<Fournisseur> {
  const data = await fetchJson<UsersPayload>('users.json');
  return data.fournisseur;
}

export async function getAgent(): Promise<Agent> {
  const data = await fetchJson<UsersPayload>('users.json');
  return data.agent;
}

export async function getAcheteur(): Promise<Acheteur> {
  const data = await fetchJson<UsersPayload>('users.json');
  return data.acheteur;
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
