import type { TourStep } from '../components/TourGuide';
import type { UserRole } from '../types';

export const catalogueTourSteps: TourStep[] = [
  {
    target: '[data-tour="credits-badge"]',
    title: 'Vos crédits 💰',
    content: 'Voici votre solde de crédits. 1 crédit = 1 lead. Vous pouvez recharger vos crédits à tout moment depuis la page "Crédits".',
    placement: 'bottom',
  },
  {
    target: '[data-tour="filters-panel"]',
    title: 'Filtres intelligents ',
    content: 'Utilisez ces filtres pour trouver les leads qui correspondent exactement à vos besoins : secteur, région, score minimum. Les filtres sont sauvegardés automatiquement.',
    placement: 'right',
  },
  {
    target: '[data-tour="score-slider"]',
    title: 'Score de qualification ⭐',
    content: 'Le score (0-100) est calculé par notre IA selon plusieurs critères : intérêt du prospect, qualité des données, historique. Plus le score est élevé, plus le lead est qualifié.',
    placement: 'right',
  },
  {
    target: '[data-tour="sector-chart"]',
    title: 'Répartition par secteur ',
    content: 'Ce graphique vous montre la distribution des leads disponibles par secteur d\'activité. Identifiez rapidement les opportunités.',
    placement: 'right',
  },
  {
    target: '[data-tour="lead-card"]',
    title: 'Cartes de leads 📇',
    content: 'Chaque carte affiche les informations essentielles : entreprise, secteur, score IA, prix. Les données personnelles (nom, email, téléphone) ne sont visibles qu\'après l\'achat.',
    placement: 'top',
  },
  {
    target: '[data-tour="audio-badge"]',
    title: 'Enregistrement audio 🎧',
    content: 'Ce badge indique qu\'un enregistrement audio de la qualification est disponible. Vous pourrez l\'écouter en cliquant sur "Voir les détails".',
    placement: 'top',
  },
  {
    target: '[data-tour="view-details"]',
    title: 'Détails du lead 🔍',
    content: 'Cliquez ici pour voir tous les détails : historique, notes de qualification, enregistrement audio, et ajouter le lead à votre panier.',
    placement: 'top',
  },
];

export const dashboardTourSteps: Record<UserRole, TourStep[]> = {
  acheteur: [
    {
      target: '[data-tour="stats-cards"]',
      title: 'Vos statistiques ',
      content: 'Vue d\'ensemble de vos métriques clés : crédits disponibles, leads achetés, taux de conversion, et leads disponibles dans le catalogue.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="evolution-chart"]',
      title: 'Évolution des performances 📈',
      content: 'Ce graphique affiche l\'évolution de vos achats et conversions sur les derniers mois. Identifiez les tendances et optimisez votre stratégie.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="recent-purchases"]',
      title: 'Derniers achats 🛒',
      content: 'Consultez vos achats récents avec leur statut de conversion : Converti (client acquis), En cours (négociation), ou Perdu.',
      placement: 'top',
    },
    {
      target: '[data-tour="quick-actions"]',
      title: 'Actions rapides ⚡',
      content: 'Accès direct aux fonctionnalités principales : parcourir le catalogue, recharger vos crédits, suivre vos conversions.',
      placement: 'left',
    },
  ],
  fournisseur: [
    {
      target: '[data-tour="stats-cards"]',
      title: 'Vos statistiques ',
      content: 'Vue d\'ensemble : leads uploadés, leads vendus, revenus générés, et paiement en attente.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="revenue-chart"]',
      title: 'Revenus mensuels 💰',
      content: 'Suivez l\'évolution de vos revenus mois par mois. Les paiements sont effectués automatiquement sous 7 jours.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="upload-button"]',
      title: 'Upload de leads 📤',
      content: 'Cliquez ici pour uploader un nouveau fichier CSV ou XLSX contenant vos leads. Le système détecte automatiquement les doublons.',
      placement: 'bottom',
    },
  ],
  agent: [
    {
      target: '[data-tour="stats-cards"]',
      title: 'Vos performances ',
      content: 'Statistiques du jour : leads qualifiés, durée moyenne d\'appel, et votre taux de qualification.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="pending-leads"]',
      title: 'Leads à qualifier ⏳',
      content: 'Liste des leads en attente de qualification. Cliquez sur "Appeler" pour démarrer un appel et enregistrer la conversation.',
      placement: 'top',
    },
    {
      target: '[data-tour="call-interface"]',
      title: 'Interface d\'appel ',
      content: 'Pendant l\'appel, le script de qualification s\'affiche ici. L\'enregistrement démarre automatiquement.',
      placement: 'left',
    },
  ],
  admin: [
    {
      target: '[data-tour="system-health"]',
      title: 'État du système 🏥',
      content: 'Surveillez la santé globale de la plateforme : performance, latence API, capacité base de données.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="user-management"]',
      title: 'Gestion utilisateurs 👥',
      content: 'Validez les nouveaux comptes, gérez les permissions, et surveillez l\'activité des utilisateurs.',
      placement: 'top',
    },
  ],
};

export const mesAchatsTourSteps: TourStep[] = [
  {
    target: '[data-tour="conversion-stats"]',
    title: 'Statistiques de conversion ',
    content: 'Cartes résumant vos achats : total, convertis, en cours, et perdus. Le taux de conversion est calculé automatiquement.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="conversion-chart"]',
    title: 'Évolution des conversions 📈',
    content: 'Graphique montrant l\'évolution de vos conversions dans le temps. Analysez vos performances et identifiez les tendances.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="purchases-table"]',
    title: 'Tableau détaillé 📋',
    content: 'Tous vos achats avec possibilité de marquer le statut de conversion. Filtrez par statut pour une vue ciblée.',
    placement: 'top',
  },
  {
    target: '[data-tour="status-badge"]',
    title: 'Statuts de conversion 🏷️',
    content: 'Marquez chaque lead : Converti ✅ (client gagné), En cours ⏳ (négociation), ou Perdu ❌. Ces données améliorent les recommandations IA.',
    placement: 'left',
  },
];

export const creditsTourSteps: TourStep[] = [
  {
    target: '[data-tour="credit-balance"]',
    title: 'Solde actuel ',
    content: 'Votre solde de crédits disponibles. Un crédit vous permet d\'acheter un lead qualifié.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="credit-packs"]',
    title: 'Packs de crédits ',
    content: 'Choisissez le pack adapté à vos besoins. Plus vous achetez, plus le prix par crédit est avantageux.',
    placement: 'top',
  },
  {
    target: '[data-tour="usage-chart"]',
    title: 'Historique d\'utilisation ',
    content: 'Suivez votre consommation de crédits dans le temps pour mieux anticiper vos besoins.',
    placement: 'bottom',
  },
];
