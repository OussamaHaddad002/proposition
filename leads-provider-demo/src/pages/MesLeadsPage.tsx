import { useState } from 'react';
import { FileSpreadsheet, Upload, CheckCircle, Clock, Eye, Trash2, Download, TrendingUp, DollarSign, X, Phone, Mail, Building2, MapPin, Globe, Calendar, Headphones, Play, Pause, Mic, XCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { mockFournisseur, mockLeads } from '../data/mockData';
import type { Lead } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function MesLeadsPage() {
  const [selectedLead, setSelectedLead] = useState<(Lead & { uploadDate: string; earnings?: number }) | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'qualified' | 'rejected' | 'sold'>('all');
  const [isPlaying, setIsPlaying] = useState(false);

  // Mes leads avec statuts variés
  const myLeads = mockLeads.slice(0, 35).map((lead, _index) => ({
    ...lead,
    uploadDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    earnings: lead.status === 'sold' ? lead.price * 0.7 : undefined,
  }));

  const filteredLeads = filterStatus === 'all' 
    ? myLeads 
    : myLeads.filter(l => l.status === filterStatus);

  const stats = {
    total: myLeads.length,
    pending: myLeads.filter(l => l.status === 'pending').length,
    qualified: myLeads.filter(l => l.status === 'qualified').length,
    sold: myLeads.filter(l => l.status === 'sold').length,
    rejected: myLeads.filter(l => l.status === 'rejected').length,
  };

  const totalEarnings = myLeads
    .filter(l => l.earnings)
    .reduce((sum, l) => sum + (l.earnings || 0), 0);

  const monthlyData = [
    { month: 'Sep', leads: 45, sold: 32, revenue: 2400 },
    { month: 'Oct', leads: 62, sold: 45, revenue: 3375 },
    { month: 'Nov', leads: 58, sold: 40, revenue: 3000 },
    { month: 'Déc', leads: 75, sold: 55, revenue: 4125 },
    { month: 'Jan', leads: 82, sold: 62, revenue: 4650 },
  ];

  const statusDistribution = [
    { name: 'Vendus', value: stats.sold, color: '#10b981' },
    { name: 'Qualifiés', value: stats.qualified, color: '#3b82f6' },
    { name: 'En attente', value: stats.pending, color: '#f59e0b' },
    { name: 'Rejetés', value: stats.rejected, color: '#ef4444' },
  ];

  const getStatusBadge = (status: Lead['status']) => {
    const styles: Record<Lead['status'], { bg: string; text: string; label: string }> = {
      new: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Nouveau' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
      qualified: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Qualifié' },
      sold: { bg: 'bg-green-100', text: 'text-green-700', label: 'Vendu' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeté' },
    };
    return styles[status];
  };

  return (
    <>
    <Layout userRole="fournisseur" userName={`${mockFournisseur.firstName} ${mockFournisseur.lastName}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mes Leads 📋</h1>
            <p className="text-sm sm:text-base text-gray-500">Gérez et suivez tous vos leads soumis</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              <Download size={18} />
              Exporter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-medium hover:bg-accent-dark transition-colors">
              <Upload size={18} />
              Nouveau fichier
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <FileSpreadsheet size={20} className="text-primary" />
              <span className="text-sm text-gray-500">Total soumis</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} className="text-yellow-500" />
              <span className="text-sm text-gray-500">En attente</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={20} className="text-blue-500" />
              <span className="text-sm text-gray-500">Qualifiés</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.qualified}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign size={20} className="text-green-500" />
              <span className="text-sm text-gray-500">Vendus</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.sold}</p>
          </div>
          <div className="bg-gradient-to-br from-accent to-accent-dark rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} />
              <span className="text-sm text-white/70">Revenus</span>
            </div>
            <p className="text-2xl font-bold">{totalEarnings.toLocaleString()}€</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance mensuelle</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="leads" name="Leads soumis" stroke="#344a5e" strokeWidth={2} fill="none" />
                <Area type="monotone" dataKey="sold" name="Vendus" stroke="#fd7958" strokeWidth={2} fill="url(#colorRevenue2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Répartition par statut</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 flex-1">{item.name}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Liste des leads</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {(['all', 'pending', 'qualified', 'sold', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Tous' : 
                   status === 'pending' ? 'En attente' :
                   status === 'qualified' ? 'Qualifiés' :
                   status === 'sold' ? 'Vendus' : 'Rejetés'}
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
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Gains</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.slice(0, 10).map((lead) => {
                  const badge = getStatusBadge(lead.status);
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
                      <td className="px-6 py-4 text-gray-700">{lead.company}</td>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(lead.uploadDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        {lead.earnings ? (
                          <span className="font-semibold text-green-600">{lead.earnings.toFixed(0)}€</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          {lead.status === 'pending' && (
                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>

    {/* Lead Detail Modal */}
    {selectedLead && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4" onClick={() => { setSelectedLead(null); setIsPlaying(false); }}>
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="bg-[#344a5e] p-5 text-white relative">
            <button
              onClick={() => { setSelectedLead(null); setIsPlaying(false); }}
              className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center text-lg font-bold">
                {selectedLead.firstName.charAt(0)}{selectedLead.lastName.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold">{selectedLead.firstName} {selectedLead.lastName}</h2>
                <p className="text-white/70 text-sm">{selectedLead.company}</p>
              </div>
              <div className="ml-auto">
                {(() => {
                  const badge = getStatusBadge(selectedLead.status);
                  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>{badge.label}</span>;
                })()}
              </div>
            </div>
          </div>

          <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-5">
            {/* Contact & Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail size={15} className="text-gray-400" />
                    <span className="text-gray-700">{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone size={15} className="text-gray-400" />
                    <span className="text-gray-700">{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Building2 size={15} className="text-gray-400" />
                    <span className="text-gray-700">{selectedLead.company}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Localisation</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-sm">
                    <MapPin size={15} className="text-gray-400" />
                    <span className="text-gray-700">{selectedLead.city}, {selectedLead.region}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Globe size={15} className="text-gray-400" />
                    <span className="text-gray-700">{selectedLead.sector}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Calendar size={15} className="text-gray-400" />
                    <span className="text-gray-700">{new Date(selectedLead.uploadDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score + Price row */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                  selectedLead.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                  selectedLead.score >= 60 ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {selectedLead.score}
                </div>
                <div>
                  <p className="text-xs text-gray-400">Score IA</p>
                  <p className="text-sm font-semibold text-gray-700">{selectedLead.score >= 80 ? 'Excellent' : selectedLead.score >= 60 ? 'Bon' : 'Moyen'}</p>
                </div>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#fd7958]/[0.08] flex items-center justify-center">
                  <DollarSign size={18} className="text-[#fd7958]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Prix</p>
                  <p className="text-sm font-semibold text-[#fd7958]">{selectedLead.price}€</p>
                </div>
              </div>
              {selectedLead.earnings && (
                <div className="flex-1 bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <TrendingUp size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Gains</p>
                    <p className="text-sm font-semibold text-emerald-600">{selectedLead.earnings.toFixed(0)}€</p>
                  </div>
                </div>
              )}
            </div>

            {/* Source info */}
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-400">Source:</span> <span className="font-medium text-gray-700">{selectedLead.source}</span></div>
                <div><span className="text-gray-400">Canal:</span> <span className="font-medium text-gray-700">{selectedLead.channel}</span></div>
              </div>
            </div>

            {/* Qualification Recording */}
            {(selectedLead.status === 'qualified' || selectedLead.status === 'sold') && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Headphones size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-800">Enregistrement de qualification</h4>
                    <p className="text-[11px] text-emerald-600/70">Lead qualifié par l'agent \u2014 Appel du {new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                {/* Audio Player */}
                <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors shrink-0"
                  >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                  </button>
                  <div className="flex-1">
                    <div className="bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`bg-emerald-500 h-1.5 rounded-full transition-all duration-300 ${isPlaying ? 'w-1/3' : 'w-0'}`} />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>{isPlaying ? '0:58' : '0:00'}</span>
                      <span>2:45</span>
                    </div>
                  </div>
                  <Mic size={14} className="text-emerald-400 shrink-0" />
                </div>
                {/* Summary */}
                <p className="text-xs text-emerald-700/80 mt-2.5 leading-relaxed">
                  <span className="font-semibold">Résumé :</span> Le prospect a confirmé son intérêt pour le service. Budget validé, décision prévue sous 2 semaines. Interlocuteur décisionnaire.
                </p>
              </div>
            )}

            {/* Non-qualification Recording */}
            {selectedLead.status === 'rejected' && (
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <XCircle size={16} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-800">Enregistrement de non-qualification</h4>
                    <p className="text-[11px] text-red-500/70">Lead non qualifié par l'agent — Appel du {new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                {/* Audio Player */}
                <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shrink-0"
                  >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                  </button>
                  <div className="flex-1">
                    <div className="bg-red-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`bg-red-500 h-1.5 rounded-full transition-all duration-300 ${isPlaying ? 'w-1/3' : 'w-0'}`} />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>{isPlaying ? '0:42' : '0:00'}</span>
                      <span>1:30</span>
                    </div>
                  </div>
                  <Mic size={14} className="text-red-400 shrink-0" />
                </div>
                {/* Reason */}
                <p className="text-xs text-red-700/80 mt-2.5 leading-relaxed">
                  <span className="font-semibold">Motif :</span> Le prospect n'est pas intéressé par le service. Pas de budget alloué actuellement, contact non décisionnaire.
                </p>
              </div>
            )}

            {/* Pending status info */}
            {selectedLead.status === 'pending' && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-800">En attente de qualification</h4>
                    <p className="text-xs text-amber-600/70">Ce lead est en cours de traitement par notre équipe d'agents. L'enregistrement sera disponible une fois l'appel effectué.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedLead.notes && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 mb-1">Notes</h4>
                <p className="text-sm text-gray-600">{selectedLead.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-4 flex justify-end">
            <button
              onClick={() => { setSelectedLead(null); setIsPlaying(false); }}
              className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
