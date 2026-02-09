import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreditCard, Plus, History, TrendingUp, Gift, Zap, Star, Check, Download, ChevronRight, Wallet } from 'lucide-react';
import Layout from '../components/Layout';
import { mockAcheteur, creditPacks } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TourGuide from '../components/TourGuide';
import { creditsTourSteps } from '../data/tourSteps';

export default function CreditsPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setShowTour(true);
    }
  }, [searchParams]);

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
      case 'purchase': return <Plus size={16} className="text-green-600" />;
      case 'usage': return <CreditCard size={16} className="text-red-500" />;
      case 'bonus': return <Gift size={16} className="text-purple-600" />;
      default: return <History size={16} className="text-gray-400" />;
    }
  };

  const getHistoryColor = (type: string) => {
    switch(type) {
      case 'purchase': return 'bg-green-50 text-green-700';
      case 'usage': return 'bg-red-50 text-red-600';
      case 'bonus': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <Layout userRole="acheteur" userName={`${mockAcheteur.firstName} ${mockAcheteur.lastName}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Crédits & Paiements </h1>
            <p className="text-sm sm:text-base text-gray-500">Gérez vos crédits et consultez l'historique</p>
          </div>
        </div>

        {/* Credit Balance Card */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 sm:p-8 text-white" data-tour="credit-balance">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-6">
            <div>
              <p className="text-white/70 mb-2 text-sm sm:text-base">Solde actuel</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold">{mockAcheteur.credits}</span>
                <span className="text-lg sm:text-xl text-white/70">crédits</span>
              </div>
              <p className="text-white/60 mt-2 text-sm">
                ≈ {mockAcheteur.credits * 75}€ de valeur
              </p>
            </div>
            <div className="flex flex-col items-center sm:text-right">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Wallet size={32} className="text-white sm:w-10 sm:h-10" />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors text-sm sm:text-base">
                <Plus size={18} />
                Acheter des crédits
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Crédits utilisés ce mois</p>
                <p className="text-2xl font-bold text-gray-900">30</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Zap size={24} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Coût moyen/lead</p>
                <p className="text-2xl font-bold text-gray-900">75€</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Gift size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bonus accumulés</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Credit Packs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6" data-tour="credit-packs">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Acheter des crédits</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {creditPacks.map((pack) => (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPack === pack.id
                        ? 'border-accent bg-accent/5 shadow-lg'
                        : 'border-gray-200 hover:border-accent/50'
                    } ${pack.popular ? 'ring-2 ring-accent ring-offset-2' : ''}`}
                  >
                    {pack.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
                        Populaire
                      </div>
                    )}
                    
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 mb-2">{pack.name}</h3>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star size={16} className="text-accent fill-accent" />
                        <span className="text-2xl font-bold text-gray-900">{pack.credits}</span>
                        <span className="text-gray-500">crédits</span>
                      </div>
                      <p className="text-3xl font-bold text-accent mb-1">{pack.price}€</p>
                      <p className="text-sm text-gray-500">{(pack.price / pack.credits).toFixed(2)}€ / crédit</p>
                      
                      {(pack.bonus ?? 0) > 0 && (
                        <div className="mt-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium inline-block">
                          +{pack.bonus} bonus
                        </div>
                      )}
                    </div>
                    
                    {selectedPack === pack.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedPack && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Pack {creditPacks.find(p => p.id === selectedPack)?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {creditPacks.find(p => p.id === selectedPack)?.credits} crédits + {creditPacks.find(p => p.id === selectedPack)?.bonus || 0} bonus
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors">
                    Payer {creditPacks.find(p => p.id === selectedPack)?.price}€
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Usage Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6" data-tour="usage-chart">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Évolution des crédits</h2>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={usageStats}>
                  <defs>
                    <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="added" name="Ajoutés" stroke="#10b981" strokeWidth={2} fill="url(#colorAdded)" />
                  <Area type="monotone" dataKey="used" name="Utilisés" stroke="#ef4444" strokeWidth={2} fill="url(#colorUsed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Historique</h2>
                <button className="text-sm text-accent hover:underline flex items-center gap-1">
                  <Download size={14} />
                  Exporter
                </button>
              </div>
              
              <div className="space-y-3">
                {creditHistory.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${getHistoryColor(item.type)}`}>
                      {getHistoryIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.description}</p>
                      <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${item.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {item.amount > 0 ? '+' : ''}{item.amount}
                      </p>
                      <p className="text-xs text-gray-400">{item.balance} crédits</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-center text-accent font-medium hover:bg-accent/5 rounded-lg transition-colors">
                Voir tout l'historique
              </button>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Moyens de paiement</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">•••• 4242</p>
                    <p className="text-xs text-gray-500">Expire 12/26</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Par défaut</span>
                </div>
              </div>

              <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-accent hover:text-accent transition-colors">
                <Plus size={16} />
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
    </Layout>
  );
}
