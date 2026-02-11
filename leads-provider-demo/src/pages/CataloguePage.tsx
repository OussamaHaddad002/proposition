import { useState, useEffect } from 'react';
import { ShoppingCart, Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import LeadCard from '../components/LeadCard';
import LeadDetailModal from '../components/LeadDetailModal';
import TourGuide from '../components/TourGuide';
import { mockAcheteur, mockLeads, sectorDistribution } from '../data/mockData';
import { catalogueTourSteps } from '../data/tourSteps';
import type { Lead } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTour, setShowTour] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [minScore, setMinScore] = useState(60);
  const [cart, setCart] = useState<Lead[]>([]);

  const availableLeads = mockLeads.filter(l => l.status === 'qualified' && l.score >= minScore);
  
  const filteredLeads = availableLeads.filter(lead => {
    const matchesSearch = lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || lead.sector === selectedSector;
    const matchesRegion = selectedRegion === 'all' || lead.region === selectedRegion;
    return matchesSearch && matchesSector && matchesRegion;
  });

  const sectors = ['all', ...new Set(mockLeads.map(l => l.sector))];
  const regions = ['all', ...new Set(mockLeads.map(l => l.region))];

  const addToCart = (lead: Lead) => {
    if (!cart.find(l => l.id === lead.id)) {
      setCart([...cart, lead]);
    }
    setSelectedLead(null);
  };

  const removeFromCart = (leadId: string) => {
    setCart(cart.filter(l => l.id !== leadId));
  };

  const totalCartPrice = cart.reduce((sum, lead) => sum + lead.price, 0);

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setShowTour(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <Layout userRole="acheteur" userName={`${mockAcheteur.firstName} ${mockAcheteur.lastName}`}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Catalogue</h1>
            <p className="text-sm text-gray-400 mt-0.5">Leads qualifiés et exclusifs</p>
          </div>
          <div className="flex items-center gap-3">
            <div data-tour="credits-badge" className="px-3 py-1.5 rounded-lg bg-[#fd7958]/[0.08] text-sm">
              <span className="font-semibold text-[#fd7958]">{mockAcheteur.credits}</span>
              <span className="text-[#fd7958]/70 ml-1">crédits</span>
            </div>
            {cart.length > 0 && (
              <button className="relative flex items-center gap-2 px-4 py-2 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors">
                <ShoppingCart size={15} />
                Panier ({cart.length})
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Filters Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div data-tour="filters-panel" className="bg-white rounded-xl p-5 border border-gray-100/80">
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
                    placeholder="Nom, entreprise..."
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
              <div data-tour="score-slider" className="mb-4">
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
            <div data-tour="sector-chart" className="bg-white rounded-xl p-5 border border-gray-100/80">
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
              {filteredLeads.slice(0, 12).map((lead, index) => (
                <div key={lead.id} data-tour={index === 0 ? "lead-card" : undefined}>
                  <LeadCard
                    lead={lead}
                    onView={() => setSelectedLead(lead)}
                    onAction={() => addToCart(lead)}
                    actionLabel="Ajouter"
                    showPrice
                    anonymous
                  />
                </div>
              ))}
            </div>

            {filteredLeads.length > 12 && (
              <div className="text-center mt-6">
                <button className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Charger plus de leads
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-5 right-5 bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.1)] border border-gray-100/80 p-5 w-72 animate-slide-in">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ShoppingCart size={16} className="text-[#fd7958]" />
              Panier ({cart.length})
            </h3>
            <div className="space-y-2 max-h-36 overflow-y-auto mb-4">
              {cart.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#344a5e]/[0.06] rounded-lg flex items-center justify-center text-[10px] font-bold text-[#344a5e]">
                      {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-800">{lead.company}</p>
                      <p className="text-[10px] text-gray-400">{lead.sector}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#fd7958]">{lead.price}€</span>
                    <button
                      onClick={() => removeFromCart(lead.id)}
                      className="text-gray-300 hover:text-red-500 text-sm"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between mb-3">
                <span className="text-xs text-gray-400">Total</span>
                <span className="text-lg font-bold text-[#fd7958]">{totalCartPrice}€</span>
              </div>
              <button className="w-full py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors">
                Procéder au paiement
              </button>
              <p className="text-[10px] text-gray-300 text-center mt-2">
                Utilise {cart.length} crédit{cart.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Lead Detail Modal */}
        {selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onAction={addToCart}
            actionLabel="Ajouter au panier"
          />
        )}

        {/* Tour Guide */}
        <TourGuide
          steps={catalogueTourSteps}
          isActive={showTour}
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      </div>
    </Layout>
  );
}
