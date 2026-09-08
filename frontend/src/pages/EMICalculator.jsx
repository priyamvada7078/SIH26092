/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calculator, AlertCircle, Sparkles } from 'lucide-react';
import { calculateEMI } from '../services/api';
import EMIResult from '../components/EMIResult';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useLanguage } from '../i18n/LanguageContext';

export default function EMICalculator() {
  const location = useLocation();
  const { t } = useLanguage();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const principalNum = Number(formData.principal);
    const rateNum = Number(formData.annual_interest_rate);
    const tenureNum = Number(formData.tenure_months);
    const moratoriumNum = Number(formData.moratorium_months);

    if (!formData.principal || isNaN(principalNum) || principalNum <= 0) {
      newErrors.principal = t('emi.errors.principal');
    }
    if (formData.annual_interest_rate === '' || isNaN(rateNum) || rateNum < 0) {
      newErrors.annual_interest_rate = t('emi.errors.rate');
    }
    if (!formData.tenure_months || isNaN(tenureNum) || tenureNum <= 0) {
      newErrors.tenure_months = t('emi.errors.tenure');
    }
    if (formData.moratorium_months === '' || isNaN(moratoriumNum) || moratoriumNum < 0) {
      newErrors.moratorium_months = t('emi.errors.moratorium');
    } else if (tenureNum > 0 && moratoriumNum >= tenureNum) {
      newErrors.moratorium_months = t('emi.errors.moratoriumTenure');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setApiError(null);
      const res = await calculateEMI(formData);
      setResult(res);
    } catch (err) {
      setApiError(err.message || t('emi.errors.fallback'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPreset = (preset) => {
    setFormData(preset);
    setErrors({});
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            {t('emi.badge')}
          </span>
          <h1 className="page-header-title">{t('emi.title')}</h1>
          <p className="page-header-subtitle">{t('emi.subtitle')}</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="demo-presets-bar">
          <div className="demo-presets-title">
            <Sparkles size={16} color="var(--primary-600)" />
            <span>{t('emi.presetsTitle')}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => applyPreset({ principal: '140000', annual_interest_rate: '6.5', tenure_months: '36', moratorium_months: '3' })}>
              {t('emi.presets.micro')}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => applyPreset({ principal: '1000000', annual_interest_rate: '7.0', tenure_months: '60', moratorium_months: '6' })}>
              {t('emi.presets.term')}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => applyPreset({ principal: '500000', annual_interest_rate: '4.0', tenure_months: '84', moratorium_months: '12' })}>
              {t('emi.presets.education')}
            </button>
          </div>
        </div>

        <div className="emi-layout">
          <div className="card">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Calculator size={20} color="var(--primary-700)" /> {t('emi.formTitle')}
            </h2>

            {apiError && <ErrorMessage title={t('emi.errorTitle')} message={apiError} onRetry={handleCalculate} />}

            <form onSubmit={handleCalculate} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="principal">
                  {t('emi.fields.principal')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">Rs</span>
                  <input
                    type="number"
                    id="principal"
                    name="principal"
                    className={`form-control has-prefix ${errors.principal ? 'is-invalid' : ''}`}
                    placeholder={t('emi.placeholders.principal')}
                    value={formData.principal}
                    onChange={handleChange}
                    min="1"
                    step="1000"
                    required
                  />
                </div>
                {errors.principal && <div className="form-error"><AlertCircle size={14} /> {errors.principal}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="annual_interest_rate">
                  {t('emi.fields.rate')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  id="annual_interest_rate"
                  name="annual_interest_rate"
                  className={`form-control ${errors.annual_interest_rate ? 'is-invalid' : ''}`}
                  placeholder={t('emi.placeholders.rate')}
                  value={formData.annual_interest_rate}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                />
                {errors.annual_interest_rate && <div className="form-error"><AlertCircle size={14} /> {errors.annual_interest_rate}</div>}
                <div className="form-hint">{t('emi.hints.rate')}</div>
              </div>

              <div className="responsive-two-col">
                <div className="form-group">
                  <label className="form-label" htmlFor="tenure_months">
                    {t('emi.fields.tenure')} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    id="tenure_months"
                    name="tenure_months"
                    className={`form-control ${errors.tenure_months ? 'is-invalid' : ''}`}
                    placeholder={t('emi.placeholders.tenure')}
                    value={formData.tenure_months}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    required
                  />
                  {errors.tenure_months && <div className="form-error"><AlertCircle size={14} /> {errors.tenure_months}</div>}
                  <div className="form-hint">
                    {formData.tenure_months && !isNaN(Number(formData.tenure_months))
                      ? `~${(Number(formData.tenure_months) / 12).toFixed(1)} ${t('emi.hints.years')}`
                      : ''}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="moratorium_months">
                    {t('emi.fields.moratorium')} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    id="moratorium_months"
                    name="moratorium_months"
                    className={`form-control ${errors.moratorium_months ? 'is-invalid' : ''}`}
                    placeholder={t('emi.placeholders.moratorium')}
                    value={formData.moratorium_months}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                  />
                  {errors.moratorium_months && <div className="form-error"><AlertCircle size={14} /> {errors.moratorium_months}</div>}
                  <div className="form-hint">{t('emi.hints.moratorium')}</div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" /> {t('emi.calculating')}
                  </>
                ) : (
                  <>
                    <Calculator size={18} /> {t('emi.calculate')}
                  </>
                )}
              </button>
            </form>
          </div>

          <div>
            {loading && (
              <div className="card">
                <LoadingSpinner message={t('emi.loading')} />
              </div>
            )}
            {!loading && result && <EMIResult result={result} />}
            {!loading && !result && (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                <Calculator size={40} color="var(--primary-600)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                  {t('emi.emptyTitle')}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', lineHeight: '1.6' }}>
                  {t('emi.emptyText')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
