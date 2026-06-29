import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim()) {
      setError("Please fill in all fields to continue.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/register", form, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data?.success) {
        localStorage.setItem(
          "prashnottari_user",
          JSON.stringify({
            username: res.data.username,
            email: res.data.email,
            isAdmin: !!res.data.isAdmin,
          })
        );
        navigate("/quiz", { replace: true });
      } else {
        setError(res.data?.message || "Login failed");
      }
    } catch (err) {
      setError("Unable to reach server");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSubmit(e);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">
          Sign In
          <span>Enter your details to begin</span>
        </h1>

        <div className="field">
          <label htmlFor="input-username">Your Name</label>
          <input
            type="text"
            id="input-username"
            name="username"
            value={form.username}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Arjun Sharma"
            maxLength={40}
            autoComplete="name"
            spellCheck={false}
          />
        </div>

        <div className="field">
          <label htmlFor="input-email">Email</label>
          <input
            type="email"
            id="input-email"
            name="email"
            value={form.email}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g. arjun@email.com"
            autoComplete="email"
          />
        </div>

        <p className={`error-msg ${error ? "visible" : ""}`} role="alert" aria-live="polite">
          {error}
        </p>

        <button
          className="btn-signin"
          type="button"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Start Quiz →"}
        </button>

        {/* Decorative ruled lines */}
        <div className="login-ruled-lines" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <div className="doodle-row" aria-hidden="true">
          <span>✏️</span><span>📝</span><span>📖</span><span>🖊️</span>
        </div>

        <p className="login-footer-link">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
