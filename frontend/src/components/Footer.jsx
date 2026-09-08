import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-title">
              Scheme<span>Saathi</span>
            </div>
            <p className="footer-brand-desc">{t('footer.desc')}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontSize: '0.8125rem' }}>
              <ShieldCheck size={16} /> {t('footer.ministry')}
            </div>
          </div>

          <div>
            <h4 className="footer-heading">{t('footer.quick')}</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">{t('nav.home')}</Link></li>
              <li><Link to="/matcher" className="footer-link">{t('nav.matcher')}</Link></li>
              <li><Link to="/calculator" className="footer-link">{t('nav.calculator')}</Link></li>
              <li><Link to="/schemes" className="footer-link">{t('nav.schemesExplorer')}</Link></li>
              <li><Link to="/partners" className="footer-link">{t('nav.partners')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">{t('footer.details')}</h4>
            <ul className="footer-links">
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{t('footer.event')}</strong> {t('footer.eventValue')}
              </li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{t('footer.problem')}</strong> SIH26092
              </li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{t('footer.category')}</strong> {t('footer.categoryValue')}
              </li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{t('footer.engine')}</strong> {t('footer.engineValue')}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-disclaimer-box">
          <p>
            <strong>{t('footer.disclaimerTitle')}</strong> {t('footer.disclaimer')}
          </p>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} SchemeSaathi (SIH26092). {t('footer.built')}
          </div>
          <div>{t('footer.platform')}</div>
        </div>
      </div>
    </footer>
  );
}
