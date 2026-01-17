import React, { useEffect, useState, useCallback } from "react";
import { getAccessToken } from "../utils/token";
import "./CSS/AdminCategory.css"; // reuse same CSS
import "./CSS/AdminLocation.css"; // reuse same CSS

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminLocation = () => {
  // Temp state for toggles during editing
const [isActiveTemp, setIsActiveTemp] = useState(true);
const [isPopularTemp, setIsPopularTemp] = useState(false);

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [perPage, setPerPage] = useState(20);
  const [filterActive, setFilterActive] = useState(false);
  const [filterPopular, setFilterPopular] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterParentId, setFilterParentId] = useState("");
  const [parentOptions, setParentOptions] = useState([]);

  void setFilterType
  void setFilterParentId
  void setFilterLevel



  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [details, setDetails] = useState(null);

  const [formData, setFormData] = useState({
  name: "",
  type: "state", // NEW (default)
  parent_id: null,
  is_popular: false,
  is_active: true,
});

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);

  // Normalize location item: ensure children array and is_active default (treat missing as active)
 const normalizeLocation = useCallback((loc) => ({
  id: Number(loc.id),
  name: loc.name || "",
  slug: loc.slug || "",
  type: loc.type || "state", 
  level: loc.level ?? 0,

  parent_id: loc.parent_id !== null && loc.parent_id !== undefined ? Number(loc.parent_id) : null,

  is_popular:
    loc.is_popular === true || loc.is_popular === 1 || loc.is_popular === "1",

  is_active:
    loc.is_active === true || loc.is_active === 1 || loc.is_active === "1",

  children: Array.isArray(loc.children)
    ? loc.children.map((child) => normalizeLocation(child))
    : [],
}), []);


useEffect(() => {
  setFormData((prev) => {
    let newData = { ...prev };

    // If type changed to state, parent_id should be null
    if (prev.type === "state" && prev.parent_id !== null) {
      newData.parent_id = null;
    }

    // Set level based on type
    if (prev.type === "state") newData.level = 0;
    if (prev.type === "city") newData.level = 1;
    if (prev.type === "area") newData.level = 2;

    return newData;
  });
}, []); // no dependencies needed now


