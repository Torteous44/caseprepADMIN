import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { templateApi } from "../../services/api";
import { Template, QuestionStructure } from "../../types";
import ImageUploader from "../common/ImageUploader";
import "./TemplateForm.css";

const DEFAULT_TEMPLATE: Template = {
  case_type: "",
  lead_type: "",
  difficulty: "",
  company: "",
  industry: "",
  prompt: "",
  structure: {
    question1: { prompt: "", context: "" },
    question2: { prompt: "", context: "" },
    question3: { prompt: "", context: "" },
    question4: { prompt: "", context: "" },
  },
  image_url: "",
  version: "1.0",
  title: "",
  description_short: "",
  description_long: "",
  duration: 30,
};

const TemplateForm: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<Template>(DEFAULT_TEMPLATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const navigate = useNavigate();
  const isEditMode = !!templateId;

  useEffect(() => {
    if (isEditMode) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await templateApi.getTemplateById(templateId!);
      setTemplate(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch template");
      console.error("Error fetching template:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStructureChange = (
    questionKey: string,
    field: keyof QuestionStructure,
    value: string
  ) => {
    setTemplate((prev) => ({
      ...prev,
      structure: {
        ...prev.structure,
        [questionKey]: {
          ...prev.structure[questionKey],
          [field]: value,
        },
      },
    }));
  };

  const handleImageUrlChange = (url: string) => {
    setTemplate((prev) => ({
      ...prev,
      image_url: url,
    }));
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (
      !template.case_type ||
      !template.lead_type ||
      !template.difficulty ||
      !template.prompt
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    // Validate structure
    for (const key in template.structure) {
      const question = template.structure[key];
      if (!question.prompt || !question.context) {
        setError(`Please fill in all fields for ${key}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        await templateApi.updateTemplate(templateId!, template);
      } else {
        await templateApi.createTemplate(template);
      }

      navigate("/admin/templates");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save template");
      console.error("Error saving template:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading template...</div>;
  }

  return (
    <div className="template-form-container">
      <div className="template-form-header">
        <h1>{isEditMode ? "Edit" : "Create"} Interview Template</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="template-form">
        <div className="form-section">
          <h2>Template Details</h2>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={template.title}
              onChange={handleChange}
              placeholder="User-friendly title for the template"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description_short">Short Description *</label>
            <input
              type="text"
              id="description_short"
              name="description_short"
              value={template.description_short}
              onChange={handleChange}
              placeholder="A brief tagline or summary"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description_long">Detailed Description</label>
            <textarea
              id="description_long"
              name="description_long"
              value={template.description_long}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed description of what the case covers"
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes) *</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={template.duration}
              onChange={handleChange}
              min={10}
              max={120}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="case_type">Case Type *</label>
              <input
                type="text"
                id="case_type"
                name="case_type"
                value={template.case_type}
                onChange={handleChange}
                placeholder="e.g., Market Entry, Profitability"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lead_type">Lead Type *</label>
              <select
                id="lead_type"
                name="lead_type"
                value={template.lead_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Lead Type</option>
                <option value="Interviewer-led">Interviewer-led</option>
                <option value="Candidate-led">Candidate-led</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={template.difficulty}
                onChange={handleChange}
                required
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={template.company || ""}
                onChange={handleChange}
                placeholder="e.g., Example Corp"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={template.industry || ""}
                onChange={handleChange}
                placeholder="e.g., Technology, Healthcare"
              />
            </div>

            <div className="form-group">
              <label htmlFor="version">Version</label>
              <input
                type="text"
                id="version"
                name="version"
                value={template.version}
                onChange={handleChange}
                placeholder="e.g., 1.0"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Main Prompt</h2>

          <div className="form-group">
            <label htmlFor="prompt">Case Prompt *</label>
            <textarea
              id="prompt"
              name="prompt"
              value={template.prompt}
              onChange={handleChange}
              placeholder="Enter the main case prompt..."
              rows={6}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Case Image</h2>
          <p className="image-upload-note">
            Images are uploaded directly to Cloudinary and will be saved along
            with the template. The URL will be automatically added to the form.
          </p>

          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              type="text"
              id="image_url"
              name="image_url"
              value={template.image_url || ""}
              onChange={handleChange}
              placeholder="Enter image URL or upload an image below"
            />
          </div>

          <ImageUploader
            currentImageUrl={template.image_url}
            onImageUrlChange={handleImageUrlChange}
          />
        </div>

        <div className="form-section">
          <h2>Question Structure</h2>

          {Object.keys(template.structure).map((questionKey, index) => (
            <div className="question-structure" key={questionKey}>
              <h3>Question {index + 1}</h3>

              <div className="form-group">
                <label htmlFor={`${questionKey}-prompt`}>
                  Question Prompt *
                </label>
                <textarea
                  id={`${questionKey}-prompt`}
                  value={template.structure[questionKey].prompt}
                  onChange={(e) =>
                    handleStructureChange(questionKey, "prompt", e.target.value)
                  }
                  placeholder="Enter question prompt..."
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`${questionKey}-context`}>
                  Interviewer Context *
                </label>
                <textarea
                  id={`${questionKey}-context`}
                  value={template.structure[questionKey].context}
                  onChange={(e) =>
                    handleStructureChange(
                      questionKey,
                      "context",
                      e.target.value
                    )
                  }
                  placeholder="Enter context for interviewers..."
                  rows={3}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/admin/templates")}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : isEditMode
              ? "Update Template"
              : "Create Template"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateForm;
