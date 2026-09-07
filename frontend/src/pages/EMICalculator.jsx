import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Calculator,
  IndianRupee,
  Percent,
  Calendar,
  Clock,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { calculateEMI } from '../services/api';
import EMIResult from '../components/EMIResult';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function EMICalculator() {
  const location = useLocation();

  // Initialize with location state if navigated from a scheme card, or defaults
  const [formData, setFormData] = useState({
    principal: '100000',
    annual_interest_rate: '6.5',
    tenure_months: '60',
    moratorium_months: '3',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [result, setResult] = useState(null);

  // Sync state if navigation passed initial state
  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        principal: location.state.principal ? String(location.state.principal) : prev.principal,
        annual_interest_rate: location.state.interest_rate !== undefined ? String(location.state.interest_rate) : prev.annual_interest_rate,
        moratorium_months: location.state.moratorium_months !== undefined ? String(location.state.moratorium_months) : prev.moratorium_months,
      }));
    }
  }, [location.state]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Client-Side Validation
  const validateForm = () => {
    const newErrors = {};

    const principalNum = Number(formData.principal);
    if (!formData.principal || isNaN(principalNum) || principalNum <= 0) {
      newErrors.principal = 'Principal loan amount must be greater than ₹0.';
    }

    const rateNum = Number(formData.annual_interest_rate);
    if (formData.annual_interest_rate === '' || isNaN(rateNum) || rateNum < 0) {
      newErrors.annual_interest_rate = 'Annual interest rate cannot be negative.';
    }

    const tenureNum = Number(formData.tenure_months);
    if (!formData.tenure_months || isNaN(tenureNum) || tenureNum <= 0) {
      newErrors.tenure_months = 'Tenure must be at least 1 month.';
    }

    const moratoriumNum = Number(formData.moratorium_months);
    if (formData.moratorium_months === '' || isNaN(moratoriumNum) || moratoriumNum < 0) {
      newErrors.moratorium_months = 'Moratorium months cannot be negative.';
    } else if (tenureNum > 0 && moratoriumNum >= tenureNum) {
      newErrors.moratorium_months = 'Moratorium period must be strictly less than total tenure.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setApiError(null);
      const res = await calculateEMI(formData);
      setResult(res);
    } catch (err) {
      setApiError(err.message || 'Failed to calculate EMI. Please check backend status.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-calculate on initial mount if state was passed
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preset scenarios
  const applyPreset = (preset) => {
    setFormData(preset);
    setErrors({});
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            Reducing-Balance Formula
          </span>
          <h1 className="page-header-title">EMI Calculator</h1>
          <p className="page-header-subtitle">
            Estimate your monthly repayment, total interest, and moratorium schedule using the exact government reducing-balance methodology.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Presets Bar */}
        <div
          style={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--slate-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-700)', fontWeight: 600 }}>
            <Sparkles size={16} color="var(--primary-600)" />
            <span>Standard Scheme Presets:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                applyPreset({
                  principal: '140000',
                  annual_interest_rate: '6.5',
                  tenure_months: '36',
                  moratorium_months: '3',
                })
              }
            >
              Micro Finance (₹1.4L, 6.5%, 36m)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                applyPreset({
                  principal: '1000000',
                  annual_interest_rate: '7.0',
                  tenure_months: '60',
                  moratorium_months: '6',
                })
              }
            >
              Term Loan (₹10L, 7.0%, 60m)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                applyPreset({
                  principal: '500000',
                  annual_interest_rate: '4.0',
                  tenure_months: '84',
                  moratorium_months: '12',
                })
              }
            >
              Education Loan (₹5L, 4.0%, 84m)
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="emi-layout">
          {/* Form Card */}
          <div className="card">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Calculator size={20} color="var(--primary-700)" /> Repayment Parameters
            </h2>

            {apiError && (
              <ErrorMessage
                title="Calculation Error"
                message={apiError}
                onRetry={handleCalculate}
              />
            )}

            <form onSubmit={handleCalculate} noValidate>
              {/* Principal */}
              <div className="form-group">
                <label className="form-label" htmlFor="principal">
                  Principal Loan Amount (₹) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    type="number"
                    id="principal"
                    name="principal"
                    className={`form-control has-prefix ${errors.principal ? 'is-invalid' : ''}`}
                    placeholder="Enter principal amount (e.g. 100000)"
                    value={formData.principal}
                    onChange={handleChange}
                    min="1"
                    step="1000"
                    required
                  />
                </div>
                {errors.principal && (
                  <div className="form-error">
                    <AlertCircle size={14} /> {errors.principal}
                  </div>
                )}
              </div>

              {/* Annual Interest Rate */}
              <div className="form-group">
                <label className="form-label" htmlFor="annual_interest_rate">
                  Annual Interest Rate (% p.a.) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  id="annual_interest_rate"
                  name="annual_interest_rate"
                  className={`form-control ${errors.annual_interest_rate ? 'is-invalid' : ''}`}
                  placeholder="e.g. 6.5"
                  value={formData.annual_interest_rate}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                />
                {errors.annual_interest_rate && (
                  <div className="form-error">
                    <AlertCircle size={14} /> {errors.annual_interest_rate}
                  </div>
                )}
                <div className="form-hint">
                  Concessional rates typically range from 4.0% to 7.0% per annum.
                </div>
              </div>

              {/* Tenure & Moratorium side-by-side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="tenure_months">
                    Tenure (Months) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    id="tenure_months"
                    name="tenure_months"
                    className={`form-control ${errors.tenure_months ? 'is-invalid' : ''}`}
                    placeholder="e.g. 60"
                    value={formData.tenure_months}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    required
                  />
                  {errors.tenure_months && (
                    <div className="form-error">
                      <AlertCircle size={14} /> {errors.tenure_months}
                    </div>
                  )}
                  <div className="form-hint">
                    {formData.tenure_months && !isNaN(Number(formData.tenure_months))
                      ? `~${(Number(formData.tenure_months) / 12).toFixed(1)} years`
                      : ''}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="moratorium_months">
                    Moratorium (Months) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    id="moratorium_months"
                    name="moratorium_months"
                    className={`form-control ${errors.moratorium_months ? 'is-invalid' : ''}`}
                    placeholder="e.g. 3"
                    value={formData.moratorium_months}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                  />
                  {errors.moratorium_months && (
                    <div className="form-error">
                      <AlertCircle size={14} /> {errors.moratorium_months}
                    </div>
                  )}
                  <div className="form-hint">Zero repayment holiday at start</div>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
                style={{ marginTop: '1rem' }}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" /> Calculating Repayment...
                  </>
                ) : (
                  <>
                    <Calculator size={18} /> Calculate EMI
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Side */}
          <div>
            {loading && (
              <div className="card">
                <LoadingSpinner message="Calculating EMI using backend reducing-balance algorithm..." />
              </div>
            )}

            {!loading && result && <EMIResult result={result} />}

            {!loading && !result && (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                <Calculator size={40} color="var(--primary-600)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                  Ready to Compute EMI
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', lineHeight: '1.6' }}>
                  Enter loan details on the left and click <strong>"Calculate EMI"</strong> to get the complete repayment breakdown.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
