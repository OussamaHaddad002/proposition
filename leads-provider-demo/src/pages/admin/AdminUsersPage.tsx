import { useState } from 'react';
import { Search, UserPlus, Shield, Ban, CheckCircle, Eye, Mail, Phone, Building2, Calendar, Download, ChevronLeft, ChevronRight, Edit, Trash2, Users, Activity, TrendingUp, Clock, Wallet, Plus, Minus } from 'lucide-react';
import Layout from '../../components/Layout';
import type { UserRole } from '../../types';

interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  company?: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  createdAt: string;
  lastLogin: string;
  leadsCount: number;
  revenue: number;
}

const mockUsers: MockUser[] = [
  { id: '1', firstName: 'Sophie', lastName: 'Martin', email: 'sophie@agence-ads.fr', phone: '+33 1 23 45 67 89', role: 'fournisseur', company: 'Agence Ads Paris', status: 'active', createdAt: '2024-01-15', lastLogin: '2026-02-09', leadsCount: 1250, revenue: 28540 },
  { id: '2', firstName: 'Lucas', lastName: 'Dubois', email: 'lucas@leads-provider.fr', phone: '+33 6 12 34 56 78', role: 'agent', status: 'active', createdAt: '2024-03-01', lastLogin: '2026-02-09', leadsCount: 4521, revenue: 0 },
  { id: '3', firstName: 'Marie', lastName: 'Leroy', email: 'marie@pme-lille.fr', phone: '+33 3 20 12 34 56', role: 'acheteur', company: 'PME Lille Marketing', status: 'active', createdAt: '2024-02-10', lastLogin: '2026-02-08', leadsCount: 156, revenue: 4680 },
  { id: '4', firstName: 'Pierre', lastName: 'Dupont', email: 'pierre@assurance-vie.fr', phone: '+33 4 56 78 90 12', role: 'acheteur', company: 'Assurance Vie Pro', status: 'active', createdAt: '2024-04-22', lastLogin: '2026-02-07', leadsCount: 89, revenue: 2670 },
  { id: '5', firstName: 'Julie', lastName: 'Bernard', email: 'julie@callcenter.pro', phone: '+33 6 98 76 54 32', role: 'agent', status: 'active', createdAt: '2024-05-10', lastLogin: '2026-02-09', leadsCount: 3200, revenue: 0 },
  { id: '6', firstName: 'Thomas', lastName: 'Moreau', email: 'thomas@solar-france.com', phone: '+33 1 11 22 33 44', role: 'fournisseur', company: 'Solar France', status: 'active', createdAt: '2024-06-01', lastLogin: '2026-02-06', leadsCount: 890, revenue: 19250 },
  { id: '7', firstName: 'Camille', lastName: 'Laurent', email: 'camille@eco-energie.fr', phone: '+33 5 55 66 77 88', role: 'fournisseur', company: 'Éco Énergie', status: 'pending', createdAt: '2026-02-08', lastLogin: '-', leadsCount: 0, revenue: 0 },
  { id: '8', firstName: 'Nicolas', lastName: 'Petit', email: 'nicolas@immopro.fr', phone: '+33 6 44 55 66 77', role: 'acheteur', company: 'ImmoPro', status: 'suspended', createdAt: '2024-07-15', lastLogin: '2026-01-20', leadsCount: 45, revenue: 1350 },
  { id: '9', firstName: 'Emma', lastName: 'Garcia', email: 'emma@digital-agency.fr', phone: '+33 1 99 88 77 66', role: 'fournisseur', company: 'Digital Agency', status: 'active', createdAt: '2024-08-20', lastLogin: '2026-02-09', leadsCount: 620, revenue: 14300 },
  { id: '10', firstName: 'Antoine', lastName: 'Lefebvre', email: 'antoine@callpro.fr', phone: '+33 6 33 22 11 00', role: 'agent', status: 'inactive', createdAt: '2024-02-01', lastLogin: '2025-11-10', leadsCount: 1800, revenue: 0 },
  { id: '11', firstName: 'Léa', lastName: 'Roux', email: 'lea@financeplus.fr', phone: '+33 4 12 34 56 78', role: 'acheteur', company: 'Finance Plus', status: 'active', createdAt: '2024-09-01', lastLogin: '2026-02-08', leadsCount: 210, revenue: 6300 },
  { id: '12', firstName: 'Hugo', lastName: 'Vincent', email: 'hugo@datacorp.fr', phone: '+33 1 87 65 43 21', role: 'fournisseur', company: 'DataCorp', status: 'active', createdAt: '2024-10-15', lastLogin: '2026-02-07', leadsCount: 450, revenue: 10800 },
  { id: '13', firstName: 'Manon', lastName: 'Fournier', email: 'manon@leads-provider.fr', phone: '+33 6 22 33 44 55', role: 'agent', status: 'active', createdAt: '2024-11-01', lastLogin: '2026-02-09', leadsCount: 2100, revenue: 0 },
  { id: '14', firstName: 'Romain', lastName: 'Bertrand', email: 'romain@credit-expert.fr', phone: '+33 3 45 67 89 01', role: 'acheteur', company: 'Crédit Expert', status: 'active', createdAt: '2024-12-05', lastLogin: '2026-02-05', leadsCount: 78, revenue: 2340 },
  { id: '15', firstName: 'Sarah', lastName: 'Michel', email: 'sarah@webfactory.fr', phone: '+33 6 11 22 33 44', role: 'fournisseur', company: 'WebFactory', status: 'pending', createdAt: '2026-02-07', lastLogin: '-', leadsCount: 0, revenue: 0 },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | MockUser['status']>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creditUser, setCreditUser] = useState<MockUser | null>(null);
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditAction, setCreditAction] = useState<'add' | 'subtract'>('add');
  const perPage = 10;

  const filteredUsers = mockUsers
    .filter(u => filterRole === 'all' || u.role === filterRole)
    .filter(u => filterStatus === 'all' || u.status === filterStatus)
    .filter(u => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.company || '').toLowerCase().includes(q)
      );
    });

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage);

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    pending: mockUsers.filter(u => u.status === 'pending').length,
    suspended: mockUsers.filter(u => u.status === 'suspended').length,
    fournisseurs: mockUsers.filter(u => u.role === 'fournisseur').length,
    agents: mockUsers.filter(u => u.role === 'agent').length,
    acheteurs: mockUsers.filter(u => u.role === 'acheteur').length,
  };

  const getRoleBadge = (role: UserRole) => {
    const styles: Record<UserRole, { bg: string; text: string; label: string }> = {
      fournisseur: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Fournisseur' },
      agent: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Agent' },
      acheteur: { bg: 'bg-green-100', text: 'text-green-700', label: 'Acheteur' },
      admin: { bg: 'bg-red-100', text: 'text-red-700', label: 'Admin' },
    };
    return styles[role];
  };

  const getStatusInfo = (status: MockUser['status']) => {
    const styles: Record<MockUser['status'], { bg: string; text: string; dot: string; label: string }> = {
      active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Actif' },
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'En attente' },
      suspended: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Suspendu' },
      inactive: { bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400', label: 'Inactif' },
    };
    return styles[status];
  };

  return (
    <Layout userRole="admin" userName="Admin Platform">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Utilisateurs</h1>
            <p className="text-sm sm:text-base text-gray-500">Gérez tous les comptes de la plateforme</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <Download size={16} />
              <span className="hidden sm:inline">Exporter</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark transition-colors"
            >
              <UserPlus size={16} />
              Nouvel utilisateur
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Total', value: stats.total, icon: <Users size={16} /> },
            { label: 'Actifs', value: stats.active, icon: <CheckCircle size={16} /> },
            { label: 'En attente', value: stats.pending, icon: <Clock size={16} /> },
            { label: 'Suspendus', value: stats.suspended, icon: <Ban size={16} /> },
            { label: 'Fournisseurs', value: stats.fournisseurs, icon: <TrendingUp size={16} /> },
            { label: 'Agents', value: stats.agents, icon: <Phone size={16} /> },
            { label: 'Acheteurs', value: stats.acheteurs, icon: <Activity size={16} /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
              <div className="flex items-center justify-center gap-1.5 mb-1 text-primary">{stat.icon}</div>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Rechercher par nom, email, entreprise..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => { setFilterRole(e.target.value as any); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">Tous les rôles</option>
                <option value="fournisseur">Fournisseur</option>
                <option value="agent">Agent</option>
                <option value="acheteur">Acheteur</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value as any); setCurrentPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="pending">En attente</option>
                <option value="suspended">Suspendu</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600">Utilisateur</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600">Rôle</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 hidden md:table-cell">Entreprise</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 hidden lg:table-cell">Leads</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 hidden lg:table-cell">Inscription</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 hidden sm:table-cell">Dernière connexion</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const statusInfo = getStatusInfo(user.status);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${roleBadge.bg} ${roleBadge.text}`}>
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}>
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600 truncate">{user.company || '—'}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                          <span className="hidden sm:inline">{statusInfo.label}</span>
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <span className="text-sm font-medium text-gray-700">{user.leadsCount.toLocaleString()}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs text-gray-500 hidden lg:table-cell">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs text-gray-500 hidden sm:table-cell">
                        {user.lastLogin === '-' ? (
                          <span className="text-yellow-600 font-medium">Jamais</span>
                        ) : (
                          new Date(user.lastLogin).toLocaleDateString('fr-FR')
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                            title="Voir"
                          >
                            <Eye size={15} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-accent hover:bg-gray-100 rounded-lg transition-colors" title="Modifier">
                            <Edit size={15} />
                          </button>
                          {user.role === 'acheteur' && (
                            <button
                              onClick={() => { setCreditUser(user); setCreditAmount(0); setCreditAction('add'); }}
                              className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Gérer crédits"
                            >
                              <Wallet size={15} />
                            </button>
                          )}
                          {user.status === 'active' ? (
                            <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors" title="Suspendre">
                              <Ban size={15} />
                            </button>
                          ) : user.status === 'pending' ? (
                            <button className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-gray-100 rounded-lg transition-colors" title="Valider">
                              <CheckCircle size={15} />
                            </button>
                          ) : (
                            <button className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-gray-100 rounded-lg transition-colors" title="Réactiver">
                              <Shield size={15} />
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

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-500">
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} au total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1 ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Profil Utilisateur</h2>
                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div className="p-6 space-y-5">
                {/* User header */}
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${getRoleBadge(selectedUser.role).bg} ${getRoleBadge(selectedUser.role).text}`}>
                    {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(selectedUser.role).bg} ${getRoleBadge(selectedUser.role).text}`}>
                        {getRoleBadge(selectedUser.role).label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(selectedUser.status).bg} ${getStatusInfo(selectedUser.status).text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusInfo(selectedUser.status).dot}`}></span>
                        {getStatusInfo(selectedUser.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <Phone size={16} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="text-sm font-medium text-gray-800">{selectedUser.phone}</p>
                    </div>
                  </div>
                  {selectedUser.company && (
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                      <Building2 size={16} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Entreprise</p>
                        <p className="text-sm font-medium text-gray-800">{selectedUser.company}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Inscription</p>
                      <p className="text-sm font-medium text-gray-800">{new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>

                {/* Performance stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-primary/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-primary">{selectedUser.leadsCount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Leads</p>
                  </div>
                  <div className="bg-accent/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-accent">{selectedUser.revenue > 0 ? `${selectedUser.revenue.toLocaleString()}€` : '—'}</p>
                    <p className="text-xs text-gray-500">Revenus</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-green-600">{selectedUser.lastLogin === '-' ? 'Jamais' : new Date(selectedUser.lastLogin).toLocaleDateString('fr-FR')}</p>
                    <p className="text-xs text-gray-500">Dernière connexion</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedUser.status === 'pending' && (
                    <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Valider le compte
                    </button>
                  )}
                  {selectedUser.status === 'active' && (
                    <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-2">
                      <Ban size={16} /> Suspendre
                    </button>
                  )}
                  {(selectedUser.status === 'suspended' || selectedUser.status === 'inactive') && (
                    <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-2">
                      <Shield size={16} /> Réactiver
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
                    <Edit size={16} /> Modifier
                  </button>
                  <button className="px-4 py-2 border border-red-200 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors text-sm flex items-center justify-center gap-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Nouvel Utilisateur</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input type="text" placeholder="Prénom" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input type="text" placeholder="Nom" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="email@exemple.fr" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input type="tel" placeholder="+33 6 00 00 00 00" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                    <option value="fournisseur">Fournisseur</option>
                    <option value="agent">Agent</option>
                    <option value="acheteur">Acheteur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise (optionnel)</label>
                  <input type="text" placeholder="Nom de l'entreprise" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <UserPlus size={16} /> Créer le compte
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credit Management Modal */}
        {creditUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setCreditUser(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Gérer les Crédits</h2>
                <button onClick={() => setCreditUser(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                    {creditUser.firstName.charAt(0)}{creditUser.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{creditUser.firstName} {creditUser.lastName}</p>
                    <p className="text-sm text-gray-500">{creditUser.company || creditUser.email}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Solde actuel</p>
                  <p className="text-3xl font-bold text-primary">42 crédits</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCreditAction('add')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${creditAction === 'add' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Plus size={16} /> Ajouter
                  </button>
                  <button
                    onClick={() => setCreditAction('subtract')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${creditAction === 'subtract' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Minus size={16} /> Retirer
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de crédits</label>
                  <input
                    type="number"
                    min={0}
                    value={creditAmount}
                    onChange={e => setCreditAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motif (optionnel)</label>
                  <input type="text" placeholder="Ex: Bonus fidélité, correction erreur..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                {creditAmount > 0 && (
                  <div className={`rounded-lg p-3 text-sm ${creditAction === 'add' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    Nouveau solde : <span className="font-bold">{creditAction === 'add' ? 42 + creditAmount : Math.max(0, 42 - creditAmount)} crédits</span>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setCreditUser(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
                  <button
                    onClick={() => setCreditUser(null)}
                    disabled={creditAmount === 0}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-40 ${creditAction === 'add' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {creditAction === 'add' ? 'Créditer' : 'Débiter'}
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
