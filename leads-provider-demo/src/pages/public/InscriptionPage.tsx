import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, User, Phone, Building2,
  ShoppingCart, Users, Shield, CheckCircle2, MapPin, Briefcase, Globe, Check
} from 'lucide-react';
import type { UserRole } from '../../types';

// Steps: 1=Role, 2=Infos, 3=Entreprise, 4=Préférences (acheteur), 5=Vérification email, 6=Terminé
type Step = 1 | 2 | 3 | 4 | 5 | 6;

const sectors = [
  'Technologie', 'Finance', 'Santé', 'Immobilier', 'Énergie',
  'Commerce', 'Industrie', 'Transport', 'Éducation', 'Services'
];

const regions = [
  'Île-de-France', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur',
  'Occitanie', 'Nouvelle-Aquitaine', 'Grand Est', 'Hauts-de-France',
  'Bretagne', 'Normandie', 'Pays de la Loire'
];

export default function InscriptionPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form state
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    siret: '',
    website: '',
    city: '',
    region: '',
    sectors: [] as string[],
    regions: [] as string[],
    budget: '',
    volume: '',
    acceptTerms: false,
    acceptNewsletter: false,
  });
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles: { role: UserRole; label: string; description: string; icon: React.ReactNode; color: string; features: string[] }[] = [
    {
      role: 'fournisseur',
      label: 'Fournisseur',
      description: 'Vendez vos leads qualifiés et gagnez de l\'argent',
      icon: <Users size={28} />,
      color: 'from-blue-500 to-blue-600',
      features: ['Upload de fichiers CSV', 'Suivi des ventes en temps réel', 'Paiements automatiques']
    },
    {
      role: 'acheteur',
      label: 'Acheteur',
      description: 'Achetez des leads exclusifs et vérifiés',
      icon: <ShoppingCart size={28} />,
      color: 'from-purple-500 to-purple-600',
      features: ['Catalogue de leads qualifiés', 'Filtres avancés & matching IA', 'Crédits flexibles']
    },
    {
      role: 'agent',
      label: 'Agent',
      description: 'Qualifiez les leads par téléphone',
      icon: <Phone size={28} />,
      color: 'from-green-500 to-green-600',
      features: ['Interface d\'appel intégrée', 'Enregistrement automatique', 'Tableau de performance']
    },
  ];

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleSector = (sector: string) => {
    setForm(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }));
  };

  const toggleRegion = (region: string) => {
    setForm(prev => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region]
    }));
  };

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1 && !selectedRole) {
      return false;
    }

    if (currentStep === 2) {
      if (!form.firstName.trim()) newErrors.firstName = 'Prénom requis';
      if (!form.lastName.trim()) newErrors.lastName = 'Nom requis';
      if (!form.email.trim()) newErrors.email = 'Email requis';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email invalide';
      if (!form.phone.trim()) newErrors.phone = 'Téléphone requis';
      if (!form.password) newErrors.password = 'Mot de passe requis';
      else if (form.password.length < 8) newErrors.password = 'Minimum 8 caractères';
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (currentStep === 3) {
      if (!form.company.trim()) newErrors.company = 'Entreprise requise';
      if (!form.city.trim()) newErrors.city = 'Ville requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      // Skip step 4 (preferences) for non-acheteur roles
      if (step === 3 && selectedRole !== 'acheteur') {
        setStep(5);
      } else {
        setStep((step + 1) as Step);
      }
    }
  };

  const prevStep = () => {
    if (step === 5 && selectedRole !== 'acheteur') {
      setStep(3);
    } else {
      setStep((step - 1) as Step);
    }
  };

  const handleVerificationInput = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerifyAndFinish = () => {
    setStep(6);
  };

  const handleGoToDashboard = () => {
    if (selectedRole) {
      // Redirect to catalogue with interactive tour for first-time users
      navigate('/catalogue?tour=true');
    }
  };

  const totalSteps = selectedRole === 'acheteur' ? 5 : 4;
  const displayStep = step === 6 ? totalSteps : (step > 4 && selectedRole !== 'acheteur') ? step - 1 : step;

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(form.password);
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-500'];
  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12">
        <div>
          <Link to="/">
            <img src="/logo.png" alt="Leads Provider" className="h-12" />
          </Link>
        </div>

        <div className="max-w-lg">
          <h1 className="text-4xl font-bold text-white mb-6">
            Rejoignez la plateforme <span className="text-accent">#1</span> de leads qualifiés
          </h1>
          <p className="text-white/70 text-lg mb-8">
            Créez votre compte en quelques minutes et accédez immédiatement à notre marketplace de leads vérifiés.
          </p>

          {/* Progress indicators */}
          {step > 1 && step < 6 && (
            <div className="space-y-3">
              {['Choix du profil', 'Informations personnelles', 'Entreprise', ...(selectedRole === 'acheteur' ? ['Préférences'] : []), 'Vérification'].map((label, i) => {
                const stepNum = i + 1;
                const isCompleted = displayStep > stepNum;
                const isCurrent = displayStep === stepNum;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-accent text-white' :
                      'bg-white/20 text-white/60'
                    }`}>
                      {isCompleted ? <Check size={16} /> : stepNum}
                    </div>
                    <span className={`text-sm font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-green-300' : 'text-white/50'}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-white/50 text-sm">
          © 2026 Leads Provider. Tous droits réservés.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 lg:p-12">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 animate-fade-in">

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link to="/"><img src="/logo.png" alt="Leads Provider" className="h-10" /></Link>
          </div>

          {/* ===================== STEP 1: Role Selection ===================== */}
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Créez votre compte</h2>
                <p className="text-gray-500">Choisissez votre profil pour commencer</p>
              </div>

              <div className="space-y-4">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => setSelectedRole(r.role)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                      selectedRole === r.role
                        ? 'border-accent bg-accent/5 shadow-md'
                        : 'border-gray-200 hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white shrink-0`}>
                        {r.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900">{r.label}</h3>
                          {selectedRole === r.role && (
                            <CheckCircle2 size={20} className="text-accent" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{r.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {r.features.map((f) => (
                            <span key={f} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              <Check size={10} className="text-green-500" /> {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={nextStep}
                disabled={!selectedRole}
                className="w-full mt-8 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continuer</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* ===================== STEP 2: Personal Info ===================== */}
          {step === 2 && (
            <div>
              <div className="mb-8">
                <button onClick={prevStep} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 mb-4 text-sm">
                  <ArrowLeft size={16} /> Retour
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations personnelles</h2>
                <p className="text-gray-500">Renseignez vos coordonnées</p>
              </div>

              <div className="space-y-4">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        placeholder="Jean"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="Dupont"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      />
                    </div>
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="jean.dupont@entreprise.fr"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="06 12 34 56 78"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Minimum 8 caractères"
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">Force : {strengthLabels[Math.max(0, passwordStrength - 1)]}</p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Répétez le mot de passe"
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Les mots de passe correspondent</p>
                  )}
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full mt-8 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 group"
              >
                <span>Continuer</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* ===================== STEP 3: Company Info ===================== */}
          {step === 3 && (
            <div>
              <div className="mb-8">
                <button onClick={prevStep} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 mb-4 text-sm">
                  <ArrowLeft size={16} /> Retour
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre entreprise</h2>
                <p className="text-gray-500">Informations sur votre structure</p>
              </div>

              <div className="space-y-4">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise *</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder="Ma Société SAS"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${errors.company ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                </div>

                {/* SIRET */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={form.siret}
                      onChange={(e) => handleChange('siret', e.target.value)}
                      placeholder="123 456 789 00012"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Optionnel – permet la vérification automatique</p>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="https://www.monsite.fr"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* City & Region */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Paris"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      />
                    </div>
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
                    <select
                      value={form.region}
                      onChange={(e) => handleChange('region', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    >
                      <option value="">Sélectionner</option>
                      {regions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Terms */}
                <div className="pt-2 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.acceptTerms}
                      onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-gray-600">
                      J'accepte les <button className="text-accent hover:underline">Conditions Générales d'Utilisation</button> et la <button className="text-accent hover:underline">Politique de Confidentialité</button> *
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.acceptNewsletter}
                      onChange={(e) => handleChange('acceptNewsletter', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-gray-600">
                      Je souhaite recevoir des offres et actualités par email
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={nextStep}
                disabled={!form.acceptTerms}
                className="w-full mt-8 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{selectedRole === 'acheteur' ? 'Continuer' : 'Vérifier mon email'}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* ===================== STEP 4: Preferences (Acheteur only) ===================== */}
          {step === 4 && selectedRole === 'acheteur' && (
            <div>
              <div className="mb-8">
                <button onClick={prevStep} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 mb-4 text-sm">
                  <ArrowLeft size={16} /> Retour
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos préférences</h2>
                <p className="text-gray-500">Personnalisez votre expérience pour un matching IA optimal</p>
              </div>

              <div className="space-y-6">
                {/* Sectors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Secteurs d'intérêt <span className="text-gray-400">(sélectionnez un ou plusieurs)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map((sector) => (
                      <button
                        key={sector}
                        onClick={() => toggleSector(sector)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          form.sectors.includes(sector)
                            ? 'bg-accent text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {form.sectors.includes(sector) && <Check size={12} className="inline mr-1" />}
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Regions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Régions ciblées <span className="text-gray-400">(sélectionnez un ou plusieurs)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => toggleRegion(region)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          form.regions.includes(region)
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {form.regions.includes(region) && <Check size={12} className="inline mr-1" />}
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget & Volume */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget mensuel estimé</label>
                    <select
                      value={form.budget}
                      onChange={(e) => handleChange('budget', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    >
                      <option value="">Sélectionner</option>
                      <option value="<500">Moins de 500€</option>
                      <option value="500-1000">500€ - 1 000€</option>
                      <option value="1000-3000">1 000€ - 3 000€</option>
                      <option value="3000-5000">3 000€ - 5 000€</option>
                      <option value=">5000">Plus de 5 000€</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Volume de leads / mois</label>
                    <select
                      value={form.volume}
                      onChange={(e) => handleChange('volume', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    >
                      <option value="">Sélectionner</option>
                      <option value="<20">Moins de 20</option>
                      <option value="20-50">20 - 50</option>
                      <option value="50-100">50 - 100</option>
                      <option value="100-500">100 - 500</option>
                      <option value=">500">Plus de 500</option>
                    </select>
                  </div>
                </div>

                {/* Matching preview card */}
                {form.sectors.length > 0 && (
                  <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-xl p-4 border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                      <span className="font-medium text-gray-900 text-sm">Matching IA configuré</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Notre algorithme vous recommandera des leads correspondant à vos critères :
                      {' '}<span className="font-medium text-accent">{form.sectors.length} secteur(s)</span>
                      {form.regions.length > 0 && <> · <span className="font-medium text-primary">{form.regions.length} région(s)</span></>}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={nextStep}
                className="w-full mt-8 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 group"
              >
                <span>Vérifier mon email</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* ===================== STEP 5: Email Verification ===================== */}
          {step === 5 && (
            <div>
              <div className="mb-8">
                <button onClick={prevStep} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 mb-4 text-sm">
                  <ArrowLeft size={16} /> Retour
                </button>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={32} className="text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérifiez votre email</h2>
                  <p className="text-gray-500">
                    Un code de vérification a été envoyé à
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">{form.email || 'votre@email.fr'}</p>
                </div>
              </div>

              {/* 6-digit code input */}
              <div className="flex justify-center gap-3 mb-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleVerificationInput(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        const prevInput = document.getElementById(`code-${index - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                ))}
              </div>

              <p className="text-center text-sm text-gray-400 mb-6">
                Le code expire dans <span className="font-medium text-gray-600">4:59</span>
              </p>

              <button
                onClick={handleVerifyAndFinish}
                className="w-full py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 group"
              >
                <span>Vérifier et créer mon compte</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center mt-4">
                <button className="text-sm text-accent hover:underline">
                  Renvoyer le code
                </button>
                <span className="text-gray-300 mx-2">·</span>
                <button className="text-sm text-gray-500 hover:underline">
                  Changer d'adresse email
                </button>
              </div>
            </div>
          )}

          {/* ===================== STEP 6: Success ===================== */}
          {step === 6 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Bienvenue chez Leads Provider ! 🎉
              </h2>
              <p className="text-gray-500 mb-2">
                Votre compte <span className="font-semibold text-accent capitalize">{selectedRole}</span> a été créé avec succès.
              </p>
              <p className="text-gray-400 text-sm mb-8">
                {selectedRole === 'acheteur' && 'Vous recevez 10 crédits offerts pour explorer le catalogue.'}
                {selectedRole === 'fournisseur' && 'Vous pouvez dès maintenant uploader vos premiers leads.'}
                {selectedRole === 'agent' && 'Votre accès à l\'interface de qualification est prêt.'}
              </p>

              {/* Welcome perks */}
              <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">Ce qui vous attend :</h3>
                <div className="space-y-3">
                  {selectedRole === 'acheteur' && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center"><ShoppingCart size={16} className="text-accent" /></div>
                        <div><p className="text-sm font-medium text-gray-900">Catalogue de +500 leads qualifiés</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><Shield size={16} className="text-purple-600" /></div>
                        <div><p className="text-sm font-medium text-gray-900">IA de matching pour des leads pertinents</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle2 size={16} className="text-green-600" /></div>
                        <div><p className="text-sm font-medium text-gray-900">10 crédits offerts pour commencer</p></div>
                      </div>
                    </>
                  )}
                  {selectedRole === 'fournisseur' && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Users size={16} className="text-blue-600" /></div>
                        <div><p className="text-sm font-medium text-gray-900">Upload CSV de vos leads en un clic</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center"><ShoppingCart size={16} className="text-accent" /></div>
                        <div><p className="text-sm font-medium text-gray-900">Suivi des ventes en temps réel</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle2 size={16} className="text-green-600" /></div>
                        <div><p className="text-sm font-medium text-gray-900">Paiements automatiques et sécurisés</p></div>
                      </div>
                    </>
                  )}
                  {selectedRole === 'agent' && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Phone size={16} className="text-green-600" /></div>
                        <div><p className="text-sm font-medium text-gray-900">Interface d'appel intégrée avec CTI</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center"><ShoppingCart size={16} className="text-accent" /></div>
                        <div><p className="text-sm font-medium text-gray-900">Enregistrement automatique des appels</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><Shield size={16} className="text-purple-600" /></div>
                        <div><p className="text-sm font-medium text-gray-900">Tableau de performance en temps réel</p></div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handleGoToDashboard}
                className="w-full py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 group"
              >
                <span>Accéder à mon espace</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Footer - Back to login */}
          {step < 6 && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Déjà un compte ?{' '}
              <Link to="/" className="text-accent font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
