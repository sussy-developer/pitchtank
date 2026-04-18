import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/investor.css';

const Icons = {
  Marketplace: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Investments: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
  Messages: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  Watchlist: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>,
  Analytics: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>,
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  )
};

export default function MyInvestments() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    // Fetch deals (mocking investorId for now, but usually you'd pass a real ID)
    // We fetch all deals for demo, in production add: ?investorId=CURRENT_USER_ID
    fetch('/api/deals')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDeals(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch deals:", err));
  }, []);

  return (

    <section className="marketplace-view fade-in">
            <header className="marketplace-header">
              <div className="header-left">
                <h1>My Deals & Investments</h1>
              </div>
            </header>

            <div className="inv-metrics-row">
              <div className="inv-metric-card">
                <span className="inv-metric-label">Active deals</span>
                <span className="inv-metric-value">{deals.length}</span>
              </div>
              <div className="inv-metric-card">
                <span className="inv-metric-label">Capital Committed</span>
                <span className="inv-metric-value highlight">${deals.reduce((acc, d) => acc + (d.offerAmount || 0), 0).toLocaleString()}</span>
              </div>
              <div className="inv-metric-card">
                <span className="inv-metric-label">Closed deals</span>
                <span className="inv-metric-value">{deals.filter(d => d.status === 'closed').length}</span>
              </div>
              <div className="inv-metric-card">
                <span className="inv-metric-label">Negotiating</span>
                <span className="inv-metric-value">{deals.filter(d => d.status === 'negotiating').length}</span>
              </div>
            </div>

            <div className="startup-grid" style={{ marginTop: '24px' }}>
              {deals.length === 0 ? (
                <p style={{ padding: '20px', color: '#9CA3AF' }}>You haven't initiated any deals yet.</p>
              ) : deals.map(deal => (
                <div key={deal.dealId || deal._id} className="inv-startup-card">
                  <div className="card-top-row" style={{ justifyContent: 'flex-end' }}>
                    <span className={`score-badge-alt ${deal.status === 'closed' ? 'bg-green' : deal.status === 'negotiating' ? 'bg-orange' : 'bg-blue'}`} style={{
                       backgroundColor: deal.status === 'closed' ? 'rgba(16, 185, 129, 0.2)' : deal.status === 'negotiating' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                       color: deal.status === 'closed' ? '#10B981' : deal.status === 'negotiating' ? '#F59E0B' : '#3B82F6'
                    }}>
                      {deal.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="startup-main-info">
                    <div className="s-name-row">
                      <span className="s-name">{deal.startupId?.name || 'Unknown Startup'}</span>
                    </div>
                    <span className="s-founder">Deal ID: {deal.dealId?.slice(0, 8)}...</span>
                  </div>

                  <p className="s-desc" style={{ marginTop: '12px', fontSize: '0.85rem' }}>
                    <strong>Terms:</strong> {deal.terms || 'Standard term sheet'}
                  </p>

                  <div className="s-funding-row" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="s-ask-block">
                      <span className="s-ask-val">${(deal.offerAmount || 0).toLocaleString()} offered</span>
                      <span className="s-ask-label">{deal.equityAsked || 0}% equity asked</span>
                    </div>
                    <button className="btn-view-pitch" onClick={() => navigate(`/startup/${deal.startupId?._id || deal.startupId}`)}>
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
    </section>
  );
}
