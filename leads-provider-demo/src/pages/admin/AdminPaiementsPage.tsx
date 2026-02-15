import { useState } from 'react';
import { Search, CreditCard, Download, Eye, ChevronLeft, ChevronRight, DollarSign, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import Layout from '../../components/Layout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApi } from '../../hooks/useApi';
import { getTransactions, getMonthlyRevenue } from '../../services/api';
import type { Transaction } from '../../types';

export default function AdminPaiementsPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | Transaction['type']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | Transaction['status']>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const perPage = 8;

  const { data: transactionsData } = useApi(getTransactions, []);
  const { data: monthlyRevenueData } = useApi(getMonthlyRevenue, []);
  const allTransactions = transactionsData ?? [];
  const monthlyData = monthlyRevenueData ?? [];

  const filtered = allTransactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => filterStatus === 'all' || t.status === filterStatus)
    .filter(t => {
      if (!search) return true;
      const q = search.toLowerCase();
      return t.userName.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || (t.company || '').toLowerCase().includes(q);
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalRevenue = allTransactions.filter(t => t.type === 'credit_purchase' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalPayouts = allTransactions.filter(t => t.type === 'fournisseur_payment' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const pendingPayouts = allTransactions.filter(t => t.type === 'fournisseur_payment' && t.status === 'pending').reduce((s, t) => s + t.amount, 0);

  const typeDistribution = [
    { name: 'Achats crédits', value: allTransactions.filter(t => t.type === 'credit_purchase').length, color: '#3b82f6' },
    { name: 'Achats leads', value: allTransactions.filter(t => t.type === 'lead_purchase').length, color: '#10b981' },
    { name: 'Paiements fourn.', value: allTransactions.filter(t => t.type === 'fournisseur_payment').length, color: '#f59e0b' },
    { name: 'Remboursements', value: allTransactions.filter(t => t.type === 'refund').length, color: '#ef4444' },
    { name: 'Bonus', value: allTransactions.filter(t => t.type === 'bonus').length, color: '#8b5cf6' },
  ];

  const getTypeBadge = (type: Transaction['type']) => {
    const styles = {
      credit_purchase: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Achat crédits', icon: <ArrowUpRight size={12} /> },
      lead_purchase: { bg: 'bg-green-100', text: 'text-green-700', label: 'Achat lead', icon: <ArrowUpRight size={12} /> },
      fournisseur_payment: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Paiement fourn.', icon: <ArrowDownRight size={12} /> },
      refund: { bg: 'bg-red-100', text: 'text-red-700', label: 'Remboursement', icon: <RefreshCw size={12} /> },
      bonus: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Bonus', icon: <DollarSign size={12} /> },
    };
    return styles[type];
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const styles = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Complété' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En cours' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Échoué' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Remboursé' },
    };
    return styles[status];
  };

  return (
    <Layout userRole="admin" userName="Admin Platform">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Paiements & Transactions</h1>
            <p className="text-sm sm:text-base text-gray-500">Suivi de toutes les transactions financières</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} /> Exporter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2"><TrendingUp size={20} /><span className="text-sm text-white/80">Revenus</span></div>
            <p className="text-2xl font-bold">{totalRevenue.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2"><ArrowDownRight size={20} /><span className="text-sm text-white/80">Payé fournisseurs</span></div>
            <p className="text-2xl font-bold">{totalPayouts.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2"><Clock size={20} /><span className="text-sm text-white/80">En attente</span></div>
            <p className="text-2xl font-bold">{pendingPayouts.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-500"><CreditCard size={20} /><span className="text-sm">Transactions</span></div>
            <p className="text-2xl font-bold text-gray-900">{allTransactions.length}</p>
            <p className="text-xs text-gray-400">ce mois</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Revenus vs Paiements</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v}€`} />
                  <Tooltip formatter={(value) => [`${Number(value)} €`]} />
                  <Area type="monotone" dataKey="revenus" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} name="Revenus" />
                  <Area type="monotone" dataKey="payouts" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} name="Paiements" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Par type</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                    {typeDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {typeDistribution.map(d => (
                <span key={d.name} className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} /> {d.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Rechercher par utilisateur, description, ID..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all" />
            </div>
            <select value={filterType} onChange={e => { setFilterType(e.target.value as typeof filterType); setCurrentPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="all">Tous les types</option>
              <option value="credit_purchase">Achat crédits</option>
              <option value="lead_purchase">Achat lead</option>
              <option value="fournisseur_payment">Paiement fourn.</option>
              <option value="refund">Remboursement</option>
              <option value="bonus">Bonus</option>
            </select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as typeof filterStatus); setCurrentPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="all">Tous les statuts</option>
              <option value="completed">Complété</option>
              <option value="pending">En cours</option>
              <option value="failed">Échoué</option>
              <option value="refunded">Remboursé</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600">Transaction</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Utilisateur</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden md:table-cell">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Montant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Statut</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(tx => {
                  const typeBadge = getTypeBadge(tx.type);
                  const statusBadge = getStatusBadge(tx.status);
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3">
                        <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-400">{tx.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-800">{tx.userName}</p>
                        <p className="text-xs text-gray-400">{tx.company || tx.userRole}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge.bg} ${typeBadge.text}`}>{typeBadge.icon} {typeBadge.label}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">{new Date(tx.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString('fr-FR')} €
                        </span>
                        {tx.credits && <p className="text-xs text-gray-400">{tx.credits} crédits</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>{statusBadge.label}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <button onClick={() => setSelectedTx(tx)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"><Eye size={15} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">{filtered.length} transaction{filtered.length > 1 ? 's' : ''}</p>
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

        {selectedTx && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTx(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Détail Transaction</h2>
                <button onClick={() => setSelectedTx(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <p className={`text-3xl font-bold ${selectedTx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedTx.amount >= 0 ? '+' : ''}{selectedTx.amount.toLocaleString('fr-FR')} €
                  </p>
                  {selectedTx.credits && <p className="text-sm text-gray-500 mt-1">{selectedTx.credits} crédits</p>}
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'ID', value: selectedTx.id },
                    { label: 'Description', value: selectedTx.description },
                    { label: 'Utilisateur', value: `${selectedTx.userName}${selectedTx.company ? ` — ${selectedTx.company}` : ''}` },
                    { label: 'Date', value: new Date(selectedTx.date).toLocaleString('fr-FR') },
                    ...(selectedTx.paymentMethod ? [{ label: 'Moyen de paiement', value: selectedTx.paymentMethod }] : []),
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-500">{row.label}</span>
                      <span className="text-sm font-medium text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {(() => { const b = getTypeBadge(selectedTx.type); return <span className={`px-3 py-1 rounded-full text-sm font-medium ${b.bg} ${b.text}`}>{b.label}</span>; })()}
                  {(() => { const b = getStatusBadge(selectedTx.status); return <span className={`px-3 py-1 rounded-full text-sm font-medium ${b.bg} ${b.text}`}>{b.label}</span>; })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
