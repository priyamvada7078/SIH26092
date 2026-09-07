import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calculator,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Award,
  Layers,
  Info,
} from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge-container">
            <div className="hero-pill">
              <span className="hero-pill-dot" />
              <span>Smart Rule-Based Scheme Matching • SIH 2026</span>
            </div>
          </div>

          <div className="hero-content">
            <h1 className="hero-title">
              Find the Right Scheme. <span>Build Your Future.</span>
            </h1>
            <p className="hero-subtitle">
              AI-driven assistance to discover suitable concessional loan and education schemes for marginalized entrepreneurs.
            </p>

            <div className="hero-actions">
              <Link to="/matcher" className="btn btn-primary btn-lg">
                <Sparkles size={20} /> Find My Scheme
              </Link>
              <Link to="/calculator" className="btn btn-secondary btn-lg">
                <Calculator size={20} /> Calculate EMI
              </Link>
              <Link to="/partners" className="btn btn-teal btn-lg">
                <MapPin size={20} /> Find a Partner
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="hero-disclaimer-box">
              <Info size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Prototype Notice:</strong> Prototype for SIH 2026 demonstration. Scheme and partner data shown in this prototype are demo data and should not be treated as official financial guidance.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Key Capabilities</div>
            <h2 className="section-title">Designed for Inclusive Entrepreneurship</h2>
            <p className="section-subtitle">
              Simplifying access to government concessional credit schemes through transparent, explainable recommendations.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrap feature-icon-blue">
                <Sparkles size={28} />
              </div>
              <h3 className="feature-title">Smart Scheme Matching</h3>
              <p className="feature-description">
                Find schemes based on income, project cost, project type and education status. Transparent rule-based scoring ensures every recommendation is explainable.
              </p>
              <Link to="/matcher" className="btn btn-outline btn-sm" style={{ marginTop: 'auto' }}>
                Launch Matcher <ArrowRight size={14} />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrap feature-icon-teal">
                <Calculator size={28} />
              </div>
              <h3 className="feature-title">EMI Calculator</h3>
              <p className="feature-description">
                Estimate monthly repayments, total payment and interest using standard reducing-balance math with moratorium holiday support.
              </p>
              <Link to="/calculator" className="btn btn-outline btn-sm" style={{ marginTop: 'auto' }}>
                Compute Repayments <ArrowRight size={14} />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrap feature-icon-saffron">
                <MapPin size={28} />
              </div>
              <h3 className="feature-title">Partner Locator</h3>
              <p className="feature-description">
                Find nearby authorized/demo channel partners (Public Sector Banks, Regional Rural Banks, SCAs) with localized distance filtering.
              </p>
              <Link to="/partners" className="btn btn-outline btn-sm" style={{ marginTop: 'auto' }}>
                Locate Nearby Partners <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Transparent Process</div>
            <h2 className="section-title">How SchemeSaathi Works</h2>
            <p className="section-subtitle">
              Four simple steps from scheme discovery to nearest channel partner application.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Enter Profile Details</h3>
              <p className="step-desc">
                Provide basic family income, required project cost, and project category (business or education).
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Rule-Based Evaluation</h3>
              <p className="step-desc">
                The engine evaluates official income caps, funding ceilings, and eligibility criteria transparently.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Review Recommendations</h3>
              <p className="step-desc">
                Receive the best matching concessional scheme with an explainable reason and alternative options.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">Estimate & Connect</h3>
              <p className="step-desc">
                Calculate your exact monthly EMI with moratorium holiday and locate nearby channel partner branches.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
