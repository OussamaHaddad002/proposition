import { useState } from 'react';
import { Search, Download, Eye, ChevronLeft, ChevronRight, DollarSign, Clock, CheckCircle, User, Send } from 'lucide-react';
import Layout from '../../components/Layout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FournisseurGain {
  id: string;
  fournisseur: string;
  company: string;
  email: string;
  iban: string;
  totalLeadsSold: number;
  totalEarnings: number;
  pendingAmount: number;
  paidAmount: number;
  lastPaymentDate: string;
  status: 'active' | 'pending_validation' | 'suspended';
}

const mockGains: FournisseurGain[] = [
  { id: 'F-001', fournisseur: 'Sophie Martin', company: 'Agence Ads Paris', email: 'sophie@agence-ads.fr', iban: 'FR76 •••• •••• 4521', totalLeadsSold: 1250, totalEarnings: 28540, pendingAmount: 2450, paidAmount: 26090, lastPaymentDate: '2026-01-31', status: 'active' },
  { id: 'F-002', fournisseur: 'Thomas Moreau', company: 'Solar France', email: 'thomas@solar-france.com', iban: 'FR76 •••• •••• 7834', totalLeadsSold: 890, totalEarnings: 19250, pendingAmount: 0, paidAmount: 19250, lastPaymentDate: '2026-02-08', status: 'active' },
  { id: 'F-003', fournisseur: 'Emma Garcia', company: 'Digital Agency', email: 'emma@digital-agency.fr', iban: 'FR76 •••• •••• 1256', totalLeadsSold: 620, totalEarnings: 14300, pendingAmount: 1950, paidAmount: 12350, lastPaymentDate: '2026-01-31', status: 'active' },
  { id: 'F-004', fournisseur: 'Hugo Vincent', company: 'DataCorp', email: 'hugo@datacorp.fr', iban: 'FR76 •••• •••• 9012', totalLeadsSold: 450, totalEarnings: 10800, pendingAmount: 850, paidAmount: 9950, lastPaymentDate: '2026-01-15', status: 'active' },
  { id: 'F-005', fournisseur: 'Camille Laurent', company: 'Éco Énergie', email: 'camille@eco-energie.fr', iban: '', totalLeadsSold: 0, totalEarnings: 0, pendingAmount: 0, paidAmount: 0, lastPaymentDate: '-', status: 'pending_validation' },
  { id: 'F-006', fournisseur: 'Sarah Michel', company: 'WebFactory', email: 'sarah@webfactory.fr', iban: '', totalLeadsSold: 0, totalEarnings: 0, pendingAmount: 0, paidAmount: 0, lastPaymentDate: '-', status: 'pending_validation' },
];

