import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Users, Phone, ShoppingCart, Shield } from 'lucide-react';
import type { UserRole } from '../../types';
import { useAuth } from '../../App';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setRole } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null);

  const roles: { role: UserRole; label: string; description: string; icon: React.ReactNode; accent: string; bg: string }[] = [
    { 
      role: 'fournisseur', 
      label: 'Fournisseur', 
      description: 'Vendez vos leads',
      icon: <Users size={20} />,
      accent: 'text-blue-600',
      bg: 'bg-blue-50 group-hover:bg-blue-100',
    },
    { 
      role: 'agent', 
      label: 'Agent', 
      description: 'Qualifiez par téléphone',
      icon: <Phone size={20} />,
      accent: 'text-emerald-600',
      bg: 'bg-emerald-50 group-hover:bg-emerald-100',
    },
    { 
      role: 'acheteur', 
      label: 'Acheteur', 
      description: 'Achetez des leads exclusifs',
      icon: <ShoppingCart size={20} />,
      accent: 'text-violet-600',
      bg: 'bg-violet-50 group-hover:bg-violet-100',
    },
    { 
      role: 'admin', 
      label: 'Admin', 
      description: 'Gérez la plateforme',
      icon: <Shield size={20} />,
      accent: 'text-rose-600',
      bg: 'bg-rose-50 group-hover:bg-rose-100',
    },
  ];

  const handleLogin = (role: UserRole) => {
    setRole(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
      {/* Full-screen centered layout */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[920px] flex flex-col lg:flex-row bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Left — Branding panel */}
          <div className="lg:w-[380px] bg-gradient-to-br from-[#344a5e] to-[#2a3d4e] p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <div className="relative z-10">
              <img src="/logo.png" alt="Leads Provider" className="h-9 mb-10" />
              <h1 className="text-2xl lg:text-[1.65rem] font-bold text-white leading-snug mb-4">
                Des leads qualifiés,<br />
                <span className="text-[#fd7958]">100% exclusifs.</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed">
                +18 ans d'expérience en prospection BtoB & BtoC. Chaque lead est vérifié par téléphone.
              </p>
            </div>

            <div className="relative z-10 mt-10 grid grid-cols-2 gap-3">
              {[
                { value: '15k+', label: 'Leads générés' },
                { value: '98%', label: 'Satisfaction' },
                { value: '78%', label: 'Qualification' },
                { value: '<24h', label: 'Délai moyen' },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-3 px-2 rounded-xl bg-white/[0.07]">
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-[11px] text-white/50 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Login panel */}
          <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Bienvenue</h2>
                <p className="text-sm text-gray-400">Choisissez votre espace ou connectez-vous</p>
              </div>

              {/* Role selection — primary action */}
              <div className="space-y-2.5 mb-8">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleLogin(r.role)}
                    onMouseEnter={() => setHoveredRole(r.role)}
                    onMouseLeave={() => setHoveredRole(null)}
                    className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-white hover:shadow-sm transition-all duration-200 text-left"
                  >
                    <div className={`w-9 h-9 rounded-lg ${r.bg} ${r.accent} flex items-center justify-center shrink-0 transition-colors duration-200`}>
                      {r.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800">{r.label}</div>
                      <div className="text-xs text-gray-400">{r.description}</div>
                    </div>
                    <ArrowRight 
                      size={16} 
                      className={`shrink-0 transition-all duration-200 ${
                        hoveredRole === r.role 
                          ? 'text-gray-500 translate-x-0.5' 
                          : 'text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-[11px] uppercase tracking-wider text-gray-300 font-medium">
                    ou par email
                  </span>
                </div>
              </div>

              {/* Compact login form */}
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleLogin('acheteur'); }}>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="email"
                    placeholder="votre@email.fr"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/40 focus:bg-white transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mot de passe"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/40 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors flex items-center justify-center gap-2 group"
                >
                  Se connecter
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>

              {/* Footer links */}
              <div className="flex items-center justify-between mt-5 text-xs text-gray-400">
                <Link to="/inscription" className="hover:text-[#fd7958] transition-colors">
                  Créer un compte
                </Link>
                <Link to="/forgot-password" className="hover:text-[#fd7958] transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-center py-4 text-[11px] text-gray-300">
        <Link to="/" className="hover:text-[#fd7958] transition-colors">← Retour à l'accueil</Link>
        <span className="mx-2">·</span>
        © 2026 Leads Provider
      </div>
    </div>
  );
}
