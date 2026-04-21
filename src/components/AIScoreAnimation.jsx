import { useState, useEffect, useRef } from 'react';
import '../styles/ai-score.css';

const criteriaList = [
  { label: 'Market Fit',     icon: '🎯' },
  { label: 'Innovation',     icon: '💡' },
  { label: 'Scalability',    icon: '📈' },
  { label: 'Revenue Model',  icon: '💰' },
  { label: 'Competition',    icon: '⚔️' },
  { label: 'Team Strength',  icon: '👥' },
  { label: 'Execution Risk', icon: '⚡' },
  { label: 'Traction',       icon: '🚀' },
];

function AnimatedNumber({ target, duration = 1200 }) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return <span>{current}</span>;
}

// Stable fallback scores derived from filename (used when API is unreachable)
function generateFallback(fileName) {
  let hash = 0;
  for (let i = 0; i < fileName.length; i++) {
    hash = ((hash << 5) - hash) + fileName.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);
  const seeded = (s, i, min, max) => {
    const x = Math.sin(s + i + 1) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };
  const scores = criteriaList.map((c, idx) => ({
    ...c,
    score: seeded(seed, idx, 60, 88),
  }));
  const overall = Math.round(scores.reduce((s, c) => s + c.score, 0) / scores.length);
  return { scores, overall };
}