export default function AdminGainsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | FournisseurGain['status']>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFournisseur, setSelectedFournisseur] = useState<FournisseurGain | null>(null);
  const [showPayModal, setShowPayModal] = useState<FournisseurGain | null>(null);
  const perPage = 8;

  const filtered = mockGains
    .filter(g => filterStatus === 'all' || g.status === filterStatus)
    .filter(g => {
      if (!search) return true;
      const q = search.toLowerCase();
      return g.fournisseur.toLowerCase().includes(q) || g.company.toLowerCase().includes(q) || g.email.toLowerCase().includes(q);
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalEarnings = mockGains.reduce((s, g) => s + g.totalEarnings, 0);
  const totalPending = mockGains.reduce((s, g) => s + g.pendingAmount, 0);
  const totalPaid = mockGains.reduce((s, g) => s + g.paidAmount, 0);

  const monthlyData = [
    { month: 'Sep', gains: 4200, paid: 3800 },
    { month: 'Oct', gains: 5500, paid: 5100 },
    { month: 'Nov', gains: 6800, paid: 6200 },
    { month: 'Déc', gains: 8100, paid: 7600 },
    { month: 'Jan', gains: 9500, paid: 8800 },
    { month: 'Fév', gains: 5250, paid: 2450 },
  ];

  const getStatusBadge = (status: FournisseurGain['status']) => {
    const styles = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Actif' },
      pending_validation: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En validation' },
      suspended: { bg: 'bg-red-100', text: 'text-red-700', label: 'Suspendu' },
    };
    return styles[status];
  };

  return (
    <Layout userRole="admin" userName="Admin Platform">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gains Fournisseurs</h1>
            <p className="text-sm sm:text-base text-gray-500">Gérez les gains et paiements des fournisseurs</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} /> Exporter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary to-[#1e2d3d] rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2"><DollarSign size={20} /><span className="text-sm text-white/80">Total gains</span></div>
            <p className="text-2xl font-bold">{totalEarnings.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2"><CheckCircle size={20} /><span className="text-sm text-white/80">Total payé</span></div>
            <p className="text-2xl font-bold">{totalPaid.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2"><Clock size={20} /><span className="text-sm text-white/80">En attente</span></div>
            <p className="text-2xl font-bold">{totalPending.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-500"><User size={20} /><span className="text-sm">Fournisseurs</span></div>
            <p className="text-2xl font-bold text-gray-900">{mockGains.filter(g => g.status === 'active').length}</p>
            <p className="text-xs text-gray-400">actifs</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Évolution des gains & paiements</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v}€`} />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} €`]} />
                <Area type="monotone" dataKey="gains" stroke="#344a5e" fill="#344a5e" fillOpacity={0.1} strokeWidth={2} name="Gains" />
                <Area type="monotone" dataKey="paid" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} name="Payé" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Rechercher fournisseur..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all" />
            </div>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as typeof filterStatus); setCurrentPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="pending_validation">En validation</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600">Fournisseur</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">Leads vendus</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Total gains</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Payé</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">En attente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Statut</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(gain => {
                  const badge = getStatusBadge(gain.status);
                  return (
                    <tr key={gain.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                            {gain.fournisseur.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900">{gain.fournisseur}</p>
                            <p className="text-xs text-gray-500">{gain.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className="text-sm font-medium text-gray-700">{gain.totalLeadsSold.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">{gain.totalEarnings.toLocaleString('fr-FR')} €</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-green-600">{gain.paidAmount.toLocaleString('fr-FR')} €</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-medium ${gain.pendingAmount > 0 ? 'text-orange-600' : 'text-gray-400'}`}>{gain.pendingAmount.toLocaleString('fr-FR')} €</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>{badge.label}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedFournisseur(gain)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors" title="Détails"><Eye size={15} /></button>
                          {gain.pendingAmount > 0 && (
                            <button onClick={() => setShowPayModal(gain)} className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-gray-100 rounded-lg transition-colors" title="Payer"><Send size={15} /></button>
                          )}
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
              <p className="text-xs text-gray-500">{filtered.length} fournisseur{filtered.length > 1 ? 's' : ''}</p>
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

        {/* Detail Modal */}
        {selectedFournisseur && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedFournisseur(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Détail Fournisseur</h2>
                <button onClick={() => setSelectedFournisseur(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {selectedFournisseur.fournisseur.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedFournisseur.fournisseur}</h3>
                    <p className="text-sm text-gray-500">{selectedFournisseur.company}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-primary/5 rounded-lg p-3 text-center"><p className="text-xl font-bold text-primary">{selectedFournisseur.totalLeadsSold.toLocaleString()}</p><p className="text-xs text-gray-500">Leads vendus</p></div>
                  <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-green-600">{selectedFournisseur.paidAmount.toLocaleString('fr-FR')}€</p><p className="text-xs text-gray-500">Payé</p></div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-orange-600">{selectedFournisseur.pendingAmount.toLocaleString('fr-FR')}€</p><p className="text-xs text-gray-500">En attente</p></div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Email', value: selectedFournisseur.email },
                    { label: 'IBAN', value: selectedFournisseur.iban || 'Non renseigné' },
                    { label: 'Dernier paiement', value: selectedFournisseur.lastPaymentDate === '-' ? 'Aucun' : new Date(selectedFournisseur.lastPaymentDate).toLocaleDateString('fr-FR') },
                    { label: 'Total gains', value: `${selectedFournisseur.totalEarnings.toLocaleString('fr-FR')} €` },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-500">{row.label}</span>
                      <span className="text-sm font-medium text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>
                {selectedFournisseur.pendingAmount > 0 && (
                  <button
                    onClick={() => { setSelectedFournisseur(null); setShowPayModal(selectedFournisseur); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    <Send size={16} /> Effectuer le virement ({selectedFournisseur.pendingAmount.toLocaleString('fr-FR')} €)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pay Modal */}
        {showPayModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPayModal(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Confirmer le virement</h2>
                <button onClick={() => setShowPayModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{showPayModal.pendingAmount.toLocaleString('fr-FR')} €</p>
                  <p className="text-sm text-gray-500 mt-1">vers {showPayModal.fournisseur}</p>
                  <p className="text-xs text-gray-400">{showPayModal.iban || 'IBAN non renseigné'}</p>
                </div>
                <div className="bg-yellow-50 text-yellow-700 rounded-lg p-3 text-sm flex items-center gap-2">
                  <Clock size={16} /> Le virement sera traité sous 48h ouvrées
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowPayModal(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
                  <button onClick={() => setShowPayModal(null)} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    <Send size={16} /> Confirmer
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
