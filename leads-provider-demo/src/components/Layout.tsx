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
  CreditCard
} from 'lucide-react';
import type { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  userName: string;
}

const menuItems: Record<UserRole, { path: string; label: string; icon: React.ReactNode }[]> = {
  fournisseur: [
    { path: '/fournisseur', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/fournisseur/leads', label: 'Mes Leads', icon: <Upload size={20} /> },
    { path: '/fournisseur/settings', label: 'Paramètres', icon: <Settings size={20} /> },
  ],
  agent: [
    { path: '/agent', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/agent/historique', label: 'Historique Appels', icon: <Phone size={20} /> },
    { path: '/agent/settings', label: 'Paramètres', icon: <Settings size={20} /> },
  ],
  acheteur: [
    { path: '/acheteur', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/acheteur/catalogue', label: 'Catalogue', icon: <ShoppingCart size={20} /> },
    { path: '/acheteur/achats', label: 'Mes Achats', icon: <Users size={20} /> },
    { path: '/acheteur/credits', label: 'Crédits', icon: <CreditCard size={20} /> },
    { path: '/acheteur/settings', label: 'Paramètres', icon: <Settings size={20} /> },
  ],
  admin: [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/leads', label: 'Tous les Leads', icon: <Users size={20} /> },
    { path: '/admin/utilisateurs', label: 'Utilisateurs', icon: <Users size={20} /> },
    { path: '/admin/settings', label: 'Paramètres', icon: <Settings size={20} /> },
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-primary text-white transition-transform duration-300 w-64
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-primary-light">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Leads Provider" className="h-10 w-auto" />
            
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSidebarOpen(false);
            }}
            className="p-1 hover:bg-primary-light rounded-lg transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {currentMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-lg'
                    : 'text-gray-300 hover:bg-primary-light hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-light">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-primary-light hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen transition-all duration-300 lg:ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Hamburger clicked, current state:', sidebarOpen);
                setSidebarOpen(prev => !prev);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative z-50 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <div className="relative hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                        notif.unread ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-accent hover:underline">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-medium text-gray-700">{userName}</span>
                <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                    Mon profil
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                    Paramètres
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
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
