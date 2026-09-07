import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Award,
  HelpCircle,
  TrendingDown,
  Calendar,
  IndianRupee,
  Layers,
  ArrowRight,
  Calculator,
  MapPin,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { formatINR, formatPercent } from '../utils/formatters';

export default function RecommendationCard({ recommendation, onReset }) {
  const navigate = useNavigate();

  if (!recommendation) return null;

  const {
    eligible,
    scheme_name,
    reason,
    interest_rate,
    maximum_amount,
    moratorium_months,
    confidence,
    alternatives = [],
  } = recommendation;

  // If ineligible
  if (!eligible) {
    return (
      <div className="ineligible-card" role="region" aria-label="Recommendation Result">
        <div className="ineligible-icon">
          <AlertCircle size={28} />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#991b1b', marginBottom: '0.75rem' }}>
          No Suitable Scheme Found
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', lineHeight: '1.6', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
          {reason || 'No suitable scheme was found based on the information provided.'}
        </p>
        <div className="alert alert-warning" style={{ textAlign: 'left', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
          <HelpCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.875rem' }}>
            <strong>Recommendation Suggestion:</strong> You can modify your project cost, annual income, or project category to discover other concessional loan opportunities.
          </div>
        </div>
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          <RefreshCw size={16} /> Modify Details & Try Again
        </button>
      </div>
    );
  }

  const confidencePercent = confidence ? Math.round(confidence * 100) : 90;

  const handleCalculateEMI = (amount, rate, moratorium) => {
    navigate('/calculator', {
      state: {
        principal: amount || maximum_amount,
        interest_rate: rate !== undefined ? rate : interest_rate,
        moratorium_months: moratorium !== undefined ? moratorium : moratorium_months,
      },
    });
  };

  const handleFindPartners = () => {
    navigate('/partners');
  };

  return (
    <div className="recommendation-card" role="region" aria-label="Recommendation Result">
      {/* Top Banner & Header */}
      <div className="recommendation-header">
        <div className="recommendation-badge-top">
          <Sparkles size={16} /> Top Recommended Scheme
        </div>
        <h2 className="recommendation-scheme-name">{scheme_name}</h2>
      </div>

      {/* Primary Metrics Strip */}
      <div className="metrics-strip">
        <div className="metric-item">
          <span className="metric-label">Concessional Rate</span>
          <span className="metric-value metric-value-accent">
            {formatPercent(interest_rate)}
          </span>
          <span className="metric-sub">Annual reducing rate</span>
        </div>

        <div className="metric-item">
          <span className="metric-label">Maximum Funding</span>
          <span className="metric-value">{formatINR(maximum_amount)}</span>
          <span className="metric-sub">Direct loan ceiling</span>
        </div>

        <div className="metric-item">
          <span className="metric-label">Moratorium Holiday</span>
          <span className="metric-value">{moratorium_months} Months</span>
          <span className="metric-sub">Zero repayment period</span>
        </div>
      </div>

      {/* Confidence Score Bar */}
      <div className="confidence-bar-wrap">
        <div className="confidence-header">
          <span className="confidence-title">
            <Award size={16} color="var(--accent-teal-700)" />
            Rule-Based Match Confidence
          </span>
          <span className="confidence-percent">{confidencePercent}% Match</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${confidencePercent}%` }} />
        </div>
      </div>

      {/* Explainability Reason Box */}
      <div className="explainability-box">
        <div className="explainability-box-title">
          <CheckCircle2 size={16} color="var(--accent-teal-700)" />
          Why This Scheme Was Selected:
        </div>
        <p className="explainability-text">{reason}</p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: alternatives.length > 0 ? '1.5rem' : 0 }}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => handleCalculateEMI(maximum_amount, interest_rate, moratorium_months)}
        >
          <Calculator size={16} /> Calculate Repayment EMI
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleFindPartners}
        >
          <MapPin size={16} /> Find Channel Partner
        </button>
      </div>

      {/* Alternatives Section */}
      {alternatives.length > 0 && (
        <div className="alternatives-section">
          <h3 className="alternatives-heading">
            <Layers size={18} color="var(--primary-700)" /> Other Eligible Options ({alternatives.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alternatives.map((alt, idx) => (
              <div key={idx} className="alternative-card">
                <div className="alternative-header">
                  <span className="alternative-name">{alt.scheme_name}</span>
                  <span className="badge badge-teal">{formatPercent(alt.interest_rate)}</span>
                </div>

                <div className="alternative-stats">
                  <span><strong>Max Amount:</strong> {formatINR(alt.maximum_amount)}</span>
                  <span>•</span>
                  <span><strong>Moratorium:</strong> {alt.moratorium_months} Months</span>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                  {alt.reason}
                </p>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleCalculateEMI(alt.maximum_amount, alt.interest_rate, alt.moratorium_months)}
                >
                  <Calculator size={14} /> Calculate EMI for {alt.scheme_name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