export default function AIScoreAnimation({ fileName, pdfFile, onComplete, onScoresGenerated }) {
  const [phase, setPhase] = useState('scanning');
  const [visibleCriteria, setVisibleCriteria] = useState(0);
  const [scores, setScores] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchFromAPI = async () => {
      if (!pdfFile) return null;
      const formData = new FormData();
      formData.append('file', pdfFile);
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`API ${res.status}`);
      return res.json();
    };

    const run = async () => {
      // Phase 1 — scanning (already set above)
      // Start API call immediately in background
      const apiPromise = fetchFromAPI().catch(() => null);

      // Wait minimum scanning duration
      await new Promise(r => setTimeout(r, 900));
      if (cancelled) return;
      setPhase('analyzing');

      // Wait for API response, minimum 1.5 s more in analyzing phase
      const [apiResult] = await Promise.all([
        apiPromise,
        new Promise(r => setTimeout(r, 1500)),
      ]);
      if (cancelled) return;

      let generatedScores, overall;
      if (apiResult && Array.isArray(apiResult.criteria) && apiResult.criteria.length) {
        // Use real API scores — attach icons from criteriaList by index
        generatedScores = apiResult.criteria.map((c, i) => ({
          label: c.label,
          icon: criteriaList[i]?.icon ?? '📊',
          score: Math.max(0, Math.min(100, parseInt(c.score) || 60)),
        }));
        overall = Math.max(0, Math.min(100, parseInt(apiResult.overall) || 60));
        setApiError(false);
      } else {
        const fb = generateFallback(fileName || 'pitch.pdf');
        generatedScores = fb.scores;
        overall = fb.overall;
        if (pdfFile) setApiError(true);
      }

      setScores(generatedScores);
      setFinalScore(overall);
      if (onScoresGenerated) {
        onScoresGenerated({ criteria: generatedScores, overall });
      }

      setPhase('scores');

      // Wait for all criteria to animate in, then show result
      await new Promise(r => setTimeout(r, generatedScores.length * 260 + 600));
      if (cancelled) return;
      setPhase('result');
    };

    run();
    return () => { cancelled = true; };
  }, []);

  // Reveal criteria one-by-one when in scores phase
  useEffect(() => {
    if (phase !== 'scores') return;
    if (visibleCriteria >= scores.length) return;
    const t = setTimeout(() => setVisibleCriteria(p => p + 1), 260);
    return () => clearTimeout(t);
  }, [phase, visibleCriteria, scores.length]);

  const getScoreColor = (score) => {
    if (score >= 85) return '#10B981';
    if (score >= 70) return '#3B82F6';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    return 'C';
  };

  return (
    <div className="ai-score-anim">
      {/* Scanning Phase */}
      {phase === 'scanning' && (
        <div className="score-phase fade-in">
          <div className="scan-icon-wrap">
            <div className="scan-ring" />
            <span className="scan-emoji">📄</span>
          </div>
          <h3 className="phase-title">Scanning pitch deck...</h3>
          <p className="phase-sub">{fileName}</p>
          <div className="scan-bar">
            <div className="scan-bar-fill" />
          </div>
        </div>
      )}

      {/* Analyzing Phase */}
      {phase === 'analyzing' && (
        <div className="score-phase fade-in">
          <div className="scan-icon-wrap">
            <div className="analyze-ring" />
            <span className="scan-emoji">🧠</span>
          </div>
          <h3 className="phase-title">AI analyzing your pitch...</h3>
          <p className="phase-sub">Evaluating {criteriaList.length} key metrics</p>
          <div className="analyze-dots">
            <span className="a-dot" />
            <span className="a-dot" />
            <span className="a-dot" />
          </div>
          {apiError && (
            <p style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '8px' }}>
              ⚠️ Could not reach scoring API — using estimated scores
            </p>
          )}
        </div>
      )}

      {/* Scores Phase */}
      {phase === 'scores' && (
        <div className="score-phase fade-in">
          <h3 className="phase-title" style={{ marginBottom: '20px' }}>Evaluating criteria</h3>
          <div className="criteria-grid">
            {scores.map((c, i) => (
              <div
                key={c.label}
                className={`criteria-row ${i < visibleCriteria ? 'criteria-visible' : 'criteria-hidden'}`}
              >
                <span className="criteria-icon">{c.icon}</span>
                <span className="criteria-label">{c.label}</span>
                <div className="criteria-bar-track">
                  <div
                    className="criteria-bar-fill"
                    style={{
                      width: i < visibleCriteria ? `${c.score}%` : '0%',
                      backgroundColor: getScoreColor(c.score),
                    }}
                  />
                </div>
                <span className="criteria-val" style={{ color: getScoreColor(c.score) }}>
                  {i < visibleCriteria ? <AnimatedNumber target={c.score} duration={800} /> : 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Result Phase */}
      {phase === 'result' && (
        <div className="score-phase fade-in result-phase">
          <div className="result-score-ring">
            <svg viewBox="0 0 120 120" className="result-svg">
              <circle cx="60" cy="60" r="52" className="ring-bg" />
              <circle
                cx="60" cy="60" r="52"
                className="ring-fill"
                style={{
                  strokeDasharray: `${(finalScore / 100) * 327} 327`,
                  stroke: getScoreColor(finalScore),
                }}
              />
            </svg>
            <div className="result-score-text">
              <span className="result-num"><AnimatedNumber target={finalScore} duration={1500} /></span>
              <span className="result-max">/100</span>
            </div>
          </div>

          <div className="result-grade" style={{ color: getScoreColor(finalScore) }}>
            Grade: {getGrade(finalScore)}
          </div>

          <h3 className="result-headline">
            {finalScore >= 80 ? '🔥 Excellent Pitch!' :
             finalScore >= 70 ? '👍 Strong Pitch' :
             '💪 Good Foundation'}
          </h3>
          <p className="result-desc">
            {finalScore >= 80
              ? 'Your startup shows exceptional promise. Investors are likely to be very interested!'
              : finalScore >= 70
              ? 'Strong fundamentals detected. A few refinements could push you into the top tier.'
              : 'Solid start! Consider strengthening your competitive analysis and traction metrics.'}
          </p>

          <div className="result-breakdown">
            {scores.slice(0, 4).map(c => (
              <div key={c.label} className="mini-stat">
                <span className="mini-icon">{c.icon}</span>
                <span className="mini-label">{c.label}</span>
                <span className="mini-val" style={{ color: getScoreColor(c.score) }}>{c.score}</span>
              </div>
            ))}
          </div>

          {apiError && (
            <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginBottom: '8px' }}>
              Scores estimated — start the AI backend for real analysis
            </p>
          )}

          <button className="btn-primary result-done-btn" onClick={onComplete}>
            Continue to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
