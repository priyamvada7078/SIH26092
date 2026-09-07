import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Description */}
          <div>
            <div className="footer-brand-title">
              Scheme<span>Saathi</span>
            </div>
            <p className="footer-brand-desc">
              Smart assistance for inclusive financial access. AI-driven scheme matching and repayment estimation designed for marginalized entrepreneurs under MoSJE initiatives.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontSize: '0.8125rem' }}>
              <ShieldCheck size={16} /> Ministry of Social Justice and Empowerment (MoSJE)
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="footer-heading">Quick Navigation</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/matcher" className="footer-link">Find Scheme</Link>
              </li>
              <li>
                <Link to="/calculator" className="footer-link">EMI Calculator</Link>
              </li>
              <li>
                <Link to="/schemes" className="footer-link">Schemes Explorer</Link>
              </li>
              <li>
                <Link to="/partners" className="footer-link">Partner Locator</Link>
              </li>
            </ul>
          </div>

          {/* Problem Statement Details */}
          <div>
            <h4 className="footer-heading">Hackathon Details</h4>
            <ul className="footer-links">
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                <strong style={{ color: '#e2e8f0' }}>Event:</strong> Smart India Hackathon 2026
              </li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                <strong style={{ color: '#e2e8f0' }}>Problem ID:</strong> SIH26092
              </li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                <strong style={{ color: '#e2e8f0' }}>Category:</strong> Software / FinTech
              </li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                <strong style={{ color: '#e2e8f0' }}>Engine:</strong> Transparent Rule-Based
              </li>
            </ul>
          </div>
        </div>

        {/* Prototype Disclaimer */}
        <div className="footer-disclaimer-box">
          <p>
            <strong>Prototype Disclaimer:</strong> This application is a hackathon prototype. Scheme and partner information displayed here is demo data and should be independently verified before making financial decisions.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} SchemeSaathi (SIH26092). Built for Smart India Hackathon 2026.
          </div>
          <div>
            Prototype Demonstration Platform
          </div>
        </div>
      </div>
    </footer>
  );
}
