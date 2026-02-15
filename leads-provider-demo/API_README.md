# Leads Provider — API Reference (Backend Specifications)

> Ce document décrit **tous les endpoints** que le backend doit implémenter pour remplacer les fichiers JSON statiques utilisés dans le prototype frontend.
>
> **Architecture actuelle** : Le frontend consomme `src/services/api.ts` qui fetch des fichiers JSON depuis `/api/*.json`. Pour brancher le vrai backend, il suffit de changer `API_BASE` (ou utiliser une variable d'env) vers l'URL du serveur. **Aucune modification dans les pages n'est nécessaire.**

---

## Table des matières

1. [Rôles Utilisateurs](#1-rôles-utilisateurs)
2. [Endpoints — Vue d'ensemble](#2-endpoints--vue-densemble)
3. [Détail des Endpoints](#3-détail-des-endpoints)
   - [Leads](#31-leads)
   - [Utilisateurs](#32-utilisateurs)
   - [Facturation & Crédits (Acheteur)](#33-facturation--crédits-acheteur)
   - [Statistiques](#34-statistiques)
   - [Imports Admin](#35-imports-admin)
   - [Imports Agent](#36-imports-agent)
   - [Audios](#37-audios)
   - [Transactions / Paiements (Admin)](#38-transactions--paiements-admin)
   - [Configuration Crédits (Admin)](#39-configuration-crédits-admin)
   - [Gains Fournisseurs (Admin)](#310-gains-fournisseurs-admin)
   - [Virements (Fournisseur)](#311-virements-fournisseur)
4. [Types / Modèles de Données](#4-types--modèles-de-données)
5. [Mapping Pages → Endpoints](#5-mapping-pages--endpoints)
6. [Notes pour l'intégration](#6-notes-pour-lintégration)

---

## 1. Rôles Utilisateurs

| Rôle | Description |
|------|-------------|
| `admin` | Super-administrateur. Accès total : dashboards, imports, audios, paiements, crédits, gains, utilisateurs. |
| `fournisseur` | Fournit les leads. Voit ses fichiers, ses leads, ses gains, ses virements. |
| `agent` | Qualifie les leads par téléphone. Voit les imports à traiter, historique d'appels. |
| `acheteur` | Achète des leads. Catalogue, achats, crédits. |

---

## 2. Endpoints — Vue d'ensemble

| # | Méthode | Endpoint | Description | Rôle(s) |
|---|---------|----------|-------------|---------|
| 1 | `GET` | `/api/leads` | Liste de tous les leads | all |
| 2 | `GET` | `/api/leads?search=&sector=&region=&minScore=&status=` | Leads filtrés | all |
| 3 | `GET` | `/api/users/fournisseur` | Profil du fournisseur connecté | fournisseur |
| 4 | `GET` | `/api/users/agent` | Profil de l'agent connecté | agent |
| 5 | `GET` | `/api/users/acheteur` | Profil de l'acheteur connecté | acheteur |
| 6 | `GET` | `/api/billing/credit-packs` | Packs de crédits disponibles à l'achat | acheteur |
| 7 | `GET` | `/api/billing/payments` | Historique des paiements de l'acheteur | acheteur |
| 8 | `GET` | `/api/billing/notifications` | Notifications de l'acheteur | acheteur |
| 9 | `GET` | `/api/stats/global` | Statistiques globales | admin |
| 10 | `GET` | `/api/stats/monthly` | Stats mensuelles (leads, qualifiés, vendus, CA) | admin, fournisseur |
| 11 | `GET` | `/api/stats/sectors` | Distribution par secteur | admin, acheteur |
| 12 | `GET` | `/api/stats/regions` | Distribution par région | admin |
| 13 | `GET` | `/api/stats/score-explanations` | Explication du score IA par feature | admin |
| 14 | `GET` | `/api/admin/imports` | Liste des imports fichiers (vue admin) | admin |
| 15 | `GET` | `/api/agent/imports` | Liste des imports fichiers (vue agent) | agent |
| 16 | `GET` | `/api/admin/audios` | Enregistrements audio des appels | admin |
| 17 | `GET` | `/api/admin/transactions` | Toutes les transactions financières | admin |
| 18 | `GET` | `/api/admin/transactions/monthly-revenue` | CA mensuel + payouts | admin |
| 19 | `GET` | `/api/admin/credits/packs` | Configuration des packs crédits (admin) | admin |
| 20 | `GET` | `/api/admin/credits/rules` | Règles de tarification crédits | admin |
| 21 | `GET` | `/api/admin/gains` | Gains par fournisseur | admin |
| 22 | `GET` | `/api/admin/gains/monthly` | Évolution mensuelle des gains | admin |
| 23 | `GET` | `/api/fournisseur/virements` | Historique des virements reçus | fournisseur |
| 24 | `GET` | `/api/fournisseur/virements/monthly` | Montants mensuels des virements | fournisseur |

---

## 3. Détail des Endpoints

### 3.1 Leads

#### `GET /api/leads`

Retourne la liste complète des leads.

**Réponse** : `Lead[]`

```json
[
  {
    "id": "lead-001",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+33 6 12 34 56 78",
    "company": "SolarTech",
    "sector": "Énergie Solaire",
    "region": "Île-de-France",
    "city": "Paris",
    "source": "Facebook Ads",
    "channel": "Formulaire Web",
    "score": 87,
    "status": "qualified",
    "qualificationStatus": "qualified",
    "createdAt": "2026-02-10T14:30:00Z",
    "updatedAt": "2026-02-11T09:15:00Z",
    "price": 25,
    "isExclusive": true,
    "hasAudioRecording": true,
    "notes": "Intéressé par installation 6kWc"
  }
]
```

#### `GET /api/leads?search=&sector=&region=&minScore=&status=`

Même réponse, avec filtrage côté serveur. Tous les paramètres sont optionnels.

| Paramètre | Type | Valeurs possibles |
|-----------|------|-------------------|
| `search` | `string` | Recherche libre (nom, prénom, société, secteur) |
| `sector` | `string` | `"all"` ou nom du secteur |
| `region` | `string` | `"all"` ou nom de la région |
| `minScore` | `number` | Score minimum (0-100) |
| `status` | `string` | `"all"`, `"new"`, `"qualified"`, `"sold"`, `"rejected"`, `"pending"` |

---

### 3.2 Utilisateurs

#### `GET /api/users/fournisseur`

**Réponse** : `Fournisseur`

```json
{
  "id": "user-f001",
  "email": "sophie@agence-ads.fr",
  "firstName": "Sophie",
  "lastName": "Martin",
  "role": "fournisseur",
  "company": "Agence Ads Paris",
  "phone": "+33 1 23 45 67 89",
  "avatar": null,
  "credits": null,
  "createdAt": "2025-06-15T10:00:00Z",
  "iban": "FR76 •••• •••• •••• 4521",
  "totalLeadsUploaded": 1250,
  "totalLeadsSold": 890,
  "totalRevenue": 28540,
  "pendingPayment": 2450
}
```

#### `GET /api/users/agent`

**Réponse** : `Agent`

```json
{
  "id": "user-a001",
  "email": "marc@leads-provider.fr",
  "firstName": "Marc",
  "lastName": "Lefebvre",
  "role": "agent",
  "company": "Leads Provider",
  "phone": "+33 1 98 76 54 32",
  "createdAt": "2025-09-01T08:00:00Z",
  "leadsQualifiedToday": 12,
  "totalLeadsQualified": 1456,
  "averageCallDuration": 245,
  "qualificationRate": 72.5
}
```

#### `GET /api/users/acheteur`

**Réponse** : `Acheteur`

```json
{
  "id": "user-b001",
  "email": "pierre@renovation-plus.fr",
  "firstName": "Pierre",
  "lastName": "Bernard",
  "role": "acheteur",
  "company": "Rénovation Plus",
  "phone": "+33 6 11 22 33 44",
  "credits": 145,
  "createdAt": "2025-08-20T14:00:00Z",
  "totalLeadsPurchased": 89,
  "conversionRate": 34.5,
  "preferredSectors": ["Énergie Solaire", "Isolation"],
  "preferredRegions": ["Île-de-France", "PACA"]
}
```

---

### 3.3 Facturation & Crédits (Acheteur)

#### `GET /api/billing/credit-packs`

Packs de crédits disponibles à l'achat par les acheteurs.

**Réponse** : `CreditPack[]`

```json
[
  {
    "id": "pack-1",
    "name": "Starter",
    "credits": 10,
    "price": 49,
    "popular": false,
    "bonus": 0
  },
  {
    "id": "pack-2",
    "name": "Pro",
    "credits": 50,
    "price": 199,
    "popular": true,
    "bonus": 5
  }
]
```

#### `GET /api/billing/payments`

Historique des paiements de l'acheteur connecté.

**Réponse** : `Payment[]`

```json
[
  {
    "id": "pay-001",
    "amount": 199,
    "status": "completed",
    "date": "2026-02-08",
    "type": "credit_purchase",
    "description": "Achat Pack Pro — 50 crédits"
  }
]
```

| `type` | Description |
|--------|-------------|
| `credit_purchase` | Achat de pack crédits |
| `lead_payment` | Débit pour achat de lead |

#### `GET /api/billing/notifications`

**Réponse** : `Notification[]`

```json
[
  {
    "id": "notif-001",
    "type": "success",
    "title": "Achat confirmé",
    "message": "50 crédits ajoutés à votre compte.",
    "read": false,
    "createdAt": "2026-02-10T10:30:00Z"
  }
]
```

| `type` | Couleur UI |
|--------|-----------|
| `info` | Bleu |
| `success` | Vert |
| `warning` | Jaune |
| `error` | Rouge |

---

### 3.4 Statistiques

#### `GET /api/stats/global`

**Réponse** :

```json
{
  "totalLeads": 1250,
  "qualifiedLeads": 890,
  "soldLeads": 456,
  "pendingLeads": 234,
  "revenue": 45600,
  "avgScore": 72.5,
  "conversionRate": 36.5
}
```

#### `GET /api/stats/monthly`

**Réponse** : `Array`

```json
[
  { "month": "Sep", "leads": 145, "qualified": 98, "sold": 52, "revenue": 5200 },
  { "month": "Oct", "leads": 180, "qualified": 125, "sold": 68, "revenue": 6800 }
]
```

#### `GET /api/stats/sectors`

**Réponse** : `Array`

```json
[
  { "name": "Énergie Solaire", "value": 350, "color": "#fd7958" },
  { "name": "Isolation", "value": 280, "color": "#344a5e" }
]
```

#### `GET /api/stats/regions`

**Réponse** : `Array`

```json
[
  { "name": "Île-de-France", "value": 320 },
  { "name": "PACA", "value": 180 }
]
```

#### `GET /api/stats/score-explanations`

Explication des features qui composent le score IA d'un lead.

**Réponse** : `ScoreExplanation[]`

```json
[
  {
    "feature": "Complétude du profil",
    "contribution": 25,
    "description": "Le lead a renseigné tous les champs obligatoires"
  }
]
```

---

### 3.5 Imports Admin

#### `GET /api/admin/imports`

Vue admin : tous les fichiers importés par les fournisseurs.

**Réponse** : `AdminImport[]`

```json
[
  {
    "id": "IMP-001",
    "fileName": "leads_solaire_jan2026.csv",
    "fournisseur": "Sophie Martin",
    "company": "Agence Ads Paris",
    "uploadDate": "2026-02-10",
    "totalLeads": 250,
    "valid": 220,
    "invalid": 15,
    "duplicates": 15,
    "status": "completed",
    "processingTime": "2m 34s"
  }
]
```

| `status` | Description |
|----------|-------------|
| `processing` | Import en cours de traitement |
| `completed` | Terminé avec succès |
| `failed` | Échec du traitement |
| `pending_review` | En attente de validation manuelle |

---

### 3.6 Imports Agent

#### `GET /api/agent/imports`

Vue agent : fichiers à qualifier (leads en attente, qualifiés, rejetés).

**Réponse** : `AgentImport[]`

```json
[
  {
    "id": "IMP-001",
    "fileName": "leads_solaire_jan2026.csv",
    "fournisseur": "Sophie Martin",
    "company": "Agence Ads Paris",
    "uploadDate": "2026-02-10",
    "totalLeads": 250,
    "pending": 45,
    "qualified": 180,
    "rejected": 15,
    "duplicates": 10,
    "status": "en_cours"
  }
]
```

| `status` | Description |
|----------|-------------|
| `en_cours` | Qualification en cours |
| `termine` | Tous les leads sont qualifiés |
| `en_attente` | Pas encore commencé |

---

### 3.7 Audios

#### `GET /api/admin/audios`

Enregistrements audio des appels de qualification.

**Réponse** : `AudioRecord[]`

```json
[
  {
    "id": "AUD-001",
    "leadName": "Jean Dupont",
    "leadCompany": "SolarTech",
    "agentName": "Marc Lefebvre",
    "date": "2026-02-10",
    "duration": "4:32",
    "durationSeconds": 272,
    "size": "3.2 MB",
    "status": "available",
    "qualificationResult": "qualified"
  }
]
```

| `status` | Description |
|----------|-------------|
| `available` | Audio accessible / téléchargeable |
| `processing` | En cours de traitement |
| `archived` | Archivé |

| `qualificationResult` | Description |
|------------------------|-------------|
| `qualified` | Lead qualifié |
| `not_qualified` | Lead non qualifié |
| `callback` | Rappel planifié |
| `pending` | En attente de qualification |

---

### 3.8 Transactions / Paiements (Admin)

#### `GET /api/admin/transactions`

Toutes les transactions financières de la plateforme.

**Réponse** : `Transaction[]`

```json
[
  {
    "id": "TRX-001",
    "type": "credit_purchase",
    "userName": "Pierre Bernard",
    "userRole": "acheteur",
    "company": "Rénovation Plus",
    "amount": 199.00,
    "credits": 50,
    "date": "2026-02-10",
    "status": "completed",
    "description": "Achat Pack Pro",
    "paymentMethod": "Carte bancaire"
  }
]
```

| `type` | Description |
|--------|-------------|
| `credit_purchase` | Achat de crédits par un acheteur |
| `lead_purchase` | Achat d'un lead (débit crédits) |
| `refund` | Remboursement |
| `bonus` | Crédits bonus offerts |
| `fournisseur_payment` | Paiement versé à un fournisseur |

| `status` | Description |
|----------|-------------|
| `completed` | Finalisé |
| `pending` | En cours |
| `failed` | Échoué |
| `refunded` | Remboursé |

#### `GET /api/admin/transactions/monthly-revenue`

Chiffre d'affaires et payouts par mois.

**Réponse** : `Array`

```json
[
  { "month": "Sep", "revenus": 12500, "payouts": 8200 },
  { "month": "Oct", "revenus": 15800, "payouts": 10500 }
]
```

---

### 3.9 Configuration Crédits (Admin)

#### `GET /api/admin/credits/packs`

Packs de crédits configurables par l'admin.

**Réponse** : `AdminCreditPack[]`

```json
[
  {
    "id": "pack-1",
    "name": "Starter",
    "credits": 10,
    "price": 49,
    "pricePerCredit": 4.90,
    "bonus": 0,
    "popular": false,
    "active": true
  }
]
```

> **Note** : L'admin peut activer/désactiver des packs et modifier les valeurs. Prévoir des endpoints `PUT /api/admin/credits/packs/:id` et `POST /api/admin/credits/packs`.

#### `GET /api/admin/credits/rules`

Règles de tarification (ex : prix par lead, commission fournisseur, etc.).

**Réponse** : `CreditRule[]`

```json
[
  {
    "id": "rule-1",
    "name": "Prix par lead standard",
    "description": "Coût en crédits pour l'achat d'un lead standard",
    "value": 5,
    "unit": "crédits",
    "active": true
  }
]
```

> **Note** : Prévoir `PUT /api/admin/credits/rules/:id` pour modifier les règles.

---

### 3.10 Gains Fournisseurs (Admin)

#### `GET /api/admin/gains`

Vue admin des gains accumulés par chaque fournisseur.

**Réponse** : `FournisseurGain[]`

```json
[
  {
    "id": "F-001",
    "fournisseur": "Sophie Martin",
    "company": "Agence Ads Paris",
    "email": "sophie@agence-ads.fr",
    "iban": "FR76 •••• •••• •••• 4521",
    "totalLeadsSold": 1250,
    "totalEarnings": 28540,
    "pendingAmount": 2450,
    "paidAmount": 26090,
    "lastPaymentDate": "2026-01-31",
    "status": "active"
  }
]
```

| `status` | Description |
|----------|-------------|
| `active` | Fournisseur actif, IBAN validé |
| `pending_validation` | En attente de validation (IBAN non vérifié) |
| `suspended` | Compte suspendu |

> **Note** : Prévoir `POST /api/admin/gains/:id/pay` pour déclencher un virement vers le fournisseur.

#### `GET /api/admin/gains/monthly`

Évolution mensuelle des gains et paiements.

**Réponse** : `Array`

```json
[
  { "month": "Sep", "gains": 4200, "paid": 3800 },
  { "month": "Oct", "gains": 5500, "paid": 5100 }
]
```

---

### 3.11 Virements (Fournisseur)

#### `GET /api/fournisseur/virements`

Historique des virements reçus par le fournisseur connecté.

**Réponse** : `Virement[]`

```json
[
  {
    "id": "VIR-001",
    "reference": "VP-2026-02-001",
    "amount": 2450.00,
    "date": "2026-02-10",
    "status": "pending",
    "leadsCount": 35,
    "period": "Fév 2026 (1ère quinzaine)",
    "iban": "FR76 •••• •••• •••• 4521"
  }
]
```

| `status` | Description |
|----------|-------------|
| `completed` | Virement reçu |
| `pending` | En cours de traitement |
| `failed` | Virement échoué |

#### `GET /api/fournisseur/virements/monthly`

Montants mensuels des virements.

**Réponse** : `Array`

```json
[
  { "month": "Sep", "amount": 3200 },
  { "month": "Oct", "amount": 2850 }
]
```

---

## 4. Types / Modèles de Données

Toutes les interfaces TypeScript sont définies dans `src/types/index.ts`. Voici un résumé :

### Enums / Types littéraux

| Type | Valeurs |
|------|---------|
| `LeadStatus` | `new`, `qualified`, `sold`, `rejected`, `pending` |
| `QualificationStatus` | `pending`, `in_progress`, `qualified`, `not_qualified`, `callback` |
| `UserRole` | `fournisseur`, `agent`, `acheteur`, `admin` |

### Modèles principaux

| Modèle | Champs clés | Utilisé par |
|--------|-------------|-------------|
| `Lead` | id, firstName, lastName, email, phone, company, sector, region, city, source, channel, score, status, qualificationStatus, price, isExclusive, hasAudioRecording | Catalogue, Dashboards, MesLeads, MesFichiers |
| `Fournisseur` | extends User + iban, totalLeadsUploaded, totalLeadsSold, totalRevenue, pendingPayment | Dashboard Fournisseur, MesLeads, Virements |
| `Agent` | extends User + leadsQualifiedToday, totalLeadsQualified, averageCallDuration, qualificationRate | Dashboard Agent, Imports Agent |
| `Acheteur` | extends User + credits, totalLeadsPurchased, conversionRate, preferredSectors, preferredRegions | Dashboard Acheteur, Catalogue, Crédits |
| `AdminImport` | id, fileName, fournisseur, company, uploadDate, totalLeads, valid, invalid, duplicates, status, processingTime | Admin Imports |
| `AgentImport` | id, fileName, fournisseur, company, uploadDate, totalLeads, pending, qualified, rejected, duplicates, status | Agent Imports |
| `AudioRecord` | id, leadName, leadCompany, agentName, date, duration, durationSeconds, size, status, qualificationResult | Admin Audios |
| `Transaction` | id, type, userName, userRole, company, amount, credits, date, status, description, paymentMethod | Admin Paiements |
| `AdminCreditPack` | id, name, credits, price, pricePerCredit, bonus, popular, active | Admin Crédits |
| `CreditRule` | id, name, description, value, unit, active | Admin Crédits |
| `FournisseurGain` | id, fournisseur, company, email, iban, totalLeadsSold, totalEarnings, pendingAmount, paidAmount, lastPaymentDate, status | Admin Gains |
| `Virement` | id, reference, amount, date, status, leadsCount, period, iban | Fournisseur Virements |
| `CreditPack` | id, name, credits, price, popular, bonus | Acheteur Crédits |
| `Payment` | id, amount, status, date, type, description | Acheteur Paiements |
| `Notification` | id, type, title, message, read, createdAt | Acheteur Notifications |

---

## 5. Mapping Pages → Endpoints

### Admin

| Page | Route | Endpoints consommés |
|------|-------|---------------------|
| Admin Dashboard | `/admin` | `getLeads()`, `getMonthlyStats()` |
| Admin Leads | `/admin/leads` | `getLeads()`, `getSectorDistribution()` |
| Admin Imports | `/admin/imports` | `getAdminImports()` |
| Admin Audios | `/admin/audios` | `getAudioRecords()` |
| Admin Paiements | `/admin/paiements` | `getTransactions()`, `getMonthlyRevenue()` |
| Admin Crédits | `/admin/credits` | `getAdminCreditPacks()`, `getCreditRules()` |
| Admin Gains | `/admin/gains` | `getFournisseurGains()`, `getMonthlyGains()` |
| Admin Utilisateurs | `/admin/users` | _(inline — à migrer)_ |

### Fournisseur

| Page | Route | Endpoints consommés |
|------|-------|---------------------|
| Dashboard Fournisseur | `/fournisseur` | `getFournisseur()`, `getMonthlyStats()` |
| Mes Leads | `/fournisseur/leads` | `getFournisseur()`, `getLeads()` |
| Mes Fichiers | `/fournisseur/fichiers` | `getFournisseur()`, `getLeads()` |
| Mes Virements | `/fournisseur/virements` | `getFournisseur()`, `getVirements()`, `getMonthlyVirements()` |

### Agent

| Page | Route | Endpoints consommés |
|------|-------|---------------------|
| Dashboard Agent | `/agent` | `getAgent()`, `getLeads()` |
| Imports Fournisseurs | `/agent/imports` | `getAgent()`, `getAgentImports()` |
| Historique Appels | `/agent/historique` | `getAgent()`, `getLeads()` |

### Acheteur

| Page | Route | Endpoints consommés |
|------|-------|---------------------|
| Dashboard Acheteur | `/acheteur` | `getAcheteur()`, `getLeads()`, `getSectorDistribution()` |
| Catalogue | `/acheteur/catalogue` | `getLeads()`, `getSectorDistribution()` |
| Mes Achats | `/acheteur/achats` | `getLeads()` |
| Crédits | `/acheteur/credits` | `getAcheteur()`, `getCreditPacks()` |

### Public

| Page | Route | Endpoints consommés |
|------|-------|---------------------|
| Catalogue Public | `/catalogue` | `getLeads()` |

---

## 6. Notes pour l'intégration

### Architecture du swap

```
AVANT (prototype) :
  Page → useApi(getLeads) → fetch("/api/leads.json") → fichier JSON statique

APRÈS (production) :
  Page → useApi(getLeads) → fetch("https://api.leadsprovider.fr/api/leads") → Backend réel
```

**Seul `API_BASE` dans `src/services/api.ts` doit changer.** Les pages ne sont pas modifiées.

### Authentification

Le prototype n'a pas d'auth réelle. Le backend devra :
- Implémenter JWT ou session-based auth
- Les endpoints `/api/users/*` retourneront le profil de l'utilisateur **connecté** (pas besoin de passer l'ID)
- Les endpoints fournisseur (`/api/fournisseur/*`) devront filtrer sur l'utilisateur connecté
- Les endpoints admin (`/api/admin/*`) devront vérifier le rôle `admin`

### Endpoints d'écriture à prévoir (non implémentés dans le prototype)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/leads` | Créer un lead manuellement |
| `PUT` | `/api/leads/:id` | Modifier un lead |
| `DELETE` | `/api/leads/:id` | Supprimer un lead |
| `POST` | `/api/imports` | Uploader un fichier CSV/XLSX |
| `POST` | `/api/leads/:id/qualify` | Qualifier un lead (agent) |
| `POST` | `/api/leads/:id/purchase` | Acheter un lead (acheteur, débit crédits) |
| `POST` | `/api/billing/purchase-pack` | Acheter un pack de crédits |
| `PUT` | `/api/admin/credits/packs/:id` | Modifier un pack crédit |
| `POST` | `/api/admin/credits/packs` | Créer un pack crédit |
| `PUT` | `/api/admin/credits/rules/:id` | Modifier une règle |
| `POST` | `/api/admin/gains/:id/pay` | Déclencher un virement fournisseur |
| `POST` | `/api/auth/login` | Connexion |
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/forgot-password` | Mot de passe oublié |
| `POST` | `/api/auth/reset-password` | Reset mot de passe |

### Fichiers JSON de référence

Tous les fichiers de données mock sont dans `public/api/` :

| Fichier | Contenu |
|---------|---------|
| `leads.json` | 50 leads avec tous les champs |
| `users.json` | 1 fournisseur, 1 agent, 1 acheteur |
| `billing.json` | Packs, paiements, notifications |
| `stats.json` | Stats globales, mensuelles, secteurs, régions, score explanations |
| `admin-imports.json` | 10 imports admin |
| `agent-imports.json` | 8 imports agent |
| `audios.json` | 10 enregistrements audio |
| `transactions.json` | 12 transactions + 6 mois CA |
| `credit-config.json` | 4 packs admin + 6 règles |
| `fournisseur-gains.json` | 6 fournisseurs + 6 mois gains |
| `virements.json` | 8 virements + 6 mois montants |

> **Ces fichiers JSON représentent le contrat exact des données attendues par le frontend.** Utilisez-les comme référence pour le schema de la base de données et les réponses API.
