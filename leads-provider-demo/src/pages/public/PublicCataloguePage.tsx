import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Zap,
  Lock,
  ArrowRight,
  ChevronLeft,
  MapPin,
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
} from 'lucide-react';
import { useAuth } from '../../App';
import FranceLeadMap from '../../components/FranceLeadMap';
import LeadCard from '../../components/LeadCard';
import LeadDetailModal from '../../components/LeadDetailModal';
import { useApi } from '../../hooks/useApi';
import { getLeads } from '../../services/api';
import type { Lead } from '../../types';
import {
  ResponsiveContainer, Tooltip,
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
  const { role } = useAuth();
  const isConnected = !!role;

  // Fetch leads from API
  const { data: leadsData } = useApi(getLeads, []);
  const mockLeads = leadsData ?? [];

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
                to={`/${role}/dashboard`}
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

        {/* ===== COMPACT KPI ROW ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3.5 border border-gray-100/80">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#fd7958]/10 flex items-center justify-center">
                <BarChart3 size={13} className="text-[#fd7958]" />
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Leads disponibles</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{filteredLeads.length}</p>
            <p className="text-[10px] text-emerald-500 font-medium"><TrendingUp size={9} className="inline mr-0.5" />+12% ce mois</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100/80">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp size={13} className="text-blue-500" />
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Score moyen</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{avgScore}<span className="text-xs text-gray-400">/100</span></p>
            <p className="text-[10px] text-gray-400">Qualité vérifiée par IA</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100/80">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Users size={13} className="text-emerald-500" />
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Secteurs couverts</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{new Set(filteredLeads.map(l => l.sector)).size}</p>
            <p className="text-[10px] text-gray-400">Industries différentes</p>
          </div>
          <div className="bg-white rounded-xl p-3.5 border border-gray-100/80">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <MapPin size={13} className="text-violet-500" />
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Prix moyen</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{avgPrice}<span className="text-xs text-gray-400">€</span></p>
            <p className="text-[10px] text-gray-400">Par lead qualifié</p>
          </div>
        </div>

        {/* ===== INLINE FILTERS BAR (connected only) ===== */}
        {isConnected && (
          <div className="bg-white rounded-xl px-5 py-4 border border-gray-100/80 space-y-3">
            {/* Row 1: Search + Sector + Region */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

            {/* Row 2: Score slider + toggles + reset */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 border-t border-gray-50">
              <div className="flex items-center gap-2 min-w-[180px]">
                <label className="text-xs text-gray-400 whitespace-nowrap">Score minimum</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-24 accent-[#fd7958]"
                />
                <span className="text-xs font-bold text-[#fd7958] w-6 text-right">{minScore}</span>
              </div>
              <div className="h-4 w-px bg-gray-100 hidden sm:block" />
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-200 text-[#fd7958] focus:ring-[#fd7958]/30 w-3.5 h-3.5" />
                <span className="text-xs text-gray-500">Exclusifs uniquement</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-200 text-[#fd7958] focus:ring-[#fd7958]/30 w-3.5 h-3.5" />
                <span className="text-xs text-gray-500">Avec audio</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-gray-200 text-[#fd7958] focus:ring-[#fd7958]/30 w-3.5 h-3.5" />
                <span className="text-xs text-gray-500">Moins de 7 jours</span>
              </label>
              <div className="h-4 w-px bg-gray-100 hidden sm:block" />
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSector('all');
                  setSelectedRegion('all');
                  setMinScore(60);
                }}
                className="text-xs text-[#fd7958] hover:underline font-medium whitespace-nowrap ml-auto"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        )}

        {/* ===== MAIN 2-COL LAYOUT: sidebar (map+chart) | catalogue ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT SIDEBAR — Map + Sectors (always visible) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Map */}
            <div className="bg-white rounded-xl p-4 border border-gray-100/80">
              <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                Répartition géographique
              </h3>
              <p className="text-[11px] text-gray-400 mb-3">Cliquez une région pour filtrer</p>
              <FranceLeadMap
                regionDistribution={regionDistribution}
                selectedRegion={selectedRegion}
                onSelectRegion={setSelectedRegion}
                maxCount={maxRegionCount}
              />
              <div className="flex items-center justify-center gap-1 mt-2">
                <span className="text-[9px] text-gray-400">Faible</span>
                {['#e2e8f0', '#fed7aa', '#fdba74', '#fb923c', '#fd7958'].map((c, i) => (
                  <div key={i} className="w-3.5 h-2 rounded-full" style={{ backgroundColor: c }} />
                ))}
                <span className="text-[9px] text-gray-400">Élevé</span>
              </div>
            </div>

            {/* Sector bar chart */}
            <div className="bg-white rounded-xl p-4 border border-gray-100/80">
              <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <BarChart3 size={14} className="text-gray-400" />
                Top secteurs
              </h3>
              <p className="text-[11px] text-gray-400 mb-3">Nombre de leads par secteur</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={sectorBarData.slice(0, 5)} layout="vertical" margin={{ left: 0, right: 5, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} width={70} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '11px' }}
                    formatter={(value) => [`${value} leads`, 'Nombre']}
                  />
                  <Bar dataKey="count" fill="#fd7958" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>


          </div>

          {/* RIGHT — Catalogue area */}
          <div className="lg:col-span-8">
            {/* Connected: real catalogue */}
            {isConnected && (
              <>
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

                {/* Bottom CTA */}
                <div className="mt-6 bg-white rounded-xl p-5 border border-gray-100/80 text-center relative overflow-hidden">
                  <div className="absolute -top-10 -left-10 w-28 h-28 bg-[#fd7958]/[0.04] rounded-full" />
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#344a5e]/[0.03] rounded-full" />
                  <div className="relative">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">Intéressé par ces leads ?</h3>
                    <p className="text-xs text-gray-400 mb-3 max-w-sm mx-auto">
                      Retournez à votre espace pour acheter des leads et accéder à toutes les fonctionnalités.
                    </p>
                    <Link
                      to={`/${role}/dashboard`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors"
                    >
                      <ShoppingCart size={14} />
                      Mon espace
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Guest: blurred catalogue with CTA overlay */}
            {!isConnected && (
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold text-gray-700">{filteredLeads.length}</span> leads disponibles
                    </p>
                    <Lock size={12} className="text-gray-300" />
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl">
                  {/* Blurred cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 blur-[6px] pointer-events-none select-none" aria-hidden="true">
                    {filteredLeads.slice(0, 9).map((lead) => (
                      <LeadCard key={lead.id} lead={lead} anonymous />
                    ))}
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white" />

                  {/* CTA overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-7 py-6 shadow-xl border border-gray-100/80 text-center max-w-sm mx-4">
                      <div className="w-11 h-11 bg-[#fd7958]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Lock size={18} className="text-[#fd7958]" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-800 mb-1">
                        {filteredLeads.length} leads vous attendent
                      </h3>
                      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                        Créez votre compte pour voir les détails, les coordonnées et acheter des leads qualifiés.
                      </p>
                      <Link
                        to="/inscription"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors shadow-lg shadow-[#fd7958]/20 w-full justify-center"
                      >
                        Commencer gratuitement
                        <ArrowRight size={14} />
                      </Link>
                      <Link
                        to="/login"
                        className="inline-flex items-center justify-center w-full mt-2 px-5 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium"
                      >
                        Déjà un compte ? Se connecter
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onAction={() => {
            setSelectedLead(null);
            window.location.href = isConnected ? `/${role}/dashboard` : '/inscription';
          }}
          actionLabel={isConnected ? 'Acheter ce lead' : "S'inscrire pour acheter"}
        />
      )}
    </div>
  );
}
