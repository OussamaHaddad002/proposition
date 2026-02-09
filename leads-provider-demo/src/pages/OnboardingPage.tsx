import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Check, Upload, Phone, ShoppingCart, TrendingUp,
  Target, Filter, CreditCard, Users, FileSpreadsheet, Headphones, Star,
  PlayCircle, Bell, Settings, Sparkles
} from 'lucide-react';
import { useAuth } from '../App';
import type { UserRole } from '../types';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactElement;
  features?: { icon: React.ReactElement; text: string; }[];
  image?: string;
  tips?: string[];
}

const onboardingSteps: Record<UserRole, OnboardingStep[]> = {
  fournisseur: [
    {
      title: 'Bienvenue, Fournisseur ! 👋',
      description: 'Commençons par une visite rapide de votre espace pour maximiser vos ventes de leads.',
      icon: <Users size={48} className="text-blue-500" />,
      features: [
        { icon: <Upload size={20} />, text: 'Uploadez vos fichiers CSV en quelques clics' },
        { icon: <TrendingUp size={20} />, text: 'Suivez vos revenus en temps réel' },
        { icon: <FileSpreadsheet size={20} />, text: 'Gérez tous vos leads depuis un seul endroit' },
      ],
    },
    {
      title: 'Comment uploader vos leads',
      description: 'Préparez un fichier CSV avec : prénom, nom, email, téléphone, entreprise, secteur. Notre système validera automatiquement chaque lead.',
      icon: <Upload size={48} className="text-blue-500" />,
      image: '/placeholder-upload.png',
      tips: [
        'Formats acceptés : CSV, XLSX',
        'Maximum 1000 leads par fichier',
        'Les doublons sont automatiquement détectés',
      ],
    },
    {
      title: 'Qualification & Vente',
      description: 'Nos agents qualifient vos leads par téléphone. Une fois qualifiés, ils sont mis en vente automatiquement sur le catalogue.',
      icon: <Phone size={48} className="text-green-500" />,
      features: [
        { icon: <Headphones size={20} />, text: 'Appels enregistrés pour transparence' },
        { icon: <Star size={20} />, text: 'Score IA calculé automatiquement' },
        { icon: <TrendingUp size={20} />, text: 'Paiement automatique à la vente' },
      ],
    },
    {
      title: 'Suivez vos performances',
      description: 'Tableau de bord complet avec statistiques en temps réel, historique des ventes, et projections de revenus.',
      icon: <TrendingUp size={48} className="text-accent" />,
      features: [
        { icon: <Target size={20} />, text: 'Taux de qualification par secteur' },
        { icon: <CreditCard size={20} />, text: 'Revenus et paiements automatisés' },
        { icon: <Bell size={20} />, text: 'Notifications instantanées' },
      ],
    },
  ],
  acheteur: [
    {
      title: 'Bienvenue, Acheteur ! ',
      description: 'Découvrez comment trouver et acheter les meilleurs leads pour votre business.',
      icon: <ShoppingCart size={48} className="text-purple-500" />,
      features: [
        { icon: <Target size={20} />, text: 'Catalogue de leads vérifiés et qualifiés' },
        { icon: <Sparkles size={20} />, text: 'Matching IA basé sur vos préférences' },
        { icon: <Headphones size={20} />, text: 'Enregistrements audio disponibles' },
      ],
    },
    {
      title: 'Le catalogue intelligent',
      description: 'Filtrez par secteur, région, score. Notre IA vous recommande les leads les plus pertinents selon vos critères.',
      icon: <Filter size={48} className="text-purple-500" />,
      image: '/placeholder-catalogue.png',
      tips: [
        'Consultez le score IA (0-100) de chaque lead',
        'Écoutez l\'enregistrement de qualification',
        'Filtres avancés : budget, volume, timing',
      ],
    },
    {
      title: 'Système de crédits',
      description: 'Achetez des packs de crédits flexibles. 1 crédit = 1 lead. Plus vous achetez, plus vous économisez !',
      icon: <CreditCard size={48} className="text-accent" />,
      features: [
        { icon: <Star size={20} />, text: '10 crédits offerts à l\'inscription' },
        { icon: <CreditCard size={20} />, text: 'Packs de 50 à 1500 crédits' },
        { icon: <Check size={20} />, text: 'Paiement sécurisé par carte bancaire' },
      ],
    },
    {
      title: 'Suivez vos conversions',
      description: 'Marquez vos leads comme "Converti", "En cours" ou "Perdu" pour optimiser votre stratégie.',
      icon: <TrendingUp size={48} className="text-green-500" />,
      features: [
        { icon: <Target size={20} />, text: 'Taux de conversion par secteur' },
        { icon: <TrendingUp size={20} />, text: 'ROI calculé automatiquement' },
        { icon: <Bell size={20} />, text: 'Recommandations IA personnalisées' },
      ],
    },
  ],
  agent: [
    {
      title: 'Bienvenue, Agent ! ',
      description: 'Votre rôle est crucial : qualifier les leads par téléphone pour garantir leur qualité.',
      icon: <Phone size={48} className="text-green-500" />,
      features: [
        { icon: <Phone size={20} />, text: 'Interface d\'appel intégrée avec CTI' },
        { icon: <Headphones size={20} />, text: 'Enregistrement automatique' },
        { icon: <TrendingUp size={20} />, text: 'Tableau de performance en temps réel' },
      ],
    },
    {
      title: 'Processus de qualification',
      description: 'Appelez le prospect, vérifiez son intérêt, posez les questions clés. L\'appel est enregistré automatiquement.',
      icon: <Headphones size={48} className="text-green-500" />,
      image: '/placeholder-call.png',
      tips: [
        'Script de qualification affiché en temps réel',
        'Notes et commentaires sauvegardés automatiquement',
        'Enregistrement audio attaché au lead',
      ],
    },
    {
      title: 'Marquez le résultat',
      description: 'Qualifiez le lead selon la conversation : Qualifié ✓, Non qualifié ✗, ou À rappeler 🔄',
      icon: <Check size={48} className="text-blue-500" />,
      features: [
        { icon: <Check size={20} />, text: 'Qualifié → Mis en vente automatiquement' },
        { icon: <Phone size={20} />, text: 'À rappeler → Programmé dans votre liste' },
        { icon: <Star size={20} />, text: 'Score IA ajusté selon vos feedbacks' },
      ],
    },
    {
      title: 'Votre performance',
      description: 'Consultez vos statistiques : nombre d\'appels, durée moyenne, taux de qualification, et objectifs.',
      icon: <TrendingUp size={48} className="text-accent" />,
      features: [
        { icon: <Target size={20} />, text: 'Objectifs quotidiens et hebdomadaires' },
        { icon: <TrendingUp size={20} />, text: 'Badges de performance' },
        { icon: <Bell size={20} />, text: 'Prime selon le taux de qualification' },
      ],
    },
  ],
  admin: [
    {
      title: 'Bienvenue, Administrateur ! 👑',
      description: 'Vous avez accès à toutes les fonctionnalités de gestion de la plateforme.',
      icon: <Settings size={48} className="text-red-500" />,
      features: [
        { icon: <Users size={20} />, text: 'Gestion des utilisateurs' },
        { icon: <FileSpreadsheet size={20} />, text: 'Supervision des leads' },
        { icon: <TrendingUp size={20} />, text: 'Analytics avancés' },
      ],
    },
    {
      title: 'Gestion des utilisateurs',
      description: 'Créez, modifiez, et gérez les comptes. Attribuez les rôles et les permissions.',
      icon: <Users size={48} className="text-red-500" />,
      features: [
        { icon: <Check size={20} />, text: 'Validation des nouveaux comptes' },
        { icon: <Settings size={20} />, text: 'Personnalisation des accès' },
        { icon: <Bell size={20} />, text: 'Alertes en cas d\'activité suspecte' },
      ],
    },
  ],
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setRole } = useAuth();
  const userRole = (searchParams.get('role') || 'acheteur') as UserRole;
  
  const [currentStep, setCurrentStep] = useState(0);
  const steps = onboardingSteps[userRole] || onboardingSteps.acheteur;
  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      // Finish onboarding and go to dashboard
      setRole(userRole);
      navigate(`/${userRole}`);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    setRole(userRole);
    navigate(`/${userRole}`);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-100 h-2">
          <div 
            className="bg-accent h-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="p-4 sm:p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-primary sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Visite Guidée</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-600">Étape {currentStep + 1} / {steps.length}</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-xs sm:text-sm text-gray-400 hover:text-gray-600 underline whitespace-nowrap flex-shrink-0"
            >
              Passer
            </button>
          </div>

          {/* Content */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6 animate-bounce">
              {step.icon}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">{step.title}</h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">{step.description}</p>
          </div>

          {/* Features or Tips */}
          {step.features && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {step.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-2 sm:mb-3">
                    {feature.icon}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">{feature.text}</p>
                </div>
              ))}
            </div>
          )}

          {step.tips && step.tips.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-2 sm:mb-3 flex items-center gap-2">
                <PlayCircle size={18} className="flex-shrink-0" /> Astuces importantes
              </h3>
              <ul className="space-y-2">
                {step.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-blue-800">
                    <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Image placeholder */}
          {step.image && (
            <div className="mb-6 sm:mb-8 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl h-48 sm:h-64 flex items-center justify-center border-2 border-dashed border-gray-200">
              <div className="text-center">
                <PlayCircle size={36} className="text-gray-300 mx-auto mb-2 sm:w-12 sm:h-12" />
                <p className="text-xs sm:text-sm text-gray-400">Aperçu interface</p>
              </div>
            </div>
          )}

          {/* Step Indicators */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-accent'
                    : index < currentStep
                    ? 'w-2 bg-green-400'
                    : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
            >
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="font-medium">Précédent</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-2 sm:py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors group shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <span>{isLastStep ? 'Commencer' : 'Suivant'}</span>
              {isLastStep ? (
                <Check size={16} className="group-hover:scale-110 transition-transform sm:w-[18px] sm:h-[18px]" />
              ) : (
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform sm:w-[18px] sm:h-[18px]" />
              )}
            </button>
          </div>

          {/* Bottom hint */}
          {isLastStep && (
            <div className="mt-4 sm:mt-6 text-center px-2">
              <p className="text-xs sm:text-sm text-gray-500">
                🎉 Vous êtes prêt ! Cliquez sur "Commencer" pour accéder à votre espace.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
