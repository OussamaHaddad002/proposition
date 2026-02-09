import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, CheckCircle, XCircle, Clock, Eye, Download, Phone, Mail, Building2, MapPin, Calendar, TrendingUp, Star } from 'lucide-react';
import Layout from '../components/Layout';
import { mockAcheteur, mockLeads } from '../data/mockData';
import type { Lead } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TourGuide from '../components/TourGuide';
import { mesAchatsTourSteps } from '../data/tourSteps';

export default function MesAchatsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'converted' | 'pending' | 'lost'>('all');
  const [searchParams] = useSearchParams();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setShowTour(true);
    }
  }, [searchParams]);

  // Simulation de leads achetés avec statut de conversion
  const purchasedLeads = mockLeads.slice(0, 25).map((lead, index) => ({
    ...lead,
    purchaseDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    conversionStatus: ['converted', 'pending', 'lost'][index % 3] as 'converted' | 'pending' | 'lost',
    convertedValue: index % 3 === 0 ? Math.floor(Math.random() * 5000) + 1000 : undefined,
  }));

  const filteredLeads = filterStatus === 'all' 
    ? purchasedLeads 
    : purchasedLeads.filter(l => l.conversionStatus === filterStatus);

  const conversionStats = {
    total: purchasedLeads.length,
    converted: purchasedLeads.filter(l => l.conversionStatus === 'converted').length,
    pending: purchasedLeads.filter(l => l.conversionStatus === 'pending').length,
    lost: purchasedLeads.filter(l => l.conversionStatus === 'lost').length,
  };

  const monthlyPurchases = [
    { month: 'Sep', leads: 12, value: 4800 },
    { month: 'Oct', leads: 18, value: 7200 },
    { month: 'Nov', leads: 15, value: 6000 },
    { month: 'Déc', leads: 22, value: 8800 },
    { month: 'Jan', leads: 25, value: 10000 },
  ];

  const getStatusBadge = (status: 'converted' | 'pending' | 'lost') => {
    const styles = {
      converted: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={14} />, label: 'Converti' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={14} />, label: 'En cours' },
      lost: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={14} />, label: 'Perdu' },
    };
    return styles[status];
  };

  const totalValue = purchasedLeads
    .filter(l => l.convertedValue)
    .reduce((sum, l) => sum + (l.convertedValue || 0), 0);

  return (
    <Layout userRole="acheteur" userName={`${mockAcheteur.firstName} ${mockAcheteur.lastName}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mes Achats </h1>
            <p className="text-sm sm:text-base text-gray-500">Historique et suivi de vos leads achetés</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            <Download size={18} />
            Exporter CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="conversion-stats">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Package size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total achetés</p>
                <p className="text-2xl font-bold text-gray-900">{conversionStats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Convertis</p>
                <p className="text-2xl font-bold text-green-600">{conversionStats.converted}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">En cours</p>
                <p className="text-2xl font-bold text-yellow-600">{conversionStats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <TrendingUp size={24} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valeur générée</p>
                <p className="text-2xl font-bold text-accent">{totalValue.toLocaleString()}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100" data-tour="conversion-chart">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Évolution des achats</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyPurchases}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fd7958" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fd7958" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#fd7958" strokeWidth={2} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion Rate */}
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4 text-white/80">Taux de conversion</h3>
            <div className="text-5xl font-bold mb-2">
              {Math.round((conversionStats.converted / conversionStats.total) * 100)}%
            </div>
            <p className="text-white/70 text-sm mb-6">
              {conversionStats.converted} leads convertis sur {conversionStats.total}
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Convertis</span>
                <div className="flex-1 mx-3 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-400 rounded-full" 
                    style={{ width: `${(conversionStats.converted / conversionStats.total) * 100}%` }}
                  />
                </div>
                <span className="font-medium">{conversionStats.converted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">En cours</span>
                <div className="flex-1 mx-3 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full" 
                    style={{ width: `${(conversionStats.pending / conversionStats.total) * 100}%` }}
                  />
                </div>
                <span className="font-medium">{conversionStats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Perdus</span>
                <div className="flex-1 mx-3 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-400 rounded-full" 
                    style={{ width: `${(conversionStats.lost / conversionStats.total) * 100}%` }}
                  />
                </div>
                <span className="font-medium">{conversionStats.lost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-tour="purchases-table">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Leads achetés</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {(['all', 'converted', 'pending', 'lost'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Tous' : status === 'converted' ? 'Convertis' : status === 'pending' ? 'En cours' : 'Perdus'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Lead</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Entreprise</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Secteur</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Score</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Date achat</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.slice(0, 10).map((lead) => {
                  const badge = getStatusBadge(lead.conversionStatus);
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-sm">
                            {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</p>
                            <p className="text-sm text-gray-500">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-gray-400" />
                          <span className="text-gray-700">{lead.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{lead.sector}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-sm font-bold ${
                          lead.score >= 80 ? 'bg-green-100 text-green-700' :
                          lead.score >= 60 ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`} data-tour="status-badge">
                          {badge.icon}
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(lead.purchaseDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                            <Phone size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                            <Mail size={16} />
                          </button>
                          <button 
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Detail Drawer */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex justify-end z-50" onClick={() => setSelectedLead(null)}>
            <div 
              className="bg-white w-full max-w-lg h-full overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Détail du lead</h2>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-xl">
                    {selectedLead.firstName.charAt(0)}{selectedLead.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedLead.firstName} {selectedLead.lastName}</h3>
                    <p className="text-gray-500">{selectedLead.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{selectedLead.email}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                    <p className="font-medium text-gray-900">{selectedLead.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Secteur</p>
                    <p className="font-medium text-gray-900">{selectedLead.sector}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Région</p>
                    <p className="font-medium text-gray-900">{selectedLead.region}</p>
                  </div>
                </div>

                <div className="bg-accent/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-accent font-semibold">Score IA</span>
                    <span className="text-2xl font-bold text-accent">{selectedLead.score}/100</span>
                  </div>
                  <div className="w-full bg-accent/20 rounded-full h-2">
                    <div 
                      className="bg-accent rounded-full h-2"
                      style={{ width: `${selectedLead.score}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
                    <Phone size={18} />
                    Appeler
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    <Mail size={18} />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showTour && (
        <TourGuide
          steps={mesAchatsTourSteps}
          isActive={showTour}
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}
    </Layout>
  );
}
