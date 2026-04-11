export default function CircularProgress({ value, maxValue = 100 }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / maxValue) * circumference;

  return (
    <div className="circular-progress-wrap">
      <svg className="circular-progress" width="120" height="120" viewBox="0 0 120 120">
        <circle className="circle-bg" cx="60" cy="60" r={radius} strokeWidth="8" />
        <circle
          className="circle-progress"
          cx="60" cy="60" r={radius}
          strokeWidth="8"
          style={{ strokeDasharray: circumference, strokeDashoffset }}
        />
      </svg>
      <div className="circular-progress-text">
        <span className="score-val">{value}</span>
        <span className="score-max">/{maxValue}</span>
      </div>
    </div>
  );
}
