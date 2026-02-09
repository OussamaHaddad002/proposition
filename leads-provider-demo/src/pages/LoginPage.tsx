import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Users, Phone, ShoppingCart, Shield } from 'lucide-react';
import type { UserRole } from '../types';
import { useAuth } from '../App';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setRole } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin] = useState(true);
  const [selectedRole] = useState<UserRole | null>(null);

  const roles: { role: UserRole; label: string; description: string; icon: React.ReactNode; color: string }[] = [
    { 
      role: 'fournisseur', 
      label: 'Fournisseur', 
      description: 'Vendez vos leads qualifiés',
      icon: <Users size={24} />,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      role: 'agent', 
      label: 'Agent', 
      description: 'Qualifiez les leads par téléphone',
      icon: <Phone size={24} />,
      color: 'from-green-500 to-green-600'
    },
    { 
      role: 'acheteur', 
      label: 'Acheteur', 
      description: 'Achetez des leads exclusifs',
      icon: <ShoppingCart size={24} />,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      role: 'admin', 
      label: 'Administrateur', 
      description: 'Gérez la plateforme',
      icon: <Shield size={24} />,
      color: 'from-red-500 to-red-600'
    },
  ];

  const handleLogin = (role: UserRole) => {
    setRole(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <div>
          <img src="/logo.png" alt="Leads Provider" className="h-12" />
        </div>
        
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold text-white mb-6">
            Vendez plus grâce à nos <span className="text-accent">Leads qualifiés</span> et 100% exclusifs !
          </h1>
          <p className="text-white/70 text-lg mb-8">
            Plus de 18 ans d'expérience dans la prospection BtoB et BtoC. 
            Nous générons des leads qualifiés et exclusifs, 100% vérifiés par téléphone.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-accent mb-1">15 000+</div>
              <div className="text-white/70 text-sm">Leads générés</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-accent mb-1">98%</div>
              <div className="text-white/70 text-sm">Satisfaction client</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-accent mb-1">78%</div>
              <div className="text-white/70 text-sm">Taux de qualification</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-accent mb-1">24h</div>
              <div className="text-white/70 text-sm">Délai moyen</div>
            </div>
          </div>
        </div>

        <div className="text-white/50 text-sm">
          © 2026 Leads Provider. Tous droits réservés.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/logo.png" alt="Leads Provider" className="h-10" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h2>
            <p className="text-gray-500">
              {isLogin ? 'Accédez à votre espace personnel' : 'Créez votre compte en quelques clics'}
            </p>
          </div>

          {/* Demo: Role Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => handleLogin(r.role)}
                  className={`group relative p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                    selectedRole === r.role 
                      ? 'border-accent bg-accent/5' 
                      : 'border-gray-200 hover:border-accent/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-white mb-2 mx-auto group-hover:scale-110 transition-transform`}>
                    {r.icon}
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{r.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{r.description}</div>
                  <ArrowRight 
                    size={16} 
                    className="absolute top-3 right-3 text-gray-300 group-hover:text-accent group-hover:translate-x-1 transition-all" 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou connectez-vous</span>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin('acheteur'); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="votre@email.fr"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-accent focus:ring-accent" />
                <span className="text-gray-600">Se souvenir de moi</span>
              </label>
              <button type="button" className="text-accent hover:underline">
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 group"
            >
              <span>Se connecter</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="text-accent font-medium hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
