import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import "./App.css";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("prashnottari_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children }) => {
  const user = getStoredUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const user = getStoredUser();
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/quiz" replace />;
  return children;
};

function App() {
  const user = getStoredUser();
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/quiz" : "/login"} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;