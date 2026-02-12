import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Zap,
  Lock,
  ArrowRight,
  ChevronLeft,
  MapPin,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  ShoppingCart,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../App';
import FranceLeadMap from '../../components/FranceLeadMap';
import LeadCard from '../../components/LeadCard';
import LeadDetailModal from '../../components/LeadDetailModal';
import { mockLeads, sectorDistribution } from '../../data/mockData';
import type { Lead } from '../../types';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

export default function PublicCataloguePage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialSector = searchParams.get('sector') || 'all';
  const initialLocation = searchParams.get('location') || '';

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSector, setSelectedSector] = useState(initialSector);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [minScore, setMinScore] = useState(60);
  const [locationTerm] = useState(initialLocation);
  const [showCatalogue, setShowCatalogue] = useState(false);
  const { role } = useAuth();
  const isConnected = !!role;

  const availableLeads = mockLeads.filter(l => l.status === 'qualified' && l.score >= minScore);

  const filteredLeads = availableLeads.filter(lead => {
    const matchesSearch = lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || lead.sector === selectedSector;
    const matchesRegion = selectedRegion === 'all' || lead.region === selectedRegion;
    const matchesLocation = !locationTerm ||
      lead.region.toLowerCase().includes(locationTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(locationTerm.toLowerCase());
    return matchesSearch && matchesSector && matchesRegion && matchesLocation;
  });

  const sectors = ['all', ...new Set(mockLeads.map(l => l.sector))];
  const regions = ['all', ...new Set(mockLeads.map(l => l.region))];

  // --- Stats computations ---
  const avgScore = useMemo(() => {
    if (filteredLeads.length === 0) return 0;
    return Math.round(filteredLeads.reduce((sum, l) => sum + l.score, 0) / filteredLeads.length);
  }, [filteredLeads]);

  const avgPrice = useMemo(() => {
    if (filteredLeads.length === 0) return 0;
    return Math.round(filteredLeads.reduce((sum, l) => sum + l.price, 0) / filteredLeads.length);
  }, [filteredLeads]);

  // Region distribution for the map
  const regionDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLeads.forEach(l => {
      counts[l.region] = (counts[l.region] || 0) + 1;
    });
    return counts;
  }, [filteredLeads]);

  const maxRegionCount = useMemo(() => Math.max(1, ...Object.values(regionDistribution)), [regionDistribution]);

  // Sector bar chart data
  const sectorBarData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLeads.forEach(l => {
      counts[l.sector] = (counts[l.sector] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name: name.length > 10 ? name.slice(0, 10) + '…' : name, fullName: name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredLeads]);

  // Top regions list
  const topRegions = useMemo(() => {
    return Object.entries(regionDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [regionDistribution]);

  // Sources distribution
  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLeads.forEach(l => {
      counts[l.source] = (counts[l.source] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredLeads]);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#fd7958] rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">LP</span>
              </div>
              <span className="text-sm font-bold text-gray-800 tracking-tight">
                Leads<span className="text-[#fd7958]">Provider</span>
              </span>
            </Link>
            <Link
              to="/"
              className="hidden md:flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft size={14} />
              Accueil
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {isConnected ? (
              <Link
                to={`/${role}`}
                className="px-4 py-1.5 bg-[#344a5e] text-white rounded-lg text-sm font-medium hover:bg-[#2a3d4e] transition-colors"
              >
                Mon espace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="px-4 py-1.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors"
                >
                  Rejoindre
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {initialSearch ? `Leads « ${initialSearch} »` : 'Catalogue de leads'}
              {locationTerm && <span className="text-gray-400 font-normal"> — {locationTerm}</span>}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Explorez nos leads qualifiés et vérifiés par IA</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fd7958]/[0.08] text-xs font-medium text-[#fd7958]">
            <Zap size={13} />
            {filteredLeads.length} leads disponibles
          </div>
        </div>

        {/* ============ STATS / INSIGHTS SECTION ============ */}
        <div className="space-y-4">
          {/* Stats cards row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100/80">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#fd7958]/10 flex items-center justify-center">
                  <BarChart3 size={15} className="text-[#fd7958]" />
                </div>
                <span className="text-[11px] text-gray-400 font-medium">Leads disponibles</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{filteredLeads.length}</p>
              <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
                <TrendingUp size={10} className="inline mr-0.5" />
                +12% ce mois
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100/80">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <TrendingUp size={15} className="text-blue-500" />
                </div>
                <span className="text-[11px] text-gray-400 font-medium">Score moyen</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{avgScore}<span className="text-sm text-gray-400">/100</span></p>
              <p className="text-[10px] text-gray-400 mt-0.5">Qualité vérifiée par IA</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100/80">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Users size={15} className="text-emerald-500" />
                </div>
                <span className="text-[11px] text-gray-400 font-medium">Secteurs couverts</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{new Set(filteredLeads.map(l => l.sector)).size}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Industries différentes</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100/80">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <MapPin size={15} className="text-violet-500" />
                </div>
                <span className="text-[11px] text-gray-400 font-medium">Prix moyen</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{avgPrice}<span className="text-sm text-gray-400">€</span></p>
              <p className="text-[10px] text-gray-400 mt-0.5">Par lead qualifié</p>
            </div>
          </div>

          {/* Charts + Map row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* France Map */}
            <div className="lg:col-span-1 bg-white rounded-xl p-5 border border-gray-100/80">
              <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                Répartition géographique
              </h3>
              <p className="text-[11px] text-gray-400 mb-3">Densité de leads par région</p>

              <FranceLeadMap
                regionDistribution={regionDistribution}
                selectedRegion={selectedRegion}
                onSelectRegion={setSelectedRegion}
                maxCount={maxRegionCount}
              />

              {/* Legend */}
              <div className="flex items-center justify-center gap-1 mt-3">
                <span className="text-[9px] text-gray-400">Faible</span>
                {['#e2e8f0', '#fed7aa', '#fdba74', '#fb923c', '#fd7958'].map((c, i) => (
                  <div key={i} className="w-4 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                ))}
                <span className="text-[9px] text-gray-400">Élevé</span>
              </div>
            </div>

            {/* Sector distribution bar chart */}
            <div className="lg:col-span-1 bg-white rounded-xl p-5 border border-gray-100/80">
              <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <BarChart3 size={14} className="text-gray-400" />
                Distribution par secteur
              </h3>
              <p className="text-[11px] text-gray-400 mb-3">Top secteurs en nombre de leads</p>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={sectorBarData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} width={75} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px' }}
                    formatter={(value) => [`${value} leads`, 'Nombre']}
                  />
                  <Bar dataKey="count" fill="#fd7958" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Right column: top regions + sources */}
            <div className="lg:col-span-1 space-y-4">
              {/* Top Regions */}
              <div className="bg-white rounded-xl p-5 border border-gray-100/80">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" />
                  Top régions
                </h3>
                <div className="space-y-2.5">
                  {topRegions.map(([region, count], i) => (
                    <div key={region} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-300 w-3">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-gray-700 font-medium truncate">{region}</span>
                          <span className="text-xs font-semibold text-gray-900">{count}</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-1 rounded-full bg-[#fd7958] transition-all"
                            style={{ width: `${(count / maxRegionCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Pie Chart */}
              <div className="bg-white rounded-xl p-5 border border-gray-100/80">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Sources des leads</h3>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {sourceData.map((_, index) => (
                        <Cell key={`src-${index}`} fill={['#fd7958', '#344a5e', '#60a5fa', '#34d399', '#a78bfa', '#f472b6'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-1">
                  {sourceData.slice(0, 4).map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: ['#fd7958', '#344a5e', '#60a5fa', '#34d399'][i] }} />
                      <span className="text-gray-500 flex-1 truncate">{item.name}</span>
                      <span className="font-medium text-gray-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA banner after stats */}
          {isConnected ? (
            <div className="bg-[#344a5e] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/[0.04] rounded-full" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/[0.03] rounded-full" />
              <div className="relative text-center sm:text-left">
                <h3 className="text-white font-semibold text-sm mb-0.5">
                  {filteredLeads.length} leads qualifiés disponibles
                </h3>
                <p className="text-white/60 text-xs">
                  Accédez au catalogue complet pour voir les détails et acheter des leads.
                </p>
              </div>
              <button
                onClick={() => setShowCatalogue(!showCatalogue)}
                className="relative inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors shrink-0"
              >
                {showCatalogue ? (
                  <>
                    <ChevronDown size={14} className="rotate-180 transition-transform" />
                    Masquer le catalogue
                  </>
                ) : (
                  <>
                    <Eye size={14} />
                    Voir le catalogue
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-[#344a5e] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/[0.04] rounded-full" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/[0.03] rounded-full" />
              <div className="relative text-center sm:text-left">
                <h3 className="text-white font-semibold text-sm mb-0.5">
                  {filteredLeads.length} leads qualifiés vous attendent
                </h3>
                <p className="text-white/60 text-xs">
                  Inscrivez-vous gratuitement pour accéder au catalogue, aux coordonnées complètes et commencer à convertir.
                </p>
              </div>
              <Link
                to="/inscription"
                className="relative inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors shrink-0"
              >
                Créer un compte gratuit
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* ============ MAIN CONTENT: FILTERS + LEADS GRID ============ */}
        {isConnected && showCatalogue && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Filters Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100/80">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-gray-400" />
                  Filtres
                </h2>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSector('all');
                    setSelectedRegion('all');
                    setMinScore(60);
                  }}
                  className="text-[11px] text-[#fd7958] hover:underline font-medium"
                >
                  Réinitialiser
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Nom, entreprise, secteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Sector Filter */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Secteur</label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all"
                >
                  <option value="all">Tous les secteurs</option>
                  {sectors.filter(s => s !== 'all').map((sector) => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Région</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all"
                >
                  <option value="all">Toutes les régions</option>
                  {regions.filter(r => r !== 'all').map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Score Filter */}
              <div className="mb-4">
                <label className="flex items-center justify-between text-xs font-medium text-gray-500 mb-1.5">
                  <span>Score minimum</span>
                  <span className="text-[#fd7958] font-bold text-sm">{minScore}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full accent-[#fd7958]"
                />
                <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="space-y-2 pt-3 border-t border-gray-50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-200 text-[#fd7958] focus:ring-[#fd7958]/30 w-3.5 h-3.5" />
                  <span className="text-xs text-gray-500">Exclusifs uniquement</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-200 text-[#fd7958] focus:ring-[#fd7958]/30 w-3.5 h-3.5" />
                  <span className="text-xs text-gray-500">Avec enregistrement audio</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200 text-[#fd7958] focus:ring-[#fd7958]/30 w-3.5 h-3.5" />
                  <span className="text-xs text-gray-500">Moins de 7 jours</span>
                </label>
              </div>
            </div>

            {/* Sector Distribution */}
            <div className="bg-white rounded-xl p-5 border border-gray-100/80">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Répartition secteurs</h3>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={sectorDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={62}
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
              <div className="space-y-1 mt-2">
                {sectorDistribution.slice(0, 4).map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-500 flex-1 truncate">{item.name}</span>
                    <span className="font-medium text-gray-700">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Sign Up Card */}
            <div className="bg-white rounded-xl p-5 border border-gray-100/80 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#fd7958]/[0.06] rounded-full" />
              <Lock size={18} className="text-[#fd7958] mb-2" />
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Accès complet</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Inscrivez-vous pour voir les contacts complets, acheter des leads et bénéficier de notre scoring IA.
              </p>
              <Link
                to="/inscription"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#fd7958] text-white rounded-lg text-xs font-medium hover:bg-[#e86847] transition-colors"
              >
                Créer un compte
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Leads Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-gray-700">{filteredLeads.length}</span> leads disponibles
              </p>
              <select className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20">
                <option>Score (décroissant)</option>
                <option>Prix (croissant)</option>
                <option>Date (récent)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredLeads.slice(0, 12).map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onView={() => setSelectedLead(lead)}
                  onAction={() => setSelectedLead(lead)}
                  actionLabel="Voir détails"
                  showPrice
                  anonymous
                />
              ))}
            </div>

            {filteredLeads.length === 0 && (
              <div className="text-center py-16">
                <Search size={32} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-400">Aucun lead ne correspond à vos critères</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSector('all');
                    setSelectedRegion('all');
                    setMinScore(60);
                  }}
                  className="mt-3 text-xs text-[#fd7958] hover:underline font-medium"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {filteredLeads.length > 12 && (
              <div className="text-center mt-6">
                <button className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Charger plus de leads
                </button>
              </div>
            )}

            {/* Bottom CTA Banner */}
            <div className="mt-6 bg-white rounded-xl p-6 border border-gray-100/80 text-center relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-28 h-28 bg-[#fd7958]/[0.04] rounded-full" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#344a5e]/[0.03] rounded-full" />
              <div className="relative">
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  Intéressé par ces leads ?
                </h3>
                <p className="text-xs text-gray-400 mb-4 max-w-sm mx-auto">
                  Retournez à votre espace pour acheter des leads et accéder à toutes les fonctionnalités.
                </p>
                <Link
                  to={`/${role}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors"
                >
                  <ShoppingCart size={14} />
                  Mon espace
                </Link>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Guest bottom CTA — shown when catalogue is hidden */}
        {!isConnected && (
          <div className="bg-white rounded-xl p-8 border border-gray-100/80 text-center relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-28 h-28 bg-[#fd7958]/[0.04] rounded-full" />
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#344a5e]/[0.03] rounded-full" />
            <div className="relative">
              <div className="w-14 h-14 bg-[#fd7958]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-[#fd7958]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Accédez au catalogue complet
              </h3>
              <p className="text-sm text-gray-400 mb-5 max-w-md mx-auto">
                Créez votre compte gratuitement pour explorer les leads en détail, consulter les coordonnées complètes et commencer à convertir.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/inscription"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors shadow-lg shadow-[#fd7958]/20"
                >
                  Commencer gratuitement
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onAction={() => {
            setSelectedLead(null);
            window.location.href = isConnected ? `/${role}` : '/inscription';
          }}
          actionLabel={isConnected ? 'Acheter ce lead' : "S'inscrire pour acheter"}
        />
      )}
    </div>
  );
}
