import { useNavigate } from 'react-router-dom';
import useCountUp from '../hooks/useCountUp';

function TrustMetric({ target, suffix, label, prefix = '' }) {
  const { count, ref } = useCountUp(target, 2200);
  return (
    <div className="trust-item" ref={ref}>
      <span className="trust-number">{prefix}{count.toLocaleString()}{suffix}</span>
      <span className="trust-label">{label}</span>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="hero" id="hero" aria-label="Hero section">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-glow-1"></div>
          <div className="hero-glow-2"></div>
          <div className="hero-glow-3"></div>
          <div className="grid-pattern"></div>
        </div>

        <div className="hero-content">
          <div className="announcement-badge" role="status">
            <span className="badge-dot" aria-hidden="true"></span>
            <span>Now live — AI-powered pitch evaluation</span>
          </div>

          <h1 className="hero-headline">
            Pitch your startup to real investors.
          </h1>

          <p className="hero-subheadline">
            Upload your idea, get instant AI scoring, and connect with investors who are ready to fund you.
          </p>

          <div className="cta-group" role="group" aria-label="Get started actions">
            <button className="btn-cta-primary" type="button" id="cta-submit" onClick={() => navigate('/auth')}>
              Submit your idea
            </button>

            <button className="btn-cta-secondary" type="button" id="cta-explore" onClick={() => navigate('/auth')}>
              Explore startups
            </button>
          </div>

          <div className="trust-section" aria-label="Platform statistics">
            <div className="trust-divider" aria-hidden="true"></div>
            <div className="trust-grid">
              <TrustMetric target={2400} suffix="+" label="Startups pitched" />
              <TrustMetric target={18} prefix="$" suffix="M+" label="Funding raised" />
              <TrustMetric target={340} suffix="+" label="Active investors" />
              <TrustMetric target={92} suffix="%" label="Founder satisfaction" />
            </div>
          </div>
        </div>

        <div className="scroll-indicator" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      <section className="section section-dark" id="how-it-works" aria-label="How it works">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">HOW IT WORKS</span>
            <h2 className="section-title">Three steps to funding</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Submit your startup</h3>
              <p className="step-desc">Upload a pitch deck, video, or just fill in the form. Any format works.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Get AI scored</h3>
              <p className="step-desc">Our AI evaluates your startup across 6 dimensions and gives you a detailed report.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Connect with investors</h3>
              <p className="step-desc">Matched investors review your pitch and send funding offers directly to you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-darker" id="why-pitchtank" aria-label="Why choose PitchTank">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">THE PITCHTANK ADVANTAGE</span>
            <h2 className="section-title">Why founders trust us</h2>
          </div>

          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginTop: '40px'
          }}>
            <div className="feature-card" style={{
              background: 'rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '24px',
              padding: '32px',
              transition: 'transform 0.3s ease'
            }}>
              <div className="feature-icon" style={{ fontSize: '32px', marginBottom: '20px' }}>⚡</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Hyper-Speed Matching</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Skip the endless networking. Our algorithms match you with relevant investors in less than 24 hours based on your AI score and sector.</p>
            </div>

            <div className="feature-card" style={{
              background: 'rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '24px',
              padding: '32px',
              transition: 'transform 0.3s ease'
            }}>
              <div className="feature-icon" style={{ fontSize: '32px', marginBottom: '20px' }}>🤖</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Transparent AI Scoring</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>No more "ghosting". Get a raw, objective score on your deck so you know exactly what to improve before talking to a human investor.</p>
            </div>

            <div className="feature-card" style={{
              background: 'rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '24px',
              padding: '32px',
              transition: 'transform 0.3s ease'
            }}>
              <div className="feature-icon" style={{ fontSize: '32px', marginBottom: '20px' }}>🛡️</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>IP Protection</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Your work is your treasure. Every deck viewed by an investor is dynamically watermarked with their identity to prevent unauthorized sharing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-darker" id="startups" aria-label="Trending startups">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">FEATURED STARTUPS</span>
            <h2 className="section-title">Trending this week</h2>
          </div>

          <div className="startups-grid">
            <div className="startup-card" role="button" tabIndex={0} aria-label="View PayFlow AI details" onClick={() => navigate('/auth')}>
              <div className="category-tag">FinTech</div>
              <h3 className="startup-name">PayFlow AI</h3>
              <p className="startup-desc">Automated invoice reconciliation for SMEs</p>
              <div className="startup-footer">
                <span className="score-badge">Score 91/100</span>
                <span className="funding-ask">₹50L ask</span>
              </div>
            </div>

            <div className="startup-card" role="button" tabIndex={0} aria-label="View MediScan details" onClick={() => navigate('/auth')}>
              <div className="category-tag">HealthTech</div>
              <h3 className="startup-name">MediScan</h3>
              <p className="startup-desc">AI skin condition diagnosis via smartphone</p>
              <div className="startup-footer">
                <span className="score-badge">Score 87/100</span>
                <span className="funding-ask">₹1.2Cr ask</span>
              </div>
            </div>

            <div className="startup-card" role="button" tabIndex={0} aria-label="View LearnLoop details" onClick={() => navigate('/auth')}>
              <div className="category-tag">EdTech</div>
              <h3 className="startup-name">LearnLoop</h3>
              <p className="startup-desc">Personalized micro-learning for rural India</p>
              <div className="startup-footer">
                <span className="score-badge">Score 84/100</span>
                <span className="funding-ask">₹30L ask</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
