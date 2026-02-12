import { useState } from 'react';
import { FileSpreadsheet, Search, Upload, Eye, Clock, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight, User, Calendar, Hash, ArrowLeft, Copy, Plus } from 'lucide-react';
import Layout from '../../components/Layout';
import { useApi } from '../../hooks/useApi';
import { getFournisseur, getLeads } from '../../services/api';
import type { Lead } from '../../types';

type FileStatus = 'traité' | 'en_cours' | 'erreur';
type LeadSource = 'file' | 'manual';

interface FichierImport {
  id: string;
  fileName: string;
  uploadDate: string;
  leadCount: number;
  doublonCount: number;
  validCount: number;
  rejectCount: number;
  status: FileStatus;
  source: LeadSource;
  leads: (Lead & { isDublon: boolean; dublonOf?: string })[];
}

export default function MesFichiersPage() {
  const [activeTab, setActiveTab] = useState<'fichiers' | 'manuels'>('fichiers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFichier, setSelectedFichier] = useState<FichierImport | null>(null);
  const [filterDoublons, setFilterDoublons] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const { data: mockFournisseur } = useApi(getFournisseur, []);
  const { data: leadsData } = useApi(getLeads, []);
  const allLeads = leadsData ?? [];

  // Build mock fichiers importés from leads data
  const fichiers: FichierImport[] = [
    {
      id: 'FIC-001',
      fileName: 'leads_janvier_2026.csv',
      uploadDate: '2026-01-15T10:30:00Z',
      leadCount: 8,
      doublonCount: 2,
      validCount: 5,
      rejectCount: 1,
      status: 'traité',
      source: 'file',
      leads: allLeads.slice(0, 8).map((l, i) => ({
        ...l,
        isDublon: i === 2 || i === 5,
        dublonOf: i === 2 ? allLeads[14]?.firstName + ' ' + allLeads[14]?.lastName + ' (' + allLeads[14]?.email + ')' : i === 5 ? allLeads[20]?.firstName + ' ' + allLeads[20]?.lastName + ' (' + allLeads[20]?.phone + ')' : undefined,
      })),
    },
    {
      id: 'FIC-002',
      fileName: 'prospects_B2B_IDF.xlsx',
      uploadDate: '2026-01-22T14:15:00Z',
      leadCount: 12,
      doublonCount: 3,
      validCount: 8,
      rejectCount: 1,
      status: 'traité',
      source: 'file',
      leads: allLeads.slice(8, 20).map((l, i) => ({
        ...l,
        isDublon: i === 1 || i === 4 || i === 9,
        dublonOf: i === 1 ? allLeads[2]?.firstName + ' ' + allLeads[2]?.lastName + ' (email identique)' : i === 4 ? allLeads[0]?.firstName + ' ' + allLeads[0]?.lastName + ' (téléphone identique)' : i === 9 ? allLeads[5]?.firstName + ' ' + allLeads[5]?.lastName + ' (nom + entreprise)' : undefined,
      })),
    },
    {
      id: 'FIC-003',
      fileName: 'campagne_fevrier.csv',
      uploadDate: '2026-02-03T09:00:00Z',
      leadCount: 10,
      doublonCount: 1,
      validCount: 7,
      rejectCount: 2,
      status: 'traité',
      source: 'file',
      leads: allLeads.slice(20, 30).map((l, i) => ({
        ...l,
        isDublon: i === 6,
        dublonOf: i === 6 ? allLeads[3]?.firstName + ' ' + allLeads[3]?.lastName + ' (email identique)' : undefined,
      })),
    },
    {
      id: 'FIC-004',
      fileName: 'leads_startup_tech.csv',
      uploadDate: '2026-02-08T16:45:00Z',
      leadCount: 6,
      doublonCount: 0,
      validCount: 4,
      rejectCount: 0,
      status: 'en_cours',
      source: 'file',
      leads: allLeads.slice(30, 36).map(l => ({
        ...l,
        isDublon: false,
      })),
    },
    {
      id: 'FIC-005',
      fileName: 'import_salon_2026.xlsx',
      uploadDate: '2026-02-10T11:20:00Z',
      leadCount: 14,
      doublonCount: 4,
      validCount: 0,
      rejectCount: 0,
      status: 'en_cours',
      source: 'file',
      leads: allLeads.slice(36, 50).map((l, i) => ({
        ...l,
        isDublon: i === 0 || i === 3 || i === 7 || i === 11,
        dublonOf: i === 0 ? allLeads[1]?.firstName + ' ' + allLeads[1]?.lastName + ' (email identique)' : i === 3 ? allLeads[8]?.firstName + ' ' + allLeads[8]?.lastName + ' (téléphone identique)' : i === 7 ? allLeads[15]?.firstName + ' ' + allLeads[15]?.lastName + ' (nom + entreprise)' : i === 11 ? allLeads[22]?.firstName + ' ' + allLeads[22]?.lastName + ' (email identique)' : undefined,
      })),
    },
  ];

  // Manual leads
  const manualLeads: FichierImport = {
    id: 'MANUAL',
    fileName: 'Leads manuels',
    uploadDate: '',
    leadCount: 5,
    doublonCount: 1,
    validCount: 4,
    rejectCount: 0,
    status: 'traité',
    source: 'manual',
    leads: allLeads.slice(4, 9).map((l, i) => ({
      ...l,
      isDublon: i === 3,
      dublonOf: i === 3 ? allLeads[15]?.firstName + ' ' + allLeads[15]?.lastName + ' (email identique)' : undefined,
    })),
  };

  const allFichiers = [...fichiers];
  const totalLeads = allFichiers.reduce((s, f) => s + f.leadCount, 0) + manualLeads.leadCount;
  const totalDoublons = allFichiers.reduce((s, f) => s + f.doublonCount, 0) + manualLeads.doublonCount;
  const totalValid = allFichiers.reduce((s, f) => s + f.validCount, 0) + manualLeads.validCount;

  // Filter files by search
  const filteredFichiers = allFichiers.filter(f =>
    f.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered manual leads by search
  const filteredManualLeads = manualLeads.leads.filter(l =>
    l.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // For file detail view: filter leads
  const detailLeads = selectedFichier
    ? (filterDoublons ? selectedFichier.leads.filter(l => l.isDublon) : selectedFichier.leads)
    : [];
  const detailTotalPages = Math.ceil(detailLeads.length / perPage);
  const detailPaginated = detailLeads.slice((currentPage - 1) * perPage, currentPage * perPage);

  const getStatusBadge = (status: FileStatus) => {
    const styles = {
      traité: { bg: 'bg-green-100', text: 'text-green-700', label: 'Traité', icon: <CheckCircle size={12} /> },
      en_cours: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En cours', icon: <Clock size={12} /> },
      erreur: { bg: 'bg-red-100', text: 'text-red-700', label: 'Erreur', icon: <XCircle size={12} /> },
    };
    return styles[status];
  };

  const getLeadStatusBadge = (status: Lead['status']) => {
    const styles: Record<Lead['status'], { bg: string; text: string; label: string }> = {
      new: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Nouveau' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
      qualified: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Qualifié' },
      sold: { bg: 'bg-green-100', text: 'text-green-700', label: 'Vendu' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeté' },
    };
    return styles[status];
  };

  // Render the lead detail table (used both in file detail and manual leads)
  const renderLeadRow = (lead: Lead & { isDublon: boolean; dublonOf?: string }) => {
    const statusBadge = getLeadStatusBadge(lead.status);
    return (
      <tr key={lead.id} className={`transition-colors ${lead.isDublon ? 'bg-orange-50 border-l-4 border-l-orange-400' : 'hover:bg-gray-50'}`}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{lead.firstName} {lead.lastName}</span>
            {lead.isDublon && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">
                <Copy size={10} /> DOUBLON
              </span>
            )}
          </div>
          {lead.isDublon && lead.dublonOf && (
            <p className="text-[11px] text-orange-600 mt-0.5 flex items-center gap-1">
              <AlertTriangle size={10} /> Similaire à : {lead.dublonOf}
            </p>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{lead.email}</td>
        <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{lead.phone}</td>
        <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{lead.company}</td>
        <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{lead.city}</td>
        <td className="px-4 py-3 text-center">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
            {statusBadge.label}
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          <span className={`text-sm font-bold ${lead.score >= 70 ? 'text-green-600' : lead.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {lead.score}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <Layout userRole="fournisseur" userName={mockFournisseur ? `${mockFournisseur.firstName} ${mockFournisseur.lastName}` : 'Chargement...'}>
      {!mockFournisseur ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fd7958]" /></div>
      ) : selectedFichier ? (
        /* ============ FILE DETAIL VIEW ============ */
        <div className="space-y-5">
          {/* Back button + file info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setSelectedFichier(null); setFilterDoublons(false); setCurrentPage(1); }}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet size={20} className="text-[#344a5e]" />
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">{selectedFichier.fileName}</h1>
                </div>
                <p className="text-xs text-gray-500 ml-7">
                  {selectedFichier.source === 'manual' ? 'Leads ajoutés manuellement' : `Importé le ${new Date(selectedFichier.uploadDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                  {' · '}{selectedFichier.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-7 sm:ml-0">
              {(() => { const s = getStatusBadge(selectedFichier.status); return (
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>{s.icon} {s.label}</span>
              ); })()}
            </div>
          </div>

          {/* Detail stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Leads totaux', value: selectedFichier.leadCount, color: 'text-[#344a5e]', bg: 'bg-slate-50', icon: <Hash size={14} /> },
              { label: 'Doublons', value: selectedFichier.doublonCount, color: 'text-orange-700', bg: 'bg-orange-50', icon: <Copy size={14} /> },
              { label: 'Validés', value: selectedFichier.validCount, color: 'text-green-700', bg: 'bg-green-50', icon: <CheckCircle size={14} /> },
              { label: 'Rejetés', value: selectedFichier.rejectCount, color: 'text-red-700', bg: 'bg-red-50', icon: <XCircle size={14} /> },
            ].map(stat => (
              <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
                <div className={`flex items-center justify-center gap-1 mb-1 ${stat.color}`}>{stat.icon}</div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Doublon filter toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setFilterDoublons(false); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !filterDoublons ? 'bg-[#344a5e] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Tous les leads ({selectedFichier.leads.length})
            </button>
            <button
              onClick={() => { setFilterDoublons(true); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                filterDoublons ? 'bg-orange-500 text-white' : 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-50'
              }`}
            >
              <Copy size={13} /> Doublons uniquement ({selectedFichier.leads.filter(l => l.isDublon).length})
            </button>
          </div>

          {/* Leads table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden md:table-cell">Téléphone</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden lg:table-cell">Entreprise</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden lg:table-cell">Ville</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Statut</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {detailPaginated.map(lead => renderLeadRow(lead))}
                </tbody>
              </table>
            </div>
            {detailLeads.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Copy size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">{filterDoublons ? 'Aucun doublon dans ce fichier' : 'Aucun lead'}</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {detailTotalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: detailTotalPages }, (_, i) => (
                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-[#344a5e] text-white' : 'hover:bg-gray-100'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(detailTotalPages, p + 1))} disabled={currentPage === detailTotalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ============ MAIN LIST VIEW ============ */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mes Fichiers & Leads</h1>
              <p className="text-sm sm:text-base text-gray-500">Retrouvez vos imports et leads manuels — les doublons sont signalés</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors text-sm">
                <Upload size={16} /> Importer un fichier
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#344a5e] text-white rounded-xl font-medium hover:bg-[#344a5e]/90 transition-colors text-sm">
                <Plus size={16} /> Lead manuel
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Fichiers importés', value: allFichiers.length, icon: <FileSpreadsheet size={16} />, color: 'text-[#344a5e]', bg: 'bg-slate-50' },
              { label: 'Leads totaux', value: totalLeads, icon: <User size={16} />, color: 'text-blue-700', bg: 'bg-blue-50' },
              { label: 'Leads validés', value: totalValid, icon: <CheckCircle size={16} />, color: 'text-green-700', bg: 'bg-green-50' },
              { label: 'Doublons détectés', value: totalDoublons, icon: <Copy size={16} />, color: 'text-orange-700', bg: 'bg-orange-50' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
                <div className={`flex items-center gap-2 mb-1 ${stat.color}`}>{stat.icon}<span className="text-xs font-medium text-gray-500">{stat.label}</span></div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setActiveTab('fichiers'); setSearchTerm(''); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'fichiers' ? 'bg-[#344a5e] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <FileSpreadsheet size={15} /> Fichiers importés ({allFichiers.length})
              </button>
              <button
                onClick={() => { setActiveTab('manuels'); setSearchTerm(''); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'manuels' ? 'bg-[#344a5e] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <User size={15} /> Leads manuels ({manualLeads.leadCount})
              </button>
            </div>
            <div className="relative flex-1 sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'fichiers' ? 'Rechercher un fichier...' : 'Rechercher un lead...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#344a5e]/20 focus:border-[#344a5e]"
              />
            </div>
          </div>

          {/* === FICHIERS TAB === */}
          {activeTab === 'fichiers' && (
            <div className="space-y-3">
              {filteredFichiers.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
                  <FileSpreadsheet size={40} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Aucun fichier trouvé</p>
                </div>
              ) : (
                filteredFichiers.map(fichier => {
                  const statusBadge = getStatusBadge(fichier.status);
                  return (
                    <div key={fichier.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* File icon + info */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <FileSpreadsheet size={20} className="text-[#344a5e]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">{fichier.fileName}</h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                {statusBadge.icon} {statusBadge.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                              <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(fichier.uploadDate).toLocaleDateString('fr-FR')}</span>
                              <span className="flex items-center gap-1"><User size={11} /> {fichier.leadCount} leads</span>
                              <span className="flex items-center gap-1"><CheckCircle size={11} className="text-green-500" /> {fichier.validCount} validés</span>
                              {fichier.doublonCount > 0 && (
                                <span className="flex items-center gap-1 text-orange-600 font-medium">
                                  <Copy size={11} /> {fichier.doublonCount} doublon{fichier.doublonCount > 1 ? 's' : ''}
                                </span>
                              )}
                              {fichier.rejectCount > 0 && (
                                <span className="flex items-center gap-1 text-red-500"><XCircle size={11} /> {fichier.rejectCount} rejeté{fichier.rejectCount > 1 ? 's' : ''}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress bar + actions */}
                        <div className="flex items-center gap-3 sm:flex-shrink-0">
                          {/* Mini progress */}
                          <div className="hidden sm:block w-24">
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                              <div className="bg-green-500 h-full" style={{ width: `${(fichier.validCount / fichier.leadCount) * 100}%` }} />
                              <div className="bg-orange-400 h-full" style={{ width: `${(fichier.doublonCount / fichier.leadCount) * 100}%` }} />
                              <div className="bg-red-400 h-full" style={{ width: `${(fichier.rejectCount / fichier.leadCount) * 100}%` }} />
                            </div>
                            <div className="flex justify-between mt-0.5">
                              <span className="text-[9px] text-green-600">{Math.round((fichier.validCount / fichier.leadCount) * 100)}%</span>
                              {fichier.doublonCount > 0 && <span className="text-[9px] text-orange-500">{Math.round((fichier.doublonCount / fichier.leadCount) * 100)}%</span>}
                            </div>
                          </div>

                          <button
                            onClick={() => { setSelectedFichier(fichier); setCurrentPage(1); setFilterDoublons(false); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#344a5e] text-white rounded-lg text-xs font-medium hover:bg-[#344a5e]/90 transition-colors"
                          >
                            <Eye size={13} /> Voir les leads
                          </button>
                        </div>
                      </div>

                      {/* Doublon preview strip */}
                      {fichier.doublonCount > 0 && (
                        <div className="px-4 pb-3">
                          <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                            <p className="text-[11px] font-semibold text-orange-700 flex items-center gap-1.5 mb-1">
                              <AlertTriangle size={12} /> {fichier.doublonCount} doublon{fichier.doublonCount > 1 ? 's' : ''} détecté{fichier.doublonCount > 1 ? 's' : ''}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {fichier.leads.filter(l => l.isDublon).slice(0, 3).map(lead => (
                                <span key={lead.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-orange-200 rounded text-[10px] text-orange-700">
                                  <Copy size={9} /> {lead.firstName} {lead.lastName}
                                </span>
                              ))}
                              {fichier.leads.filter(l => l.isDublon).length > 3 && (
                                <span className="text-[10px] text-orange-500">+{fichier.leads.filter(l => l.isDublon).length - 3} autres</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* === MANUAL LEADS TAB === */}
          {activeTab === 'manuels' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-[#344a5e]" />
                  <span className="text-sm font-semibold text-gray-900">Leads ajoutés manuellement</span>
                  <span className="text-xs text-gray-400">({filteredManualLeads.length})</span>
                </div>
                {manualLeads.doublonCount > 0 && (
                  <span className="text-xs text-orange-600 font-medium flex items-center gap-1">
                    <AlertTriangle size={12} /> {manualLeads.doublonCount} doublon{manualLeads.doublonCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Contact</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden md:table-cell">Téléphone</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden lg:table-cell">Entreprise</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden lg:table-cell">Ville</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Statut</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredManualLeads.map(lead => renderLeadRow(lead))}
                  </tbody>
                </table>
              </div>
              {filteredManualLeads.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <User size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Aucun lead manuel trouvé</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
