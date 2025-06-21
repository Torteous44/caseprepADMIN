import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import LoginForm from "./components/auth/LoginForm";
import TemplateList from "./components/templates/TemplateList";
import TemplateForm from "./components/templates/TemplateForm";
import LessonList from "./components/templates/LessonList";
import LessonForm from "./components/templates/LessonForm";
import Unauthorized from "./pages/Unauthorized";
import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected admin routes */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route element={<AdminLayout />}>
              {/* Template routes */}
              <Route path="/admin/templates" element={<TemplateList />} />
              <Route path="/admin/templates/new" element={<TemplateForm />} />
              <Route
                path="/admin/templates/edit/:templateId"
                element={<TemplateForm />}
              />

              {/* Lesson routes */}
              <Route path="/admin/lessons" element={<LessonList />} />
              <Route path="/admin/lessons/new" element={<LessonForm />} />
              <Route path="/admin/lessons/:lessonId" element={<LessonForm />} />
            </Route>
          </Route>

          {/* Redirect root to templates */}
          <Route
            path="/"
            element={<Navigate to="/admin/templates" replace />}
          />

          {/* Catch-all redirect */}
          <Route
            path="*"
            element={<Navigate to="/admin/templates" replace />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
