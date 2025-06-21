import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { lessonApi } from "../../services/api";
import { Lesson, LessonBody, Phase } from "../../types";
import ImageUploader from "../common/ImageUploader";
import "./TemplateForm.css"; // Reusing the existing CSS

const DEFAULT_LESSON: Lesson = {
  id: "",
  title: "",
  difficulty: "medium",
  company: "",
  body: {
    phases: [
      {
        type: "introduction",
        content: "",
      },
      {
        type: "questioning",
        questions: [
          {
            text: "",
            expected_components: [
              {
                id: "component1",
                description: "",
              },
            ],
          },
        ],
      },
    ],
    voice_id: "en-US-Neural2-F",
  },
  image_url: "",
  short_description: "",
  long_description: "",
};

const LessonForm: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson>(DEFAULT_LESSON);
  const [bodyJson, setBodyJson] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const navigate = useNavigate();
  const isEditMode = !!lessonId;

  useEffect(() => {
    if (isEditMode) {
      fetchLesson();
    } else {
      // Initialize the body JSON for a new lesson
      setBodyJson(JSON.stringify(DEFAULT_LESSON.body, null, 2));
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await lessonApi.getLessonById(lessonId!);
      const fetchedLesson = response.data;
      setLesson(fetchedLesson);
      setBodyJson(JSON.stringify(fetchedLesson.body, null, 2));
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch lesson");
      console.error("Error fetching lesson:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setLesson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBodyJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBodyJson(e.target.value);
  };

  const handleImageUrlChange = (url: string) => {
    setLesson((prev) => ({
      ...prev,
      image_url: url,
    }));
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!lesson.id || !lesson.title || !lesson.difficulty) {
      setError("Please fill in all required fields");
      return false;
    }

    // Validate the JSON structure
    try {
      const parsedBody = JSON.parse(bodyJson);

      // Just check if it's valid JSON
      return true;
    } catch (err) {
      setError("Invalid JSON structure for body");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Parse the body JSON
      const parsedBody = JSON.parse(bodyJson);

      // Create the lesson data
      const lessonData = {
        ...lesson,
        body: parsedBody,
      };

      if (isEditMode) {
        await lessonApi.updateLesson(lessonId!, lessonData);
      } else {
        await lessonApi.createLesson(lessonData);
      }

      navigate("/admin/lessons");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save lesson");
      console.error("Error saving lesson:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading lesson...</div>;
  }

  return (
    <div className="template-form-container">
      <div className="template-form-header">
        <h1>{isEditMode ? "Edit" : "Create"} Lesson</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="template-form">
        <div className="form-section">
          <h2>Lesson Details</h2>

          <div className="form-group">
            <label htmlFor="id">Lesson ID *</label>
            <input
              type="text"
              id="id"
              name="id"
              value={lesson.id}
              onChange={handleChange}
              placeholder="Unique identifier for the lesson (URL-friendly)"
              required
              disabled={isEditMode} // ID cannot be changed in edit mode
            />
            {isEditMode && (
              <small
                style={{ display: "block", marginTop: "5px", color: "#666" }}
              >
                Lesson ID cannot be changed after creation
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={lesson.title}
              onChange={handleChange}
              placeholder="User-friendly title for the lesson"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={lesson.difficulty}
                onChange={handleChange}
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={lesson.company}
                onChange={handleChange}
                placeholder="e.g., McKinsey, BCG"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="short_description">Short Description *</label>
            <input
              type="text"
              id="short_description"
              name="short_description"
              value={lesson.short_description}
              onChange={handleChange}
              placeholder="A brief tagline or summary"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="long_description">Detailed Description</label>
            <textarea
              id="long_description"
              name="long_description"
              value={lesson.long_description}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed description of what the lesson covers"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Case Image</h2>
          <p className="image-upload-note">
            Images are uploaded directly to Cloudinary and will be saved along
            with the lesson. The URL will be automatically added to the form.
          </p>

          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              type="text"
              id="image_url"
              name="image_url"
              value={lesson.image_url}
              onChange={handleChange}
              placeholder="Enter image URL or upload an image below"
            />
          </div>

          <ImageUploader
            currentImageUrl={lesson.image_url}
            onImageUrlChange={handleImageUrlChange}
          />
        </div>

        <div className="form-section">
          <h2>Lesson Body (JSON)</h2>
          <p className="image-upload-note">
            Enter the lesson body as JSON. This should include phases,
            questions, and expected components. The structure should follow the
            API documentation, but validation has been relaxed to allow for more
            flexibility.
          </p>

          <div className="form-group">
            <label htmlFor="bodyJson">Body JSON *</label>
            <textarea
              id="bodyJson"
              value={bodyJson}
              onChange={handleBodyJsonChange}
              rows={15}
              style={{ fontFamily: "monospace" }}
              placeholder="Enter lesson body as JSON"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/admin/lessons")}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : isEditMode
              ? "Update Lesson"
              : "Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonForm;
