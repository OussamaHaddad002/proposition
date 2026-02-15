import { useState } from 'react';
import { FileSpreadsheet, Search, Eye, Clock, CheckCircle, XCircle, AlertTriangle, Download, ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';
import Layout from '../../components/Layout';
import { useApi } from '../../hooks/useApi';
import { getAgent, getAgentImports } from '../../services/api';
import type { AgentImport } from '../../types';

export default function AgentImportsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | AgentImport['status']>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImport, setSelectedImport] = useState<AgentImport | null>(null);
  const perPage = 6;

  const { data: mockAgent } = useApi(getAgent, []);
  const { data: importsData } = useApi(getAgentImports, []);
  const allImports = importsData ?? [];

  const filtered = allImports
    .filter(i => filterStatus === 'all' || i.status === filterStatus)
    .filter(i => {
      if (!search) return true;
      const q = search.toLowerCase();
      return i.fileName.toLowerCase().includes(q) || i.fournisseur.toLowerCase().includes(q) || i.company.toLowerCase().includes(q);
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const stats = {
    total: allImports.length,
    enCours: allImports.filter(i => i.status === 'en_cours').length,
    termine: allImports.filter(i => i.status === 'termine').length,
    enAttente: allImports.filter(i => i.status === 'en_attente').length,
    totalLeads: allImports.reduce((s, i) => s + i.totalLeads, 0),
    pendingLeads: allImports.reduce((s, i) => s + i.pending, 0),
  };

  const getStatusBadge = (status: AgentImport['status']) => {
    const styles = {
      en_cours: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'En cours', icon: <Clock size={12} /> },
      termine: { bg: 'bg-green-100', text: 'text-green-700', label: 'Terminé', icon: <CheckCircle size={12} /> },
      en_attente: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente', icon: <AlertTriangle size={12} /> },
    };
    return styles[status];
  };

  return (
    <Layout userRole="agent" userName={mockAgent ? `${mockAgent.firstName} ${mockAgent.lastName}` : 'Chargement...'}>
      {!mockAgent ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fd7958]" /></div>
      ) : (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Imports Fournisseurs</h1>
            <p className="text-sm sm:text-base text-gray-500">Consultez les fichiers importés et les leads à qualifier</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} /> Exporter
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total imports', value: stats.total, icon: <FileSpreadsheet size={16} />, color: 'text-gray-900', bg: 'bg-gray-50' },
            { label: 'En cours', value: stats.enCours, icon: <Clock size={16} />, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Terminés', value: stats.termine, icon: <CheckCircle size={16} />, color: 'text-green-700', bg: 'bg-green-50' },
            { label: 'En attente', value: stats.enAttente, icon: <AlertTriangle size={16} />, color: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Total leads', value: stats.totalLeads.toLocaleString(), icon: <User size={16} />, color: 'text-primary', bg: 'bg-primary/5' },
            { label: 'Leads à traiter', value: stats.pendingLeads, icon: <XCircle size={16} />, color: 'text-accent', bg: 'bg-accent/5' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
              <div className={`flex items-center justify-center gap-1.5 mb-1 ${stat.color}`}>{stat.icon}</div>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Rechercher par fichier, fournisseur..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value as typeof filterStatus); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>
        </div>

        {/* Imports Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600">Fichier</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600">Fournisseur</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600 hidden md:table-cell">Date</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Total</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">En attente</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 hidden lg:table-cell">Qualifiés</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 hidden lg:table-cell">Rejetés</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Statut</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(imp => {
                  const badge = getStatusBadge(imp.status);
                  const progress = imp.totalLeads > 0 ? Math.round(((imp.qualified + imp.rejected) / imp.totalLeads) * 100) : 0;
                  return (
                    <tr key={imp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet size={16} className="text-gray-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{imp.fileName}</p>
                            <p className="text-xs text-gray-400">{imp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <p className="text-sm text-gray-800">{imp.fournisseur}</p>
                        <p className="text-xs text-gray-400">{imp.company}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-500">{new Date(imp.uploadDate).toLocaleDateString('fr-FR')}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-semibold text-gray-900">{imp.totalLeads}</span>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className={`text-sm font-medium ${imp.pending > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>{imp.pending}</span>
                      </td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        <span className="text-sm font-medium text-green-600">{imp.qualified}</span>
                      </td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        <span className="text-sm font-medium text-red-600">{imp.rejected}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                            {badge.icon} {badge.label}
                          </span>
                          {imp.status !== 'en_attente' && (
                            <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setSelectedImport(imp)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                            title="Détails"
                          >
                            <Eye size={15} />
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
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">{filtered.length} import{filtered.length > 1 ? 's' : ''}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Import Detail Modal */}
        {selectedImport && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImport(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Détail Import</h2>
                <button onClick={() => setSelectedImport(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet size={24} className="text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">{selectedImport.fileName}</p>
                    <p className="text-xs text-gray-500">{selectedImport.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-400 mb-1"><User size={14} /><span className="text-xs">Fournisseur</span></div>
                    <p className="text-sm font-medium text-gray-800">{selectedImport.fournisseur}</p>
                    <p className="text-xs text-gray-500">{selectedImport.company}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-400 mb-1"><Calendar size={14} /><span className="text-xs">Date upload</span></div>
                    <p className="text-sm font-medium text-gray-800">{new Date(selectedImport.uploadDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-primary/5 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-primary">{selectedImport.totalLeads}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-yellow-600">{selectedImport.pending}</p>
                    <p className="text-xs text-gray-500">En attente</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-green-600">{selectedImport.qualified}</p>
                    <p className="text-xs text-gray-500">Qualifiés</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-red-600">{selectedImport.rejected}</p>
                    <p className="text-xs text-gray-500">Rejetés</p>
                  </div>
                </div>

                {selectedImport.duplicates > 0 && (
                  <div className="flex items-center gap-2 bg-orange-50 text-orange-700 rounded-lg p-3 text-sm">
                    <AlertTriangle size={16} />
                    <span>{selectedImport.duplicates} doublon{selectedImport.duplicates > 1 ? 's' : ''} détecté{selectedImport.duplicates > 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progression</span>
                    <span className="font-medium text-gray-900">
                      {selectedImport.totalLeads > 0 ? Math.round(((selectedImport.qualified + selectedImport.rejected) / selectedImport.totalLeads) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all" style={{ width: `${selectedImport.totalLeads > 0 ? ((selectedImport.qualified + selectedImport.rejected) / selectedImport.totalLeads) * 100 : 0}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(() => {
                    const badge = getStatusBadge(selectedImport.status);
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
                        {badge.icon} {badge.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </Layout>
  );
}
