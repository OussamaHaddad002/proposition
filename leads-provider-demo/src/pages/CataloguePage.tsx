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

  // Leads disponibles (qualifiés et non vendus)
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

  // Check if tour should be shown
  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setShowTour(true);
      // Remove tour param after starting
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <Layout userRole="acheteur" userName={`${mockAcheteur.firstName} ${mockAcheteur.lastName}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Catalogue de Leads </h1>
            <p className="text-sm sm:text-base text-gray-500">Découvrez des leads qualifiés et exclusifs</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div data-tour="credits-badge" className="bg-accent/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl">
              <span className="text-accent font-bold text-lg sm:text-xl">{mockAcheteur.credits}</span>
              <span className="text-accent ml-1 text-sm sm:text-base">crédits</span>
            </div>
            {cart.length > 0 && (
              <button className="relative flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-accent text-white rounded-xl font-medium hover:bg-accent-dark transition-colors text-sm sm:text-base">
                <ShoppingCart size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Panier ({cart.length})</span>
                <span className="sm:hidden">({cart.length})</span>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div data-tour="filters-panel" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={18} />
                  Filtres
                </h2>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSector('all');
                    setSelectedRegion('all');
                    setMinScore(60);
                  }}
                  className="text-sm text-accent hover:underline"
                >
                  Réinitialiser
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nom, entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
              </div>

              {/* Sector Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                >
                  <option value="all">Tous les secteurs</option>
                  {sectors.filter(s => s !== 'all').map((sector) => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                >
                  <option value="all">Toutes les régions</option>
                  {regions.filter(r => r !== 'all').map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Score Filter */}
              <div data-tour="score-slider" className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score minimum: <span className="text-accent font-bold">{minScore}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Filtres rapides</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-accent focus:ring-accent" />
                  <span className="text-sm text-gray-600">Leads exclusifs uniquement</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-accent focus:ring-accent" />
                  <span className="text-sm text-gray-600">Avec enregistrement audio</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-accent focus:ring-accent" />
                  <span className="text-sm text-gray-600">Moins de 7 jours</span>
                </label>
              </div>
            </div>

            {/* Sector Distribution */}
            <div data-tour="sector-chart" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Répartition par secteur</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={sectorDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
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
              <div className="space-y-1 mt-2">
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

          {/* Leads Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredLeads.length}</span> leads disponibles
              </p>
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Tri: Score (décroissant)</option>
                <option>Tri: Prix (croissant)</option>
                <option>Tri: Date (récent)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                <button className="px-6 py-3 border border-accent text-accent rounded-xl font-medium hover:bg-accent/5 transition-colors">
                  Charger plus de leads
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-80 animate-slide-in">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart size={20} className="text-accent" />
              Votre panier ({cart.length})
            </h3>
            <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
              {cart.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lead.company}</p>
                      <p className="text-xs text-gray-500">{lead.sector}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-accent">{lead.price}€</span>
                    <button
                      onClick={() => removeFromCart(lead.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-bold text-accent">{totalCartPrice}€</span>
              </div>
              <button className="w-full py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors">
                Procéder au paiement
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                Utilise {cart.length} crédit{cart.length > 1 ? 's' : ''} de votre solde
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
