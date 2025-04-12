import React from "react";
import { Link } from "react-router-dom";
import "./Unauthorized.css";

const Unauthorized: React.FC = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">🔒</div>
        <h1>Access Denied</h1>
        <p>
          You don't have permission to access this area. This section is
          restricted to admin users only.
        </p>
        <div className="unauthorized-actions">
          <Link to="/login" className="login-link">
            Return to Login
          </Link>
          <Link to="/admin/templates" className="home-link">
            Go to Templates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
