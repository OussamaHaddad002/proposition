import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Upload, Users, Euro, FileSpreadsheet, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import { mockFournisseur, monthlyStats } from '../../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TourGuide from '../../components/TourGuide';
import { dashboardTourSteps } from '../../data/tourSteps';

export default function FournisseurDashboard() {
  const [dragActive, setDragActive] = useState(false);
  const [searchParams] = useSearchParams();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setShowTour(true);
    }
  }, [searchParams]);

  const statusData = [
    { name: 'Qualifiés', value: 45, color: '#10b981' },
    { name: 'En attente', value: 25, color: '#f59e0b' },
    { name: 'Vendus', value: 20, color: '#3b82f6' },
    { name: 'Rejetés', value: 10, color: '#ef4444' },
  ];

  const recentUploads = [
    { id: 1, filename: 'leads_janvier_2026.csv', date: '2026-01-28', count: 150, status: 'processed', valid: 142, duplicates: 8 },
    { id: 2, filename: 'campagne_google_ads.xlsx', date: '2026-01-20', count: 85, status: 'processed', valid: 79, duplicates: 6 },
    { id: 3, filename: 'leads_linkedin.csv', date: '2026-01-15', count: 200, status: 'processed', valid: 188, duplicates: 12 },
  ];

  return (
    <Layout userRole="fournisseur" userName={`${mockFournisseur.firstName} ${mockFournisseur.lastName}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bonjour, {mockFournisseur.firstName} 👋</h1>
            <p className="text-sm sm:text-base text-gray-500">Voici un résumé de votre activité</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-medium hover:bg-accent-dark transition-colors" data-tour="upload-button">
            <Upload size={18} />
            Nouveau Upload
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="stats-cards">
          <StatCard
            title="Leads Uploadés"
            value={mockFournisseur.totalLeadsUploaded.toLocaleString()}
            change={12}
            icon={<Users size={24} />}
            color="primary"
          />
          <StatCard
            title="Leads Vendus"
            value={mockFournisseur.totalLeadsSold.toLocaleString()}
            change={8}
            icon={<CheckCircle size={24} />}
            color="success"
          />
          <StatCard
            title="Revenus Total"
            value={`${mockFournisseur.totalRevenue.toLocaleString()}€`}
            change={15}
            icon={<Euro size={24} />}
            color="accent"
          />
          <StatCard
            title="Paiement en attente"
            value={`${mockFournisseur.pendingPayment.toLocaleString()}€`}
            icon={<Clock size={24} />}
            color="warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100" data-tour="revenue-chart">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Évolution des revenus</h2>
              <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option>6 derniers mois</option>
                <option>Cette année</option>
                <option>Tout</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyStats}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fd7958" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fd7958" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value/1000}k€`} />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toLocaleString()}€`, 'Revenus']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#fd7958" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Répartition des leads</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Zone & Recent Files */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Uploader des leads</h2>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-accent bg-accent/5' 
                  : 'border-gray-200 hover:border-accent/50'
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => setDragActive(false)}
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet size={32} className="text-accent" />
              </div>
              <p className="text-gray-600 mb-2">
                Glissez-déposez vos fichiers ici
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Formats acceptés: CSV, Excel (.xlsx)
              </p>
              <button className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors">
                Parcourir les fichiers
              </button>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Conseil</h4>
              <p className="text-sm text-blue-700">
                Assurez-vous que votre fichier contient les colonnes: Nom, Prénom, Email, Téléphone, Entreprise, Secteur.
              </p>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Uploads récents</h2>
              <button className="text-accent text-sm font-medium hover:underline">Voir tout</button>
            </div>
            <div className="space-y-3">
              {recentUploads.map((upload) => (
                <div key={upload.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{upload.filename}</p>
                    <p className="text-sm text-gray-500">{upload.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-sm font-medium text-green-600">{upload.valid}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle size={14} className="text-red-400" />
                      <span className="text-sm text-red-500">{upload.duplicates} doublons</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Payment Banner */}
        <div className="bg-gradient-to-r from-accent to-accent-dark rounded-xl p-4 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Euro size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg">Paiement en attente</h3>
              <p className="text-white/80 text-sm">Vous avez {mockFournisseur.pendingPayment.toLocaleString()}€ de leads validés à encaisser</p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-accent rounded-xl font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
            <Download size={18} />
            Télécharger la facture
          </button>
        </div>
      </div>

      {showTour && (
        <TourGuide
          steps={dashboardTourSteps.fournisseur}
          isActive={showTour}
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}
    </Layout>
  );
}
