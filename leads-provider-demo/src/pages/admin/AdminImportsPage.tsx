import { useState } from 'react';
import { FileSpreadsheet, Search, Eye, Clock, CheckCircle, XCircle, Download, ChevronLeft, ChevronRight, User, RotateCcw, Trash2, RefreshCw } from 'lucide-react';
import Layout from '../../components/Layout';
import { useApi } from '../../hooks/useApi';
import { getAdminImports } from '../../services/api';
import type { AdminImport } from '../../types';

export default function AdminImportsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | AdminImport['status']>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImport, setSelectedImport] = useState<AdminImport | null>(null);
  const perPage = 8;

  const { data: importsData } = useApi(getAdminImports, []);
  const allImports = importsData ?? [];

  const filtered = allImports
    .filter(i => filterStatus === 'all' || i.status === filterStatus)
    .filter(i => {
      if (!search) return true;
      const q = search.toLowerCase();
      return i.fileName.toLowerCase().includes(q) || i.fournisseur.toLowerCase().includes(q) || i.company.toLowerCase().includes(q) || i.id.toLowerCase().includes(q);
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const stats = {
    total: allImports.length,
    completed: allImports.filter(i => i.status === 'completed').length,
    processing: allImports.filter(i => i.status === 'processing').length,
    pendingReview: allImports.filter(i => i.status === 'pending_review').length,
    failed: allImports.filter(i => i.status === 'failed').length,
    totalLeads: allImports.reduce((s, i) => s + i.totalLeads, 0),
  };

  const getStatusBadge = (status: AdminImport['status']) => {
    const styles = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Terminé', icon: <CheckCircle size={12} /> },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'En traitement', icon: <RefreshCw size={12} className="animate-spin" /> },
      pending_review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'À réviser', icon: <Clock size={12} /> },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Échoué', icon: <XCircle size={12} /> },
    };
    return styles[status];
  };

  return (
    <Layout userRole="admin" userName="Admin Platform">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Imports</h1>
            <p className="text-sm sm:text-base text-gray-500">Tous les fichiers importés par les fournisseurs</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} /> Exporter
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total', value: stats.total, icon: <FileSpreadsheet size={16} /> },
            { label: 'Terminés', value: stats.completed, icon: <CheckCircle size={16} /> },
            { label: 'En traitement', value: stats.processing, icon: <RefreshCw size={16} /> },
            { label: 'À réviser', value: stats.pendingReview, icon: <Clock size={16} /> },
            { label: 'Échoués', value: stats.failed, icon: <XCircle size={16} /> },
            { label: 'Total leads', value: stats.totalLeads.toLocaleString(), icon: <User size={16} /> },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
              <div className="flex items-center justify-center gap-1.5 mb-1 text-primary">{stat.icon}</div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Rechercher par fichier, fournisseur, ID..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all" />
            </div>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as typeof filterStatus); setCurrentPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="all">Tous les statuts</option>
              <option value="completed">Terminé</option>
              <option value="processing">En traitement</option>
              <option value="pending_review">À réviser</option>
              <option value="failed">Échoué</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600">Fichier</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Fournisseur</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden md:table-cell">Date</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Total</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">Valides</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 hidden lg:table-cell">Doublons</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Statut</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(imp => {
                  const badge = getStatusBadge(imp.status);
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
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-800">{imp.fournisseur}</p>
                        <p className="text-xs text-gray-400">{imp.company}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">{new Date(imp.uploadDate).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900">{imp.totalLeads}</td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell text-sm font-medium text-green-600">{imp.valid}</td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell text-sm font-medium text-orange-600">{imp.duplicates}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {badge.icon} {badge.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedImport(imp)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors" title="Détails"><Eye size={15} /></button>
                          {imp.status === 'failed' && (
                            <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition-colors" title="Relancer"><RotateCcw size={15} /></button>
                          )}
                          <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors" title="Supprimer"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">{filtered.length} import{filtered.length > 1 ? 's' : ''}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"><ChevronLeft size={16} /></button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>{i + 1}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>

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
                    <p className="text-xs text-gray-500">Fournisseur</p>
                    <p className="text-sm font-medium text-gray-800">{selectedImport.fournisseur}</p>
                    <p className="text-xs text-gray-400">{selectedImport.company}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Date upload</p>
                    <p className="text-sm font-medium text-gray-800">{new Date(selectedImport.uploadDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-primary/5 rounded-lg p-3 text-center"><p className="text-xl font-bold text-primary">{selectedImport.totalLeads}</p><p className="text-xs text-gray-500">Total</p></div>
                  <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-green-600">{selectedImport.valid}</p><p className="text-xs text-gray-500">Valides</p></div>
                  <div className="bg-red-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-red-600">{selectedImport.invalid}</p><p className="text-xs text-gray-500">Invalides</p></div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-orange-600">{selectedImport.duplicates}</p><p className="text-xs text-gray-500">Doublons</p></div>
                </div>
                {selectedImport.processingTime && (
                  <p className="text-sm text-gray-500">Temps de traitement : <span className="font-medium text-gray-700">{selectedImport.processingTime}</span></p>
                )}
                <div className="flex gap-2">
                  {(() => { const b = getStatusBadge(selectedImport.status); return <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${b.bg} ${b.text}`}>{b.icon} {b.label}</span>; })()}
                </div>
                {selectedImport.status === 'failed' && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
                    <RotateCcw size={16} /> Relancer le traitement
                  </button>
                )}
                {selectedImport.status === 'pending_review' && (
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
                      <CheckCircle size={16} /> Approuver
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">
                      <XCircle size={16} /> Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
