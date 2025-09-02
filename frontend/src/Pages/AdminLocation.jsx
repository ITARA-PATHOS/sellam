import React, { useEffect, useState } from "react";
import { getAccessToken } from "../utils/token";
import "./CSS/AdminCategory.css"; // reuse same CSS
import "./CSS/AdminLocation.css"; // reuse same CSS

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminLocation = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [perPage, setPerPage] = useState(20);
const [filterActive, setFilterActive] = useState(false);
const [filterPopular, setFilterPopular] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [details, setDetails] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    parent_id: 0,
    is_popular: false,
    is_active: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);




useEffect(() => {
const fetchLocations = async () => {
  try {
    setLoading(true);
    const token = await getAccessToken();

    const params = new URLSearchParams();
    params.append("per_page", perPage);
    params.append("page", 1);

    if (searchQuery.trim() !== "") params.append("search", searchQuery.trim());
    if (filterActive) params.append("is_active", 1);
if (filterPopular) params.append("is_popular", 1);

    const res = await fetch(`${BASE_URL}/v1/admin/locations?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();
    console.log("Fetched locations:", data.data);

    if (data.success) {
      // merge any sessionStorage-stored new locations
      const stored = JSON.parse(sessionStorage.getItem("newLocations") || "[]");

      const mergedLocations = [...data.data];

      stored.forEach(storedLoc => {
        if (!mergedLocations.find(loc => loc.id === storedLoc.id)) {
          mergedLocations.push(storedLoc);
        }
      });

      // --- ADD FRONTEND FILTERING HERE ---
  let filtered = mergedLocations;

  if (filterActive) {
    filtered = filtered.filter(loc => loc.is_active === true);
  }

  if (filterPopular) {
    filtered = filtered.filter(loc => loc.is_popular === true);
  }

  setLocations(filtered);
  setFilteredLocations(filtered);
    } else {
      setError(data.message);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

fetchLocations();
}, [perPage, filterActive, filterPopular, searchQuery]);


  // ---- FETCH LOCATION DETAILS ----
  const fetchDetails = async (id) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/locations/${id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
       if (data.success) {
      // check if we have a local copy in state (with updated active/popular)
      const localCopy = locations.find(loc => loc.id === id);
      const updatedDetails = localCopy
        ? { ...data.data, is_active: localCopy.is_active, is_popular: localCopy.is_popular }
        : data.data;

      setDetails(updatedDetails);
    }
    } catch (err) {
      console.error(err);
    }
  };

  // ---- CREATE LOCATION ----
const handleCreate = async (e) => {
  e.preventDefault();
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE_URL}/v1/admin/locations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...formData,
        is_active: !!formData.is_active,
        is_popular: !!formData.is_popular,
      }),
    });

    const data = await res.json();
    console.log("Created location:", data.data);

    if (data.success) {
      const newLoc = {
        ...data.data,
        is_active: !!formData.is_active,
        is_popular: !!formData.is_popular,
      };

      // update state
      setLocations(prev => [...prev, newLoc]);
      setFilteredLocations(prev => [...prev, newLoc]);

      // store in sessionStorage
      const stored = JSON.parse(sessionStorage.getItem("newLocations") || "[]");
      sessionStorage.setItem(
        "newLocations",
        JSON.stringify([...stored, newLoc])
      );

      resetForm();
    } else {
      alert(data.message || "Failed to create location");
    }
  } catch (err) {
    console.error(err);
  }
};


  // ---- UPDATE LOCATION ----
  useEffect(() => {
    if (editingLocation) {
      setFormData({
        name: editingLocation.name || "",
        parent_id: editingLocation.parent_id || 0,
        is_popular: editingLocation.is_popular || false,
        is_active: editingLocation.is_active !== undefined ? editingLocation.is_active : true,
      });
    }
  }, [editingLocation]);

const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE_URL}/v1/admin/locations/${editingLocation.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        is_active: !!formData.is_active,
        is_popular: !!formData.is_popular,
      }),
    });

    const data = await res.json();
    if (data.success) {
      const updatedLoc = {
        ...data.data,
        is_active: !!formData.is_active,
        is_popular: !!formData.is_popular,
      };

      setLocations(prev =>
        prev.map(loc => (loc.id === updatedLoc.id ? updatedLoc : loc))
      );
      setFilteredLocations(prev =>
        prev.map(loc => (loc.id === updatedLoc.id ? updatedLoc : loc))
      );
      setDetails(updatedLoc);

      // Update in sessionStorage if exists
      const stored = JSON.parse(sessionStorage.getItem("newLocations") || "[]");
      const index = stored.findIndex(loc => loc.id === updatedLoc.id);
      if (index > -1) {
        stored[index] = updatedLoc;
        sessionStorage.setItem("newLocations", JSON.stringify(stored));
      }

      resetForm();
    } else {
      alert(data.message || "Failed to update location");
    }
  } catch (err) {
    console.error(err);
  }
};


  // ---- DELETE LOCATION ----
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/locations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setLocations((prev) => prev.filter((loc) => loc.id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---- RESET FORM ----
  const resetForm = () => {
    setShowForm(false);
    setEditingLocation(null);
    setFormData({
      name: "",
      parent_id: 0,
      is_popular: false,
      is_active: true,
    });
  };


  return (
    <div className="main-area">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <span className="section-title">Manage Locations</span>
        <span className="breadcrumb">Admin &gt; Locations</span>
      </div>

      {/* Create Button + Search */}
      <div className="score1" >
        <button className="ducther2" onClick={() => setShowForm(true)}>
          ＋ Create Location
        </button>
      <div >
  {/* Search */}
  <input
    type="text"
    placeholder="Search locations..."
    value={searchQuery}
    onChange={(e) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (query.trim() === "") {
        setFilteredLocations(locations); // Reset to all locations if search is empty
      } else {
        const filtered = locations.filter((location) =>
          location.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredLocations(filtered);
      }
    }}
    style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", flexGrow: 1 }}
  />

  <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <input
      type="checkbox"
          className="juti"
      checked={filterActive}
      onChange={(e) => setFilterActive(e.target.checked)}
    />
    Active
  </label>

  <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <input
      type="checkbox"
          className="juti"
      checked={filterPopular}
      onChange={(e) => setFilterPopular(e.target.checked)}
    />
    Popular
  </label>

  {/* Per Page Selector */}
  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
    <span>📄</span>
    <select
      value={perPage}
      onChange={(e) => setPerPage(Number(e.target.value))}
      style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
  </div>
</div>

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
  {filteredLocations.map((loc, i) => (
    <tr key={loc.id} onClick={() => fetchDetails(loc.id)} style={{ cursor: "pointer" }}>
      <td>{i + 1}</td>
      <td>{loc.name}</td>
      <td>
       <span className={`status-badge ${loc.is_active ? "active" : "disabled"}`}>
    {loc.is_active ? "enabled" : "disabled"}
  </span>
      </td>
      <td>
        <button
          className="ducther3"
          onClick={(e) => {
            e.stopPropagation();
            setEditingLocation(loc);
            setShowForm(true);
          }}
        >
          ✎
        </button>
        <button
          className="ducther4"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(loc.id);
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
            <h3>{editingLocation ? "Edit Location" : "Create Location"}</h3>
            <form onSubmit={editingLocation ? handleUpdate : handleCreate}>
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
                Parent ID
                <input
                  type="number"
                  value={formData.parent_id}
                  onChange={(e) =>
                    setFormData({ ...formData, parent_id: Number(e.target.value) })
                  }
                />
              </label>

<label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
  <input
    type="checkbox"
    className="juti"
    checked={formData.is_active}
    onChange={(e) => {
      const isActive = e.target.checked;
      setFormData({ ...formData, is_active: isActive });

      // Update status badge in table immediately
      if (editingLocation) {
        setLocations((prev) =>
          prev.map((loc) =>
            loc.id === editingLocation.id ? { ...loc, is_active: isActive } : loc
          )
        );
        setFilteredLocations((prev) =>
          prev.map((loc) =>
            loc.id === editingLocation.id ? { ...loc, is_active: isActive } : loc
          )
        );
      }
    }}
  />
  Active
</label>

<label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
  <input
    type="checkbox"
    className="juti"
    checked={formData.is_popular}
    onChange={(e) => {
      const isPopular = e.target.checked;
      setFormData({ ...formData, is_popular: isPopular });

      // Update popular immediately in table
      if (editingLocation) {
        setLocations((prev) =>
          prev.map((loc) =>
            loc.id === editingLocation.id ? { ...loc, is_popular: isPopular } : loc
          )
        );
        setFilteredLocations((prev) =>
          prev.map((loc) =>
            loc.id === editingLocation.id ? { ...loc, is_popular: isPopular } : loc
          )
        );
      }
    }}
  />
  Popular
</label>

              <div className="modal-actions4">
                <button type="submit" className="ducther5">
                  Save
                </button>
                <button type="button" className="ducther6" onClick={resetForm}>
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
            <h3>Location Details</h3>
            <p><b>ID:</b> {details.id}</p>
            <p><b>Name:</b> {details.name}</p>
            <p><b>Slug:</b> {details.slug}</p>
            <p><b>Parent ID:</b> {details.parent_id}</p>
            <p><b>Level:</b> {details.level}</p>
            <p><b>Popular:</b> {details.is_popular ? "Yes" : "No"}</p>
            <p><b>Status:</b> {details.is_active ? "Enabled" : "Disabled"}</p>
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

export default AdminLocation;
