import { useState, useEffect } from 'react';
import { CreditCard, Save, Plus, Trash2, Edit, Package, Settings, DollarSign, Gift, ToggleLeft, ToggleRight } from 'lucide-react';
import Layout from '../../components/Layout';
import { useApi } from '../../hooks/useApi';
import { getAdminCreditPacks, getCreditRules } from '../../services/api';
import type { AdminCreditPack, CreditRule } from '../../types';

export default function AdminCreditsPage() {
  const { data: packsData } = useApi(getAdminCreditPacks, []);
  const { data: rulesData } = useApi(getCreditRules, []);

  const [packs, setPacks] = useState<AdminCreditPack[]>([]);
  const [rules, setRules] = useState<CreditRule[]>([]);

  useEffect(() => { if (packsData) setPacks(packsData); }, [packsData]);
  useEffect(() => { if (rulesData) setRules(rulesData); }, [rulesData]);

  const [editingPack, setEditingPack] = useState<AdminCreditPack | null>(null);
  const [showNewPack, setShowNewPack] = useState(false);

  const stats = {
    totalPacks: packs.filter(p => p.active).length,
    avgPrice: Math.round(packs.filter(p => p.active).reduce((s, p) => s + p.pricePerCredit, 0) / packs.filter(p => p.active).length * 100) / 100,
    totalBonusGiven: 1250,
    activeRules: rules.filter(r => r.active).length,
  };

  const togglePackActive = (id: string) => {
    setPacks(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const toggleRuleActive = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const updateRuleValue = (id: string, value: number) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, value } : r));
  };

  return (
    <Layout userRole="admin" userName="Admin Platform">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Crédits</h1>
          <p className="text-sm sm:text-base text-gray-500">Configurez les packs de crédits et les règles tarifaires</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Packs actifs', value: stats.totalPacks, icon: <Package size={18} /> },
            { label: 'Prix moyen/crédit', value: `${stats.avgPrice} €`, icon: <DollarSign size={18} /> },
            { label: 'Bonus distribués', value: stats.totalBonusGiven.toLocaleString(), icon: <Gift size={18} /> },
            { label: 'Règles actives', value: `${stats.activeRules}/${rules.length}`, icon: <Settings size={18} /> },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-primary">{stat.icon}</div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Credit Packs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard size={18} /> Packs de Crédits
            </h2>
            <button
              onClick={() => setShowNewPack(true)}
              className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark transition-colors"
            >
              <Plus size={16} /> Nouveau pack
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packs.map(pack => (
              <div key={pack.id} className={`relative rounded-xl border-2 p-4 transition-all ${pack.active ? 'border-gray-200' : 'border-gray-100 opacity-60'} ${pack.popular ? 'border-accent ring-2 ring-accent/20' : ''}`}>
                {pack.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent text-white text-xs font-bold rounded-full">Populaire</span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{pack.name}</h3>
                  <button onClick={() => togglePackActive(pack.id)} className="text-gray-400 hover:text-gray-600">
                    {pack.active ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} />}
                  </button>
                </div>
                <div className="mb-3">
                  <p className="text-2xl font-bold text-gray-900">{pack.price} €</p>
                  <p className="text-sm text-gray-500">{pack.credits} crédits</p>
                  <p className="text-xs text-gray-400">{pack.pricePerCredit.toFixed(2)} € / crédit</p>
                </div>
                {pack.bonus > 0 && (
                  <div className="flex items-center gap-1 text-green-600 text-sm mb-3">
                    <Gift size={14} /> +{pack.bonus} crédits bonus
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPack(pack)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Edit size={12} /> Modifier
                  </button>
                  <button className="px-3 py-1.5 border border-red-200 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Rules Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Settings size={18} /> Règles & Paramètres
          </h2>
          <div className="space-y-3">
            {rules.map(rule => (
              <div key={rule.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all ${rule.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-70'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{rule.name}</h3>
                    {!rule.active && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Désactivé</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{rule.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rule.value}
                      onChange={e => updateRuleValue(rule.id, parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-xs text-gray-500">{rule.unit}</span>
                  </div>
                  <button onClick={() => toggleRuleActive(rule.id)} className="text-gray-400 hover:text-gray-600">
                    {rule.active ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark transition-colors">
              <Save size={16} /> Enregistrer les modifications
            </button>
          </div>
        </div>

        {/* Edit Pack Modal */}
        {(editingPack || showNewPack) && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setEditingPack(null); setShowNewPack(false); }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">{editingPack ? 'Modifier le pack' : 'Nouveau pack'}</h2>
                <button onClick={() => { setEditingPack(null); setShowNewPack(false); }} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du pack</label>
                  <input type="text" defaultValue={editingPack?.name || ''} placeholder="Ex: Premium" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Crédits</label>
                    <input type="number" defaultValue={editingPack?.credits || ''} placeholder="50" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                    <input type="number" defaultValue={editingPack?.price || ''} placeholder="199" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bonus crédits</label>
                    <input type="number" defaultValue={editingPack?.bonus || 0} placeholder="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={editingPack?.popular || false} className="rounded border-gray-300 text-accent focus:ring-accent" />
                      <span className="text-sm text-gray-700">Populaire</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setEditingPack(null); setShowNewPack(false); }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
                  <button onClick={() => { setEditingPack(null); setShowNewPack(false); }} className="flex-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors flex items-center justify-center gap-2">
                    <Save size={16} /> {editingPack ? 'Enregistrer' : 'Créer'}
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
