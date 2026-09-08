import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Calculator,
  Layers,
  MapPin,
  Sparkles,
  Menu,
  X,
  Building2,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <div className="gov-topbar">
        <div className="container gov-topbar-inner">
          <div className="gov-topbar-left">
            <div className="gov-flag-strip" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span>{t('nav.ministry')}</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>{t('nav.government')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="gov-badge">{t('nav.badge')}</span>
          </div>
        </div>
      </div>

      <header className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="brand-link" onClick={closeMobileMenu}>
            <div className="brand-icon-wrap">
              <Building2 size={24} />
            </div>
            <div className="brand-text-wrap">
              <span className="brand-title">
                Scheme<span>Saathi</span>
              </span>
              <span className="brand-subtitle">{t('nav.brandSubtitle')}</span>
            </div>
          </Link>

          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/matcher" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <Sparkles size={16} /> {t('nav.matcher')}
            </NavLink>
            <NavLink to="/calculator" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <Calculator size={16} /> {t('nav.calculator')}
            </NavLink>
            <NavLink to="/schemes" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <Layers size={16} /> {t('nav.schemes')}
            </NavLink>
            <NavLink to="/partners" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <MapPin size={16} /> {t('nav.partners')}
            </NavLink>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <select
              className="language-select"
              aria-label={t('common.language')}
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="en">{t('common.english')}</option>
              <option value="hi">{t('common.hindi')}</option>
            </select>

            <Link to="/matcher" className="nav-cta-btn">
              <Sparkles size={16} /> {t('nav.cta')}
            </Link>

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={t('nav.toggle')}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="mobile-nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                {t('nav.home')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/matcher" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <Sparkles size={18} /> {t('nav.matcher')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/calculator" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <Calculator size={18} /> {t('nav.calculator')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/schemes" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <Layers size={18} /> {t('nav.schemesExplorer')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/partners" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <MapPin size={18} /> {t('nav.partners')}
              </NavLink>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
