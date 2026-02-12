import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  Users,
  Phone,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Search,
  CreditCard,
  FileSpreadsheet,
  FolderOpen,
  Banknote,
  Headphones,
  DollarSign,
  Package,
  TrendingUp
} from 'lucide-react';
import type { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  userName: string;
}

const menuItems: Record<UserRole, { path: string; label: string; icon: React.ReactNode }[]> = {
  fournisseur: [
    { path: '/fournisseur', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/fournisseur/leads', label: 'Mes Leads', icon: <Upload size={18} /> },
    { path: '/fournisseur/fichiers', label: 'Mes Fichiers', icon: <FolderOpen size={18} /> },
    { path: '/fournisseur/virements', label: 'Virements', icon: <Banknote size={18} /> },
    { path: '/fournisseur/settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ],
  agent: [
    { path: '/agent', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/agent/historique', label: 'Historique Appels', icon: <Phone size={18} /> },
    { path: '/agent/imports', label: 'Imports', icon: <FileSpreadsheet size={18} /> },
    { path: '/agent/settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ],
  acheteur: [
    { path: '/acheteur', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/acheteur/catalogue', label: 'Catalogue', icon: <ShoppingCart size={18} /> },
    { path: '/acheteur/achats', label: 'Mes Achats', icon: <Users size={18} /> },
    { path: '/acheteur/credits', label: 'Crédits', icon: <CreditCard size={18} /> },
    { path: '/acheteur/settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ],
  admin: [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/admin/leads', label: 'Tous les Leads', icon: <Users size={18} /> },
    { path: '/admin/utilisateurs', label: 'Utilisateurs', icon: <Users size={18} /> },
    { path: '/admin/imports', label: 'Imports', icon: <FileSpreadsheet size={18} /> },
    { path: '/admin/audios', label: 'Audios', icon: <Headphones size={18} /> },
    { path: '/admin/paiements', label: 'Paiements', icon: <DollarSign size={18} /> },
    { path: '/admin/credits', label: 'Crédits', icon: <Package size={18} /> },
    { path: '/admin/gains', label: 'Gains Fourn.', icon: <TrendingUp size={18} /> },
    { path: '/admin/settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ],
};

export default function Layout({ children, userRole, userName }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentMenu = menuItems[userRole] || [];

  const notifications = [
    { id: 1, title: 'Nouveau lead qualifié', time: 'Il y a 5 min', unread: true },
    { id: 2, title: '15 leads disponibles', time: 'Il y a 1h', unread: true },
    { id: 3, title: 'Paiement reçu', time: 'Hier', unread: false },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] overflow-x-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transition-transform duration-300 w-[220px]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-5">
          <img src="/logo.png" alt="Leads Provider" className="h-8 w-auto" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSidebarOpen(false);
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors lg:hidden text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-2 px-3">
          <div className="text-[10px] uppercase tracking-wider text-gray-300 font-semibold px-3 mb-2">Menu</div>
          {currentMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all text-[13px] font-medium ${
                  isActive
                    ? 'bg-[#fd7958]/[0.08] text-[#fd7958]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <span className={isActive ? 'text-[#fd7958]' : 'text-gray-400'}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors text-[13px] font-medium"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen transition-all duration-300 lg:ml-[220px]">
        {/* Header */}
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-100/80 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSidebarOpen(prev => !prev);
              }}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative z-50 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={18} className="text-gray-500" />
            </button>
            <div className="relative hidden sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg w-48 lg:w-56 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative"
              >
                <Bell size={18} className="text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#fd7958] rounded-full"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in">
                  <div className="px-4 py-2.5 border-b border-gray-50">
                    <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                  </div>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer ${
                        notif.unread ? 'bg-[#fd7958]/[0.03]' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-700">{notif.title}</p>
                      <p className="text-[11px] text-gray-400">{notif.time}</p>
                    </div>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-50">
                    <button className="text-xs text-[#fd7958] hover:underline font-medium">
                      Voir tout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-7 h-7 bg-[#344a5e] rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-600">{userName}</span>
                <ChevronDown size={14} className="text-gray-300 hidden sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in">
                  <div className="px-4 py-2.5 border-b border-gray-50">
                    <p className="text-sm font-medium text-gray-800">{userName}</p>
                    <p className="text-[11px] text-gray-400 capitalize">{userRole}</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50">
                    Mon profil
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50">
                    Paramètres
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
