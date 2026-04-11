import React from 'react';
import '../styles/pricing.css';

export default function PricingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="pricing-overlay" onClick={onClose}>
      <div className="pricing-modal" onClick={e => e.stopPropagation()}>
        <button className="pricing-close" onClick={onClose}>&times;</button>

        <h2 className="pricing-title">YOUR PRICING TIERS</h2>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="tier-name">Founder — free</h3>
            <div className="tier-price">
              <span className="price-val">₹0</span>
              <span className="price-period">/month</span>
            </div>
            <ul className="tier-features">
              <li>1 startup submission</li>
              <li>1 AI analysis</li>
              <li>Basic Shark Bot (10 msgs)</li>
              <li>Public marketplace listing</li>
            </ul>
          </div>

          <div className="pricing-card popular">
            <div className="popular-badge">Most popular</div>
            <h3 className="tier-name">Founder pro — ₹499/-</h3>
            <div className="tier-price">
              <span className="price-val blue-text">₹499</span>
              <span className="price-period">/month</span>
            </div>
            <ul className="tier-features">
              <li>Unlimited submissions</li>
              <li>Unlimited AI re-analysis</li>
              <li>Unlimited Shark Bot</li>
              <li>Verified founder badge</li>
              <li>Priority investor matching</li>
            </ul>
          </div>

          <div className="pricing-card">
            <h3 className="tier-name">Investor pro —₹4789/-</h3>
            <div className="tier-price">
              <span className="price-val green-text">₹4789/-</span>
              <span className="price-period">/month</span>
            </div>
            <ul className="tier-features">
              <li>Full marketplace access</li>
              <li>AI investor matching</li>
              <li>Direct founder messaging</li>
              <li>Portfolio analytics</li>
              <li>Verified investor badge</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
