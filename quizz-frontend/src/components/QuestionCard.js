import React from "react";

export default function QuestionCard({ index, total, question, selected, onSelect }) {
  // Build options array from the backend data shape
  const options = [
    { key: "option1", label: question.option1 },
    { key: "option2", label: question.option2 },
    { key: "option3", label: question.option3 },
    { key: "option4", label: question.option4 },
  ];

  return (
    <div className="question-card">
      {/* Notebook hole-punch decoration */}
      <div className="holes" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>

      <div className="card-body">
        <span className="category-badge">
          Question {index + 1}
        </span>

        <p className="question-text fade-in" key={index} aria-live="polite" aria-atomic="true">
          {question.question}
        </p>

        {/* Options */}
        <div className="options-grid" role="group" aria-label="Answer choices">
          {options.map((opt, i) => {
            const isSelected = selected === opt.key;
            return (
              <button
                key={opt.key}
                className={`option-btn slide-in ${isSelected ? "selected" : ""}`}
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => onSelect(opt.key)}
                aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt.label}`}
              >
                <span className="option-label">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="option-text">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
