import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Users,
  Phone,
  ShoppingCart,
  Star,
  Shield,
  TrendingUp,
  Zap,
  Target,
  ChevronRight,
  BarChart3,
  Globe,
  Award,
  MapPin,
  Upload,
} from 'lucide-react';

const services = [
  { id: 1, name: 'Technologie', leads: 320, icon: Globe, color: 'bg-blue-50 text-blue-500' },
  { id: 2, name: 'Finance', leads: 275, icon: BarChart3, color: 'bg-emerald-50 text-emerald-500' },
  { id: 3, name: 'Énergie', leads: 190, icon: Zap, color: 'bg-amber-50 text-amber-500' },
  { id: 4, name: 'Santé', leads: 230, icon: Shield, color: 'bg-rose-50 text-rose-500' },
  { id: 5, name: 'Commerce', leads: 185, icon: ShoppingCart, color: 'bg-violet-50 text-violet-500' },
  { id: 6, name: 'Immobilier', leads: 210, icon: Target, color: 'bg-cyan-50 text-cyan-500' },
];

const allServices = [
  'Technologie', 'Finance', 'Énergie', 'Santé', 'Commerce', 'Immobilier',
  'Éducation', 'Automobile', 'Industrie', 'Services', 'Assurance', 'Tourisme',
  'Transport & Logistique', 'Agroalimentaire', 'Télécommunications',
  'Ressources Humaines', 'Marketing Digital', 'Conseil & Consulting',
  'BTP & Construction', 'Mode & Textile',
];

const steps = [
  {
    step: '01',
    title: 'Trouvez vos leads',
    description: 'Explorez notre catalogue de leads qualifiés par secteur, région et score.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Qualification IA',
    description: 'Chaque lead est vérifié et noté par notre algorithme de scoring intelligent.',
    icon: Target,
  },
  {
    step: '03',
    title: 'Achetez & Convertissez',
    description: 'Achetez uniquement les leads pertinents et développez votre activité.',
    icon: TrendingUp,
  },
];

const stats = [
  { value: '12K+', label: 'Leads qualifiés' },
  { value: '3.2K', label: 'Entreprises actives' },
  { value: '87%', label: 'Taux de satisfaction' },
  { value: '45%', label: 'Taux de conversion' },
];

