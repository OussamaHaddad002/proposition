import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, TrendingUp, DollarSign, Activity, Shield, AlertTriangle, CheckCircle2, Server, Database, Cpu, Settings, UserPlus, Ban, Eye, MoreVertical, Brain, Gauge, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { mockLeads, monthlyStats, sectorDistribution } from '../data/mockData';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TourGuide from '../components/TourGuide';
import { dashboardTourSteps } from '../data/tourSteps';

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'ai' | 'system'>('overview');
  const [searchParams] = useSearchParams();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setShowTour(true);
    }
  }, [searchParams]);

  // Mock data pour les stats admin
  const systemHealth = [
    { name: 'API', status: 'healthy', uptime: 99.9, latency: 45 },
    { name: 'Database', status: 'healthy', uptime: 99.8, latency: 12 },
    { name: 'IA Engine', status: 'healthy', uptime: 99.5, latency: 230 },
    { name: 'Aheeva', status: 'healthy', uptime: 98.9, latency: 89 },
  ];

  const aiPerformance = [
    { day: 'Lun', accuracy: 87, predictions: 120 },
    { day: 'Mar', accuracy: 89, predictions: 145 },
    { day: 'Mer', accuracy: 91, predictions: 132 },
    { day: 'Jeu', accuracy: 88, predictions: 156 },
    { day: 'Ven', accuracy: 92, predictions: 168 },
    { day: 'Sam', accuracy: 90, predictions: 85 },
    { day: 'Dim', accuracy: 91, predictions: 42 },
  ];

  const recentUsers = [
    { id: '1', name: 'Sophie Martin', email: 'sophie@solartech.fr', role: 'fournisseur', status: 'active', createdAt: '2024-01-15' },
    { id: '2', name: 'Lucas Durand', email: 'lucas@callcenter.pro', role: 'agent', status: 'active', createdAt: '2024-01-14' },
    { id: '3', name: 'Pierre Dupont', email: 'pierre@assurance.fr', role: 'acheteur', status: 'active', createdAt: '2024-01-13' },
    { id: '4', name: 'Marie Bernard', email: 'marie@eco-energie.com', role: 'fournisseur', status: 'pending', createdAt: '2024-01-12' },
    { id: '5', name: 'Jean Michel', email: 'jean@credit.fr', role: 'acheteur', status: 'suspended', createdAt: '2024-01-10' },
  ];

  const alerts = [
    { id: '1', type: 'warning', message: 'Pic de charge détecté sur le serveur API', time: 'Il y a 5 min' },
    { id: '2', type: 'info', message: 'Nouveau fournisseur en attente de validation', time: 'Il y a 15 min' },
    { id: '3', type: 'success', message: 'Mise à jour modèle IA déployée avec succès', time: 'Il y a 1h' },
  ];

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      fournisseur: 'bg-blue-100 text-blue-700',
      agent: 'bg-purple-100 text-purple-700',
      acheteur: 'bg-green-100 text-green-700',
      admin: 'bg-red-100 text-red-700',
    };
    return styles[role] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; dot: string }> = {
      active: { bg: 'text-green-600', dot: 'bg-green-500' },
      pending: { bg: 'text-yellow-600', dot: 'bg-yellow-500' },
      suspended: { bg: 'text-red-600', dot: 'bg-red-500' },
    };
    return styles[status] || { bg: 'text-gray-600', dot: 'bg-gray-500' };
  };

  return (
    <Layout userRole="admin" userName="Admin Platform">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Centre de Contrôle </h1>
            <p className="text-sm sm:text-base text-gray-500">Supervision complète de la plateforme Leads Provider</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {alerts.filter(a => a.type === 'warning').length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                <AlertTriangle size={16} />
                <span>{alerts.filter(a => a.type === 'warning').length} alertes</span>
              </div>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
              <Settings size={18} />
              Configuration
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto pb-px -mb-px">
          {[
            { key: 'overview', label: 'Vue d\'ensemble', icon: Activity },
            { key: 'users', label: 'Utilisateurs', icon: Users },
            { key: 'ai', label: 'IA', icon: Brain },
            { key: 'system', label: 'Système', icon: Server },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedTab === tab.key
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.key === 'overview' ? 'Général' : tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Revenu mensuel"
                value="48,750€"
                change={18}
                icon={<DollarSign size={24} />}
                color="success"
              />
              <StatCard
                title="Utilisateurs actifs"
                value="1,247"
                change={12}
                icon={<Users size={24} />}
                color="primary"
              />
              <StatCard
                title="Leads traités"
                value={mockLeads.length * 10}
                change={25}
                icon={<TrendingUp size={24} />}
                color="accent"
              />
              <StatCard
                title="Taux de satisfaction"
                value="94.5%"
                change={3}
                icon={<CheckCircle2 size={24} />}
                color="info"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Évolution des revenus</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={monthlyStats}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [`${value.toLocaleString()}€`, 'Revenus']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Activity Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Activité leads</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="leads" name="Leads reçus" fill="#344a5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="qualified" name="Qualifiés" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sold" name="Vendus" fill="#fd7958" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertes récentes</h2>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`flex items-center gap-4 p-4 rounded-lg ${
                    alert.type === 'warning' ? 'bg-yellow-50' :
                    alert.type === 'success' ? 'bg-green-50' :
                    'bg-blue-50'
                  }`}>
                    {alert.type === 'warning' && <AlertTriangle className="text-yellow-600" size={20} />}
                    {alert.type === 'success' && <CheckCircle2 className="text-green-600" size={20} />}
                    {alert.type === 'info' && <Activity className="text-blue-600" size={20} />}
                    <p className="flex-1 text-gray-700">{alert.message}</p>
                    <span className="text-sm text-gray-500">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Eye size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent">
                  <option>Tous les rôles</option>
                  <option>Fournisseurs</option>
                  <option>Agents</option>
                  <option>Acheteurs</option>
                </select>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors">
                <UserPlus size={18} />
                Nouvel utilisateur
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-tour="user-management">
              <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Utilisateur</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Rôle</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Statut</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Inscrit le</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentUsers.map((user) => {
                    const statusStyle = getStatusBadge(user.status);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                            <span className={`text-sm ${statusStyle.bg}`}>
                              {user.status === 'active' ? 'Actif' : user.status === 'pending' ? 'En attente' : 'Suspendu'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.createdAt}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors">
                              <Ban size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
          </>
        )}

        {/* AI Performance Tab */}
        {selectedTab === 'ai' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Brain size={24} />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Précision du modèle</p>
                    <p className="text-3xl font-bold">89.2%</p>
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2" style={{ width: '89.2%' }} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Prédictions/jour</p>
                    <p className="text-3xl font-bold">848</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm">+15% vs semaine dernière</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Gauge size={24} />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Temps de réponse</p>
                    <p className="text-3xl font-bold">230ms</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm">SLA respecté: 99.5%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Précision du scoring IA</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={aiPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[80, 100]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#fd7958" strokeWidth={3} dot={{ fill: '#fd7958', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Features SHAP - Impact moyen</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Durée appel', impact: 85 },
                    { name: 'Secteur activité', impact: 72 },
                    { name: 'Taille entreprise', impact: 68 },
                    { name: 'Région', impact: 55 },
                    { name: 'Source lead', impact: 48 },
                    { name: 'Horaire contact', impact: 35 },
                  ].map((feature, index) => (
                    <div key={feature.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{feature.name}</span>
                        <span className="font-medium text-gray-900">{feature.impact}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-accent to-primary rounded-full h-2 transition-all duration-500"
                          style={{ width: `${feature.impact}%`, animationDelay: `${index * 100}ms` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* System Tab */}
        {selectedTab === 'system' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="system-health">
              {systemHealth.map((system) => (
                <div key={system.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      {system.name === 'API' && <Server size={24} className="text-primary" />}
                      {system.name === 'Database' && <Database size={24} className="text-primary" />}
                      {system.name === 'IA Engine' && <Brain size={24} className="text-primary" />}
                      {system.name === 'Aheeva' && <Cpu size={24} className="text-primary" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-green-600 font-medium">Opérationnel</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">{system.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Uptime</span>
                      <span className="font-medium text-green-600">{system.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Latence</span>
                      <span className="font-medium text-gray-900">{system.latency}ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Logs système récents</h2>
              <div className="space-y-2 font-mono text-sm">
                {[
                  { time: '16:45:23', level: 'INFO', message: '[API] Request processed in 45ms - /api/leads/score' },
                  { time: '16:45:22', level: 'INFO', message: '[IA] Scoring model prediction completed - lead_id: L-2847' },
                  { time: '16:45:20', level: 'WARN', message: '[Aheeva] Call dropped - agent_id: A-103 - reconnecting...' },
                  { time: '16:45:18', level: 'INFO', message: '[DB] Query executed in 12ms - SELECT leads WHERE status=qualified' },
                  { time: '16:45:15', level: 'INFO', message: '[API] New lead uploaded - provider_id: P-2847' },
                ].map((log, i) => (
                  <div key={i} className={`p-3 rounded-lg ${
                    log.level === 'WARN' ? 'bg-yellow-50' : 'bg-gray-50'
                  }`}>
                    <span className="text-gray-400">{log.time}</span>
                    <span className={`mx-2 px-2 py-0.5 rounded text-xs font-bold ${
                      log.level === 'WARN' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-600'
                    }`}>{log.level}</span>
                    <span className="text-gray-700">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {showTour && (
        <TourGuide
          steps={dashboardTourSteps.admin}
          isActive={showTour}
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}
    </Layout>
  );
}
