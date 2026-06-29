import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import { useNavigate } from "react-router-dom";

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const startTimeRef = useRef(Date.now());

  const total = 10;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:8080/questions");
        const all = res.data || [];
        const randomized = shuffle(all).slice(0, Math.min(total, all.length));
        if (mounted) {
          setQuestions(randomized);
          startTimeRef.current = Date.now();
        }
      } catch (e) {
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const answeredCount = Object.keys(answers).length;

  const progress = useMemo(() => {
    return Math.round(((current + 1) / Math.max(questions.length, 1)) * 100);
  }, [current, questions.length]);

  const onSelect = (index, choiceKey) => {
    setAnswers((prev) => ({ ...prev, [index]: choiceKey }));
  };

  const onSubmit = () => {
    // Warn if unanswered questions remain
    const unanswered = questions.length - answeredCount;
    if (unanswered > 0) {
      const msg =
        unanswered === 1
          ? "You have 1 unanswered question. Submit anyway?"
          : `You have ${unanswered} unanswered questions. Submit anyway?`;
      if (!window.confirm(msg)) return;
    }

    // Calculate results with breakdown
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    let score = 0;
    const breakdown = questions.map((q, i) => {
      const chosenKey = answers[i] || null;
      const chosenLabel = chosenKey ? q[chosenKey] : null;
      const correctKey = ["option1", "option2", "option3", "option4"].find(
        (k) => q[k] === q.answer
      );
      const isCorrect = chosenKey && correctKey && chosenKey === correctKey;
      if (isCorrect) score += 1;
      return {
        question: q.question,
        selected: chosenLabel,
        correctAnswer: q.answer,
        isCorrect: !!isCorrect,
      };
    });

    const percent = questions.length
      ? Math.round((score / questions.length) * 100)
      : 0;

    navigate("/result", {
      state: {
        score,
        total: questions.length,
        percent,
        timeTaken: elapsed,
        breakdown,
        username:
          JSON.parse(localStorage.getItem("prashnottari_user") || "{}")
            .username || "Student",
      },
      replace: true,
    });
  };

  if (loading) {
    return (
      <div className="quiz-wrapper">
        <div className="quiz-loading">📝 Loading questions…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="quiz-wrapper">
        <div className="quiz-error">{error}</div>
      </div>
    );
  }
  if (!questions.length) {
    return (
      <div className="quiz-wrapper">
        <div className="quiz-loading">No questions available.</div>
      </div>
    );
  }

  const q = questions[current];
  const isFirst = current === 0;
  const isLast = current === questions.length - 1;

  return (
    <div className="quiz-wrapper">
      {/* Progress Bar */}
      <div className="progress-bar-wrap" aria-label="Progress">
        <div className="progress-meta">
          <span className="progress-text" aria-live="polite">
            Question {current + 1} of {questions.length}
          </span>
          <span className="q-counter" aria-live="polite">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <QuestionCard
        key={current}
        index={current}
        total={questions.length}
        question={q}
        selected={answers[current]}
        onSelect={(key) => onSelect(current, key)}
      />

      {/* Navigation */}
      <nav className="quiz-nav" aria-label="Question navigation">
        <button
          className="btn-nav btn-prev"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={isFirst}
          aria-label="Previous question"
        >
          ← Previous
        </button>
        {!isLast ? (
          <button
            className="btn-nav btn-next"
            onClick={() =>
              setCurrent((c) => Math.min(questions.length - 1, c + 1))
            }
            aria-label="Next question"
          >
            Next →
          </button>
        ) : (
          <button
            className="btn-nav btn-submit"
            onClick={onSubmit}
            aria-label="Submit quiz"
          >
            Submit Quiz ✓
          </button>
        )}
      </nav>
    </div>
  );
}
