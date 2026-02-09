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