useEffect(() => {
  const fetchParentOptions = async () => {
    try {
      const token = await getAccessToken();

      // States have no parent
      if (formData.type === "state") {
        setParentOptions([]);
        setFormData((prev) => ({ ...prev, parent_id: null })); // <-- null for state
        return;
      }

      // Determine parent type/level
      const parentType = formData.type === "city" ? "state" : "city";
      const parentLevel = formData.type === "city" ? 0 : 1;

      const params = new URLSearchParams();
      params.append("page", 1);
      params.append("per_page", 100);
      params.append("is_active", 1);
      params.append("type", parentType);
      params.append("level", Number(parentLevel));

      const res = await fetch(
        `${BASE_URL}/v1/admin/locations?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();
      console.log("Fetched parent options:", data);

      if (data.success && Array.isArray(data.data)) {
        const normalizedParents = data.data.map((loc) => normalizeLocation(loc));
        setParentOptions(normalizedParents);

        // Prefill parent_id if none selected yet
        if (!formData.parent_id && normalizedParents.length > 0) {
          setFormData((prev) => ({ ...prev, parent_id: normalizedParents[0].id }));
        }
      } else {
        setParentOptions([]);
        setFormData((prev) => ({ ...prev, parent_id: null })); // fallback null
      }
    } catch (err) {
      console.error("fetchParentOptions error:", err);
      setParentOptions([]);
      setFormData((prev) => ({ ...prev, parent_id: null }));
    }
  };

  fetchParentOptions();
}, [formData.type, formData.parent_id, normalizeLocation]);


 useEffect(() => {
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();

const params = new URLSearchParams();

params.append("page", 1);
params.append("per_page", perPage);

// boolean filters
if (filterActive) params.append("is_active", 1);   
if (filterPopular) params.append("is_popular", 1); 


// NEW: backend-supported filters
if (filterType) params.append("type", filterType);           // state | city | area
if (filterLevel !== "") params.append("level", filterLevel); // 0–5
if (filterParentId !== "") params.append("parent_id", filterParentId);

// backend search (preferred)
if (searchQuery.trim().length >= 2) {
  params.append("search", searchQuery.trim());
}


      const res = await fetch(`${BASE_URL}/v1/admin/locations?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      console.log("Fetched locations:", data.data);

      if (data.success) {
        // Normalize backend result
        const backendLocations = Array.isArray(data.data)
           ? data.data.map((loc) => {
        console.log('Raw loc from backend:', loc); // logs each location
        return normalizeLocation(loc);
      })
          : [];

        // merge stored sessions
        const stored = JSON.parse(sessionStorage.getItem("newLocations") || "[]");
        const storedNormalized = stored.map((loc) => normalizeLocation(loc));

        const merged = [...backendLocations];

        storedNormalized.forEach((item) => {
          if (!merged.find((loc) => Number(loc.id) === Number(item.id))) {
            merged.push(item);
          }
        });

        // LOCAL FILTERING (frontend only)
        let filtered = merged;

        if (filterActive) {
          filtered = filtered.filter((loc) => loc.is_active === true);
        }

        if (filterPopular) {
          filtered = filtered.filter((loc) => loc.is_popular === true);
        }

        if (searchQuery.trim() !== "") {
          const q = searchQuery.trim().toLowerCase();
          filtered = filtered.filter((loc) =>
            (loc.name || "").toLowerCase().includes(q)
          );
        }

        setLocations(merged);
        setFilteredLocations(filtered);
      } else {
        setError(data.message || "Failed to load locations");
        setLocations([]);
        setFilteredLocations([]);
      }
    } catch (err) {
      setError(err.message || "Unexpected error");
      setLocations([]);
      setFilteredLocations([]);
      console.error("fetchLocations error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchLocations();
}, [perPage, filterActive, filterPopular,  filterType,
  filterLevel,
  filterParentId, searchQuery, normalizeLocation]);

  // ---- FETCH LOCATION DETAILS ----
  const fetchDetails = async (id) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE_URL}/v1/admin/locations/${id}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    const data = await res.json();

    if (data.success) {
      const localCopy = locations.find((loc) => Number(loc.id) === Number(id));

      // Explicitly include type from backend
      const returned = {
        id: Number(data.data.id),
        name: data.data.name || "",
        slug: data.data.slug || "",
        type: data.data.type || "state",      // <-- TYPE added here
        parent_id: data.data.parent_id,
        level: data.data.level ?? 0,
        is_active: data.data.is_active === true,
        is_popular: data.data.is_popular === true,
        children: Array.isArray(data.data.children)
          ? data.data.children.map((child) => normalizeLocation(child))
          : [],
        children_count: data.data.children_count ?? 0,
        can_drill_down: data.data.can_drill_down ?? false,
      };

      const updatedDetails = localCopy
        ? { ...returned, is_active: localCopy.is_active, is_popular: localCopy.is_popular }
        : returned;

      setDetails(updatedDetails);
    } else {
      console.warn("Fetch details failed:", data.message);
    }
  } catch (err) {
    console.error("fetchDetails error:", err);
  }
};


  // ---- CREATE LOCATION ----
  const handleCreate = async (e) => {
    e.preventDefault();

     console.log("=== SUBMITTING PAYLOAD ===");
  console.log("FormData:", formData);
  console.log("Parent Options:", parentOptions);

   if (formData.type !== "state" && (!formData.parent_id || formData.parent_id === 0)) {
  alert("Please select a valid parent");
  return;
}



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
           name: formData.name,
           type: formData.type, 
           parent_id: formData.type === "state" ? null : Number(formData.parent_id),
           is_active: !!formData.is_active,
           is_popular: !!formData.is_popular,
        }),
      });

      const data = await res.json();
      console.log("Created location:", data.data);

      if (data.success) {
        const newLoc = normalizeLocation({
          ...data.data,
          type: formData.type,          
          is_active: !!formData.is_active,
          is_popular: !!formData.is_popular,
        });

        // update state
        setLocations((prev) => [...prev, newLoc]);
        setFilteredLocations((prev) => [...prev, newLoc]);

        // store in sessionStorage
        const stored = JSON.parse(sessionStorage.getItem("newLocations") || "[]");
        sessionStorage.setItem("newLocations", JSON.stringify([...stored, newLoc]));

        resetForm();
      } else {
        alert(data.message || "Failed to create location");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating location");
    }
  };

  // ---- UPDATE LOCATION ----
