import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { templateApi } from "../../services/api";
import { Template, TemplateFilters } from "../../types";
import "./TemplateList.css";

const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFilters>({
    case_type: "",
    lead_type: "",
    difficulty: "",
    industry: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, [filters]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await templateApi.getTemplates(filters);
      setTemplates(response.data as Template[]);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch templates");
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      await templateApi.deleteTemplate(id);
      // Filter out the deleted template
      setTemplates(templates.filter((template) => template.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete template");
      console.error("Error deleting template:", err);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="template-list-container">
      <div className="template-list-header">
        <h1>Interview Templates</h1>
        <button
          className="create-template-btn"
          onClick={() => navigate("/admin/templates/new")}
        >
          Create New Template
        </button>
      </div>

      <div className="template-filters">
        <div className="filter-group">
          <label htmlFor="case_type">Case Type</label>
          <select
            id="case_type"
            name="case_type"
            value={filters.case_type}
            onChange={handleFilterChange}
          >
            <option value="">All Case Types</option>
            <option value="Market Entry">Market Entry</option>
            <option value="Profitability">Profitability</option>
            <option value="Pricing">Pricing</option>
            <option value="Growth Strategy">Growth Strategy</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="lead_type">Lead Type</label>
          <select
            id="lead_type"
            name="lead_type"
            value={filters.lead_type}
            onChange={handleFilterChange}
          >
            <option value="">All Lead Types</option>
            <option value="Interviewer-led">Interviewer-led</option>
            <option value="Candidate-led">Candidate-led</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            name="difficulty"
            value={filters.difficulty}
            onChange={handleFilterChange}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="industry">Industry</label>
          <select
            id="industry"
            name="industry"
            value={filters.industry}
            onChange={handleFilterChange}
          >
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Retail">Retail</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="no-templates">
          No templates found. Create a new template to get started.
        </div>
      ) : (
        <div className="templates-table-container">
          <table className="templates-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Case Type</th>
                <th>Lead Type</th>
                <th>Difficulty</th>
                <th>Company</th>
                <th>Industry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>
                    {template.image_url ? (
                      <img
                        src={template.image_url}
                        alt={template.case_type}
                        className="template-thumbnail"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>{template.case_type}</td>
                  <td>{template.lead_type}</td>
                  <td>
                    <span
                      className={`difficulty ${template.difficulty.toLowerCase()}`}
                    >
                      {template.difficulty}
                    </span>
                  </td>
                  <td>{template.company || "N/A"}</td>
                  <td>{template.industry || "N/A"}</td>
                  <td className="actions-cell">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/admin/templates/edit/${template.id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTemplate(template.id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TemplateList;
