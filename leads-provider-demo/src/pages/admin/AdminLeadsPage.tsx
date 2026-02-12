import { useState } from 'react';
import { Search, Download, Eye, Trash2, CheckCircle, XCircle, Clock, Play, ArrowUpDown, ChevronLeft, ChevronRight, Building2, MapPin } from 'lucide-react';
import Layout from '../../components/Layout';
import { useApi } from '../../hooks/useApi';
import { getLeads, getSectorDistribution } from '../../services/api';
import type { Lead } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function AdminLeadsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Lead['status']>('all');
  const [filterSector, setFilterSector] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const perPage = 15;

  // Fetch data from API
  const { data: leadsData } = useApi(getLeads, []);
  const mockLeads = leadsData ?? [];
  const { data: sectorData } = useApi(getSectorDistribution, []);
  const sectorDistribution = sectorData ?? [];

  const allLeads = mockLeads;

  // Filters
  const filteredLeads = allLeads
    .filter(l => filterStatus === 'all' || l.status === filterStatus)
    .filter(l => filterSector === 'all' || l.sector === filterSector)
    .filter(l => filterRegion === 'all' || l.region === filterRegion)
    .filter(l => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        l.firstName.toLowerCase().includes(q) ||
        l.lastName.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'date') return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      if (sortBy === 'score') return dir * (a.score - b.score);
      return dir * (a.price - b.price);
    });

  const totalPages = Math.ceil(filteredLeads.length / perPage);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * perPage, currentPage * perPage);

  const stats = {
    total: allLeads.length,
    new: allLeads.filter(l => l.status === 'new').length,
    qualified: allLeads.filter(l => l.status === 'qualified').length,
    sold: allLeads.filter(l => l.status === 'sold').length,
    pending: allLeads.filter(l => l.status === 'pending').length,
    rejected: allLeads.filter(l => l.status === 'rejected').length,
  };

  const sectors = [...new Set(allLeads.map(l => l.sector))];
  const regions = [...new Set(allLeads.map(l => l.region))];

  const getStatusBadge = (status: Lead['status']) => {
    const styles: Record<Lead['status'], { bg: string; text: string; label: string; icon: React.ReactNode }> = {
      new: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Nouveau', icon: <Clock size={12} /> },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente', icon: <Clock size={12} /> },
      qualified: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Qualifié', icon: <CheckCircle size={12} /> },
      sold: { bg: 'bg-green-100', text: 'text-green-700', label: 'Vendu', icon: <CheckCircle size={12} /> },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeté', icon: <XCircle size={12} /> },
    };
    return styles[status];
  };

  const toggleSort = (field: 'date' | 'score' | 'price') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const statusColors: Record<string, string> = {
    new: '#a855f7',
    qualified: '#3b82f6',
    sold: '#10b981',
    pending: '#f59e0b',
    rejected: '#ef4444',
  };

  const statusDistribution = Object.entries(stats)
    .filter(([key]) => key !== 'total')
    .map(([key, value]) => ({
      name: key === 'new' ? 'Nouveaux' : key === 'qualified' ? 'Qualifiés' : key === 'sold' ? 'Vendus' : key === 'pending' ? 'En attente' : 'Rejetés',
      value,
      color: statusColors[key],
    }));

  return (
    <Layout userRole="admin" userName="Admin Platform">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tous les Leads 📊</h1>
            <p className="text-sm sm:text-base text-gray-500">Supervision et gestion de tous les leads de la plateforme</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors text-sm">
            <Download size={16} />
            Exporter CSV
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-gray-900', bg: 'bg-gray-50' },
            { label: 'Nouveaux', value: stats.new, color: 'text-purple-700', bg: 'bg-purple-50' },
            { label: 'En attente', value: stats.pending, color: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Qualifiés', value: stats.qualified, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Vendus', value: stats.sold, color: 'text-green-700', bg: 'bg-green-50' },
            { label: 'Rejetés', value: stats.rejected, color: 'text-red-700', bg: 'bg-red-50' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-3 sm:p-4 text-center`}>
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 truncate">{item.name}</span>
                  <span className="font-semibold ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Répartition par secteur</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sectorDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" name="%" radius={[0, 4, 4, 0]}>
                  {sectorDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Rechercher par nom, entreprise, email, téléphone..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value as any); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">Tous les statuts</option>
                <option value="new">Nouveau</option>
                <option value="pending">En attente</option>
                <option value="qualified">Qualifié</option>
                <option value="sold">Vendu</option>
                <option value="rejected">Rejeté</option>
              </select>
              <select
                value={filterSector}
                onChange={(e) => { setFilterSector(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">Tous les secteurs</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={filterRegion}
                onChange={(e) => { setFilterRegion(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">Toutes les régions</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {filteredLeads.length} lead{filteredLeads.length > 1 ? 's' : ''} trouvé{filteredLeads.length > 1 ? 's' : ''}
            </h2>
            <div className="flex gap-2 text-xs sm:text-sm">
              <button onClick={() => toggleSort('date')} className={`flex items-center gap-1 px-2 py-1 rounded ${sortBy === 'date' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                <ArrowUpDown size={12} /> Date
              </button>
              <button onClick={() => toggleSort('score')} className={`flex items-center gap-1 px-2 py-1 rounded ${sortBy === 'score' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                <ArrowUpDown size={12} /> Score
              </button>
              <button onClick={() => toggleSort('price')} className={`flex items-center gap-1 px-2 py-1 rounded ${sortBy === 'price' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                <ArrowUpDown size={12} /> Prix
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600">Contact</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 hidden md:table-cell">Entreprise</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 hidden lg:table-cell">Localisation</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600">Score</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 hidden sm:table-cell">Prix</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedLeads.map((lead) => {
                  const badge = getStatusBadge(lead.status);
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-xs sm:text-sm flex-shrink-0">
                            {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{lead.firstName} {lead.lastName}</p>
                            <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Building2 size={13} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate max-w-[140px]">{lead.company}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{lead.sector}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                          <span>{lead.city}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{lead.region}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 py-0.5 rounded-lg text-xs sm:text-sm font-bold ${
                          lead.score >= 80 ? 'bg-green-100 text-green-700' :
                          lead.score >= 60 ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {badge.icon}
                          <span className="hidden sm:inline">{badge.label}</span>
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                        <span className="font-semibold text-sm text-gray-700">{lead.price}€</span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs text-gray-500 hidden lg:table-cell">
                        {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <Eye size={15} />
                          </button>
                          {lead.hasAudioRecording && (
                            <button className="p-1.5 text-gray-400 hover:text-accent hover:bg-gray-100 rounded-lg transition-colors" title="Écouter">
                              <Play size={15} />
                            </button>
                          )}
                          <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors" title="Supprimer">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-500">
              Affichage {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredLeads.length)} sur {filteredLeads.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage + i - 2;
                if (page > totalPages || page < 1) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLead(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Détail du Lead</h2>
                  <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    {selectedLead.firstName.charAt(0)}{selectedLead.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedLead.firstName} {selectedLead.lastName}</h3>
                    <p className="text-sm text-gray-500">{selectedLead.company} — {selectedLead.sector}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-800 break-all">{selectedLead.email}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                    <p className="text-sm font-medium text-gray-800">{selectedLead.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Localisation</p>
                    <p className="text-sm font-medium text-gray-800">{selectedLead.city}, {selectedLead.region}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Source</p>
                    <p className="text-sm font-medium text-gray-800">{selectedLead.source}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Score IA</p>
                    <p className={`text-lg font-bold ${selectedLead.score >= 80 ? 'text-green-600' : selectedLead.score >= 60 ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {selectedLead.score}/100
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Prix</p>
                    <p className="text-lg font-bold text-accent">{selectedLead.price}€</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedLead.status).bg} ${getStatusBadge(selectedLead.status).text}`}>
                    {getStatusBadge(selectedLead.status).icon}
                    {getStatusBadge(selectedLead.status).label}
                  </span>
                  {selectedLead.isExclusive && (
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">Exclusif</span>
                  )}
                  {selectedLead.hasAudioRecording && (
                    <button className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
                      <Play size={14} /> Audio
                    </button>
                  )}
                </div>
                {selectedLead.notes && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-500 mb-1">Notes</p>
                    <p className="text-sm text-blue-800">{selectedLead.notes}</p>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> Valider
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-2">
                    <XCircle size={16} /> Rejeter
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
