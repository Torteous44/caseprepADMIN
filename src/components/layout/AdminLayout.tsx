import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="logo">
          <h1>CasePrepared Admin</h1>
        </div>
        <div className="user-info">
          {user && (
            <>
              <span className="user-name">{user.full_name}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <ul>
              <li>
                <NavLink
                  to="/admin/templates"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Templates
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/lessons"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Lessons
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
