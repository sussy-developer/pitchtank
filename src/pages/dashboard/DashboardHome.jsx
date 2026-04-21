import { useState, useEffect, useRef } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import CircularProgress from '../../components/CircularProgress';
import AIScoreAnimation from '../../components/AIScoreAnimation';
import '../../styles/dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deals, setDeals] = useState([]);
  const [startups, setStartups] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showScoring, setShowScoring] = useState(false);

  // Live AI score state — updates when a PDF is analyzed
  const [latestScore, setLatestScore] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 85) return '#10B981';
    if (score >= 70) return '#3B82F6';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const handleScoresGenerated = (scoreData) => {
    setLatestScore(scoreData);
  };

  // Current overall score (defaults to 82 before any analysis)
  const currentScore = latestScore?.overall ?? 82;

  // Build metric bars from latest scores or fallback to defaults
  const metricBars = latestScore
    ? latestScore.criteria.map(c => ({
        label: c.label,
        score: c.score,
        color: getScoreColor(c.score),
      }))
    : [
        { label: 'Market Fit', score: 90, color: '#3B82F6' },
        { label: 'Innovation', score: 78, color: '#3B82F6' },
        { label: 'Scalability', score: 85, color: '#3B82F6' },
        { label: 'Competition', score: 65, color: '#F59E0B' },
        { label: 'Revenue Model', score: 88, color: '#3B82F6' },
        { label: 'Execution Risk', score: 72, color: '#F59E0B' },
      ];

  // AI summary text based on live score
  const aiSummary = latestScore
    ? currentScore >= 80
      ? 'Exceptional pitch detected. Strong market fit, innovation, and scalability indicators.'
      : currentScore >= 70
      ? 'Strong fundamentals. Consider refining competitive positioning and traction data.'
      : 'Solid foundation. Focus on strengthening your competitive moat and execution strategy.'
    : 'Strong market fit and revenue model. Needs clearer competitive differentiation and expanded team.';

  useEffect(() => {
    fetch('/api/startups')
      .then(res => res.json())
      .then(data => { if (data.success) setStartups(data.data); })
      .catch(err => console.error("Failed to fetch startups:", err));

    fetch('/api/deals')
      .then(res => res.json())
      .then(data => { if (data.success) setDeals(data.data); })
      .catch(err => console.error("Failed to fetch deals:", err));
  }, []);

  // PDF watermark state
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfProcessing, setPdfProcessing] = useState(false);
  const [pdfWatermarked, setPdfWatermarked] = useState(null);
  const [pdfDragOver, setPdfDragOver] = useState(false);
  const pitchDeckRef = useRef(null);

  const userName = 'Arjun';

  const applyWatermark = async (file) => {
    setPdfProcessing(true);
    setPdfWatermarked(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const fontSize = 150;
      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(userName, fontSize);
        const x = (width / 2) - (textWidth / 2) + 50;
        const y = (height / 2) - (fontSize / 2);
        page.drawText(userName, {
          x, y,
          size: fontSize,
          font,
          color: rgb(0.6, 0.6, 0.6),
          rotate: degrees(45),
          opacity: 0.2,
        });
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfWatermarked({ url, name: file.name.replace('.pdf', '') + '_watermarked.pdf' });
    } finally {
      setPdfProcessing(false);
    }
  };

  const handlePdfSelect = (file) => {
    if (!file || file.type !== 'application/pdf') return;
    setPdfFile(file);
    applyWatermark(file);
  };

  const closeModal = () => {
    setShowSubmitModal(false);
    setShowScoring(false);
    setPdfFile(null);
    setPdfWatermarked(null);
    setPdfProcessing(false);
  };

  const handleSubmit = () => {
    setShowScoring(true);
  };

  const investors = [
    { name: 'Riya Kapoor', company: 'Blume Ventures', initials: 'RK', status: 'Offer sent', statusColor: 'blue' },
    { name: 'Vikram Patel', company: 'Sequoia India', initials: 'VP', status: 'Processing', statusColor: 'gray' },
    { name: 'Sunita Mehta', company: 'Accel Partners', initials: 'SM', status: 'Negotiating', statusColor: 'green' },
  ];

  const notifications = [
    { id: 1, text: 'Riya Kapoor sent a funding offer of ₹50L for 8% equity', time: '2 hours ago', color: 'blue' },
    { id: 2, text: 'AI analysis complete — your score improved to 82/100', time: 'Yesterday', color: 'green' },
    { id: 3, text: 'Vikram Patel added your startup to their watchlist', time: '2 days ago', color: 'orange' },
  ];

  return (
    <>
      <header className="dashboard-header">
          <div>
            <h1 className="header-title">Dashboard</h1>
            <p className="header-subtitle">Welcome back, Arjun</p>
          </div>
          <button className="btn-primary" onClick={() => setShowSubmitModal(true)}>+ Submit new startup</button>
        </header>

        <section className="metrics-row">
          <div className="metric-card">
            <span className="metric-label">AI score</span>
            <div className="metric-value blue-text">{currentScore}</div>
            <span className="metric-subtext positive">{latestScore ? 'Updated just now' : '+4 since last edit'}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Investors interested</span>
            <div className="metric-value">14</div>
            <span className="metric-subtext positive">+2 this week</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Profile views</span>
            <div className="metric-value">389</div>
            <span className="metric-subtext positive">+61 this week</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Funding received</span>
            <div className="metric-value">₹50L</div>
            <span className="metric-subtext positive">35% of goal</span>
          </div>
        </section>

        <div className="dashboard-grid">
          <div className="col-left">
            <div className="card ai-score-card">
              <div className="card-header">
                <h2 className="card-title">AI startup score</h2>
                <span className="card-tag">PayFlow AI</span>
              </div>
              <div className="ai-score-content">
                <div className="score-visual-section">
                  <CircularProgress value={currentScore} />
                  <p className="ai-summary">
                    {aiSummary}
                  </p>
                </div>
                <div className="score-bars">
                  {metricBars.map((metric, idx) => (
                    <div className="bar-row" key={idx}>
                      <span className="bar-label">{metric.label}</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${metric.score}%`, backgroundColor: metric.color }}></div>
                      </div>
                      <span className="bar-value">{metric.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card notifications-card">
              <h2 className="card-title">Recent notifications</h2>
              <div className="notifications-list">
                {notifications.map(note => (
                  <div className="notification-item" key={note.id}>
                    <div className={`notification-dot bg-${note.color}`}></div>
                    <div className="notification-content">
                      <p className="notification-text">{note.text}</p>
                      <span className="notification-time">{note.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-right">
            <div className="card funding-progress-card">
              <h2 className="card-title">Funding progress</h2>
              <div className="funding-amounts">
                <span className="raised">Raised so far</span>
                <span className="figures">${deals.filter(d => d.status === 'closed').reduce((acc, d) => acc + (d.offerAmount || 0), 0).toLocaleString()} / $1.5M</span>
              </div>
              <div className="progress-track-large">
                <div className="progress-fill-large" style={{ width: `${Math.min(100, (deals.filter(d => d.status === 'closed').reduce((acc, d) => acc + (d.offerAmount || 0), 0) / 1500000) * 100)}%` }}></div>
              </div>
              <p className="funding-subtext">{deals.filter(d => d.status === 'closed').length} closed deals — {deals.length} total offers</p>
              <button className="btn-secondary w-full mt-4" onClick={() => setActiveTab('funding')}>View all offers</button>
            </div>

            <div className="card investors-card">
              <h2 className="card-title">Interested investors</h2>
              <div className="investors-list">
                {deals.length > 0 ? deals.slice(0, 5).map((deal, idx) => (
                  <div className="investor-item" key={deal.dealId || idx}>
                    <div className="avatar-small">{deal.investorId?.displayName?.charAt(0) || 'I'}</div>
                    <div className="investor-info">
                      <span className="investor-name">{deal.investorId?.displayName || 'Investor'}</span>
                      <span className="investor-company">Offered: ${(deal.offerAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="status-tag" style={{
                      backgroundColor: deal.status === 'closed' ? 'rgba(16, 185, 129, 0.2)' : deal.status === 'negotiating' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: deal.status === 'closed' ? '#10B981' : deal.status === 'negotiating' ? '#F59E0B' : '#3B82F6',
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold'
                    }}>
                      {deal.status}
                    </div>
                  </div>
                )) : investors.map((inv, idx) => (
                  <div className="investor-item" key={idx}>
                    <div className="avatar-small">{inv.initials}</div>
                    <div className="investor-info">
                      <span className="investor-name">{inv.name}</span>
                      <span className="investor-company">{inv.company}</span>
                    </div>
                    <div className={`status-tag badge-${inv.statusColor}`}>{inv.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      {/* Submit Startup Modal with AI Scoring */}
      {showSubmitModal && (
        <div className="submit-modal-overlay" onClick={closeModal}>
          <div className="submit-modal" onClick={(e) => e.stopPropagation()} style={showScoring ? { maxWidth: '520px' } : {}}>
            {!showScoring ? (
              <>
                <div className="submit-modal-header">
                  <h2 className="submit-modal-title">Submit New Startup</h2>
                  <button className="submit-modal-close" onClick={closeModal}>✕</button>
                </div>

                <div className="submit-modal-body">
                  <p className="submit-modal-subtitle">Upload your pitch deck — it will be watermarked and scored by AI.</p>

                  <div
                    className={`upload-box${pdfDragOver ? ' upload-box--over' : ''}${pdfFile ? ' upload-box--selected' : ''}`}
                    onClick={() => pitchDeckRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setPdfDragOver(true); }}
                    onDragLeave={() => setPdfDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setPdfDragOver(false);
                      handlePdfSelect(e.dataTransfer.files[0]);
                    }}
                  >
                    <input
                      ref={pitchDeckRef}
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => handlePdfSelect(e.target.files[0])}
                    />
                    {pdfProcessing ? (
                      <>
                        <div className="upload-icon">⏳</div>
                        <div className="upload-text">Applying watermark...</div>
                      </>
                    ) : pdfWatermarked ? (
                      <>
                        <div className="upload-icon">✅</div>
                        <div className="upload-text">{pdfFile.name}</div>
                        <a
                          className="pdf-download-link"
                          href={pdfWatermarked.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Preview watermarked PDF
                        </a>
                      </>
                    ) : (
                      <>
                        <div className="upload-icon">📄</div>
                        <div className="upload-text">Drop PDF here or click to upload</div>
                      </>
                    )}
                  </div>

                  <button
                    className="btn-primary submit-modal-submit"
                    disabled={!pdfWatermarked}
                    onClick={handleSubmit}
                  >
                    🧠 Analyze with AI
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="submit-modal-header">
                  <h2 className="submit-modal-title">AI Pitch Analysis</h2>
                  <button className="submit-modal-close" onClick={closeModal}>✕</button>
                </div>
                <div className="submit-modal-body">
                  <AIScoreAnimation
                    fileName={pdfFile?.name || 'pitch-deck.pdf'}
                    pdfFile={pdfFile}
                    onComplete={closeModal}
                    onScoresGenerated={handleScoresGenerated}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
