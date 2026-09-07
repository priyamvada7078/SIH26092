import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Compass,
  Calculator,
  Layers,
  MapPin,
  Sparkles,
  Menu,
  X,
  Building2,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Government Top Bar */}
      <div className="gov-topbar">
        <div className="container gov-topbar-inner">
          <div className="gov-topbar-left">
            <div className="gov-flag-strip" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span>Ministry of Social Justice and Empowerment (MoSJE)</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>Government of India</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="gov-badge">SIH 2026 • SIH26092</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="navbar">
        <div className="container navbar-inner">
          {/* Brand */}
          <Link to="/" className="brand-link" onClick={closeMobileMenu}>
            <div className="brand-icon-wrap">
              <Building2 size={24} />
            </div>
            <div className="brand-text-wrap">
              <span className="brand-title">
                Scheme<span>Saathi</span>
              </span>
              <span className="brand-subtitle">SIH26092 • MoSJE</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-item-link ${isActive ? 'active' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/matcher"
              className={({ isActive }) =>
                `nav-item-link ${isActive ? 'active' : ''}`
              }
            >
              <Sparkles size={16} /> Find Scheme
            </NavLink>
            <NavLink
              to="/calculator"
              className={({ isActive }) =>
                `nav-item-link ${isActive ? 'active' : ''}`
              }
            >
              <Calculator size={16} /> EMI Calculator
            </NavLink>
            <NavLink
              to="/schemes"
              className={({ isActive }) =>
                `nav-item-link ${isActive ? 'active' : ''}`
              }
            >
              <Layers size={16} /> Schemes
            </NavLink>
            <NavLink
              to="/partners"
              className={({ isActive }) =>
                `nav-item-link ${isActive ? 'active' : ''}`
              }
            >
              <MapPin size={16} /> Partner Locator
            </NavLink>
          </nav>

          {/* Action CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/matcher" className="nav-cta-btn">
              <Sparkles size={16} /> Find My Scheme
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="mobile-nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/matcher"
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMobileMenu}
              >
                <Sparkles size={18} /> Find Scheme
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/calculator"
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMobileMenu}
              >
                <Calculator size={18} /> EMI Calculator
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/schemes"
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMobileMenu}
              >
                <Layers size={18} /> Schemes Explorer
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/partners"
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMobileMenu}
              >
                <MapPin size={18} /> Partner Locator
              </NavLink>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
