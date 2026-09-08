import { MapPin, Building, CheckCircle2, AlertTriangle, Layers, Navigation } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function PartnerCard({ partner }) {
  const { t } = useLanguage();
  const availabilityLabel = {
    available: t('partners.card.available'),
    limited: t('partners.card.limited'),
    unavailable: t('partners.card.unavailable'),
  }[partner.availability_status] || t('partners.card.prototypeStatus');

  const eligibilityLabel = {
    eligible: t('partners.card.eligible'),
    under_review: t('partners.card.underReview'),
    inactive: t('partners.card.inactive'),
  }[partner.eligibility_status] || t('partners.card.prototypeEligibility');

  const getPartnerTypeLabel = (type) => {
    switch (type) {
      case 'PSB':
        return t('partners.card.publicBank');
      case 'RRB':
        return t('partners.card.ruralBank');
      case 'SCA':
        return t('partners.card.sca');
      case 'NBFC-MFI':
        return t('partners.card.nbfc');
      default:
        return type;
    }
  };

  return (
    <div className="partner-card-item">
      <div className="partner-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">{partner.type}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              {getPartnerTypeLabel(partner.type)}
            </span>
          </div>
          <h3 className="partner-name">{partner.name}</h3>
        </div>

        {partner.distance_km !== undefined ? (
          <div className="partner-distance-badge">
            <Navigation size={14} />
            <span>{partner.distance_km} {t('partners.card.away')}</span>
          </div>
        ) : (
          <span className={`badge ${partner.active ? 'badge-success' : 'badge-gray'}`}>
            {availabilityLabel}
          </span>
        )}
      </div>

      {/* Location Details */}
      <div className="partner-meta-row">
        <div className="partner-meta-tag">
          <MapPin size={16} color="var(--primary-600)" />
          <span>{partner.city}, {partner.state}</span>
        </div>
        <div className="partner-meta-tag">
          <Building size={16} color="var(--slate-500)" />
          <span>{t('partners.card.demoPartner')}</span>
        </div>
        <div className="partner-meta-tag">
          {partner.eligibility_status === 'eligible' && partner.availability_status !== 'unavailable' ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success-text)', fontSize: '0.8125rem', fontWeight: 600 }}>
              <CheckCircle2 size={14} /> {eligibilityLabel} / {availabilityLabel}
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#991b1b', fontSize: '0.8125rem' }}>
              <AlertTriangle size={14} /> {eligibilityLabel} / {availabilityLabel}
            </span>
          )}
        </div>
      </div>

      {/* Supported Schemes */}
      <div>
        <div className="partner-schemes-label" style={{ marginBottom: '0.4rem' }}>
          {t('partners.card.schemes')}
        </div>
        <div className="partner-schemes-wrap">
          {partner.supported_schemes && partner.supported_schemes.length > 0 ? (
            partner.supported_schemes.map((s) => (
              <span key={s} className="badge badge-teal">
                <Layers size={12} /> {s}
              </span>
            ))
          ) : (
            <span style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>{t('partners.card.noMapping')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
