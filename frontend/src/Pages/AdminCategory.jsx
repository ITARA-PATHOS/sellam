import React, { useEffect, useState } from "react";
import { getAccessToken } from "../utils/token";
import "./CSS/AdminCategory.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const formatImageUrl = (image) => {
  if (!image) return null;
  // If backend already gave full URL, use it directly
  if (image.startsWith("http")) return image;
  // Otherwise, prepend BASE_URL
  return `${BASE_URL.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
};

console.log("BASE_URL:", BASE_URL); // ✅ check if it's defined and correct


const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    omitImage: false,
    status: "active",
  });

  const [details, setDetails] = useState(null);

  // fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/categories?per_page=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        // Wrap images with BASE_URL
      const catsWithImages = data.data.map((cat) => ({
  ...cat,
  image: formatImageUrl(cat.image),
}));

        setCategories(catsWithImages || []);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // fetch category details
  const fetchDetails = async (id) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (data.success) {
    setDetails({
  ...data.data,
  image: formatImageUrl(data.data.image),
});

      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---- CREATE ----
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessToken();
      const fd = new FormData();
      fd.append("name", formData.name);
      if (formData.description) fd.append("description", formData.description);
      fd.append("status", formData.status);

      if (formData.image instanceof File) {
        fd.append("image", formData.image);
      }

      const res = await fetch(`${BASE_URL}/v1/admin/categories`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: fd,
      });

      const data = await res.json();
      console.log("⬅️ Create Response:", data);

    if (data.success) {
  await fetchCategories();   // refresh categories after creating
  setDetails(null);
  resetForm();
}
 else {
        alert(data.message || "Failed to create category");
      }
    } catch (err) {
      console.error("❌ Create error:", err);
    }
  };

  // ---- UPDATE ----
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || "",
        description: editingCategory.description || "",
        status: editingCategory.status || "active",
        image: editingCategory.image || null,
        omitImage: false,
      });
    }
  }, [editingCategory]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessToken();
      const fd = new FormData();

      console.log("📝 FormData before update:", formData);

      fd.append("name", formData.name);
      if (formData.description) fd.append("description", formData.description);
      fd.append("status", formData.status);

      if (formData.omitImage) {
        fd.append("image", "null");
      } else if (formData.image instanceof File) {
        fd.append("image", formData.image);
      }

      const res = await fetch(`${BASE_URL}/v1/admin/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: fd,
      });

      const data = await res.json();
      console.log("⬅️ Update Response:", data);

      if (data.success) {
        console.log("✅ Updated category:", data.data);

        await fetchCategories();     // get fresh data from backend
      setDetails(null);            // close details modal
      resetForm();                 // reset form to default
    } else {
        alert(data.message || "Failed to update category");
      }
    } catch (err) {
      console.error("❌ Update error:", err);
    }
  };

  // reset form
  const resetForm = (data = null) => {
    setShowForm(false);
    setEditingCategory(null);
    if (data) {
      setFormData({
        name: data.name || "",
        description: data.description || "",
        image: data.image || null,
        omitImage: !data.image,
        status: data.status || "active",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        image: null,
        omitImage: true,
        status: "active",
      });
    }
  };

  // delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-area">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <span className="section-title">Manage Categories</span>
        <span className="breadcrumb">Admin &gt; Categories</span>
      </div>

      {/* Create button */}
      <div className="score1">
        <button className="ducther2" onClick={() => setShowForm(true)}>
          ＋ Create Category
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr
                  key={cat.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => fetchDetails(cat.id)}
                >
                  <td>{i + 1}</td>
                  <td>{cat.name}</td>
                  <td>
                    <span
                      className={`status-badge ${cat.status === "active" ? "active" : "disabled"}`}
                    >
                      {cat.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="ducther3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(cat);
                        setFormData({
                          name: cat.name,
                          description: cat.description || "",
                          image: cat.image ? cat.image : null, // already full URL
                          omitImage: !cat.image,
                          status: cat.status,
                        });
                        setShowForm(true);
                      }}
                    >
                      ✎
                    </button>
                    <button
                      className="ducther4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cat.id);
                      }}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay4">
          <div className="modal-content4 score2">
            <h3>{editingCategory ? "Edit Category" : "Create Category"}</h3>
            <form onSubmit={editingCategory ? handleUpdate : handleCreate}>
              <label>
                Name*
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={formData.omitImage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      omitImage: e.target.checked,
                      image: e.target.checked ? null : formData.image,
                    })
                  }
                />
                Omit Image
              </label>

              {!formData.omitImage && formData.image && !(formData.image instanceof File) && (
                <div>
                  <img src={formData.image} alt="current" width={100} />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, omitImage: true, image: null })}
                  >
                    Remove Image
                  </button>
                </div>
              )}

              {!formData.omitImage && (
                <label>
                  Upload Image
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.files[0],
                        omitImage: false,
                      })
                    }
                  />
                </label>
              )}

              <label>
                Status*
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

              <div className="modal-actions4">
                <button type="submit" className="ducther5">
                  Save
                </button>
                <button type="button" className="ducther6" onClick={() => resetForm()}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {details && (
        <div className="modal-overlay4">
          <div className="modal-content4 score3">
            <h3>Category Details</h3>
            <p><b>Name:</b> {details.name}</p>
            <p><b>Description:</b> {details.description || "N/A"}</p>
            <p><b>Status:</b> {details.status}</p>
            {details.image ? (
              <img src={details.image} alt={details.name} width="200" />
            ) : (
              <p><i>No image available</i></p>
            )}
            <div className="modal-actions4">
              <button className="ducther6" onClick={() => setDetails(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategory;
