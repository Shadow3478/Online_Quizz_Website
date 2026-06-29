import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("prashnottari_user");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Site navigation">
      <Link to={user ? "/quiz" : "/"} className="nav-brand" aria-label="Prashnottari home">
        Prashnottari
      </Link>

      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user-chip">
              {user.username}
              {user.isAdmin && <span className="nav-admin-badge">Admin</span>}
            </span>
            {user.isAdmin && (
              <Link to="/admin" className="nav-link-admin">
                Admin
              </Link>
            )}
            <button className="btn-logout" onClick={handleLogout} aria-label="Log out">
              Logout
            </button>
          </>
        ) : (
          <div className="nav-auth-links">
            <Link className="nav-auth-link" to="/login">
              Login
            </Link>
            <Link className="nav-auth-link primary" to="/signup">
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
