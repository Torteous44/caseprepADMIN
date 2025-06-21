import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { lessonApi } from "../../services/api";
import { Lesson } from "../../types";
import "./LessonList.css"; // Using our custom CSS for lessons

const LessonList: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await lessonApi.getLessons();
      setLessons(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch lessons");
      console.error("Error fetching lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await lessonApi.deleteLesson(id);
        // Refresh the list after deletion
        fetchLessons();
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to delete lesson");
        console.error("Error deleting lesson:", err);
      }
    }
  };

  if (loading) {
    return <div className="loading-container">Loading lessons...</div>;
  }

  return (
    <div className="template-list-container">
      <div className="template-list-header">
        <h1>Lesson Management</h1>
        <Link to="/admin/lessons/new" className="add-button">
          Create New Lesson
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {lessons.length === 0 ? (
        <div className="no-templates-message">
          <p>
            No lessons found. Click the button above to create your first
            lesson.
          </p>
        </div>
      ) : (
        <div className="template-grid">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="template-card">
              <div className="template-image">
                {lesson.image_url ? (
                  <img src={lesson.image_url} alt={lesson.title} />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
              </div>
              <div className="template-content">
                <h2>{lesson.title}</h2>
                <p className="template-description">
                  {lesson.short_description}
                </p>
                <div className="template-meta">
                  <span className="template-difficulty">
                    {lesson.difficulty}
                  </span>
                  {lesson.company && (
                    <span className="template-company">{lesson.company}</span>
                  )}
                </div>
                <div className="template-actions">
                  <Link
                    to={`/admin/lessons/${lesson.id}`}
                    className="edit-button"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonList;
