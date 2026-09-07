import React, { useState } from 'react';
import {
  Sparkles,
  IndianRupee,
  Briefcase,
  GraduationCap,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { recommendScheme } from '../services/api';
import RecommendationCard from '../components/RecommendationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function SchemeMatcher() {
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

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Client-Side Validation
  const validateForm = () => {
    const newErrors = {};

    const incomeNum = Number(formData.income);
    if (!formData.income || isNaN(incomeNum) || incomeNum <= 0) {
      newErrors.income = 'Annual family income must be greater than ₹0.';
    }

    const costNum = Number(formData.project_cost);
    if (!formData.project_cost || isNaN(costNum) || costNum <= 0) {
      newErrors.project_cost = 'Project cost must be greater than ₹0.';
    }

    if (!formData.project_type) {
      newErrors.project_type = 'Please select a project category.';
    }

    if (!formData.education_status) {
      newErrors.education_status = 'Please select your education status.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setApiError(null);
      const result = await recommendScheme(formData);
      setRecommendation(result);
    } catch (err) {
      setApiError(err.message || 'Unable to generate recommendation. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Presets
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
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
            Transparent Rule-Based Engine
          </span>
          <h1 className="page-header-title">Find the Right Scheme</h1>
          <p className="page-header-subtitle">
            Enter your applicant profile, income level, and proposed project cost to discover the most suitable government concessional credit scheme.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Quick Demo Selector */}
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
            <span>Try Quick Demo Scenarios:</span>
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
              Micro Business (₹1 Lakh)
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
              Term Loan Business (₹15 Lakh)
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
              Higher Education (₹8 Lakh)
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="matcher-layout">
          {/* Form Card */}
          <div className="matcher-form-card">
            <h2 className="form-section-title">
              <Briefcase size={20} color="var(--primary-700)" /> Applicant & Project Details
            </h2>

            {apiError && (
              <ErrorMessage
                title="Matching Error"
                message={apiError}
                onRetry={handleSubmit}
              />
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Annual Family Income */}
              <div className="form-group">
                <label className="form-label" htmlFor="income">
                  Annual Family Income (₹) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    type="number"
                    id="income"
                    name="income"
                    className={`form-control has-prefix ${errors.income ? 'is-invalid' : ''}`}
                    placeholder="Enter annual family income"
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
                <div className="form-hint">
                  Total annual income from all family sources before deductions.
                </div>
              </div>

              {/* Project Cost */}
              <div className="form-group">
                <label className="form-label" htmlFor="project_cost">
                  Estimated Project Cost (₹) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    type="number"
                    id="project_cost"
                    name="project_cost"
                    className={`form-control has-prefix ${errors.project_cost ? 'is-invalid' : ''}`}
                    placeholder="Enter estimated project cost"
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
                <div className="form-hint">
                  Estimated total capital or loan amount required for your project.
                </div>
              </div>

              {/* Project Type */}
              <div className="form-group">
                <label className="form-label" htmlFor="project_type">
                  Project Type <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  id="project_type"
                  name="project_type"
                  className={`form-control ${errors.project_type ? 'is-invalid' : ''}`}
                  value={formData.project_type}
                  onChange={handleChange}
                  required
                >
                  <option value="business">Business / Self-Employment</option>
                  <option value="education">Education</option>
                  <option value="other">Other Permissible Project</option>
                </select>
                {errors.project_type && (
                  <div className="form-error">
                    <AlertCircle size={14} /> {errors.project_type}
                  </div>
                )}
                <div className="form-hint">
                  Select the broad activity category for this financial requirement.
                </div>
              </div>

              {/* Education Status */}
              <div className="form-group">
                <label className="form-label" htmlFor="education_status">
                  Education Status <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  id="education_status"
                  name="education_status"
                  className={`form-control ${errors.education_status ? 'is-invalid' : ''}`}
                  value={formData.education_status}
                  onChange={handleChange}
                  required
                >
                  <option value="not_applicable">Not Applicable</option>
                  <option value="student">Currently a Student</option>
                  <option value="completed">Completed Course / Graduate</option>
                </select>
                {errors.education_status && (
                  <div className="form-error">
                    <AlertCircle size={14} /> {errors.education_status}
                  </div>
                )}
                <div className="form-hint">
                  Required specifically when evaluating educational loan schemes.
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
                style={{ marginTop: '1.5rem' }}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" /> Finding the best scheme...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Find Suitable Scheme
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Side */}
          <div>
            {loading && (
              <div className="card">
                <LoadingSpinner message="Evaluating scheme eligibility rules and calculating optimal match..." />
              </div>
            )}

            {!loading && recommendation && (
              <RecommendationCard
                recommendation={recommendation}
                onReset={handleReset}
              />
            )}

            {!loading && !recommendation && (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--primary-50)',
                    color: 'var(--primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <Sparkles size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                  Ready to Match Your Scheme
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', lineHeight: '1.6', maxWidth: '420px', margin: '0 auto' }}>
                  Fill out your income and project details on the left, then click <strong>"Find Suitable Scheme"</strong> to see the tailored recommendation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
