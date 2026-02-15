// Types pour la plateforme Leads Provider

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  region: string;
  city: string;
  source: string;
  channel: string;
  score: number;
  status: LeadStatus;
  qualificationStatus: QualificationStatus;
  createdAt: string;
  updatedAt: string;
  price: number;
  isExclusive: boolean;
  hasAudioRecording: boolean;
  notes?: string;
}

export type LeadStatus = 'new' | 'qualified' | 'sold' | 'rejected' | 'pending';
export type QualificationStatus = 'pending' | 'in_progress' | 'qualified' | 'not_qualified' | 'callback';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  company?: string;
  phone?: string;
  avatar?: string;
  credits?: number;
  createdAt: string;
}

export type UserRole = 'fournisseur' | 'agent' | 'acheteur' | 'admin';

export interface Fournisseur extends User {
  role: 'fournisseur';
  iban: string;
  totalLeadsUploaded: number;
  totalLeadsSold: number;
  totalRevenue: number;
  pendingPayment: number;
}

export interface Agent extends User {
  role: 'agent';
  leadsQualifiedToday: number;
  totalLeadsQualified: number;
  averageCallDuration: number;
  qualificationRate: number;
}

export interface Acheteur extends User {
  role: 'acheteur';
  credits: number;
  totalLeadsPurchased: number;
  conversionRate: number;
  preferredSectors: string[];
  preferredRegions: string[];
}

export interface Stats {
  totalLeads: number;
  qualifiedLeads: number;
  soldLeads: number;
  pendingLeads: number;
  revenue: number;
  avgScore: number;
  conversionRate: number;
}

export interface ScoreExplanation {
  feature: string;
  contribution: number;
  description: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  type: 'credit_purchase' | 'lead_payment';
  description: string;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  bonus?: number;
}

// ─── Admin Imports ──────────────────────────────────────────────────
export interface AdminImport {
  id: string;
  fileName: string;
  fournisseur: string;
  company: string;
  uploadDate: string;
  totalLeads: number;
  valid: number;
  invalid: number;
  duplicates: number;
  status: 'processing' | 'completed' | 'failed' | 'pending_review';
  processingTime?: string;
}

// ─── Agent Imports ──────────────────────────────────────────────────
export interface AgentImport {
  id: string;
  fileName: string;
  fournisseur: string;
  company: string;
  uploadDate: string;
  totalLeads: number;
  pending: number;
  qualified: number;
  rejected: number;
  duplicates: number;
  status: 'en_cours' | 'termine' | 'en_attente';
}

// ─── Audio Records ──────────────────────────────────────────────────
export interface AudioRecord {
  id: string;
  leadName: string;
  leadCompany: string;
  agentName: string;
  date: string;
  duration: string;
  durationSeconds: number;
  size: string;
  status: 'available' | 'processing' | 'archived';
  qualificationResult: 'qualified' | 'not_qualified' | 'callback' | 'pending';
}

// ─── Transactions (Paiements) ───────────────────────────────────────
export interface Transaction {
  id: string;
  type: 'credit_purchase' | 'lead_purchase' | 'refund' | 'bonus' | 'fournisseur_payment';
  userName: string;
  userRole: 'acheteur' | 'fournisseur' | 'admin';
  company?: string;
  amount: number;
  credits?: number;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  description: string;
  paymentMethod?: string;
}

// ─── Credit Config (Admin) ──────────────────────────────────────────
export interface AdminCreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  bonus: number;
  popular: boolean;
  active: boolean;
}

export interface CreditRule {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  active: boolean;
}

// ─── Fournisseur Gains ──────────────────────────────────────────────
export interface FournisseurGain {
  id: string;
  fournisseur: string;
  company: string;
  email: string;
  iban: string;
  totalLeadsSold: number;
  totalEarnings: number;
  pendingAmount: number;
  paidAmount: number;
  lastPaymentDate: string;
  status: 'active' | 'pending_validation' | 'suspended';
}

// ─── Virements (Fournisseur) ────────────────────────────────────────
export interface Virement {
  id: string;
  reference: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  leadsCount: number;
  period: string;
  iban: string;
}
