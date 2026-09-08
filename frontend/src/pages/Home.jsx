import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calculator,
  MapPin,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge-container">
            <div className="hero-pill">
              <span className="hero-pill-dot" />
              <span>{t('home.pill')}</span>
            </div>
          </div>

          <div className="hero-content">
            <h1 className="hero-title">
              {t('home.titleA')} <span>{t('home.titleB')}</span>
            </h1>
            <p className="hero-subtitle">{t('home.subtitle')}</p>

            <div className="hero-actions">
              <Link to="/matcher" className="btn btn-primary btn-lg">
                <Sparkles size={20} /> {t('home.actions.matcher')}
              </Link>
              <Link to="/calculator" className="btn btn-secondary btn-lg">
                <Calculator size={20} /> {t('home.actions.calculator')}
              </Link>
              <Link to="/partners" className="btn btn-teal btn-lg">
                <MapPin size={20} /> {t('home.actions.partners')}
              </Link>
            </div>

            <div className="hero-disclaimer-box">
              <Info size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>{t('home.noticeTitle')}</strong> {t('home.notice')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">{t('home.sectionTag')}</div>
            <h2 className="section-title">{t('home.sectionTitle')}</h2>
            <p className="section-subtitle">{t('home.sectionSubtitle')}</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap feature-icon-blue">
                <Sparkles size={28} />
              </div>
              <h3 className="feature-title">{t('home.features.matcherTitle')}</h3>
              <p className="feature-description">{t('home.features.matcherDesc')}</p>
              <Link to="/matcher" className="btn btn-outline btn-sm" style={{ marginTop: 'auto' }}>
                {t('home.features.matcherLink')} <ArrowRight size={14} />
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap feature-icon-teal">
                <Calculator size={28} />
              </div>
              <h3 className="feature-title">{t('home.features.emiTitle')}</h3>
              <p className="feature-description">{t('home.features.emiDesc')}</p>
              <Link to="/calculator" className="btn btn-outline btn-sm" style={{ marginTop: 'auto' }}>
                {t('home.features.emiLink')} <ArrowRight size={14} />
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap feature-icon-saffron">
                <MapPin size={28} />
              </div>
              <h3 className="feature-title">{t('home.features.partnerTitle')}</h3>
              <p className="feature-description">{t('home.features.partnerDesc')}</p>
              <Link to="/partners" className="btn btn-outline btn-sm" style={{ marginTop: 'auto' }}>
                {t('home.features.partnerLink')} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">{t('home.processTag')}</div>
            <h2 className="section-title">{t('home.processTitle')}</h2>
            <p className="section-subtitle">{t('home.processSubtitle')}</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">{t('home.steps.oneTitle')}</h3>
              <p className="step-desc">{t('home.steps.oneDesc')}</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">{t('home.steps.twoTitle')}</h3>
              <p className="step-desc">{t('home.steps.twoDesc')}</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">{t('home.steps.threeTitle')}</h3>
              <p className="step-desc">{t('home.steps.threeDesc')}</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">{t('home.steps.fourTitle')}</h3>
              <p className="step-desc">{t('home.steps.fourDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
