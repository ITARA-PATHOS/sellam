import React, { useEffect, useState } from "react";
import { getAccessToken } from "../utils/token";
import "./CSS/AdminCategory.css"; // reuse same CSS

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminNotifyTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedTemplate, setSelectedTemplate] = useState(null); // view details modal
  const [editingTemplate, setEditingTemplate] = useState(null); // edit mode

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    email_subject: "",
    email_content: "",
    email_status: false,
    push_status: false,
    inapp_status: false,
  });

  // Fetch list
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/notify-templates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTemplates(data.data);
        setFilteredTemplates(data.data);
      } else {
        setError(data.message || "Failed to fetch templates");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch details
  const fetchTemplateDetails = async (id) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/notify-templates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSelectedTemplate(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // search filter
  useEffect(() => {
    let data = templates;
    if (search.trim() !== "") {
      data = templates.filter((tpl) =>
        tpl.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredTemplates(data);
  }, [search, templates]);

  // form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // update template
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingTemplate) return;

    try {
      const token = await getAccessToken();
      const res = await fetch(
        `${BASE_URL}/v1/admin/notify-templates/${editingTemplate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update template");

      await fetchTemplates();
      setEditingTemplate(null);
      setSelectedTemplate(null);
    } catch (err) {
      console.error(err);
    }
  };

  // click on row → show details
  const handleViewDetails = (tpl) => {
    fetchTemplateDetails(tpl.id);
  };

  // start editing
  const handleEdit = (tpl) => {
    setEditingTemplate(tpl);
    setFormData({
      title: tpl.title,
      message: tpl.message,
      email_subject: tpl.email_subject,
      email_content: tpl.email_content,
      email_status: tpl.email_status,
      push_status: tpl.push_status,
      inapp_status: tpl.inapp_status,
    });
  };

  return (
    <div className="main-area">
    {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <span className="section-title">Manage Notifications</span>
        <span className="breadcrumb">Admin &gt; Notifications</span>
      </div>

      {/* Search bar */}
      <div className="score1">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", flexGrow: 1 }}
        />
      </div>

    <div className="table-container">

      {/* Table */}
      {loading ? (
        <p>Loading templates...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTemplates.map((tpl) => (
              <tr key={tpl.id}>
                <td>{tpl.name}</td>
                <td>{tpl.type}</td>
                <td>{tpl.title}</td>
                <td>
                  <button
                    className="ducther2"
                    onClick={() => handleViewDetails(tpl)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Details modal */}
      {selectedTemplate && !editingTemplate && (
        <div className="modal-overlay5">
          <div className="modal-content5">
            <h3>Template Details</h3>
            <p>
              <b>Name:</b> {selectedTemplate.name}
            </p>
            <p>
              <b>Type:</b> {selectedTemplate.type}
            </p>
            <p>
              <b>Title:</b> {selectedTemplate.title}
            </p>
            <p>
              <b>Message:</b> {selectedTemplate.message}
            </p>
            <p>
              <b>Email Subject:</b> {selectedTemplate.email_subject}
            </p>
            <p>
              <b>Email Content:</b> {selectedTemplate.email_content}
            </p>
            <p>
              <b>Email Status:</b>{" "}
              {selectedTemplate.email_status ? "Enabled" : "Disabled"}
            </p>
            <p>
              <b>Push Status:</b>{" "}
              {selectedTemplate.push_status ? "Enabled" : "Disabled"}
            </p>
            <p>
              <b>In-App Status:</b>{" "}
              {selectedTemplate.inapp_status ? "Enabled" : "Disabled"}
            </p>

            <div className="modal-actions4">
              <button className="ducther5" onClick={() => handleEdit(selectedTemplate)}>
                Edit
              </button>
              <button className="ducther6" onClick={() => setSelectedTemplate(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingTemplate && (
        <div className="modal-overlay5">
          <div className="modal-content5 score2">
            <h3>Edit Template</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email Subject
                <input
                  type="text"
                  name="email_subject"
                  value={formData.email_subject}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email Content
                <textarea
                  name="email_content"
                  value={formData.email_content}
                  onChange={handleChange}
                />
              </label>

              <label>
                <input
                  className="juti"
                  type="checkbox"
                  name="email_status"
                  checked={formData.email_status}
                  onChange={handleChange}
                />
                Email Status
              </label>
              <label>
                <input
                  className="juti"
                  type="checkbox"
                  name="push_status"
                  checked={formData.push_status}
                  onChange={handleChange}
                />
                Push Status
              </label>
              <label>
                <input
                  className="juti"
                  type="checkbox"
                  name="inapp_status"
                  checked={formData.inapp_status}
                  onChange={handleChange}
                />
                In-App Status
              </label>

              <div className="modal-actions4">
                <button type="submit" className="ducther5">
                  Update
                </button>
                <button
                  type="button"
                  className="ducther6"
                  onClick={() => setEditingTemplate(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminNotifyTemplate;
