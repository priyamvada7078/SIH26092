import React from 'react';
import { MapPin, Building, CheckCircle2, AlertTriangle, Layers, Navigation } from 'lucide-react';

export default function PartnerCard({ partner }) {
  const getPartnerTypeLabel = (type) => {
    switch (type) {
      case 'PSB':
        return 'Public Sector Bank';
      case 'RRB':
        return 'Regional Rural Bank';
      case 'SCA':
        return 'State Channelising Agency';
      case 'NBFC-MFI':
        return 'NBFC Microfinance Institution';
      default:
        return type;
    }
  };

  return (
    <div className="partner-card-item">
      <div className="partner-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">{partner.type}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              {getPartnerTypeLabel(partner.type)}
            </span>
          </div>
          <h3 className="partner-name">{partner.name}</h3>
        </div>

        {partner.distance_km !== undefined ? (
          <div className="partner-distance-badge">
            <Navigation size={14} />
            <span>{partner.distance_km} km away</span>
          </div>
        ) : (
          <span className={`badge ${partner.active ? 'badge-success' : 'badge-gray'}`}>
            {partner.active ? 'Active Channel' : 'Inactive'}
          </span>
        )}
      </div>

      {/* Location Details */}
      <div className="partner-meta-row">
        <div className="partner-meta-tag">
          <MapPin size={16} color="var(--primary-600)" />
          <span>{partner.city}, {partner.state}</span>
        </div>
        <div className="partner-meta-tag">
          <Building size={16} color="var(--slate-500)" />
          <span>Authorized MoSJE Partner</span>
        </div>
        {partner.distance_km !== undefined && (
          <div className="partner-meta-tag">
            {partner.active ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success-text)', fontSize: '0.8125rem', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Accepting Applications
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#991b1b', fontSize: '0.8125rem' }}>
                <AlertTriangle size={14} /> Inactive
              </span>
            )}
          </div>
        )}
      </div>

      {/* Supported Schemes */}
      <div>
        <div className="partner-schemes-label" style={{ marginBottom: '0.4rem' }}>
          Supported Concessional Schemes:
        </div>
        <div className="partner-schemes-wrap">
          {partner.supported_schemes && partner.supported_schemes.length > 0 ? (
            partner.supported_schemes.map((s) => (
              <span key={s} className="badge badge-teal">
                <Layers size={12} /> {s}
              </span>
            ))
          ) : (
            <span style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>All verified schemes</span>
          )}
        </div>
      </div>
    </div>
  );
}
