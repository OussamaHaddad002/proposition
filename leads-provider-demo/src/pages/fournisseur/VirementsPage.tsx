import { useState } from 'react';
import { Download, CheckCircle, Clock, XCircle, Eye, ChevronLeft, ChevronRight, TrendingUp, Wallet, ArrowDownRight, FileText } from 'lucide-react';
import Layout from '../../components/Layout';
import { useApi } from '../../hooks/useApi';
import { getFournisseur } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Virement {
  id: string;
  reference: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  leadsCount: number;
  period: string;
  iban: string;
}

const mockVirements: Virement[] = [
  { id: 'VIR-001', reference: 'VP-2026-02-001', amount: 2450.00, date: '2026-02-10', status: 'pending', leadsCount: 35, period: 'Fév 2026 (1ère quinzaine)', iban: 'FR76 •••• •••• •••• 4521' },
  { id: 'VIR-002', reference: 'VP-2026-01-002', amount: 3820.50, date: '2026-01-31', status: 'completed', leadsCount: 52, period: 'Jan 2026 (2ème quinzaine)', iban: 'FR76 •••• •••• •••• 4521' },
  { id: 'VIR-003', reference: 'VP-2026-01-001', amount: 2915.00, date: '2026-01-15', status: 'completed', leadsCount: 41, period: 'Jan 2026 (1ère quinzaine)', iban: 'FR76 •••• •••• •••• 4521' },
  { id: 'VIR-004', reference: 'VP-2025-12-002', amount: 4100.75, date: '2025-12-31', status: 'completed', leadsCount: 58, period: 'Déc 2025 (2ème quinzaine)', iban: 'FR76 •••• •••• •••• 4521' },
  { id: 'VIR-005', reference: 'VP-2025-12-001', amount: 3250.00, date: '2025-12-15', status: 'completed', leadsCount: 45, period: 'Déc 2025 (1ère quinzaine)', iban: 'FR76 •••• •••• •••• 4521' },
  { id: 'VIR-006', reference: 'VP-2025-11-002', amount: 2680.25, date: '2025-11-30', status: 'completed', leadsCount: 38, period: 'Nov 2025 (2ème quinzaine)', iban: 'FR76 •••• •••• •••• 4521' },
  { id: 'VIR-007', reference: 'VP-2025-11-001', amount: 1950.00, date: '2025-11-15', status: 'completed', leadsCount: 28, period: 'Nov 2025 (1ère quinzaine)', iban: 'FR76 •••• •••• •••• 4521' },
  { id: 'VIR-008', reference: 'VP-2025-10-002', amount: 520.00, date: '2025-10-31', status: 'failed', leadsCount: 8, period: 'Oct 2025 (2ème quinzaine)', iban: 'FR76 •••• •••• •••• 4521' },
];

export default function VirementsPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | Virement['status']>('all');
  const [selectedVirement, setSelectedVirement] = useState<Virement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const { data: mockFournisseur } = useApi(getFournisseur, []);

  const filtered = mockVirements.filter(v => filterStatus === 'all' || v.status === filterStatus);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalReceived = mockVirements.filter(v => v.status === 'completed').reduce((s, v) => s + v.amount, 0);
  const totalPending = mockVirements.filter(v => v.status === 'pending').reduce((s, v) => s + v.amount, 0);

  const monthlyData = [
    { month: 'Sep', amount: 3200 },
    { month: 'Oct', amount: 2850 },
    { month: 'Nov', amount: 4630 },
    { month: 'Déc', amount: 7350 },
    { month: 'Jan', amount: 6735 },
    { month: 'Fév', amount: 2450 },
  ];

  const getStatusBadge = (status: Virement['status']) => {
    const styles = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Reçu', icon: <CheckCircle size={12} /> },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En cours', icon: <Clock size={12} /> },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Échoué', icon: <XCircle size={12} /> },
    };
    return styles[status];
  };

  return (
    <>
    <Layout userRole="fournisseur" userName={mockFournisseur ? `${mockFournisseur.firstName} ${mockFournisseur.lastName}` : 'Chargement...'}>
      {!mockFournisseur ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fd7958]" /></div>
      ) : (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mes Virements</h1>
            <p className="text-sm sm:text-base text-gray-500">Historique de tous vos paiements reçus</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} /> Exporter
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={20} />
              <span className="text-sm font-medium text-white/80">Total reçu</span>
            </div>
            <p className="text-2xl font-bold">{totalReceived.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={20} />
              <span className="text-sm font-medium text-white/80">En attente</span>
            </div>
            <p className="text-2xl font-bold">{totalPending.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-500">
              <TrendingUp size={20} />
              <span className="text-sm font-medium">Virements</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockVirements.filter(v => v.status === 'completed').length}</p>
            <p className="text-xs text-gray-400">virements effectués</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-500">
              <ArrowDownRight size={20} />
              <span className="text-sm font-medium">Moy / virement</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {mockVirements.filter(v => v.status === 'completed').length > 0
                ? (totalReceived / mockVirements.filter(v => v.status === 'completed').length).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
                : '0 €'}
            </p>
          </div>
        </div>

        {/* Revenue chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Évolution des revenus</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v}€`} />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} €`, 'Montant']} />
                <Area type="monotone" dataKey="amount" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: 'all' as const, label: 'Tous' },
            { key: 'completed' as const, label: 'Reçus' },
            { key: 'pending' as const, label: 'En cours' },
            { key: 'failed' as const, label: 'Échoués' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setFilterStatus(tab.key); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterStatus === tab.key ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Virements Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600">Référence</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Période</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden md:table-cell">Date</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">Leads</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Montant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Statut</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(virement => {
                  const badge = getStatusBadge(virement.status);
                  return (
                    <tr key={virement.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3">
                        <p className="text-sm font-medium text-gray-900">{virement.reference}</p>
                        <p className="text-xs text-gray-400">{virement.iban}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{virement.period}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-500">{new Date(virement.date).toLocaleDateString('fr-FR')}</span>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className="text-sm font-medium text-gray-700">{virement.leadsCount}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${virement.status === 'completed' ? 'text-green-600' : virement.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                          {virement.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {badge.icon} {badge.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedVirement(virement)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors" title="Détails">
                            <Eye size={15} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-accent hover:bg-gray-100 rounded-lg transition-colors" title="Télécharger facture">
                            <FileText size={15} />
                          </button>
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
              <p className="text-xs text-gray-500">{filtered.length} virement{filtered.length > 1 ? 's' : ''}</p>
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
      </div>
      )}
    </Layout>

    {/* Detail modal */}
    {selectedVirement && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVirement(null)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Détail Virement</h2>
            <button onClick={() => setSelectedVirement(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-center">
              <p className={`text-3xl font-bold ${selectedVirement.status === 'completed' ? 'text-green-600' : selectedVirement.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                {selectedVirement.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
              {(() => { const b = getStatusBadge(selectedVirement.status); return (
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${b.bg} ${b.text}`}>{b.icon} {b.label}</span>
              ); })()}
            </div>
            <div className="space-y-3">
              {[
                { label: 'Référence', value: selectedVirement.reference },
                { label: 'Période', value: selectedVirement.period },
                { label: 'Date', value: new Date(selectedVirement.date).toLocaleDateString('fr-FR') },
                { label: 'Leads facturés', value: `${selectedVirement.leadsCount} leads` },
                { label: 'IBAN', value: selectedVirement.iban },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className="text-sm font-medium text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark transition-colors">
              <FileText size={16} /> Télécharger la facture
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
