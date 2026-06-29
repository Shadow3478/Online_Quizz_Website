import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    score = 0,
    total = 0,
    percent = 0,
    timeTaken = 0,
    breakdown = [],
    username = "Student",
  } = location.state || {};

  const circleRef = useRef(null);

  const passed = percent >= 50;

  // Animate the score donut on mount
  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    requestAnimationFrame(() => {
      setTimeout(() => {
        const offset = circumference - (percent / 100) * circumference;
        circle.style.transition = "stroke-dashoffset 1.2s ease";
        circle.style.strokeDashoffset = offset;
      }, 300);
    });
  }, [percent]);

  // Format time
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  const playAgain = () => {
    navigate("/quiz", { replace: true });
  };

  return (
    <div className="results-wrapper">
      <header className="results-header">
        <h2>📋 Your Results</h2>
        <p className="result-name-line">
          Well done, <strong>{username}</strong>!
        </p>
      </header>

      {/* Animated score donut */}
      <div className="score-donut-wrap" aria-hidden="true">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle className="donut-track" cx="70" cy="70" r="54" />
          <circle
            className="donut-fill"
            ref={circleRef}
            cx="70"
            cy="70"
            r="54"
          />
          <text className="donut-label" x="70" y="65">
            {percent}%
          </text>
          <text className="donut-sub" x="70" y="82">
            score
          </text>
        </svg>
      </div>

      {/* Stat cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Score</div>
          <div className="stat-value">
            {score}/{total}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Time Taken</div>
          <div className="stat-value">{timeStr}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Status</div>
          <div className={`stat-value ${passed ? "status-pass" : "status-fail"}`}>
            {passed ? "Pass ✓" : "Try Again"}
          </div>
        </div>
      </div>

      {/* Play Again */}
      <button className="btn-play-again" onClick={playAgain}>
        ↺ Play Again
      </button>

      {/* Per-question breakdown */}
      {breakdown.length > 0 && (
        <div className="breakdown-section">
          <h3>Question Breakdown</h3>
          <ul className="breakdown-list" aria-label="Per-question results">
            {breakdown.map((item, i) => (
              <li
                key={i}
                className={`breakdown-item ${item.isCorrect ? "correct" : "incorrect"}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="breakdown-icon">
                  {item.isCorrect ? "✓" : "✗"}
                </span>
                <div className="breakdown-content">
                  <p className="breakdown-q">{item.question}</p>
                  {!item.isCorrect && (
                    <p className="breakdown-ans">
                      <span className="yours">
                        Your answer: {item.selected || "—"}
                      </span>
                      <span className="correct-ans">
                        Correct: {item.correctAnswer}
                      </span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