// When editing a location, sync temp state from editingLocation
useEffect(() => {
  if (editingLocation) {
    setFormData({
      name: editingLocation.name || "",
      type: editingLocation.type || "state", 
      parent_id:
        editingLocation.parent_id === editingLocation.id
          ? null
          : editingLocation.parent_id || null,
      is_active: editingLocation.is_active !== undefined ? editingLocation.is_active : true,
      is_popular: editingLocation.is_popular !== undefined ? editingLocation.is_popular : false,
    });

    setIsActiveTemp(
      editingLocation.is_active !== undefined ? editingLocation.is_active : true
    );
    setIsPopularTemp(
      editingLocation.is_popular !== undefined ? editingLocation.is_popular : false
    );
  }
}, [editingLocation]);


const handleUpdate = async (e) => {
  e.preventDefault();

   console.log("=== SUBMITTING PAYLOAD ===");
  console.log("FormData:", formData);
  console.log("Parent Options:", parentOptions);

if (formData.type !== "state" && (!formData.parent_id || formData.parent_id === 0)) {
  alert("Please select a valid parent");
  return;
}



  // --- PREVENT SELF-PARENT ERROR ---
  const sanitizedParentId =
    formData.type === "state" ? null :
    Number(formData.parent_id) === Number(editingLocation.id)
      ? null
      : Number(formData.parent_id);

  const payload = {
  name: formData.name || "",
  type: formData.type, 
  parent_id: sanitizedParentId,
  is_active: !!isActiveTemp,
  is_popular: !!isPopularTemp,
};


  // --- DEBUG: Log payload before sending ---
  console.log("=== UPDATE PAYLOAD BEFORE FETCH ===");
  console.log("Location ID:", editingLocation.id);
  console.log("Payload:", payload);

  try {
    const token = await getAccessToken();

    const res = await fetch(
      `${BASE_URL}/v1/admin/locations/${editingLocation.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    // --- DEBUG: Log response from backend ---
    console.log("=== RESPONSE FROM BACKEND ===");
    console.log("Data received:", data);

    if (data.success) {
      const updatedLoc = normalizeLocation({
        ...data.data,
        type: payload.type,
        is_active: payload.is_active,
        is_popular: payload.is_popular,
      });

      console.log("=== UPDATED LOCATION AFTER NORMALIZE ===");
      console.log(updatedLoc);

      setLocations((prev) =>
        prev.map((loc) =>
          Number(loc.id) === Number(updatedLoc.id) ? updatedLoc : loc
        )
      );

      setFilteredLocations((prev) =>
        prev.map((loc) =>
          Number(loc.id) === Number(updatedLoc.id) ? updatedLoc : loc
        )
      );

      setDetails(updatedLoc);

      const stored = JSON.parse(sessionStorage.getItem("newLocations") || "[]");
      const index = stored.findIndex(
        (loc) => Number(loc.id) === Number(updatedLoc.id)
      );
      if (index > -1) {
        stored[index] = updatedLoc;
        sessionStorage.setItem("newLocations", JSON.stringify(stored));
      }

      resetForm();
    } else {
      alert(data.message || "Failed to update location");
    }
  } catch (err) {
    console.error("=== ERROR IN UPDATE ===", err);
    alert("Error updating location");
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
        setLocations((prev) => prev.filter((loc) => Number(loc.id) !== Number(id)));
        setFilteredLocations((prev) => prev.filter((loc) => Number(loc.id) !== Number(id)));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting location");
    }
  };

  // ---- RESET FORM ----
  const resetForm = () => {
    setShowForm(false);
    setEditingLocation(null);
    setFormData({
      name: "",
      parent_id: null,
        type: "state", // make sure default type is included
      is_popular: false,
      is_active: true,
    });
  };

  // Styling objects for sublocation dropdown (inline to avoid editing external CSS)
 
  const locationRowWrapperStyle = {
    position: "relative",
    display: "inline-block",
  };

  const childItemStyle = {
    padding: "6px 8px",
    borderBottom: "1px solid #f1f1f1",
    cursor: "pointer",
  };

  return (
    <div className="main-area">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <span className="section-title">Manage Locations</span>
        <span className="breadcrumb">Admin &gt; Locations</span>
      </div>

      {/* Create Button + Search */}
      <div className="score1">
        <button className="ducther2" onClick={() => setShowForm(true)}>
          ＋ Create Location
        </button>
        <div>
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
                  (location.name || "").toLowerCase().includes(query.toLowerCase())
                );
                setFilteredLocations(filtered);
              }
            }}
            style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", flexGrow: 1 }}
          />

        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}> <input type="checkbox" className="juti" checked={filterActive} onChange={(e) => setFilterActive(e.target.checked)} /> Active </label> <label style={{ display: "flex", alignItems: "center", gap: "6px" }}> <input type="checkbox" className="juti" checked={filterPopular} onChange={(e) => setFilterPopular(e.target.checked)} /> Popular </label>



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
  <tr key={loc.id} style={{ cursor: "pointer" }}>
    <td>{i + 1}</td>

    <td>
      <div className="location-wrapper hoverable-wrapper" style={locationRowWrapperStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <strong>{loc.name}</strong>

          {/* Child count indicator */}
          {loc.children && loc.children.length > 0 && (
            <span style={{ fontSize: 12, color: "#633" }}>
              ▾ {loc.children.length}
            </span>
          )}
        </div>

        {/* Sublocation Dropdown */}
        <div
          className="sublocations-dropdown"
          onClick={(e) => e.stopPropagation()}
        >
          {(loc.children || []).length === 0 ? (
            <div style={{ padding: 8 }}>No sublocations</div>
          ) : (
            loc.children.map((child) => (
              <div
                key={child.id}
                style={childItemStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  fetchDetails(child.id);
                }}
              >
                {child.name}
              </div>
            ))
          )}
        </div>
      </div>
    </td>

    {/* Status Badge */}
    <td>
      <span
        className={`status-badge ${loc.is_active ? "active" : "disabled"}`}
      >
        {loc.is_active ? "enabled" : "disabled"}
      </span>
    </td>

    {/* Actions */}
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

      <span
        onClick={(e) => {
          e.stopPropagation();
          fetchDetails(loc.id);
        }}
        style={{
          cursor: "pointer",
          marginLeft: 6,
          color: "#007bff",
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        ⓘ
      </span>

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

      {/* Add JS-based hover handling to show the dropdowns on hover */}
      {/* This is a small hack to attach listeners to each row and toggle the display of the .sublocations-dropdown inside it.
          We do this to avoid modifying external CSS files. */}

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
  Type*
  <select
    value={formData.type}
    onChange={(e) =>
      setFormData({ ...formData, type: e.target.value })
    }
    required
  >
    <option value="state">State</option>
    <option value="city">City</option>
    <option value="area">Area</option>
  </select>
</label>


             {formData.type !== "state" && (
  <label>
    Parent Location*
   <select
  value={formData.parent_id !== undefined ? formData.parent_id : ""}
  onChange={(e) =>
  setFormData({
    ...formData,
    parent_id: e.target.value === "" ? null : Number(e.target.value),
  })
}

  required
>
  <option value="">Select parent</option>
  {parentOptions.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name}
    </option>
  ))}
</select>

  </label>
)}

              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
  <input
    type="checkbox"
    className="juti"
    checked={isActiveTemp}
    onChange={(e) => setIsActiveTemp(e.target.checked)}
  />
  Active
</label>

<label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
  <input
    type="checkbox"
    className="juti"
    checked={isPopularTemp}
    onChange={(e) => setIsPopularTemp(e.target.checked)}
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
     {/* Details Modal */}
{details && (
  <div className="modal-overlay4">
    <div className="modal-content4 score3">
      <h3>Location Details</h3>

      <p><b>ID:</b> {details.id}</p>
      <p><b>Name:</b> {details.name}</p>
      <p><b>Slug:</b> {details.slug}</p>
      <p><b>Type:</b> {details.type}</p>
      <p><b>Parent ID:</b> {details.parent_id}</p>
      <p><b>Level:</b> {details.level}</p>
      <p><b>Active:</b> {details.is_active ? "Yes" : "No"}</p>
      <p><b>Popular:</b> {details.is_popular ? "Yes" : "No"}</p>
      <p><b>Children Count:</b> {details.children_count}</p>
      <p><b>Can Drill Down:</b> {details.can_drill_down}</p>

      {/* Optional: List child locations */}
      {details.children && details.children.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <b>Child Locations:</b>
          <ul>
            {details.children.map((child) => (
              <li key={child.id}>{child.name}</li>
            ))}
          </ul>
        </div>
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


export default AdminLocation;
