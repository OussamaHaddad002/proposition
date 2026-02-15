import { useState } from 'react';
import { Headphones, Search, Play, Pause, Trash2, Download, Eye, Clock, CheckCircle, ChevronLeft, ChevronRight, Phone, User, Calendar, Volume2 } from 'lucide-react';
import Layout from '../../components/Layout';
import { useApi } from '../../hooks/useApi';
import { getAudioRecords } from '../../services/api';
import type { AudioRecord } from '../../types';

export default function AdminAudiosPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | AudioRecord['status']>('all');
  const [filterResult, setFilterResult] = useState<'all' | AudioRecord['qualificationResult']>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<AudioRecord | null>(null);
  const perPage = 8;

  const { data: audiosData } = useApi(getAudioRecords, []);
  const allAudios = audiosData ?? [];

  const filtered = allAudios
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .filter(a => filterResult === 'all' || a.qualificationResult === filterResult)
    .filter(a => {
      if (!search) return true;
      const q = search.toLowerCase();
      return a.leadName.toLowerCase().includes(q) || a.leadCompany.toLowerCase().includes(q) || a.agentName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalDuration = allAudios.reduce((s, a) => s + a.durationSeconds, 0);
  const totalSizeMB = allAudios.reduce((s, a) => s + parseFloat(a.size), 0);

  const getResultBadge = (result: AudioRecord['qualificationResult']) => {
    const styles = {
      qualified: { bg: 'bg-green-100', text: 'text-green-700', label: 'Qualifié' },
      not_qualified: { bg: 'bg-red-100', text: 'text-red-700', label: 'Non qualifié' },
      callback: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'À rappeler' },
      pending: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'En attente' },
    };
    return styles[result];
  };

  const getStatusLabel = (status: AudioRecord['status']) => {
    const styles = {
      available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Disponible' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Traitement' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Archivé' },
    };
    return styles[status];
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
  };

  return (
    <Layout userRole="admin" userName="Admin Platform">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Audios</h1>
            <p className="text-sm sm:text-base text-gray-500">Enregistrements des appels de qualification</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} /> Exporter
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><Headphones size={18} /><span className="text-sm">Total</span></div>
            <p className="text-2xl font-bold text-gray-900">{allAudios.length}</p>
            <p className="text-xs text-gray-400">enregistrements</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><Clock size={18} /><span className="text-sm">Durée totale</span></div>
            <p className="text-2xl font-bold text-gray-900">{formatDuration(totalDuration)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><Volume2 size={18} /><span className="text-sm">Stockage</span></div>
            <p className="text-2xl font-bold text-gray-900">{totalSizeMB.toFixed(1)} MB</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><CheckCircle size={18} /><span className="text-sm">Qualifiés</span></div>
            <p className="text-2xl font-bold text-green-600">{allAudios.filter(a => a.qualificationResult === 'qualified').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Rechercher par lead, agent, ID..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all" />
            </div>
            <select value={filterResult} onChange={e => { setFilterResult(e.target.value as typeof filterResult); setCurrentPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="all">Tous les résultats</option>
              <option value="qualified">Qualifié</option>
              <option value="not_qualified">Non qualifié</option>
              <option value="callback">À rappeler</option>
            </select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as typeof filterStatus); setCurrentPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="all">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="processing">Traitement</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-gray-600 w-12"></th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Lead</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Agent</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden md:table-cell">Date</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Durée</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Résultat</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">Statut</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(audio => {
                  const resultBadge = getResultBadge(audio.qualificationResult);
                  const statusBadge = getStatusLabel(audio.status);
                  const isPlaying = playingId === audio.id;
                  return (
                    <tr key={audio.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => setPlayingId(isPlaying ? null : audio.id)}
                          disabled={audio.status === 'processing'}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-accent/10 hover:text-accent'} disabled:opacity-40`}
                        >
                          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{audio.leadName}</p>
                        <p className="text-xs text-gray-500">{audio.leadCompany}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{audio.agentName}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-gray-500">{new Date(audio.date).toLocaleDateString('fr-FR')}</p>
                        <p className="text-xs text-gray-400">{new Date(audio.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-mono text-gray-700">{audio.duration}</span>
                        <p className="text-xs text-gray-400">{audio.size}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${resultBadge.bg} ${resultBadge.text}`}>{resultBadge.label}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>{statusBadge.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedAudio(audio)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors" title="Détails"><Eye size={15} /></button>
                          <button className="p-1.5 text-gray-400 hover:text-accent hover:bg-gray-100 rounded-lg transition-colors" title="Télécharger"><Download size={15} /></button>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors" title="Supprimer"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">{filtered.length} enregistrement{filtered.length > 1 ? 's' : ''}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"><ChevronLeft size={16} /></button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>{i + 1}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>

        {selectedAudio && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAudio(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Détail Audio</h2>
                <button onClick={() => setSelectedAudio(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                {/* Player */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => setPlayingId(playingId === selectedAudio.id ? null : selectedAudio.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${playingId === selectedAudio.id ? 'bg-accent text-white' : 'bg-white text-gray-700 shadow-sm'}`}
                    >
                      {playingId === selectedAudio.id ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: playingId === selectedAudio.id ? '45%' : '0%' }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-400">{playingId === selectedAudio.id ? '1:58' : '0:00'}</span>
                        <span className="text-xs text-gray-400">{selectedAudio.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: <User size={14} />, label: 'Lead', value: `${selectedAudio.leadName} — ${selectedAudio.leadCompany}` },
                    { icon: <Phone size={14} />, label: 'Agent', value: selectedAudio.agentName },
                    { icon: <Calendar size={14} />, label: 'Date', value: new Date(selectedAudio.date).toLocaleString('fr-FR') },
                    { icon: <Clock size={14} />, label: 'Durée', value: selectedAudio.duration },
                    { icon: <Volume2 size={14} />, label: 'Taille', value: selectedAudio.size },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-400">{row.icon}</span>
                      <span className="text-sm text-gray-500 w-16">{row.label}</span>
                      <span className="text-sm font-medium text-gray-900 flex-1">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {(() => { const b = getResultBadge(selectedAudio.qualificationResult); return <span className={`px-3 py-1 rounded-full text-sm font-medium ${b.bg} ${b.text}`}>{b.label}</span>; })()}
                  {(() => { const b = getStatusLabel(selectedAudio.status); return <span className={`px-3 py-1 rounded-full text-sm font-medium ${b.bg} ${b.text}`}>{b.label}</span>; })()}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <Download size={16} /> Télécharger
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
