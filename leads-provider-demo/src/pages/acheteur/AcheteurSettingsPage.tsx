import AcheteurLayout from '../../components/AcheteurLayout';
import { useState } from 'react';
import { User, Lock, Bell, Globe, Camera, Mail, Phone, Building2, MapPin, Save, Eye, EyeOff } from 'lucide-react';

export default function AcheteurSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Préférences', icon: Globe },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <AcheteurLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Paramètres</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gérez votre profil et vos préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100/80 p-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5 ${
                      isActive
                        ? 'bg-[#fd7958]/[0.08] text-[#fd7958]'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon size={17} className={isActive ? 'text-[#fd7958]' : 'text-gray-400'} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-100/80 p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-[#344a5e] rounded-full flex items-center justify-center text-white text-xl font-semibold">
                        PD
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#fd7958] text-white rounded-full flex items-center justify-center hover:bg-[#e86847] transition-colors">
                        <Camera size={13} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">Pierre Dupont</h3>
                      <p className="text-xs text-gray-400">Acheteur · Membre depuis Jan 2024</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Prénom</label>
                      <input type="text" defaultValue="Pierre" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom</label>
                      <input type="text" defaultValue="Dupont" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        <Mail size={12} className="inline mr-1" />Email
                      </label>
                      <input type="email" defaultValue="pierre@techsolutions.fr" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        <Phone size={12} className="inline mr-1" />Téléphone
                      </label>
                      <input type="tel" defaultValue="+33 6 12 34 56 78" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        <Building2 size={12} className="inline mr-1" />Entreprise
                      </label>
                      <input type="text" defaultValue="Tech Solutions" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        <MapPin size={12} className="inline mr-1" />Localisation
                      </label>
                      <input type="text" defaultValue="Paris, France" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors"
                    >
                      <Save size={15} />
                      {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-gray-800">Changer le mot de passe</h3>
                  <div className="space-y-4 max-w-sm">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Mot de passe actuel</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all pr-10" />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Nouveau mot de passe</label>
                      <input type="password" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirmer le mot de passe</label>
                      <input type="password" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors"
                    >
                      <Save size={15} />
                      {isSaving ? 'Enregistrement...' : 'Mettre à jour'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800">Préférences de notification</h3>
                  {['Nouveaux leads disponibles', 'Mises à jour de conversion', 'Offres et promotions', 'Rapports hebdomadaires', 'Alertes de crédits bas'].map((item) => (
                    <label key={item} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-600">{item}</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-200 text-[#fd7958] focus:ring-[#fd7958]/30 w-4 h-4" />
                    </label>
                  ))}
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800">Préférences d'affichage</h3>
                  <div className="space-y-4 max-w-sm">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Langue</label>
                      <select className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all">
                        <option>Français</option>
                        <option>English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Secteurs préférés</label>
                      <select className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all">
                        <option>Tous les secteurs</option>
                        <option>Technologie</option>
                        <option>Finance</option>
                        <option>Immobilier</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Région préférée</label>
                      <select className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958]/20 focus:border-[#fd7958]/30 focus:bg-white transition-all">
                        <option>Toutes les régions</option>
                        <option>Île-de-France</option>
                        <option>Auvergne-Rhône-Alpes</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#fd7958] text-white rounded-lg text-sm font-medium hover:bg-[#e86847] transition-colors"
                    >
                      <Save size={15} />
                      {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AcheteurLayout>
  );
}
