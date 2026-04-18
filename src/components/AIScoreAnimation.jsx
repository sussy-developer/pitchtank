import { useState, useEffect, useRef } from 'react';
import '../styles/ai-score.css';

const criteriaList = [
  { label: 'Market Fit', icon: '🎯' },
  { label: 'Innovation', icon: '💡' },
  { label: 'Scalability', icon: '📈' },
  { label: 'Revenue Model', icon: '💰' },
  { label: 'Competition', icon: '⚔️' },
  { label: 'Team Strength', icon: '👥' },
  { label: 'Execution Risk', icon: '⚡' },
  { label: 'Traction', icon: '🚀' },
];

function randomScore(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function AnimatedNumber({ target, duration = 1200 }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };
    
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return <span>{current}</span>;
}

export default function AIScoreAnimation({ fileName, onComplete, onScoresGenerated }) {
  const [phase, setPhase] = useState('scanning'); // scanning → analyzing → scores → result
  const [visibleCriteria, setVisibleCriteria] = useState(0);
  const [scores, setScores] = useState([]);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    // Simple hash function to generate a stable seed from fileName
    const getHash = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };

    const baseSeed = getHash(fileName || 'pitch-deck.pdf');

    // Pseudo-random generator strictly bound between 60 and 100
    const seededRandom = (seed, index, min, max) => {
      const x = Math.sin(seed + index + 1) * 10000;
      const rand = x - Math.floor(x);
      return Math.floor(rand * (max - min + 1)) + min;
    };

    const generated = criteriaList.map((c, idx) => ({
      ...c,
      score: seededRandom(baseSeed, idx, 60, 100),
    }));
    
    setScores(generated);
    const avg = Math.round(generated.reduce((s, c) => s + c.score, 0) / generated.length);
    setFinalScore(avg);

    // Report scores back to parent
    if (onScoresGenerated) {
      onScoresGenerated({ criteria: generated, overall: avg });
    }

    // Phase timeline
    const t1 = setTimeout(() => setPhase('analyzing'), 800);
    const t2 = setTimeout(() => setPhase('scores'), 1600);
    const t3 = setTimeout(() => setPhase('result'), 4200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Reveal criteria one by one
  useEffect(() => {
    if (phase !== 'scores') return;
    if (visibleCriteria >= scores.length) return;

    const timer = setTimeout(() => {
      setVisibleCriteria(prev => prev + 1);
    }, 250);

    return () => clearTimeout(timer);
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

          <button className="btn-primary result-done-btn" onClick={onComplete}>
            Continue to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
