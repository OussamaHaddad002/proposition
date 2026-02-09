import { useState } from 'react';
import { FileSpreadsheet, Upload, CheckCircle, Clock, Eye, Trash2, Download, TrendingUp, DollarSign } from 'lucide-react';
import Layout from '../components/Layout';
import { mockFournisseur, mockLeads } from '../data/mockData';
import type { Lead } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function MesLeadsPage() {
  const [, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'qualified' | 'rejected' | 'sold'>('all');

  // Mes leads avec statuts variés
  const myLeads = mockLeads.slice(0, 35).map((lead, _index) => ({
    ...lead,
    uploadDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    earnings: lead.status === 'sold' ? lead.price * 0.7 : undefined,
  }));

  const filteredLeads = filterStatus === 'all' 
    ? myLeads 
    : myLeads.filter(l => l.status === filterStatus);

  const stats = {
    total: myLeads.length,
    pending: myLeads.filter(l => l.status === 'pending').length,
    qualified: myLeads.filter(l => l.status === 'qualified').length,
    sold: myLeads.filter(l => l.status === 'sold').length,
    rejected: myLeads.filter(l => l.status === 'rejected').length,
  };

  const totalEarnings = myLeads
    .filter(l => l.earnings)
    .reduce((sum, l) => sum + (l.earnings || 0), 0);

  const monthlyData = [
    { month: 'Sep', leads: 45, sold: 32, revenue: 2400 },
    { month: 'Oct', leads: 62, sold: 45, revenue: 3375 },
    { month: 'Nov', leads: 58, sold: 40, revenue: 3000 },
    { month: 'Déc', leads: 75, sold: 55, revenue: 4125 },
    { month: 'Jan', leads: 82, sold: 62, revenue: 4650 },
  ];

  const statusDistribution = [
    { name: 'Vendus', value: stats.sold, color: '#10b981' },
    { name: 'Qualifiés', value: stats.qualified, color: '#3b82f6' },
    { name: 'En attente', value: stats.pending, color: '#f59e0b' },
    { name: 'Rejetés', value: stats.rejected, color: '#ef4444' },
  ];

  const getStatusBadge = (status: Lead['status']) => {
    const styles: Record<Lead['status'], { bg: string; text: string; label: string }> = {
      new: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Nouveau' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
      qualified: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Qualifié' },
      sold: { bg: 'bg-green-100', text: 'text-green-700', label: 'Vendu' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeté' },
    };
    return styles[status];
  };

  return (
    <Layout userRole="fournisseur" userName={`${mockFournisseur.firstName} ${mockFournisseur.lastName}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mes Leads 📋</h1>
            <p className="text-sm sm:text-base text-gray-500">Gérez et suivez tous vos leads soumis</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              <Download size={18} />
              Exporter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-medium hover:bg-accent-dark transition-colors">
              <Upload size={18} />
              Nouveau fichier
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <FileSpreadsheet size={20} className="text-primary" />
              <span className="text-sm text-gray-500">Total soumis</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} className="text-yellow-500" />
              <span className="text-sm text-gray-500">En attente</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={20} className="text-blue-500" />
              <span className="text-sm text-gray-500">Qualifiés</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.qualified}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign size={20} className="text-green-500" />
              <span className="text-sm text-gray-500">Vendus</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.sold}</p>
          </div>
          <div className="bg-gradient-to-br from-accent to-accent-dark rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} />
              <span className="text-sm text-white/70">Revenus</span>
            </div>
            <p className="text-2xl font-bold">{totalEarnings.toLocaleString()}€</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance mensuelle</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fd7958" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fd7958" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="leads" name="Leads soumis" stroke="#344a5e" strokeWidth={2} fill="none" />
                <Area type="monotone" dataKey="sold" name="Vendus" stroke="#fd7958" strokeWidth={2} fill="url(#colorRevenue2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Répartition par statut</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 flex-1">{item.name}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Liste des leads</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {(['all', 'pending', 'qualified', 'sold', 'rejected'] as const).map((status) => (
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
                   status === 'pending' ? 'En attente' :
                   status === 'qualified' ? 'Qualifiés' :
                   status === 'sold' ? 'Vendus' : 'Rejetés'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Lead</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Entreprise</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Secteur</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Score</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Gains</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.slice(0, 10).map((lead) => {
                  const badge = getStatusBadge(lead.status);
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-sm">
                            {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</p>
                            <p className="text-sm text-gray-500">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{lead.company}</td>
                      <td className="px-6 py-4 text-gray-600">{lead.sector}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-sm font-bold ${
                          lead.score >= 80 ? 'bg-green-100 text-green-700' :
                          lead.score >= 60 ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(lead.uploadDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        {lead.earnings ? (
                          <span className="font-semibold text-green-600">{lead.earnings.toFixed(0)}€</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          {lead.status === 'pending' && (
                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
