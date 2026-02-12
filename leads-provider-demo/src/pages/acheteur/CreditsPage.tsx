import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreditCard, Plus, History, TrendingUp, Gift, Zap, Star, Check, Download, ChevronRight, Wallet } from 'lucide-react';
import AcheteurLayout from '../../components/AcheteurLayout';
import { useApi } from '../../hooks/useApi';
import { getAcheteur, getCreditPacks } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import TourGuide from '../../components/TourGuide';
import { creditsTourSteps } from '../../data/tourSteps';

export default function CreditsPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setShowTour(true);
    }
  }, [searchParams]);

  // Fetch data from API
  const { data: mockAcheteur } = useApi(getAcheteur, []);
  const { data: packsData } = useApi(getCreditPacks, []);
  const creditPacks = packsData ?? [];

  const creditHistory = [
    { id: '1', type: 'purchase', amount: 50, date: '2024-01-15', description: 'Achat pack Pro', balance: 250 },
    { id: '2', type: 'usage', amount: -1, date: '2024-01-14', description: 'Achat lead #L-2847', balance: 200 },
    { id: '3', type: 'usage', amount: -1, date: '2024-01-14', description: 'Achat lead #L-2846', balance: 201 },
    { id: '4', type: 'usage', amount: -1, date: '2024-01-13', description: 'Achat lead #L-2845', balance: 202 },
    { id: '5', type: 'bonus', amount: 10, date: '2024-01-10', description: 'Bonus parrainage', balance: 203 },
    { id: '6', type: 'purchase', amount: 100, date: '2024-01-05', description: 'Achat pack Business', balance: 193 },
  ];

  const usageStats = [
    { month: 'Sep', used: 25, added: 50 },
    { month: 'Oct', used: 40, added: 50 },
    { month: 'Nov', used: 35, added: 0 },
    { month: 'Déc', used: 55, added: 100 },
    { month: 'Jan', used: 30, added: 50 },
  ];

  const getHistoryIcon = (type: string) => {
    switch(type) {
      case 'purchase': return <Plus size={13} className="text-emerald-500" />;
      case 'usage': return <CreditCard size={13} className="text-red-400" />;
      case 'bonus': return <Gift size={13} className="text-violet-500" />;
      default: return <History size={13} className="text-gray-400" />;
    }
  };

  const getHistoryColor = (type: string) => {
    switch(type) {
      case 'purchase': return 'bg-emerald-50';
      case 'usage': return 'bg-red-50';
      case 'bonus': return 'bg-violet-50';
      default: return 'bg-gray-50';
    }
  };

  const statCards = [
    { label: 'Utilisés ce mois', value: '30', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Coût moyen/lead', value: '75€', icon: Zap, color: 'text-[#fd7958]', bg: 'bg-[#fd7958]/[0.08]' },
    { label: 'Bonus accumulés', value: '15', icon: Gift, color: 'text-violet-500', bg: 'bg-violet-50' },
  ];

  return (
    <AcheteurLayout>
      {!mockAcheteur ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fd7958]" /></div>
      ) : (
      <>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Crédits & Paiements</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gérez vos crédits et consultez l'historique</p>
        </div>

        {/* Credit Balance Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-100/80 relative overflow-hidden" data-tour="credit-balance">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#fd7958]/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col sm:flex-row items-start sm:justify-between gap-5">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">Solde actuel</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-800">{mockAcheteur.credits}</span>
                <span className="text-sm text-gray-400">crédits</span>
              </div>
              <p className="text-gray-300 mt-1 text-xs">
                ≈ {mockAcheteur.credits * 75}€ de valeur
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-3">
              <div className="w-11 h-11 bg-[#344a5e]/[0.06] rounded-xl flex items-center justify-center">
                <Wallet size={20} className="text-[#344a5e]/60" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors">
                <Plus size={15} />
                Acheter des crédits
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl px-4 py-4 border border-gray-100/80">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon size={17} className={card.color} />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">{card.label}</p>
                  <p className="text-lg font-bold text-gray-800">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Credit Packs & Chart */}
          <div className="lg:col-span-2 space-y-4">
            {/* Credit Packs */}
            <div className="bg-white rounded-xl border border-gray-100/80 p-5" data-tour="credit-packs">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Acheter des crédits</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {creditPacks.map((pack) => (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={`relative px-4 py-5 rounded-xl border cursor-pointer transition-all ${
                      selectedPack === pack.id
                        ? 'border-[#fd7958] bg-[#fd7958]/[0.03]'
                        : 'border-gray-100 hover:border-gray-200'
                    } ${pack.popular ? 'ring-1 ring-[#fd7958]/30 ring-offset-1' : ''}`}
                  >
                    {pack.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#fd7958] text-white text-[10px] font-bold rounded-md">
                        Populaire
                      </div>
                    )}
                    
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1.5">{pack.name}</h3>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star size={13} className="text-[#fd7958] fill-[#fd7958]" />
                        <span className="text-xl font-bold text-gray-800">{pack.credits}</span>
                        <span className="text-xs text-gray-400">crédits</span>
                      </div>
                      <p className="text-2xl font-bold text-[#fd7958] mb-0.5">{pack.price}€</p>
                      <p className="text-[11px] text-gray-400">{(pack.price / pack.credits).toFixed(2)}€ / crédit</p>
                      
                      {(pack.bonus ?? 0) > 0 && (
                        <div className="mt-2 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[11px] font-medium inline-block">
                          +{pack.bonus} bonus
                        </div>
                      )}
                    </div>
                    
                    {selectedPack === pack.id && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#fd7958] rounded-full flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedPack && (
                <div className="mt-4 p-3.5 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Pack {creditPacks.find(p => p.id === selectedPack)?.name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {creditPacks.find(p => p.id === selectedPack)?.credits} crédits + {creditPacks.find(p => p.id === selectedPack)?.bonus || 0} bonus
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors">
                    Payer {creditPacks.find(p => p.id === selectedPack)?.price}€
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Usage Chart */}
            <div className="bg-white rounded-xl border border-gray-100/80 p-5" data-tour="usage-chart">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Évolution des crédits</h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={usageStats}>
                  <defs>
                    <linearGradient id="creditsUsedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="creditsAddedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} width={30} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="added" name="Ajoutés" stroke="#10b981" strokeWidth={2} fill="url(#creditsAddedGrad)" dot={false} />
                  <Area type="monotone" dataKey="used" name="Utilisés" stroke="#ef4444" strokeWidth={2} fill="url(#creditsUsedGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* History & Payment Methods */}
          <div className="lg:col-span-1 space-y-4">
            {/* History */}
            <div className="bg-white rounded-xl border border-gray-100/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-800">Historique</h2>
                <button className="text-[11px] text-[#fd7958] hover:underline font-medium flex items-center gap-1">
                  <Download size={12} />
                  Exporter
                </button>
              </div>
              
              <div className="space-y-2">
                {creditHistory.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50/80 transition-colors">
                    <div className={`w-7 h-7 rounded-lg ${getHistoryColor(item.type)} flex items-center justify-center`}>
                      {getHistoryIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{item.description}</p>
                      <p className="text-[10px] text-gray-400">{new Date(item.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${item.amount > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                        {item.amount > 0 ? '+' : ''}{item.amount}
                      </p>
                      <p className="text-[10px] text-gray-300">{item.balance}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-3 py-1.5 text-center text-[#fd7958] text-xs font-medium hover:bg-[#fd7958]/[0.04] rounded-lg transition-colors">
                Voir tout l'historique
              </button>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl border border-gray-100/80 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Moyens de paiement</h2>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg">
                  <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-[9px] font-bold tracking-wider">
                    VISA
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700">•••• 4242</p>
                    <p className="text-[10px] text-gray-400">Expire 12/26</p>
                  </div>
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded">Défaut</span>
                </div>
              </div>

              <button className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 border border-dashed border-gray-200 text-gray-400 rounded-lg text-xs hover:border-[#fd7958] hover:text-[#fd7958] transition-colors">
                <Plus size={13} />
                Ajouter une carte
              </button>
            </div>
          </div>
        </div>
      </div>

      {showTour && (
        <TourGuide
          steps={creditsTourSteps}
          isActive={showTour}
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}
      </>
      )}
    </AcheteurLayout>
  );
}
