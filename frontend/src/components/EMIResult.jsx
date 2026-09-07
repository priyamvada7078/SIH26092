import React from 'react';
import {
  IndianRupee,
  Calendar,
  Percent,
  Clock,
  Info,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';
import { formatINR, formatPercent } from '../utils/formatters';

export default function EMIResult({ result }) {
  if (!result) return null;

  const {
    principal,
    annual_interest_rate,
    tenure_months,
    moratorium_months,
    repayment_months,
    monthly_emi,
    total_payment,
    total_interest,
    moratorium_note,
  } = result;

  // Percentage breakdown
  const principalPercent = total_payment > 0 ? Math.round((principal / total_payment) * 100) : 100;
  const interestPercent = 100 - principalPercent;

  return (
    <div className="emi-hero-result" role="region" aria-label="EMI Calculation Results">
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span className="badge badge-teal" style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#5eead4', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
          Reducing Balance Method
        </span>
        <span style={{ fontSize: '0.8125rem', color: '#93c5fd' }}>
          {tenure_months} Months Total Tenure
        </span>
      </div>

      {/* Main Monthly EMI Banner */}
      <div className="emi-main-display">
        <div className="emi-main-label">Estimated Monthly EMI</div>
        <div className="emi-main-amount">{formatINR(monthly_emi, 2)}</div>
        <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.4rem' }}>
          Payable for {repayment_months} active repayment month{repayment_months === 1 ? '' : 's'}
        </div>
      </div>

      {/* Total Payment & Total Interest Sub-grid */}
      <div className="emi-subgrid">
        <div className="emi-subcard">
          <div className="emi-subcard-label">Total Repayment</div>
          <div className="emi-subcard-val">{formatINR(total_payment, 2)}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Principal + Interest
          </div>
        </div>

        <div className="emi-subcard">
          <div className="emi-subcard-label">Total Interest</div>
          <div className="emi-subcard-val" style={{ color: '#fca5a5' }}>
            {formatINR(total_interest, 2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Overall cost of borrowing
          </div>
        </div>
      </div>

      {/* Visual Bar Breakdown */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
          <span>Principal: {principalPercent}%</span>
          <span>Interest: {interestPercent}%</span>
        </div>
        <div style={{ height: '8px', width: '100%', background: '#f87171', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${principalPercent}%`, background: '#38bdf8', height: '100%' }} />
          <div style={{ width: `${interestPercent}%`, background: '#f87171', height: '100%' }} />
        </div>
      </div>

      {/* Detailed Parameters List */}
      <div className="emi-parameters-list">
        <div className="emi-param-row">
          <span>Loan Principal</span>
          <strong>{formatINR(principal, 2)}</strong>
        </div>
        <div className="emi-param-row">
          <span>Annual Interest Rate</span>
          <strong>{formatPercent(annual_interest_rate)}</strong>
        </div>
        <div className="emi-param-row">
          <span>Total Tenure</span>
          <strong>{tenure_months} Months ({Math.round((tenure_months / 12) * 10) / 10} Years)</strong>
        </div>
        <div className="emi-param-row">
          <span>Moratorium Period</span>
          <strong>{moratorium_months} Months (Holiday)</strong>
        </div>
        <div className="emi-param-row">
          <span>Active Repayment Period</span>
          <strong>{repayment_months} Months</strong>
        </div>
      </div>

      {/* Backend Moratorium Note */}
      {moratorium_note && (
        <div className="moratorium-info-box">
          <Info size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#fbbf24' }} />
          <div>
            <strong style={{ display: 'block', color: '#fde68a', marginBottom: '0.15rem' }}>
              Moratorium Note
            </strong>
            {moratorium_note}
          </div>
        </div>
      )}
    </div>
  );
}
