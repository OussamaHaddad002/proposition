import type { Lead } from '../types';
import { Eye, Phone, MapPin, Building2, Calendar, Star, Headphones } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onView?: (lead: Lead) => void;
  onAction?: (lead: Lead) => void;
  actionLabel?: string;
  showPrice?: boolean;
  anonymous?: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 85) return { bg: 'bg-score-excellent', text: 'score-excellent', label: 'Excellent' };
  if (score >= 70) return { bg: 'bg-score-good', text: 'score-good', label: 'Bon' };
  if (score >= 55) return { bg: 'bg-score-medium', text: 'score-medium', label: 'Moyen' };
  return { bg: 'bg-score-low', text: 'score-low', label: 'Faible' };
};

const getStatusBadge = (status: Lead['status']) => {
  const styles: Record<Lead['status'], string> = {
    new: 'bg-blue-100 text-blue-700',
    qualified: 'bg-green-100 text-green-700',
    sold: 'bg-purple-100 text-purple-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
  };
  const labels: Record<Lead['status'], string> = {
    new: 'Nouveau',
    qualified: 'Qualifié',
    sold: 'Vendu',
    pending: 'En attente',
    rejected: 'Rejeté',
  };
  return { style: styles[status], label: labels[status] };
};

export default function LeadCard({ 
  lead, 
  onView, 
  onAction, 
  actionLabel = 'Voir',
  showPrice = false,
  anonymous = false
}: LeadCardProps) {
  const scoreInfo = getScoreColor(lead.score);
  const statusInfo = getStatusBadge(lead.status);

  const displayName = anonymous 
    ? `${lead.firstName.charAt(0)}. ${lead.lastName.charAt(0)}.`
    : `${lead.firstName} ${lead.lastName}`;

  const displayPhone = anonymous
    ? `+33 * ** ** ** ${lead.phone.slice(-2)}`
    : lead.phone;

  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:border-accent/30 hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{displayName}</h3>
              <p className="text-sm text-gray-500">{lead.company}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.style}`}>
              {statusInfo.label}
            </span>
            {lead.isExclusive && (
              <span className="flex items-center gap-1 text-xs text-accent font-medium">
                <Star size={12} fill="currentColor" /> Exclusif
              </span>
            )}
            {lead.hasAudioRecording && (
              <span data-tour="audio-badge" className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
                <Headphones size={12} /> Audio
              </span>
            )}
          </div>
        </div>

        {/* Score */}
        <div className={`${scoreInfo.bg} rounded-lg p-3 mb-4`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Score IA</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${scoreInfo.text}`}>{lead.score}</span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
          </div>
          <div className="mt-2 bg-white/50 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500`}
              style={{ 
                width: `${lead.score}%`,
                backgroundColor: scoreInfo.text === 'score-excellent' ? '#10b981' :
                                 scoreInfo.text === 'score-good' ? '#3b82f6' :
                                 scoreInfo.text === 'score-medium' ? '#f59e0b' : '#ef4444'
              }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 size={14} className="text-gray-400" />
            <span>{lead.sector}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={14} className="text-gray-400" />
            <span>{lead.city}, {lead.region}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={14} className="text-gray-400" />
            <span>{displayPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={14} className="text-gray-400" />
            <span>{new Date(lead.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {showPrice && (
            <div>
              <span className="text-2xl font-bold text-accent">{lead.price}€</span>
              <span className="text-xs text-gray-500 ml-1">/ lead</span>
            </div>
          )}
          {!showPrice && (
            <span className="text-xs text-gray-400">
              Source: {lead.source}
            </span>
          )}
          <div className="flex gap-2">
            {onView && (
              <button
                data-tour="view-details"
                onClick={() => onView(lead)}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Eye size={18} />
              </button>
            )}
            {onAction && (
              <button
                onClick={() => onAction(lead)}
                className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors text-sm"
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
