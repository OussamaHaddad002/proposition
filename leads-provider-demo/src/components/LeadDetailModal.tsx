import { X, Phone, Mail, Building2, MapPin, Calendar, Globe, Headphones, Star, TrendingUp, TrendingDown } from 'lucide-react';
import type { Lead } from '../types';
import { generateScoreExplanation } from '../data/mockData';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onAction?: (lead: Lead) => void;
  actionLabel?: string;
  showFullDetails?: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 85) return { bg: 'bg-success/10', text: 'text-success', border: 'border-success' };
  if (score >= 70) return { bg: 'bg-info/10', text: 'text-info', border: 'border-info' };
  if (score >= 55) return { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning' };
  return { bg: 'bg-danger/10', text: 'text-danger', border: 'border-danger' };
};

export default function LeadDetailModal({ 
  lead, 
  onClose, 
  onAction,
  actionLabel = 'Acheter',
  showFullDetails = false 
}: LeadDetailModalProps) {
  const scoreInfo = getScoreColor(lead.score);
  const scoreExplanations = generateScoreExplanation(lead.score);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-primary p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">
                {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {showFullDetails ? `${lead.firstName} ${lead.lastName}` : `${lead.firstName.charAt(0)}. ${lead.lastName.charAt(0)}.`}
              </h2>
              <p className="text-white/80">{lead.company}</p>
              <div className="flex items-center gap-2 mt-1">
                {lead.isExclusive && (
                  <span className="flex items-center gap-1 bg-accent px-2 py-0.5 rounded-full text-xs font-medium">
                    <Star size={10} fill="currentColor" /> Exclusif
                  </span>
                )}
                {lead.hasAudioRecording && (
                  <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    <Headphones size={10} /> Enregistrement disponible
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Score Section */}
          <div className={`${scoreInfo.bg} rounded-xl p-5 mb-6 border ${scoreInfo.border}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Score IA</h3>
              <div className="flex items-center gap-2">
                <span className={`text-4xl font-bold ${scoreInfo.text}`}>{lead.score}</span>
                <span className="text-gray-500">/100</span>
              </div>
            </div>
            
            {/* Score Explanation (SHAP-like visualization) */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Facteurs contributifs</h4>
              {scoreExplanations.map((exp, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-gray-600 truncate">{exp.feature}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      {exp.contribution > 0 ? (
                        <div 
                          className="h-full bg-success rounded-full transition-all"
                          style={{ width: `${Math.min(exp.contribution * 5, 100)}%` }}
                        />
                      ) : (
                        <div 
                          className="h-full bg-danger rounded-full transition-all ml-auto"
                          style={{ width: `${Math.min(Math.abs(exp.contribution) * 5, 100)}%` }}
                        />
                      )}
                    </div>
                    <div className="w-16 flex items-center gap-1">
                      {exp.contribution > 0 ? (
                        <TrendingUp size={14} className="text-success" />
                      ) : (
                        <TrendingDown size={14} className="text-danger" />
                      )}
                      <span className={`text-sm font-medium ${exp.contribution > 0 ? 'text-success' : 'text-danger'}`}>
                        {exp.contribution > 0 ? '+' : ''}{exp.contribution}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Informations de contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-gray-700">
                    {showFullDetails ? lead.email : `${lead.email.split('@')[0].slice(0, 3)}***@${lead.email.split('@')[1]}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <span className="text-gray-700">
                    {showFullDetails ? lead.phone : `+33 * ** ** ** ${lead.phone.slice(-2)}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-gray-400" />
                  <span className="text-gray-700">{lead.company}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Localisation & Secteur</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <span className="text-gray-700">{lead.city}, {lead.region}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-gray-400" />
                  <span className="text-gray-700">{lead.sector}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-gray-700">{new Date(lead.createdAt).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Source & Channel */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Source:</span>
                <span className="ml-2 font-medium text-gray-800">{lead.source}</span>
              </div>
              <div>
                <span className="text-gray-500">Canal:</span>
                <span className="ml-2 font-medium text-gray-800">{lead.channel}</span>
              </div>
            </div>
          </div>

          {/* Audio Recording */}
          {lead.hasAudioRecording && (
            <div className="bg-accent/10 rounded-xl p-4 mb-6">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Headphones size={18} className="text-accent" />
                Enregistrement de qualification
              </h4>
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white hover:bg-accent-dark transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full w-0" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0:00</span>
                      <span>2:45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {lead.notes && (
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <h4 className="font-medium text-gray-800 mb-2">Notes</h4>
              <p className="text-gray-600 text-sm">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-accent">{lead.price}€</span>
            <span className="text-gray-500 ml-1">/ lead</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Fermer
            </button>
            {onAction && (
              <button
                onClick={() => onAction(lead)}
                className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-dark transition-colors flex items-center gap-2"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