const testimonials = [
  {
    name: 'Marie Dupont',
    role: 'Directrice commerciale',
    company: 'Tech Solutions',
    text: 'Leads Provider a transformé notre prospection. La qualité des leads est exceptionnelle et le scoring IA nous fait gagner un temps précieux.',
    rating: 5,
  },
  {
    name: 'Pierre Martin',
    role: 'CEO',
    company: 'Green Energy',
    text: 'Un ROI imbattable. Nous avons doublé nos conversions en 3 mois grâce à la qualité des leads fournis.',
    rating: 5,
  },
  {
    name: 'Sophie Bernard',
    role: 'Responsable acquisition',
    company: 'Finance Pro',
    text: 'Le scoring IA est bluffant. On ne perd plus de temps sur des leads non qualifiés. Notre équipe est ravie.',
    rating: 5,
  },
  {
    name: 'Laurent Chevalier',
    role: 'Directeur général',
    company: 'Immo Conseil',
    text: 'En tant que fournisseur, la plateforme m\'a permis de monétiser mes leads efficacement. Les paiements sont rapides et transparents.',
    rating: 5,
  },
  {
    name: 'Camille Roux',
    role: 'Responsable marketing',
    company: 'SolarTech',
    text: 'L\'interface est intuitive et le catalogue de leads est très complet. Nous avons trouvé exactement les prospects que nous cherchions.',
    rating: 5,
  },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ─── Testimonials Carousel ────────────────────────────────
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setScrollPos((prev) => prev + 1);
    }, 30);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleCarouselReset = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    // When we've scrolled past half (the duplicated set), reset seamlessly
    const halfWidth = el.scrollWidth / 2;
    if (scrollPos >= halfWidth) {
      setScrollPos(0);
    }
  }, [scrollPos]);

  const suggestions = searchTerm.length > 0
    ? allServices.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleSelectSuggestion = (name: string) => {
    setSearchTerm(name);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (locationTerm) params.set('location', locationTerm);
    navigate(`/explore${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#fd7958] flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-sm tracking-tight">Leads Provider</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium">
              Services
            </a>
            <a href="#how-it-works" className="text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium">
              Comment ça marche
            </a>
            <a href="#testimonials" className="text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium">
              Témoignages
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="px-4 py-1.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors"
            >
              Rejoindre
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #344a5e 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 relative">
          <div className="max-w-2xl mx-auto text-center">            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
              Des leads qualifiés
              <br />
              <span className="text-[#fd7958]">qui convertissent</span>
            </h1>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-6">
              <div className="flex items-stretch bg-white border border-gray-100 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-[#fd7958]/20 focus-within:border-[#fd7958]/30 transition-all">
                {/* Service search */}
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Service, secteur..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => { if (searchTerm.length > 0) setShowSuggestions(true); }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    className="w-full pl-10 pr-3 py-3 bg-transparent text-sm placeholder:text-gray-300 focus:outline-none rounded-l-xl"
                  />
                  {/* Suggestions dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-100 shadow-lg z-50 py-1 max-h-48 overflow-y-auto">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onMouseDown={() => handleSelectSuggestion(s)}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-600 hover:bg-[#fd7958]/[0.05] hover:text-[#fd7958] transition-colors"
                        >
                          <Search size={13} className="text-gray-300 shrink-0" />
                          <span>{s}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-100 my-2.5" />

                {/* Location filter */}
                <div className="relative flex-1">
                  <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Ville, département, code postal..."
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-transparent text-sm placeholder:text-gray-300 focus:outline-none"
                  />
                </div>

                {/* Search button */}
                <button
                  onClick={handleSearch}
                  className="px-5 py-2 m-1.5 bg-[#fd7958] text-white rounded-lg text-xs font-medium hover:bg-[#e86847] transition-colors shrink-0"
                >
                  Explorer
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> Leads vérifiés</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> Scoring IA</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> Exclusivité garantie</span>
            </div>
          </div>
        </div>

        {/* Testimonials sliding strip */}
        <div
          id="testimonials"
          className="relative overflow-hidden pb-10 -mx-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#f8f9fb] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f8f9fb] to-transparent z-10 pointer-events-none" />

          <div
            ref={(el) => { scrollRef.current = el; handleCarouselReset(el); }}
            className="flex gap-4 px-6"
            style={{ transform: `translateX(-${scrollPos}px)`, willChange: 'transform' }}
          >
            {/* Duplicate testimonials for seamless loop */}
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div
                key={`${t.name}-${idx}`}
                className="flex-shrink-0 w-[320px] bg-white rounded-xl p-5 border border-gray-100/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5 mb-2.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-4 line-clamp-3">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#344a5e]/[0.06] flex items-center justify-center text-[10px] font-bold text-[#344a5e]">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{t.name}</p>
                    <p className="text-[10px] text-gray-400">{t.role} — {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fournisseur CTA Banner */}
      <section className="bg-[#344a5e]">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Upload size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Vous générez des leads ?</p>
                <p className="text-white/60 text-xs">Vendez vos leads qualifiés à des milliers d'acheteurs vérifiés.</p>
              </div>
            </div>
            <Link
              to="/inscription?role=fournisseur"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#344a5e] rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shrink-0"
            >
              Devenir fournisseur
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-100/80 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services / Sectors */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Explorez par secteur</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Des leads qualifiés dans plus de 20 secteurs d'activité
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredServices.map((service) => (
            <Link
              key={service.id}
              to={`/explore?sector=${encodeURIComponent(service.name)}`}
              className="group bg-white rounded-xl p-5 border border-gray-100/80 hover:border-gray-200 transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${service.color} flex items-center justify-center`}>
                  <service.icon size={18} />
                </div>
                <ArrowRight size={14} className="text-gray-200 group-hover:text-gray-400 mt-1 transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">{service.name}</h3>
              <p className="text-xs text-gray-400">{service.leads} leads disponibles</p>
            </Link>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">Aucun secteur trouvé pour "{searchTerm}"</p>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white border-y border-gray-100/80">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Comment ça marche</h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Un processus simple et transparent en 3 étapes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-[#f8f9fb] rounded-xl p-6 border border-gray-100/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#fd7958]/[0.08] flex items-center justify-center">
                      <item.icon size={18} className="text-[#fd7958]" />
                    </div>
                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Étape {item.step}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles / Who It's For */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pour qui ?</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Notre plateforme s'adapte à tous les acteurs du marché
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Users,
              title: 'Fournisseurs',
              description: 'Vendez vos leads à un réseau qualifié d\'acheteurs. Maximisez la valeur de vos contacts.',
              color: 'bg-blue-50 text-blue-500',
              link: '/inscription',
            },
            {
              icon: Phone,
              title: 'Agents',
              description: 'Qualifiez les leads par téléphone et gagnez des commissions sur chaque appel.',
              color: 'bg-emerald-50 text-emerald-500',
              link: '/inscription',
            },
            {
              icon: ShoppingCart,
              title: 'Acheteurs',
              description: 'Accédez à des leads exclusifs, vérifiés et scorés par IA pour booster vos ventes.',
              color: 'bg-violet-50 text-violet-500',
              link: '/inscription',
            },
          ].map((role) => (
            <Link
              key={role.title}
              to={role.link}
              className="group bg-white rounded-xl p-6 border border-gray-100/80 hover:border-gray-200 transition-all hover:shadow-sm"
            >
              <div className={`w-11 h-11 rounded-xl ${role.color} flex items-center justify-center mb-4`}>
                <role.icon size={20} />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                {role.title}
                <ChevronRight size={13} className="inline ml-1 text-gray-300 group-hover:text-[#fd7958] transition-colors" />
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">{role.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100/80 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#fd7958]/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#344a5e]/[0.03] rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-[#fd7958]/[0.08] flex items-center justify-center mx-auto mb-5">
              <Award size={22} className="text-[#fd7958]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prêt à booster vos ventes ?</h2>
            <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
              Rejoignez des milliers de professionnels qui utilisent Leads Provider pour développer leur activité.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/inscription"
                className="px-6 py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors"
              >
                Créer un compte gratuit
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100/80 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#fd7958] flex items-center justify-center">
                <Zap size={11} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-600">Leads Provider</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#services" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Services</a>
              <a href="#how-it-works" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Fonctionnement</a>
              <a href="#testimonials" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Témoignages</a>
              <Link to="/login" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Connexion</Link>
            </div>
            <p className="text-[10px] text-gray-300">© 2026 Leads Provider. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
