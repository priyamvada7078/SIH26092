import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Info,
} from 'lucide-react';
import { formatINR, formatPercent } from '../utils/formatters';
import { useLanguage } from '../i18n/LanguageContext';

export default function SchemeCard({ scheme, onViewDetails }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleCalculateEMI = (e) => {
    e.stopPropagation();
    navigate('/calculator', {
      state: {
        principal: scheme.max_amount,
        interest_rate: scheme.interest_rate,
        moratorium_months: scheme.moratorium_months,
      },
    });
  };

  return (
    <div className="scheme-card-item">
      <div className="scheme-card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-primary">{t('schemes.card.scheme')} #{scheme.id}</span>
          <span className="badge badge-teal">{formatPercent(scheme.interest_rate)}</span>
        </div>
        <h3 className="scheme-name">{scheme.name}</h3>
      </div>

      <p className="scheme-desc">{scheme.description}</p>

      {/* Meta Grid */}
      <div className="scheme-meta-grid">
        <div className="scheme-meta-item">
          <span className="scheme-meta-label">{t('schemes.card.maxFunding')}</span>
          <span className="scheme-meta-value">{formatINR(scheme.max_amount)}</span>
        </div>
        <div className="scheme-meta-item">
          <span className="scheme-meta-label">{t('schemes.card.moratorium')}</span>
          <span className="scheme-meta-value">{scheme.moratorium_months} {t('schemes.card.months')}</span>
        </div>
        <div className="scheme-meta-item">
          <span className="scheme-meta-label">{t('schemes.card.incomeCap')}</span>
          <span className="scheme-meta-value">{formatINR(scheme.income_limit)}</span>
        </div>
        <div className="scheme-meta-item">
          <span className="scheme-meta-label">{t('schemes.card.interest')}</span>
          <span className="scheme-meta-value" style={{ color: 'var(--accent-teal-700)' }}>
            {scheme.interest_rate}% p.a.
          </span>
        </div>
      </div>

      {/* Project Types */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          {t('schemes.card.eligibleTypes')}
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {scheme.project_types.map((type) => (
            <span key={type} className="badge badge-gray">
              {t(`commonLabels.projectTypes.${type}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
          onClick={() => onViewDetails && onViewDetails(scheme)}
        >
          <Info size={14} /> {t('schemes.card.details')}
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          style={{ flex: 1 }}
          onClick={handleCalculateEMI}
        >
          {t('schemes.card.calculate')} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
