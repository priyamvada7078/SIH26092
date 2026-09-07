import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  Percent,
  Calendar,
  IndianRupee,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { getScheme } from '../services/api';
import { formatINR, formatPercent, humanizeProjectType, humanizeEducationStatus } from '../utils/formatters';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function SchemeDetailsModal({ schemeId, onClose }) {
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchSchemeDetails() {
      try {
        setLoading(true);
        setError(null);
        const data = await getScheme(schemeId);
        if (isMounted) setScheme(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load scheme details.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (schemeId) {
      fetchSchemeDetails();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [schemeId, onClose]);

  const handleApplyMatcher = () => {
    onClose();
    navigate('/matcher');
  };

  const handleCalculateEMI = () => {
    onClose();
    navigate('/calculator', {
      state: {
        principal: scheme.max_amount,
        interest_rate: scheme.interest_rate,
        moratorium_months: scheme.moratorium_months,
      },
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.25rem' }}>
              Official Demo Scheme
            </span>
            <h2 className="modal-title">
              {loading ? 'Loading Details...' : scheme ? scheme.name : 'Scheme Details'}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {loading && <LoadingSpinner message="Fetching verified scheme parameters..." />}

          {error && <ErrorMessage message={error} />}

          {scheme && (
            <div>
              <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {scheme.description}
              </p>

              {/* Metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  backgroundColor: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <div className="scheme-meta-label">Maximum Loan Amount</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    {formatINR(scheme.max_amount)}
                  </div>
                </div>

                <div>
                  <div className="scheme-meta-label">Concessional Interest Rate</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-teal-700)' }}>
                    {formatPercent(scheme.interest_rate)}
                  </div>
                </div>

                <div>
                  <div className="scheme-meta-label">Moratorium Period</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    {scheme.moratorium_months} Months
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Repayment holiday</div>
                </div>

                <div>
                  <div className="scheme-meta-label">Annual Family Income Cap</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    {formatINR(scheme.income_limit)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Maximum eligibility ceiling</div>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--slate-700)', marginBottom: '0.6rem' }}>
                  Supported Project Categories
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {scheme.project_types.map((t) => (
                    <span key={t} className="badge badge-primary">
                      {humanizeProjectType(t)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education Requirement */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--slate-700)', marginBottom: '0.6rem' }}>
                  Education Qualification Requirements
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>
                  {scheme.education_required
                    ? `Eligible for: ${scheme.education_required.map(humanizeEducationStatus).join(', ')}`
                    : 'Open to all applicants (no mandatory educational qualification required).'}
                </p>
              </div>

              {/* Note */}
              <div className="alert alert-info" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
                <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.8125rem' }}>
                  All applications are subject to transparent verification of income certificates and project proposals through authorized channel partners.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {scheme && (
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleCalculateEMI}>
              <Calculator size={14} /> Calculate EMI
            </button>
            <button type="button" className="btn btn-teal btn-sm" onClick={handleApplyMatcher}>
              <Sparkles size={14} /> Check Match <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
