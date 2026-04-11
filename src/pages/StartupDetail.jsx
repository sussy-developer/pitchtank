import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/startupDetail.css';

function StartupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/startups/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStartup(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch startup details:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="detail-view"><p>Loading startup profile...</p></div>;
  if (!startup) return <div className="detail-view"><p>Startup not found.</p></div>;

  return (
    <div className="detail-view">
      <button onClick={() => navigate(-1)} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← Back</button>
      
      <div className="detail-header">
        <div className="title-group">
          <h1>{startup.name}</h1>
          <span className="badge">{startup.revenueStage || 'Seed'}</span>
        </div>
        <p className="tagline">{startup.tagline || startup.problemStatement || "No description provided."}</p>
        <div className="meta-tags">
          <span>{startup.industry}</span>
          <span>â€¢</span>
          <span>{startup.category}</span>
        </div>
      </div>

      <div className="metrics-banner">
        <div className="metric-box">
          <span className="mb-label">Investment Ask</span>
          <span className="mb-value">${(startup.investmentNeeded || 0).toLocaleString()}</span>
        </div>
        <div className="metric-box">
          <span className="mb-label">Equity Offered</span>
          <span className="mb-value">{startup.equityOffered || 0}%</span>
        </div>
        <div className="metric-box">
          <span className="mb-label">Current Valuation</span>
          <span className="mb-value">${(startup.currentValuation || 0).toLocaleString()}</span>
        </div>
        {startup.profileViews !== undefined && (
          <div className="metric-box align-right">
            <span className="mb-label">Profile Views</span>
            <span className="mb-value">{startup.profileViews}</span>
          </div>
        )}
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <section className="info-section">
            <h2>The Problem</h2>
            <p>{startup.problemStatement || "Not specified."}</p>
          </section>

          <section className="info-section">
            <h2>The Solution</h2>
            <p>{startup.solution || "Not specified."}</p>
          </section>
          
          <section className="info-section">
            <h2>Unique Selling Proposition (USP)</h2>
            <p>{startup.usp || "Not specified."}</p>
          </section>
        </div>

        <div className="detail-sidebar">
          <div className="action-card">
            <h3>Interested?</h3>
            <p>Initiate a negotiation sequence or message the founder directly.</p>
            <button className="primary-btn">Make an Offer</button>
            <button className="secondary-btn">Message Founder</button>
          </div>

          <div className="ai-card">
            <div className="ai-header">
              <span className="ai-icon">âœ¨</span>
              <h3>Venture AI Analysis</h3>
            </div>
            {startup.aiAnalysis && startup.aiAnalysis.length > 0 ? (
              <div className="ai-score">
                <div className="score-circle">
                  <span>{startup.aiAnalysis[0].overallScore}</span>
                </div>
                <p>Top {100 - startup.aiAnalysis[0].overallScore}% of cohort</p>
              </div>
            ) : (
              <div className="ai-empty">
                <p>No AI analysis has been generated for this startup yet.</p>
                <button className="accent-btn">Generate AI Report</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartupDetail;
