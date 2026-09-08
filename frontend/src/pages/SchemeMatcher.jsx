import { useState } from 'react';
import { Sparkles, Briefcase, AlertCircle } from 'lucide-react';
import { recommendScheme } from '../services/api';
import RecommendationCard from '../components/RecommendationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useLanguage } from '../i18n/LanguageContext';

export default function SchemeMatcher() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    income: '300000',
    project_cost: '100000',
    project_type: 'business',
    education_status: 'not_applicable',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const incomeNum = Number(formData.income);
    if (!formData.income || isNaN(incomeNum) || incomeNum <= 0) {
      newErrors.income = t('matcher.errors.income');
    }

    const costNum = Number(formData.project_cost);
    if (!formData.project_cost || isNaN(costNum) || costNum <= 0) {
      newErrors.project_cost = t('matcher.errors.cost');
    }

    if (!formData.project_type) {
      newErrors.project_type = t('matcher.errors.type');
    }

    if (!formData.education_status) {
      newErrors.education_status = t('matcher.errors.education');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setApiError(null);
      const result = await recommendScheme(formData);
      setRecommendation(result);
    } catch (err) {
      setApiError(err.message || t('matcher.errors.fallback'));
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset) => {
    setFormData(preset);
    setErrors({});
    setRecommendation(null);
  };

  const handleReset = () => {
    setRecommendation(null);
    setApiError(null);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
            {t('matcher.badge')}
          </span>
          <h1 className="page-header-title">{t('matcher.title')}</h1>
          <p className="page-header-subtitle">{t('matcher.subtitle')}</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="demo-presets-bar">
          <div className="demo-presets-title">
            <Sparkles size={16} color="var(--primary-600)" />
            <span>{t('matcher.presetsTitle')}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                applyPreset({
                  income: '300000',
                  project_cost: '100000',
                  project_type: 'business',
                  education_status: 'not_applicable',
                })
              }
            >
              {t('matcher.presets.micro')}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                applyPreset({
                  income: '400000',
                  project_cost: '1500000',
                  project_type: 'business',
                  education_status: 'not_applicable',
                })
              }
            >
              {t('matcher.presets.term')}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                applyPreset({
                  income: '350000',
                  project_cost: '800000',
                  project_type: 'education',
                  education_status: 'student',
                })
              }
            >
              {t('matcher.presets.education')}
            </button>
          </div>
        </div>

        <div className="matcher-layout">
          <div className="matcher-form-card">
            <h2 className="form-section-title">
              <Briefcase size={20} color="var(--primary-700)" /> {t('matcher.formTitle')}
            </h2>

            {apiError && (
              <ErrorMessage
                title={t('matcher.matchingError')}
                message={apiError}
                onRetry={handleSubmit}
              />
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="income">
                  {t('matcher.fields.income')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">Rs</span>
                  <input
                    type="number"
                    id="income"
                    name="income"
                    className={`form-control has-prefix ${errors.income ? 'is-invalid' : ''}`}
                    placeholder={t('matcher.placeholders.income')}
                    value={formData.income}
                    onChange={handleChange}
                    min="1"
                    step="1000"
                    required
                  />
                </div>
                {errors.income && (
                  <div className="form-error">
                    <AlertCircle size={14} /> {errors.income}
                  </div>
                )}
                <div className="form-hint">{t('matcher.hints.income')}</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="project_cost">
                  {t('matcher.fields.cost')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">Rs</span>
                  <input
                    type="number"
                    id="project_cost"
                    name="project_cost"
                    className={`form-control has-prefix ${errors.project_cost ? 'is-invalid' : ''}`}
                    placeholder={t('matcher.placeholders.cost')}
                    value={formData.project_cost}
                    onChange={handleChange}
                    min="1"
                    step="1000"
                    required
                  />
                </div>
                {errors.project_cost && (
                  <div className="form-error">
                    <AlertCircle size={14} /> {errors.project_cost}
                  </div>
                )}
                <div className="form-hint">{t('matcher.hints.cost')}</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="project_type">
                  {t('matcher.fields.type')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  id="project_type"
                  name="project_type"
                  className={`form-control ${errors.project_type ? 'is-invalid' : ''}`}
                  value={formData.project_type}
                  onChange={handleChange}
                  required
                >
                  <option value="business">{t('matcher.options.business')}</option>
                  <option value="education">{t('matcher.options.education')}</option>
                  <option value="other">{t('matcher.options.other')}</option>
                </select>
                {errors.project_type && (
                  <div className="form-error">
                    <AlertCircle size={14} /> {errors.project_type}
                  </div>
                )}
                <div className="form-hint">{t('matcher.hints.type')}</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="education_status">
                  {t('matcher.fields.education')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  id="education_status"
                  name="education_status"
                  className={`form-control ${errors.education_status ? 'is-invalid' : ''}`}
                  value={formData.education_status}
                  onChange={handleChange}
                  required
                >
                  <option value="not_applicable">{t('matcher.options.notApplicable')}</option>
                  <option value="student">{t('matcher.options.student')}</option>
                  <option value="completed">{t('matcher.options.completed')}</option>
                </select>
                {errors.education_status && (
                  <div className="form-error">
                    <AlertCircle size={14} /> {errors.education_status}
                  </div>
                )}
                <div className="form-hint">{t('matcher.hints.education')}</div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
                style={{ marginTop: '1.5rem' }}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" /> {t('matcher.submitting')}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> {t('matcher.submit')}
                  </>
                )}
              </button>
            </form>
          </div>

          <div>
            {loading && (
              <div className="card">
                <LoadingSpinner message={t('matcher.loading')} />
              </div>
            )}

            {!loading && recommendation && (
              <RecommendationCard recommendation={recommendation} onReset={handleReset} />
            )}

            {!loading && !recommendation && (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                <div className="empty-state-icon">
                  <Sparkles size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                  {t('matcher.emptyTitle')}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', lineHeight: '1.6', maxWidth: '420px', margin: '0 auto' }}>
                  {t('matcher.emptyText')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
