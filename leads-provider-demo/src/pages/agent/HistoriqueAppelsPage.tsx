import { useState } from 'react';
import { Phone, PhoneMissed, Clock, CheckCircle, XCircle, RotateCcw, Play, Download, User, Building2 } from 'lucide-react';
import Layout from '../../components/Layout';
import { useApi } from '../../hooks/useApi';
import { getAgent, getLeads } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function HistoriqueAppelsPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'qualified' | 'not_qualified' | 'callback'>('all');
  const [dateRange, setDateRange] = useState('7d');

  // Fetch data from API
  const { data: mockAgent } = useApi(getAgent, []);
  const { data: leadsData } = useApi(getLeads, []);
  const mockLeads = leadsData ?? [];

  // Historique des appels simulé
  const callHistory = mockLeads.slice(0, 50).map((lead, index) => ({
    id: `call-${index}`,
    lead,
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: Math.floor(Math.random() * 600) + 30, // 30s à 10min
    result: ['qualified', 'not_qualified', 'callback', 'no_answer'][index % 4] as 'qualified' | 'not_qualified' | 'callback' | 'no_answer',
    notes: index % 3 === 0 ? 'Client intéressé, à rappeler semaine prochaine' : undefined,
    hasRecording: index % 2 === 0,
  }));

  const filteredCalls = filterStatus === 'all' 
    ? callHistory 
    : callHistory.filter(c => c.result === filterStatus);

  const stats = {
    total: callHistory.length,
    qualified: callHistory.filter(c => c.result === 'qualified').length,
    not_qualified: callHistory.filter(c => c.result === 'not_qualified').length,
    callback: callHistory.filter(c => c.result === 'callback').length,
    no_answer: callHistory.filter(c => c.result === 'no_answer').length,
  };

  const dailyStats = [
    { day: 'Lun', calls: 45, qualified: 32 },
    { day: 'Mar', calls: 52, qualified: 38 },
    { day: 'Mer', calls: 48, qualified: 35 },
    { day: 'Jeu', calls: 60, qualified: 45 },
    { day: 'Ven', calls: 55, qualified: 42 },
    { day: 'Sam', calls: 20, qualified: 15 },
    { day: 'Dim', calls: 0, qualified: 0 },
  ];

  const hourlyDistribution = [
    { hour: '9h', calls: 12 },
    { hour: '10h', calls: 25 },
    { hour: '11h', calls: 30 },
    { hour: '12h', calls: 8 },
    { hour: '14h', calls: 28 },
    { hour: '15h', calls: 32 },
    { hour: '16h', calls: 22 },
    { hour: '17h', calls: 15 },
  ];

  const getResultBadge = (result: 'qualified' | 'not_qualified' | 'callback' | 'no_answer') => {
    const styles = {
      qualified: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={14} />, label: 'Qualifié' },
      not_qualified: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={14} />, label: 'Non qualifié' },
      callback: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <RotateCcw size={14} />, label: 'À rappeler' },
      no_answer: { bg: 'bg-gray-100', text: 'text-gray-700', icon: <PhoneMissed size={14} />, label: 'Pas de réponse' },
    };
    return styles[result];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const avgDuration = Math.round(callHistory.reduce((sum, c) => sum + c.duration, 0) / callHistory.length);

  return (
    <Layout userRole="agent" userName={mockAgent ? `${mockAgent.firstName} ${mockAgent.lastName}` : 'Chargement...'}>
      {!mockAgent ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fd7958]" /></div>
      ) : (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Historique des Appels </h1>
            <p className="text-sm sm:text-base text-gray-500">Consultez et analysez vos appels passés</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
            </select>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors text-sm">
              <Download size={16} />
              <span className="hidden sm:inline">Exporter</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Phone size={20} className="text-primary" />
              <span className="text-sm text-gray-500">Total appels</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={20} className="text-green-500" />
              <span className="text-sm text-gray-500">Qualifiés</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.qualified}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <RotateCcw size={20} className="text-yellow-500" />
              <span className="text-sm text-gray-500">À rappeler</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.callback}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <PhoneMissed size={20} className="text-gray-500" />
              <span className="text-sm text-gray-500">Sans réponse</span>
            </div>
            <p className="text-2xl font-bold text-gray-600">{stats.no_answer}</p>
          </div>
          <div className="bg-gradient-to-br from-accent to-accent-dark rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} />
              <span className="text-sm text-white/70">Durée moyenne</span>
            </div>
            <p className="text-2xl font-bold">{formatDuration(avgDuration)}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance par jour</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="calls" name="Appels" fill="#344a5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="qualified" name="Qualifiés" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hourly Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Distribution horaire</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="calls" stroke="#fd7958" strokeWidth={3} dot={{ fill: '#fd7958', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calls Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Derniers appels</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {(['all', 'qualified', 'callback', 'not_qualified'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Tous' : 
                   status === 'qualified' ? 'Qualifiés' : 
                   status === 'callback' ? 'À rappeler' : 'Non qualifiés'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Contact</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Entreprise</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Date/Heure</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Durée</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Résultat</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Notes</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Audio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCalls.slice(0, 15).map((call) => {
                  const badge = getResultBadge(call.result);
                  return (
                    <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{call.lead.firstName} {call.lead.lastName}</p>
                            <p className="text-sm text-gray-500">{call.lead.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-gray-400" />
                          <span className="text-gray-700">{call.lead.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <p className="text-gray-900">{new Date(call.date).toLocaleDateString('fr-FR')}</p>
                        <p className="text-gray-500">{new Date(call.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-gray-700">{formatDuration(call.duration)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {call.notes ? (
                          <p className="text-sm text-gray-600 max-w-xs truncate" title={call.notes}>
                            {call.notes}
                          </p>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {call.hasRecording ? (
                          <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-xs sm:text-sm font-medium hover:bg-accent/20 transition-colors">
                            <Play size={14} />
                            <span className="hidden sm:inline">Écouter</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
    </Layout>
  );
}
