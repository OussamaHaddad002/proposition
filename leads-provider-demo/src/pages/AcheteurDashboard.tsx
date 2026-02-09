import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Users, TrendingUp, CreditCard, ArrowRight, Target, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { mockAcheteur, mockLeads, sectorDistribution } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TourGuide from '../components/TourGuide';
import { dashboardTourSteps } from '../data/tourSteps';

export default function AcheteurDashboard() {
  const [searchParams] = useSearchParams();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setShowTour(true);
    }
  }, [searchParams]);

  // Leads disponibles (qualifiés)
  const availableLeads = mockLeads.filter(l => l.status === 'qualified').length;
  
  // Données pour le graphique d'évolution
  const evolutionData = [
    { month: 'Oct', achats: 12, conversions: 4 },
    { month: 'Nov', achats: 18, conversions: 6 },
    { month: 'Déc', achats: 15, conversions: 5 },
    { month: 'Jan', achats: 22, conversions: 8 },
    { month: 'Fév', achats: 28, conversions: 10 },
    { month: 'Mar', achats: 24, conversions: 9 },
  ];

  // Derniers achats simulés
  const recentPurchases = [
    { id: '1', company: 'Tech Solutions', sector: 'Technologie', date: '2024-03-15', status: 'converted', score: 87 },
    { id: '2', company: 'Green Energy', sector: 'Énergie', date: '2024-03-14', status: 'pending', score: 75 },
    { id: '3', company: 'Finance Pro', sector: 'Finance', date: '2024-03-13', status: 'converted', score: 92 },
    { id: '4', company: 'Retail Plus', sector: 'Commerce', date: '2024-03-12', status: 'lost', score: 68 },
    { id: '5', company: 'Health First', sector: 'Santé', date: '2024-03-11', status: 'pending', score: 81 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'converted':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full"><CheckCircle2 size={12} />Converti</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full"><Clock size={12} />En cours</span>;
      case 'lost':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full"><AlertCircle size={12} />Perdu</span>;
      default:
        return null;
    }
  };

  return (
    <Layout userRole="acheteur" userName={`${mockAcheteur.firstName} ${mockAcheteur.lastName}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tableau de bord </h1>
            <p className="text-sm sm:text-base text-gray-500">Vue d'ensemble de votre activité</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className="bg-accent/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl">
              <span className="text-accent font-bold text-lg sm:text-xl">{mockAcheteur.credits}</span>
              <span className="text-accent ml-1 text-sm">crédits</span>
            </div>
            <Link 
              to="/acheteur/catalogue"
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-accent text-white rounded-xl font-medium hover:bg-accent-dark transition-colors text-sm sm:text-base"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Voir le catalogue</span>
              <span className="sm:hidden">Catalogue</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="stats-cards">
          <StatCard
            title="Crédits disponibles"
            value={mockAcheteur.credits}
            icon={<CreditCard size={24} />}
            color="accent"
          />
          <StatCard
            title="Leads achetés"
            value={mockAcheteur.totalLeadsPurchased}
            change={12}
            icon={<Users size={24} />}
            color="primary"
          />
          <StatCard
            title="Taux de conversion"
            value={`${mockAcheteur.conversionRate}%`}
            change={5}
            icon={<TrendingUp size={24} />}
            color="success"
          />
          <StatCard
            title="Leads disponibles"
            value={availableLeads}
            icon={<Target size={24} />}
            color="info"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evolution Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100" data-tour="evolution-chart">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">Évolution des achats</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-gray-600">Achats</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-600">Conversions</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="achats" stroke="#fd7958" fill="#fd7958" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="conversions" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Répartition par secteur</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={sectorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sectorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {sectorDistribution.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 flex-1">{item.name}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Purchases & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Purchases */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-tour="recent-purchases">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="font-semibold text-gray-900">Derniers achats</h2>
              <Link to="/acheteur/achats" className="text-accent text-sm font-medium hover:underline flex items-center gap-1">
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentPurchases.map((purchase) => (
                <div key={purchase.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold flex-shrink-0">
                      {purchase.company.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{purchase.company}</p>
                      <p className="text-sm text-gray-500">{purchase.sector}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-auto">
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-1">
                        <Target size={14} className="text-accent" />
                        <span className="font-medium text-gray-900">{purchase.score}</span>
                      </div>
                      <p className="text-xs text-gray-400">{purchase.date}</p>
                    </div>
                    {getStatusBadge(purchase.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4" data-tour="quick-actions">
            <div className="bg-gradient-to-br from-accent to-accent-dark rounded-xl p-6 text-white">
              <ShoppingCart size={32} className="mb-4" />
              <h3 className="font-bold text-lg mb-2">Parcourir le catalogue</h3>
              <p className="text-white/80 text-sm mb-4">Découvrez {availableLeads} leads qualifiés disponibles</p>
              <Link 
                to="/acheteur/catalogue"
                className="inline-flex items-center gap-2 bg-white text-accent px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Explorer <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <CreditCard size={24} className="text-accent mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Recharger mes crédits</h3>
              <p className="text-gray-500 text-sm mb-4">Achetez des crédits pour débloquer plus de leads</p>
              <Link 
                to="/acheteur/credits"
                className="text-accent font-medium hover:underline flex items-center gap-1"
              >
                Voir les packs <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <TrendingUp size={24} className="text-green-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Suivre mes conversions</h3>
              <p className="text-gray-500 text-sm mb-4">Analysez vos performances et votre ROI</p>
              <Link 
                to="/acheteur/achats"
                className="text-accent font-medium hover:underline flex items-center gap-1"
              >
                Voir l'historique <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showTour && (
        <TourGuide
          steps={dashboardTourSteps.acheteur}
          isActive={showTour}
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}
    </Layout>
  );
}
