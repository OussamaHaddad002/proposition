import type { Lead, Fournisseur, Agent, Acheteur, ScoreExplanation, CreditPack, Payment, Notification } from '../types';

// Données de base pour générer les leads
const sectors = [
  'Technologie', 'Finance', 'Immobilier', 'Santé', 'Éducation', 
  'Automobile', 'Énergie', 'Commerce', 'Industrie', 'Services'
];

const regions = [
  'Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 
  'Occitanie', 'Hauts-de-France', 'Provence-Alpes-Côte d\'Azur',
  'Grand Est', 'Bretagne', 'Normandie', 'Pays de la Loire'
];

const cities: Record<string, string[]> = {
  'Île-de-France': ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Versailles', 'Nanterre'],
  'Auvergne-Rhône-Alpes': ['Lyon', 'Grenoble', 'Saint-Étienne', 'Villeurbanne', 'Clermont-Ferrand'],
  'Nouvelle-Aquitaine': ['Bordeaux', 'Limoges', 'Poitiers', 'La Rochelle', 'Pau'],
  'Occitanie': ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan', 'Béziers'],
  'Hauts-de-France': ['Lille', 'Amiens', 'Roubaix', 'Tourcoing', 'Dunkerque'],
  'Provence-Alpes-Côte d\'Azur': ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Avignon'],
  'Grand Est': ['Strasbourg', 'Reims', 'Metz', 'Mulhouse', 'Nancy'],
  'Bretagne': ['Rennes', 'Brest', 'Quimper', 'Lorient', 'Vannes'],
  'Normandie': ['Rouen', 'Le Havre', 'Caen', 'Cherbourg', 'Évreux'],
  'Pays de la Loire': ['Nantes', 'Angers', 'Le Mans', 'Saint-Nazaire', 'La Roche-sur-Yon']
};

const sources = ['Google Ads', 'Facebook Ads', 'LinkedIn', 'SEO Organique', 'Partenaire', 'Email Marketing'];
const channels = ['Web', 'Mobile', 'Téléphone', 'Salon professionnel', 'Recommandation'];

const firstNames = [
  'Jean', 'Pierre', 'Marie', 'Sophie', 'Thomas', 'Nicolas', 'Julie', 'Camille',
  'Lucas', 'Emma', 'Louis', 'Léa', 'Hugo', 'Chloé', 'Antoine', 'Manon',
  'Alexandre', 'Sarah', 'Mathieu', 'Laura', 'Julien', 'Marine', 'Romain', 'Pauline'
];

const lastNames = [
  'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand',
  'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David',
  'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'André', 'Lefèvre'
];

const companies = [
  'TechSolutions SAS', 'Digital Factory', 'InnovateCorp', 'DataTech', 'CloudServices',
  'WebAgency Pro', 'StartupLab', 'ConsultingPlus', 'MediaGroup', 'FinanceExpert',
  'ImmoPro', 'HealthCare Plus', 'EduTech', 'AutoServices', 'EnergieSolutions',
  'CommerceDigital', 'IndustrieTech', 'ServicesPro', 'LogistiquePlus', 'CyberSecure'
];

const statuses: Lead['status'][] = ['new', 'qualified', 'sold', 'pending', 'rejected'];
const qualificationStatuses: Lead['qualificationStatus'][] = ['pending', 'in_progress', 'qualified', 'not_qualified', 'callback'];

// Fonction utilitaire pour générer un ID unique
const generateId = () => Math.random().toString(36).substring(2, 15);

