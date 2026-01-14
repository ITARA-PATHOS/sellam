import React, { useEffect, useState, useCallback } from "react";
import { getAccessToken } from "../utils/token";
import "./CSS/AdminCategory.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminLocation = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Navigation
  const [parentId, setParentId] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // CRUD
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    is_active: true,
    is_popular: false,
  });

  // 1. Determine the "Type" for the request body automatically
  // Level 0 -> State | Level 1 -> City | Level 2 -> Area
  const getTargetType = () => {
    if (history.length === 0) return "state";
    if (history.length === 1) return "city";
    return "area";
  };

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      let url = `${BASE_URL}/v1/admin/locations?per_page=50`;

      if (searchQuery) {
        url += `&search=${searchQuery}`;
      } else if (parentId) {
        url += `&parent_id=${parentId}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (data.success) setLocations(data.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [parentId, searchQuery]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // 2. Navigation
  const handleDrillDown = (loc) => {
    setHistory([...history, { id: loc.id, name: loc.name }]);
    setParentId(loc.id);
    setSearchQuery("");
  };

  const handleGoBack = (index) => {
    if (index === -1) {
      setHistory([]);
      setParentId(null);
    } else {
      const newHistory = history.slice(0, index + 1);
      setHistory(newHistory);
      setParentId(newHistory[newHistory.length - 1].id);
    }
    setSearchQuery("");
  };

  // 3. Save (Store & Update)
  const handleSave = async (e) => {
    e.preventDefault();
    const token = await getAccessToken();

    // Determine if we are updating or creating
    const isUpdate = !!editingLocation;
    const method = isUpdate ? "PUT" : "POST";
    const url = isUpdate
      ? `${BASE_URL}/v1/admin/locations/${editingLocation.id}`
      : `${BASE_URL}/v1/admin/locations`;

    // Construct the Request Body exactly as Laravel expects it
    const payload = {
      name: formData.name,
      is_active: formData.is_active,
      is_popular: formData.is_popular,
      type: isUpdate ? editingLocation.type : getTargetType(),
      parent_id: isUpdate ? editingLocation.parent_id : parentId,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setEditingLocation(null);
        fetchLocations(); // Refresh the list
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure? This will delete all sub-locations too.")
    )
      return;
    const token = await getAccessToken();
    await fetch(`${BASE_URL}/v1/admin/locations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLocations();
  };

  return (
    <div className="main-area">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-area">
        <span className="section-title">Manage Locations</span>
        <div className="breadcrumb">
          <span
            onClick={() => handleGoBack(-1)}
            style={{ cursor: "pointer", color: "#280769" }}
          >
            Locations
          </span>
          {history.map((h, i) => (
            <span
              key={h.id}
              onClick={() => handleGoBack(i)}
              style={{ cursor: "pointer" }}
            >
              {" "}
              &gt; {h.name}
            </span>
          ))}
        </div>
      </div>

      <div className="score1">
        <button
          className="ducther2"
          onClick={() => {
            setEditingLocation(null);
            setFormData({ name: "", is_active: true, is_popular: false });
            setShowForm(true);
          }}
        >
          ＋ Add {getTargetType().toUpperCase()}
        </button>
        <input
          type="text"
          placeholder="Search everywhere..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-login-input"
          style={{ margin: 0, width: "250px", border: "1px solid #ccc" }}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Sub-locations</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No locations found.
                  </td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr key={loc.id}>
                    <td>
                      <strong style={{ fontSize: "15px" }}>{loc.name}</strong>
                      {searchQuery && loc.parent_name && (
                        <small
                          style={{
                            display: "block",
                            color: "#888",
                            fontStyle: "italic",
                          }}
                        >
                          in {loc.parent_name}
                        </small>
                      )}
                    </td>
                    <td>
                      {loc.can_drill_down ? (
                        <button
                          className="ducther2"
                          onClick={() => handleDrillDown(loc)}
                        >
                          View {loc.children_count}{" "}
                          {loc.type === "state" ? "Cities" : "Areas"}
                        </button>
                      ) : (
                        <span style={{ color: "#ccc", fontSize: "12px" }}>
                          Leaf Level
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          loc.is_active ? "active" : "disabled"
                        }`}
                      >
                        {loc.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="ducther3"
                        onClick={() => {
                          setEditingLocation(loc);
                          setFormData({
                            name: loc.name,
                            is_active: loc.is_active,
                            is_popular: loc.is_popular,
                          });
                          setShowForm(true);
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className="ducther4"
                        onClick={() => handleDelete(loc.id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL FIX: Using standard checkbox + label structure for existing CSS compatibility */}
      {showForm && (
        <div className="modal-overlay4">
          <div className="modal-content4">
            <h3 style={{ marginBottom: "20px" }}>
              {editingLocation ? "Update" : "Create"}{" "}
              {getTargetType().toUpperCase()}
            </h3>
            <form onSubmit={handleSave}>
              <label>
                Location Name
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter name"
                  required
                />
              </label>

              {/* Status Toggles with IDs to ensure the CSS labels work */}
              <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input
                    type="checkbox"
                    id="is_active"
                    style={{ display: "inline-block", width: "auto" }} // Overriding 'display:none' if exists
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="is_active"
                    style={{ margin: 0, cursor: "pointer" }}
                  >
                    Active
                  </label>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input
                    type="checkbox"
                    id="is_popular"
                    style={{ display: "inline-block", width: "auto" }} // Overriding 'display:none' if exists
                    checked={formData.is_popular}
                    onChange={(e) =>
                      setFormData({ ...formData, is_popular: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="is_popular"
                    style={{ margin: 0, cursor: "pointer" }}
                  >
                    Popular
                  </label>
                </div>
              </div>

              <div className="modal-actions4" style={{ marginTop: "30px" }}>
                <button type="submit" className="ducther5">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="ducther6"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLocation;
