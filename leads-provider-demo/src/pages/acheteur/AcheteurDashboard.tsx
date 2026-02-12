import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingCart, TrendingUp, CreditCard, ArrowRight, Target, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import AcheteurLayout from '../../components/AcheteurLayout';
import { useApi } from '../../hooks/useApi';
import { getAcheteur, getLeads, getSectorDistribution } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TourGuide from '../../components/TourGuide';
import { dashboardTourSteps } from '../../data/tourSteps';

export default function AcheteurDashboard() {
  const [searchParams] = useSearchParams();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setShowTour(true);
    }
  }, [searchParams]);

  // Fetch data from API
  const { data: mockAcheteur } = useApi(getAcheteur, []);
  const { data: leadsData } = useApi(getLeads, []);
  const mockLeads = leadsData ?? [];
  const { data: sectorData } = useApi(getSectorDistribution, []);
  const sectorDistribution = sectorData ?? [];

  const availableLeads = mockLeads.filter(l => l.status === 'qualified').length;
  
  const evolutionData = [
    { month: 'Oct', achats: 12, conversions: 4 },
    { month: 'Nov', achats: 18, conversions: 6 },
    { month: 'Déc', achats: 15, conversions: 5 },
    { month: 'Jan', achats: 22, conversions: 8 },
    { month: 'Fév', achats: 28, conversions: 10 },
    { month: 'Mar', achats: 24, conversions: 9 },
  ];

  const recentPurchases = [
    { id: '1', company: 'Tech Solutions', sector: 'Technologie', date: '15 Mar', status: 'converted', score: 87 },
    { id: '2', company: 'Green Energy', sector: 'Énergie', date: '14 Mar', status: 'pending', score: 75 },
    { id: '3', company: 'Finance Pro', sector: 'Finance', date: '13 Mar', status: 'converted', score: 92 },
    { id: '4', company: 'Retail Plus', sector: 'Commerce', date: '12 Mar', status: 'lost', score: 68 },
    { id: '5', company: 'Health First', sector: 'Santé', date: '11 Mar', status: 'pending', score: 81 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'converted':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 rounded-md"><CheckCircle2 size={11} />Converti</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-amber-700 bg-amber-50 rounded-md"><Clock size={11} />En cours</span>;
      case 'lost':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-red-600 bg-red-50 rounded-md"><AlertCircle size={11} />Perdu</span>;
      default:
        return null;
    }
  };

  const stats = [
    { label: 'Crédits', value: mockAcheteur?.credits ?? 0, suffix: '', icon: <CreditCard size={18} />, color: 'text-[#fd7958]', bg: 'bg-[#fd7958]/[0.07]' },
    { label: 'Leads achetés', value: mockAcheteur?.totalLeadsPurchased ?? 0, suffix: '', change: '+12%', icon: <ShoppingCart size={18} />, color: 'text-[#344a5e]', bg: 'bg-[#344a5e]/[0.06]' },
    { label: 'Conversion', value: mockAcheteur?.conversionRate ?? 0, suffix: '%', change: '+5%', icon: <TrendingUp size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Disponibles', value: availableLeads, suffix: '', icon: <Target size={18} />, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <AcheteurLayout>
      {!mockAcheteur ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fd7958]" /></div>
      ) : (
      <>
      <div className="space-y-6">

        {/* Header — clean, flat */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Tableau de bord</h1>
            <p className="text-sm text-gray-400 mt-0.5">Vue d'ensemble de votre activité</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-[#fd7958]/[0.08] text-sm">
              <span className="font-semibold text-[#fd7958]">{mockAcheteur.credits}</span>
              <span className="text-[#fd7958]/70 ml-1">crédits</span>
            </div>
            <Link 
              to="/explore"
              className="flex items-center gap-2 px-4 py-2 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors"
            >
              <ShoppingCart size={15} />
              Catalogue
            </Link>
          </div>
        </div>

        {/* Stats — minimal cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-tour="stats-cards">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}>
                  {s.icon}
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-gray-900">{s.value}{s.suffix}</span>
                {s.change && (
                  <span className="text-xs font-medium text-emerald-600">{s.change}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Evolution chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100/80" data-tour="evolution-chart">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-800">Évolution des achats</h2>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#fd7958]" />Achats</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Conversions</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={evolutionData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#b0b8c4' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#b0b8c4' }} width={30} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px' }}
                />
                <defs>
                  <linearGradient id="achatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fd7958" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#fd7958" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="achats" stroke="#fd7958" fill="url(#achatGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="conversions" stroke="#10b981" fill="url(#convGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sector donut */}
          <div className="bg-white rounded-xl p-5 border border-gray-100/80">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Répartition secteurs</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={sectorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {sectorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-3">
              {sectorDistribution.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-500 flex-1 truncate">{item.name}</span>
                  <span className="font-medium text-gray-700">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Purchases + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent purchases — clean table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100/80 overflow-hidden" data-tour="recent-purchases">
            <div className="px-5 py-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">Derniers achats</h2>
              <Link to="/acheteur/achats" className="text-xs text-[#fd7958] font-medium hover:underline flex items-center gap-1">
                Tout voir <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentPurchases.map((p) => (
                <div key={p.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-[#344a5e]/[0.06] flex items-center justify-center text-[#344a5e] text-sm font-semibold shrink-0">
                    {p.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.company}</p>
                    <p className="text-[11px] text-gray-400">{p.sector} · {p.date}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-gray-600 hidden sm:block">{p.score}</span>
                    {getStatusBadge(p.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions — stacked cards */}
          <div className="space-y-3" data-tour="quick-actions">
            {/* CTA card */}
            <div className="bg-white rounded-xl p-5 border border-gray-100/80 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#fd7958]/[0.04] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-lg bg-[#fd7958]/[0.08] flex items-center justify-center mb-3">
                  <Sparkles size={18} className="text-[#fd7958]" />
                </div>
                <h3 className="font-semibold text-sm text-gray-800 mb-1">{availableLeads} leads disponibles</h3>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                  Leads qualifiés et vérifiés prêts à l'achat
                </p>
                <Link 
                  to="/explore"
                  className="inline-flex items-center gap-1.5 bg-[#fd7958] text-white px-3.5 py-2 rounded-lg text-xs font-medium hover:bg-[#e86847] transition-colors"
                >
                  Explorer <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Credits card */}
            <Link to="/acheteur/credits" className="block bg-white rounded-xl p-4 border border-gray-100/80 hover:border-gray-200 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#fd7958]/[0.07] flex items-center justify-center shrink-0">
                  <CreditCard size={16} className="text-[#fd7958]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800">Recharger crédits</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Débloquez plus de leads</p>
                </div>
                <ArrowRight size={14} className="text-gray-200 group-hover:text-gray-400 mt-1 transition-colors" />
              </div>
            </Link>

            {/* Analytics card */}
            <Link to="/acheteur/achats" className="block bg-white rounded-xl p-4 border border-gray-100/80 hover:border-gray-200 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <TrendingUp size={16} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800">Conversions & ROI</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Suivez vos performances</p>
                </div>
                <ArrowRight size={14} className="text-gray-200 group-hover:text-gray-400 mt-1 transition-colors" />
              </div>
            </Link>
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
      </>
      )}
    </AcheteurLayout>
  );
}
