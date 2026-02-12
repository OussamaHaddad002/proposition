import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, CheckCircle, XCircle, Clock, Eye, Download, Phone, Mail, Building2, TrendingUp } from 'lucide-react';
import AcheteurLayout from '../../components/AcheteurLayout';
import { useApi } from '../../hooks/useApi';
import { getLeads } from '../../services/api';
import type { Lead } from '../../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import TourGuide from '../../components/TourGuide';
import { mesAchatsTourSteps } from '../../data/tourSteps';

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

  // Fetch leads from API
  const { data: leadsData } = useApi(getLeads, []);
  const mockLeads = leadsData ?? [];

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
      converted: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle size={12} />, label: 'Converti' },
      pending: { bg: 'bg-amber-50', text: 'text-amber-600', icon: <Clock size={12} />, label: 'En cours' },
      lost: { bg: 'bg-red-50', text: 'text-red-500', icon: <XCircle size={12} />, label: 'Perdu' },
    };
    return styles[status];
  };

  const totalValue = purchasedLeads
    .filter(l => l.convertedValue)
    .reduce((sum, l) => sum + (l.convertedValue || 0), 0);

  const statCards = [
    { label: 'Total achetés', value: conversionStats.total, icon: Package, color: 'text-[#344a5e]', bg: 'bg-[#344a5e]/[0.06]' },
    { label: 'Convertis', value: conversionStats.converted, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'En cours', value: conversionStats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Valeur générée', value: `${totalValue.toLocaleString()}€`, icon: TrendingUp, color: 'text-[#fd7958]', bg: 'bg-[#fd7958]/[0.08]' },
  ];

  return (
    <AcheteurLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Mes Achats</h1>
            <p className="text-sm text-gray-400 mt-0.5">Historique et suivi de conversion</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={15} />
            Exporter CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-tour="conversion-stats">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl px-4 py-4 border border-gray-100/80">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon size={17} className={card.color} />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">{card.label}</p>
                  <p className={`text-lg font-bold ${card.color === 'text-[#fd7958]' ? 'text-[#fd7958]' : 'text-gray-800'}`}>{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart & Conversion Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100/80" data-tour="conversion-chart">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Évolution des achats</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyPurchases}>
                <defs>
                  <linearGradient id="mesAchatsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fd7958" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#fd7958" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} width={30} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#fd7958" strokeWidth={2} fill="url(#mesAchatsGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-xl p-5 border border-gray-100/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#344a5e]/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-3">Taux de conversion</h3>
              <div className="text-4xl font-bold text-gray-800 mb-1">
                {Math.round((conversionStats.converted / conversionStats.total) * 100)}%
              </div>
              <p className="text-gray-400 text-xs mb-5">
                {conversionStats.converted} convertis sur {conversionStats.total}
              </p>
              <div className="space-y-2.5">
                {[
                  { label: 'Convertis', count: conversionStats.converted, color: 'bg-emerald-400' },
                  { label: 'En cours', count: conversionStats.pending, color: 'bg-amber-400' },
                  { label: 'Perdus', count: conversionStats.lost, color: 'bg-red-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400 w-16">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.count / conversionStats.total) * 100}%` }} />
                    </div>
                    <span className="font-semibold text-gray-700 w-5 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-gray-100/80 overflow-hidden" data-tour="purchases-table">
          <div className="px-5 py-3.5 border-b border-gray-100/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-800">Leads achetés</h2>
            <div className="flex gap-1.5 overflow-x-auto">
              {(['all', 'converted', 'pending', 'lost'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-[#344a5e] text-white'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {status === 'all' ? 'Tous' : status === 'converted' ? 'Convertis' : status === 'pending' ? 'En cours' : 'Perdus'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-2.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Lead</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Entreprise</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Secteur</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Score</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-right px-5 py-2.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.slice(0, 10).map((lead) => {
                  const badge = getStatusBadge(lead.conversionStatus);
                  return (
                    <tr key={lead.id} className="border-b border-gray-50/80 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-[#344a5e]/[0.06] rounded-lg flex items-center justify-center text-[10px] font-bold text-[#344a5e]">
                            {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{lead.firstName} {lead.lastName}</p>
                            <p className="text-[11px] text-gray-400">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={13} className="text-gray-300" />
                          <span className="text-sm text-gray-600">{lead.company}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{lead.sector}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          lead.score >= 80 ? 'bg-emerald-50 text-emerald-600' :
                          lead.score >= 60 ? 'bg-blue-50 text-blue-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${badge.bg} ${badge.text}`} data-tour="status-badge">
                          {badge.icon}
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400">
                        {new Date(lead.purchaseDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 text-gray-300 hover:text-[#344a5e] hover:bg-gray-50 rounded-md transition-colors">
                            <Phone size={14} />
                          </button>
                          <button className="p-1.5 text-gray-300 hover:text-[#344a5e] hover:bg-gray-50 rounded-md transition-colors">
                            <Mail size={14} />
                          </button>
                          <button 
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 text-gray-300 hover:text-[#344a5e] hover:bg-gray-50 rounded-md transition-colors"
                          >
                            <Eye size={14} />
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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex justify-end z-50" onClick={() => setSelectedLead(null)}>
            <div 
              className="bg-white w-full max-w-md h-full overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 border-b border-gray-100/80 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800">Détail du lead</h2>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 rounded-lg text-gray-400 text-lg"
                >
                  ×
                </button>
              </div>
              <div className="p-5 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#344a5e]/[0.06] rounded-xl flex items-center justify-center font-bold text-[#344a5e] text-sm">
                    {selectedLead.firstName.charAt(0)}{selectedLead.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">{selectedLead.firstName} {selectedLead.lastName}</h3>
                    <p className="text-sm text-gray-400">{selectedLead.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Email', value: selectedLead.email },
                    { label: 'Téléphone', value: selectedLead.phone },
                    { label: 'Secteur', value: selectedLead.sector },
                    { label: 'Région', value: selectedLead.region },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-lg px-3 py-2.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="text-sm font-medium text-gray-700 truncate">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#fd7958]/[0.06] rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#fd7958] font-medium">Score IA</span>
                    <span className="text-xl font-bold text-[#fd7958]">{selectedLead.score}/100</span>
                  </div>
                  <div className="w-full bg-[#fd7958]/[0.12] rounded-full h-1.5">
                    <div className="bg-[#fd7958] rounded-full h-1.5" style={{ width: `${selectedLead.score}%` }} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#344a5e] text-white rounded-lg text-sm font-medium hover:bg-[#2a3d4e] transition-colors">
                    <Phone size={15} />
                    Appeler
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Mail size={15} />
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
    </AcheteurLayout>
  );
}
