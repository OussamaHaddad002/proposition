import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, PhoneCall, PhoneOff, Clock, CheckCircle, XCircle, RotateCcw, Headphones, User, Building2, MapPin, Edit, Save, Mail } from 'lucide-react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import { useApi } from '../../hooks/useApi';
import { getAgent, getLeads } from '../../services/api';
import type { Lead } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TourGuide from '../../components/TourGuide';
import { dashboardTourSteps } from '../../data/tourSteps';

export default function AgentDashboard() {
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchParams] = useSearchParams();
  const [showTour, setShowTour] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState({ phone: '', email: '', company: '', city: '' });

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setShowTour(true);
    }
  }, [searchParams]);

  // Fetch data from API
  const { data: mockAgent } = useApi(getAgent, []);
  const { data: leadsData } = useApi(getLeads, []);
  const mockLeads = leadsData ?? [];

  // Leads à qualifier
  const leadsToQualify = mockLeads.filter(l => l.qualificationStatus === 'pending' || l.qualificationStatus === 'callback').slice(0, 15);

  const hourlyStats = [
    { hour: '9h', calls: 8, qualified: 6 },
    { hour: '10h', calls: 12, qualified: 9 },
    { hour: '11h', calls: 15, qualified: 11 },
    { hour: '12h', calls: 5, qualified: 3 },
    { hour: '14h', calls: 14, qualified: 10 },
    { hour: '15h', calls: 11, qualified: 8 },
    { hour: '16h', calls: 9, qualified: 7 },
  ];

  const startCall = (lead: Lead) => {
    setCurrentLead(lead);
    setCallStatus('calling');
    setTimeout(() => setCallStatus('connected'), 2000);
  };

  const endCall = (_status: 'qualified' | 'not_qualified' | 'callback') => {
    setCallStatus('ended');
    setTimeout(() => {
      setCallStatus('idle');
      setCurrentLead(null);
    }, 1000);
  };

  const getQualificationBadge = (status: Lead['qualificationStatus']) => {
    const styles: Record<Lead['qualificationStatus'], { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'En attente' },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'En cours' },
      qualified: { bg: 'bg-green-100', text: 'text-green-600', label: 'Qualifié' },
      not_qualified: { bg: 'bg-red-100', text: 'text-red-600', label: 'Non qualifié' },
      callback: { bg: 'bg-yellow-100', text: 'text-yellow-600', label: 'À rappeler' },
    };
    return styles[status];
  };

  return (
    <Layout userRole="agent" userName={mockAgent ? `${mockAgent.firstName} ${mockAgent.lastName}` : 'Chargement...'}>
      {!mockAgent ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fd7958]" /></div>
      ) : (
      <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Espace Qualification </h1>
            <p className="text-sm sm:text-base text-gray-500">Qualifiez les leads en temps réel</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">Connecté à Aheeva</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="stats-cards">
          <StatCard
            title="Appels aujourd'hui"
            value={mockAgent.leadsQualifiedToday + 5}
            change={15}
            icon={<Phone size={24} />}
            color="primary"
          />
          <StatCard
            title="Leads qualifiés"
            value={mockAgent.leadsQualifiedToday}
            change={8}
            icon={<CheckCircle size={24} />}
            color="success"
          />
          <StatCard
            title="Taux de qualification"
            value={`${mockAgent.qualificationRate}%`}
            change={2}
            icon={<RotateCcw size={24} />}
            color="accent"
          />
          <StatCard
            title="Durée moyenne"
            value={`${Math.floor(mockAgent.averageCallDuration / 60)}:${String(mockAgent.averageCallDuration % 60).padStart(2, '0')}`}
            icon={<Clock size={24} />}
            color="info"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100" data-tour="pending-leads">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Leads à qualifier ({leadsToQualify.length})</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {['all', 'pending', 'callback'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedFilter === filter
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'all' ? 'Tous' : filter === 'pending' ? 'En attente' : 'À rappeler'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {leadsToQualify.map((lead) => {
                const badge = getQualificationBadge(lead.qualificationStatus);
                const isActive = currentLead?.id === lead.id;
                
                return (
                  <div
                    key={lead.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${isActive ? 'bg-accent/5 border-l-4 border-accent' : ''}`}
                  >
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={18} className="text-primary sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900">{lead.firstName} {lead.lastName}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Building2 size={12} /> <span className="truncate max-w-[100px] sm:max-w-none">{lead.company}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {lead.city}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{lead.phone}</p>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 mt-2 sm:mt-0">
                        <div className={`px-2 py-1 rounded-lg text-xs sm:text-sm font-bold ${
                          lead.score >= 80 ? 'bg-green-100 text-green-700' :
                          lead.score >= 60 ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          Score: {lead.score}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setEditingLead(lead); setEditForm({ phone: lead.phone, email: lead.email, company: lead.company, city: lead.city }); }}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => startCall(lead)}
                            disabled={callStatus !== 'idle'}
                            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-colors ${
                              callStatus === 'idle'
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <PhoneCall size={16} />
                            Appeler
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call Panel */}
          <div className="space-y-6" data-tour="call-interface">
            {/* Active Call Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`p-4 ${
                callStatus === 'connected' ? 'bg-green-500' :
                callStatus === 'calling' ? 'bg-yellow-500' :
                'bg-gray-100'
              } transition-colors`}>
                <h3 className={`font-semibold ${callStatus !== 'idle' ? 'text-white' : 'text-gray-700'}`}>
                  {callStatus === 'idle' ? 'Aucun appel en cours' :
                   callStatus === 'calling' ? 'Appel en cours...' :
                   callStatus === 'connected' ? '🔴 En communication' :
                   'Appel terminé'}
                </h3>
              </div>
              
              {currentLead && callStatus !== 'idle' && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-primary">
                        {currentLead.firstName.charAt(0)}{currentLead.lastName.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {currentLead.firstName} {currentLead.lastName}
                    </h3>
                    <p className="text-gray-500">{currentLead.company}</p>
                    <p className="text-lg font-mono mt-2">{currentLead.phone}</p>
                    
                    {callStatus === 'connected' && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-mono text-xl">02:34</span>
                      </div>
                    )}
                    
                    {callStatus === 'calling' && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-yellow-600">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                        <span>Connexion...</span>
                      </div>
                    )}
                  </div>
                  
                  {callStatus === 'connected' && (
                    <>
                      {/* Recording indicator */}
                      <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-red-50 rounded-lg">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-600 font-medium">Enregistrement en cours</span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => endCall('qualified')}
                          className="flex flex-col items-center gap-2 p-4 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle size={24} />
                          <span className="text-sm font-medium">Qualifié</span>
                        </button>
                        <button
                          onClick={() => endCall('callback')}
                          className="flex flex-col items-center gap-2 p-4 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition-colors"
                        >
                          <RotateCcw size={24} />
                          <span className="text-sm font-medium">Rappeler</span>
                        </button>
                        <button
                          onClick={() => endCall('not_qualified')}
                          className="flex flex-col items-center gap-2 p-4 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                        >
                          <XCircle size={24} />
                          <span className="text-sm font-medium">Non qualifié</span>
                        </button>
                      </div>
                      
                      {/* End Call Button */}
                      <button
                        onClick={() => endCall('not_qualified')}
                        className="w-full mt-4 flex items-center justify-center gap-2 p-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                      >
                        <PhoneOff size={20} />
                        <span className="font-semibold">Raccrocher</span>
                      </button>
                    </>
                  )}
                </div>
              )}
              
              {callStatus === 'idle' && (
                <div className="p-6 text-center">
                  <Headphones size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Sélectionnez un lead et cliquez sur "Appeler"</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
              <textarea
                placeholder="Ajoutez vos notes ici..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                rows={4}
              />
              <button className="w-full mt-2 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance du jour</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hourlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="calls" name="Appels" fill="#344a5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="qualified" name="Qualifiés" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingLead(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Modifier le Lead</h2>
              <button onClick={() => setEditingLead(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-lg font-bold text-primary">
                  {editingLead.firstName.charAt(0)}{editingLead.lastName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{editingLead.firstName} {editingLead.lastName}</p>
                  <p className="text-xs text-gray-500">Score: {editingLead.score}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={editForm.phone} onChange={e => setEditForm(f => ({...f, phone: e.target.value}))} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({...f, email: e.target.value}))} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={editForm.company} onChange={e => setEditForm(f => ({...f, company: e.target.value}))} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={editForm.city} onChange={e => setEditForm(f => ({...f, city: e.target.value}))} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditingLead(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
                <button onClick={() => setEditingLead(null)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors">
                  <Save size={16} /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTour && (
        <TourGuide
          steps={dashboardTourSteps.agent}
          isActive={showTour}
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}
      </>
      )}
    </Layout>
  );
}
