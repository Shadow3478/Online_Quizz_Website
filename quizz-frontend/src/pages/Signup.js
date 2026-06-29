import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/register", form, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data?.success) {
        setSuccess("Account created! Logging you in...");
        localStorage.setItem(
          "prashnottari_user",
          JSON.stringify({
            username: res.data.username,
            email: res.data.email,
            isAdmin: !!res.data.isAdmin,
          })
        );
        setTimeout(() => navigate("/quiz", { replace: true }), 600);
      } else {
        setError(res.data?.message || "Signup failed");
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
      <div className="login-card signup">
        <h1 className="login-title">
          Sign Up
          <span>Create your account</span>
        </h1>

        <div className="field">
          <label htmlFor="signup-username">Username</label>
          <input
            type="text"
            id="signup-username"
            name="username"
            value={form.username}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="Choose a username"
            maxLength={40}
            autoComplete="username"
          />
        </div>

        <div className="field">
          <label htmlFor="signup-email">Email</label>
          <input
            type="email"
            id="signup-email"
            name="email"
            value={form.email}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>

        <p className={`error-msg ${error ? "visible" : ""}`} role="alert">
          {error}
        </p>
        {success && <p className="success-msg">{success}</p>}

        <button
          className="btn-signin"
          type="button"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account →"}
        </button>

        {/* Decorative ruled lines */}
        <div className="login-ruled-lines" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <div className="doodle-row" aria-hidden="true">
          <span>📓</span><span>✨</span><span>🎓</span><span>📚</span>
        </div>

        <p className="login-footer-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
