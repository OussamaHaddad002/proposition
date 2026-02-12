import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  X,
  User,
  TrendingUp,
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { getAcheteur } from '../services/api';

interface AcheteurLayoutProps {
  children: React.ReactNode;
}

const profileMenuItems = [
  { path: '/acheteur/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={17} />, description: 'Vue d\'ensemble' },
  { path: '/acheteur/achats', label: 'Mes Achats', icon: <ShoppingCart size={17} />, description: 'Historique & conversions' },
  { path: '/acheteur/credits', label: 'Crédits', icon: <CreditCard size={17} />, description: 'Solde & recharge' },
  { path: '/acheteur/settings', label: 'Paramètres', icon: <Settings size={17} />, description: 'Profil & préférences' },
];

export default function AcheteurLayout({ children }: AcheteurLayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch acheteur data from API
  const { data: mockAcheteur } = useApi(getAcheteur, []);
  const userName = mockAcheteur ? `${mockAcheteur.firstName} ${mockAcheteur.lastName}` : 'Chargement...';

  const notifications = [
    { id: 1, title: 'Nouveau lead qualifié', time: 'Il y a 5 min', unread: true },
    { id: 2, title: '15 leads disponibles', time: 'Il y a 1h', unread: true },
    { id: 3, title: 'Paiement reçu', time: 'Hier', unread: false },
  ];

  // Close notifications on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close profile sidebar on route change
  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Left: Logo + search */}
          <div className="flex items-center gap-4">
            <Link to="/explore" className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 bg-[#fd7958] rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">LP</span>
              </div>
              <span className="text-sm font-bold text-gray-800 tracking-tight hidden sm:inline">
                Leads<span className="text-[#fd7958]">Provider</span>
              </span>
            </Link>

            <div className="relative hidden md:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Rechercher un lead..."
                className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg w-56 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Center: Quick stats */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-xs">
              <CreditCard size={14} className="text-[#fd7958]" />
              <span className="font-semibold text-[#fd7958]">{mockAcheteur?.credits ?? 0}</span>
              <span className="text-gray-400">crédits</span>
            </div>
            <div className="w-px h-4 bg-gray-100" />
            <div className="flex items-center gap-1.5 text-xs">
              <TrendingUp size={14} className="text-emerald-500" />
              <span className="font-semibold text-gray-700">{mockAcheteur?.conversionRate ?? 0}%</span>
              <span className="text-gray-400">conversion</span>
            </div>
          </div>

          {/* Right: Notifications + Avatar */}
          <div className="flex items-center gap-1.5">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative"
              >
                <Bell size={18} className="text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#fd7958] rounded-full" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in z-50">
                  <div className="px-4 py-2.5 border-b border-gray-50">
                    <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                  </div>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-[#fd7958]/[0.03]' : ''}`}
                    >
                      <p className="text-sm font-medium text-gray-700">{notif.title}</p>
                      <p className="text-[11px] text-gray-400">{notif.time}</p>
                    </div>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-50">
                    <button className="text-xs text-[#fd7958] hover:underline font-medium">Voir tout</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar — opens sidebar */}
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-[#344a5e] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-600 max-w-24 truncate">
                {mockAcheteur?.firstName ?? ''}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 w-full">
        {children}
      </main>

      {/* Profile Sidebar Overlay */}
      {profileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50"
          onClick={() => setProfileOpen(false)}
        />
      )}

      {/* Profile Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-[300px] bg-white border-l border-gray-100 shadow-2xl transform transition-transform duration-300 ease-out
          ${profileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Profile Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Mon Espace</h2>
            <button
              onClick={() => setProfileOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#344a5e] rounded-full flex items-center justify-center text-white text-base font-semibold">
              {mockAcheteur?.firstName?.charAt(0)}{mockAcheteur?.lastName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{userName}</p>
              <p className="text-xs text-gray-400">{mockAcheteur?.email ?? ''}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#fd7958]/[0.08] text-[#fd7958]">
                  Acheteur
                </span>
                <span className="text-[10px] text-gray-300">·</span>
                <span className="text-[10px] text-gray-400">Membre depuis Jan 2024</span>
              </div>
            </div>
          </div>

          {/* Quick Stats in sidebar */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2.5 bg-gray-50 rounded-lg">
              <p className="text-base font-bold text-[#fd7958]">{mockAcheteur?.credits ?? 0}</p>
              <p className="text-[10px] text-gray-400">Crédits</p>
            </div>
            <div className="text-center p-2.5 bg-gray-50 rounded-lg">
              <p className="text-base font-bold text-gray-800">{mockAcheteur?.totalLeadsPurchased ?? 0}</p>
              <p className="text-[10px] text-gray-400">Achats</p>
            </div>
            <div className="text-center p-2.5 bg-gray-50 rounded-lg">
              <p className="text-base font-bold text-emerald-600">{mockAcheteur?.conversionRate ?? 0}%</p>
              <p className="text-[10px] text-gray-400">Conversion</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3">
          <div className="text-[10px] uppercase tracking-wider text-gray-300 font-semibold px-3 mb-2">
            Navigation
          </div>
          {profileMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-0.5 transition-all group ${
                  isActive
                    ? 'bg-[#fd7958]/[0.08] text-[#fd7958]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={isActive ? 'text-[#fd7958]' : 'text-gray-400 group-hover:text-gray-500'}>
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isActive ? 'text-[#fd7958]' : 'text-gray-700'}`}>
                    {item.label}
                  </p>
                  <p className="text-[10px] text-gray-400">{item.description}</p>
                </div>
                <ChevronRight size={14} className={isActive ? 'text-[#fd7958]/50' : 'text-gray-200 group-hover:text-gray-300'} />
              </Link>
            );
          })}
        </nav>

        {/* Quick actions */}
        <div className="px-3 mt-2">
          <Link
            to="/explore"
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-gray-600 hover:bg-gray-50 group"
          >
            <User size={17} className="text-gray-400 group-hover:text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Catalogue</p>
              <p className="text-[10px] text-gray-400">Explorer les leads</p>
            </div>
            <ChevronRight size={14} className="text-gray-200 group-hover:text-gray-300" />
          </Link>
        </div>

        {/* Bottom: Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
          <button
            onClick={() => {
              setProfileOpen(false);
              navigate('/');
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={17} />
            Déconnexion
          </button>
        </div>
      </aside>
    </div>
  );
}