// Fonction pour obtenir un élément aléatoire d'un tableau
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Fonction pour générer une date aléatoire dans les 30 derniers jours
const randomDate = (daysBack: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Générer 100 leads mockés
export const generateMockLeads = (): Lead[] => {
  const leads: Lead[] = [];
  
  for (let i = 0; i < 100; i++) {
    const region = randomItem(regions);
    const city = randomItem(cities[region] || ['Ville']);
    const status = randomItem(statuses);
    const score = Math.floor(Math.random() * 40) + 60; // Score entre 60 et 100
    
    leads.push({
      id: generateId(),
      firstName: randomItem(firstNames),
      lastName: randomItem(lastNames),
      email: `${randomItem(firstNames).toLowerCase()}.${randomItem(lastNames).toLowerCase()}@${randomItem(['gmail.com', 'yahoo.fr', 'outlook.fr', 'entreprise.fr'])}`,
      phone: `+33 ${Math.floor(Math.random() * 9) + 1} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
      company: randomItem(companies),
      sector: randomItem(sectors),
      region: region,
      city: city,
      source: randomItem(sources),
      channel: randomItem(channels),
      score: score,
      status: status,
      qualificationStatus: status === 'qualified' ? 'qualified' : status === 'rejected' ? 'not_qualified' : randomItem(qualificationStatuses),
      createdAt: randomDate(30),
      updatedAt: randomDate(7),
      price: Math.floor(Math.random() * 50) + 15, // Prix entre 15€ et 65€
      isExclusive: Math.random() > 0.3,
      hasAudioRecording: status === 'qualified' || status === 'sold',
      notes: Math.random() > 0.5 ? 'Prospect intéressé, à recontacter.' : undefined
    });
  }
  
  return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Explications de score mockées
export const generateScoreExplanation = (score: number): ScoreExplanation[] => {
  const baseScore = 50;
  const contributions: ScoreExplanation[] = [
    {
      feature: 'Secteur d\'activité',
      contribution: Math.floor(Math.random() * 15) + 5,
      description: 'Secteur à forte demande'
    },
    {
      feature: 'Région',
      contribution: Math.floor(Math.random() * 12) + 3,
      description: 'Zone géographique active'
    },
    {
      feature: 'Fraîcheur du lead',
      contribution: Math.floor(Math.random() * 10) + 2,
      description: 'Lead récent (< 7 jours)'
    },
    {
      feature: 'Email validé',
      contribution: Math.floor(Math.random() * 8) + 2,
      description: 'Adresse email vérifiée (MX valide)'
    },
    {
      feature: 'Téléphone validé',
      contribution: Math.floor(Math.random() * 6) + 1,
      description: 'Numéro vérifié HLR'
    },
    {
      feature: 'Canal d\'acquisition',
      contribution: Math.floor(Math.random() * 5) - 2,
      description: 'Source moyenne'
    },
    {
      feature: 'Historique similaires',
      contribution: Math.floor(Math.random() * 4),
      description: 'Leads similaires performants'
    }
  ];
  
  return contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
};

// Utilisateurs mockés
export const mockFournisseur: Fournisseur = {
  id: 'fournisseur-1',
  email: 'sophie.martin@agence-ads.fr',
  firstName: 'Sophie',
  lastName: 'Martin',
  role: 'fournisseur',
  company: 'Agence Ads Paris',
  phone: '+33 1 23 45 67 89',
  iban: 'FR76 1234 5678 9012 3456 7890 123',
  totalLeadsUploaded: 1250,
  totalLeadsSold: 892,
  totalRevenue: 28540,
  pendingPayment: 1250,
  createdAt: '2024-01-15T10:00:00Z'
};

export const mockAgent: Agent = {
  id: 'agent-1',
  email: 'lucas.dubois@leads-provider.fr',
  firstName: 'Lucas',
  lastName: 'Dubois',
  role: 'agent',
  phone: '+33 6 12 34 56 78',
  leadsQualifiedToday: 23,
  totalLeadsQualified: 4521,
  averageCallDuration: 245, // secondes
  qualificationRate: 78.5,
  createdAt: '2024-03-01T09:00:00Z'
};

export const mockAcheteur: Acheteur = {
  id: 'acheteur-1',
  email: 'marie.leroy@pme-lille.fr',
  firstName: 'Marie',
  lastName: 'Leroy',
  role: 'acheteur',
  company: 'PME Lille Marketing',
  phone: '+33 3 20 12 34 56',
  credits: 450,
  totalLeadsPurchased: 156,
  conversionRate: 32.5,
  preferredSectors: ['Technologie', 'Finance', 'Services'],
  preferredRegions: ['Hauts-de-France', 'Île-de-France'],
  createdAt: '2024-02-10T14:00:00Z'
};

// Packs de crédits
export const creditPacks: CreditPack[] = [
  { id: 'pack-1', name: 'Starter', credits: 50, price: 149 },
  { id: 'pack-2', name: 'Business', credits: 150, price: 399, popular: true },
  { id: 'pack-3', name: 'Enterprise', credits: 500, price: 999 },
  { id: 'pack-4', name: 'Unlimited', credits: 1500, price: 2499 }
];

// Paiements mockés
export const mockPayments: Payment[] = [
  { id: 'pay-1', amount: 399, status: 'completed', date: '2026-02-01', type: 'credit_purchase', description: 'Pack Business - 150 crédits' },
  { id: 'pay-2', amount: 149, status: 'completed', date: '2026-01-15', type: 'credit_purchase', description: 'Pack Starter - 50 crédits' },
  { id: 'pay-3', amount: 1250, status: 'pending', date: '2026-02-05', type: 'lead_payment', description: 'Paiement leads février' },
];

// Notifications mockées
export const mockNotifications: Notification[] = [
  { id: 'notif-1', type: 'success', title: 'Lead qualifié', message: 'Le lead Jean Dupont a été qualifié avec succès.', read: false, createdAt: '2026-02-06T09:30:00Z' },
  { id: 'notif-2', type: 'info', title: 'Nouveau lead disponible', message: '15 nouveaux leads correspondent à vos critères.', read: false, createdAt: '2026-02-06T08:00:00Z' },
  { id: 'notif-3', type: 'warning', title: 'Crédits faibles', message: 'Il vous reste 45 crédits. Pensez à recharger.', read: true, createdAt: '2026-02-05T14:00:00Z' },
  { id: 'notif-4', type: 'success', title: 'Paiement reçu', message: 'Votre paiement de 1 250€ a été traité.', read: true, createdAt: '2026-02-04T10:00:00Z' },
];

// Stats globales
export const mockGlobalStats = {
  totalLeads: 15420,
  qualifiedLeads: 8750,
  soldLeads: 6230,
  pendingLeads: 2890,
  revenue: 187500,
  avgScore: 78.5,
  conversionRate: 40.4
};

// Stats mensuelles pour graphiques
export const monthlyStats = [
  { month: 'Sep', leads: 820, qualified: 540, sold: 380, revenue: 11400 },
  { month: 'Oct', leads: 980, qualified: 680, sold: 520, revenue: 15600 },
  { month: 'Nov', leads: 1150, qualified: 790, sold: 610, revenue: 18300 },
  { month: 'Déc', leads: 890, qualified: 580, sold: 420, revenue: 12600 },
  { month: 'Jan', leads: 1320, qualified: 920, sold: 750, revenue: 22500 },
  { month: 'Fév', leads: 680, qualified: 480, sold: 350, revenue: 10500 },
];

// Distribution par secteur
export const sectorDistribution = [
  { name: 'Technologie', value: 28, color: '#fd7958' },
  { name: 'Finance', value: 22, color: '#344a5e' },
  { name: 'Immobilier', value: 18, color: '#10b981' },
  { name: 'Santé', value: 12, color: '#3b82f6' },
  { name: 'Services', value: 10, color: '#f59e0b' },
  { name: 'Autres', value: 10, color: '#94a3b8' },
];

// Distribution par région
export const regionDistribution = [
  { name: 'Île-de-France', value: 35 },
  { name: 'Auvergne-Rhône-Alpes', value: 18 },
  { name: 'PACA', value: 12 },
  { name: 'Nouvelle-Aquitaine', value: 10 },
  { name: 'Occitanie', value: 8 },
  { name: 'Autres', value: 17 },
];

// Export des leads générés
export const mockLeads = generateMockLeads();
