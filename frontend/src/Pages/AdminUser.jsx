import React, { useEffect, useState } from "react";
import { getAccessToken } from "../utils/token";
import "./CSS/AdminProduct.css";
import "./CSS/AdminCategory.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ROLES = ["user", "admin"];
const STATUS_OPTIONS = ["active", "inactive", "pending"];

function statusBadgeClass(status = "") {
  const s = String(status || "").toLowerCase();
  if (s === "active") return "status-badge status-approved";
  if (s === "inactive") return "status-badge status-rejected";
  return "status-badge status-pending";
}

const safe = (v, fallback = "-") => (v === null || v === undefined || v === "" ? fallback : v);

const AdminUser = () => {
  // Table & filters
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination meta if API returns it
  const [paginationMeta, setPaginationMeta] = useState(null);

  void paginationMeta

  // Modals & selected user
  const [selectedUser, setSelectedUser] = useState(null); // full object from /users/{id}
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Create / Edit
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    role: "user",
    status: "active",
  });

  // Status/role update form inside modal
  const [statusForm, setStatusForm] = useState({ status: "", reason: "" });
  const [roleForm, setRoleForm] = useState({ role: "" });

  // Balance management
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [balanceForm, setBalanceForm] = useState({ type: "credit", amount: 0, description: "" });

  // Local debounce for query
  useEffect(() => {
    const t = setTimeout(() => {
      fetchUsers();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, perPage, roleFilter, statusFilter]);

  // initial load
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch users list
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setErr("");
      const token = await getAccessToken();

      const params = new URLSearchParams();
      if (perPage) params.append("per_page", String(perPage));
      if (query && query.trim().length >= 2) params.append("query", query.trim());
      if (roleFilter) params.append("role", roleFilter);
      if (statusFilter) params.append("status", statusFilter);
      params.append("page", String(page));

      const res = await fetch(`${BASE_URL}/v1/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      console.log("Full Users API response:", data); // log everything
    if (data?.data?.length > 0) {
      console.log("First user object:", data.data[0]); // 👈 log just first user
    }
      if (data?.success) {
        // Accept data.data being an array OR paginated object
        if (Array.isArray(data.data)) {
          setUsers(data.data);
          setPaginationMeta(data.pagination || null);
        } else if (data.data?.data && Array.isArray(data.data.data)) {
          setUsers(data.data.data);
          setPaginationMeta(data.data.pagination || data.pagination || null);
        } else {
          // fallback try data.data.users
          setUsers(data.data || []);
          setPaginationMeta(data.pagination || null);
        }
      } else {
        setErr(data?.message || "Failed to fetch users");
        setUsers([]);
      }
    } catch (e) {
      setErr(e.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single user by ID (Show user)
  const fetchUserById = async (userId) => {
    try {
      setDetailsLoading(true);
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (data?.success) return data.data;
      return null;
    } catch (e) {
      return null;
    } finally {
      setDetailsLoading(false);
    }
  };

  // Open details modal (fetch freshest)
  const openUserDetails = async (u) => {
    const fresh = await fetchUserById(u.id || u);
    const user = fresh || u;
    setSelectedUser(user);
    setStatusForm({ status: user?.status || "", reason: "" });
    setRoleForm({ role: user?.role || "" });
  };

  // Create user (admin)
  const handleCreateUser = async (e) => {
    e?.preventDefault?.();
    try {
      const token = await getAccessToken();
      const body = {
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        email: formValues.email,
        username: formValues.username,
        phone: formValues.phone || null,
        password: formValues.password,
        role: formValues.role || null,
        status: formValues.status || null,
      };
      const res = await fetch(`${BASE_URL}/v1/admin/users`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data?.success) {
        alert(data?.message || "User created");
        setCreateOpen(false);
        // refresh list
        fetchUsers();
      } else {
        alert(data?.message || "Failed to create user");
      }
    } catch (e) {
      alert("Failed to create user");
    }
  };

  // Start edit - populate form
  const startEdit = (u) => {
    setEditUser(u);
    setFormValues({
      first_name: u.first_name || "",
      last_name: u.last_name || "",
      email: u.email || "",
      username: u.username || "",
      phone: u.phone || "",
      password: "", // leave empty unless changing
      role: u.role || "user",
      status: u.status || "active",
    });
  };

  // Submit edit (PUT)
  const handleUpdateUser = async (e) => {
    e?.preventDefault?.();
    if (!editUser) return;
    try {
      const token = await getAccessToken();
      const body = {
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        email: formValues.email,
        username: formValues.username,
        phone: formValues.phone || null,
      };
      // include password only if set
      if (formValues.password && formValues.password.length >= 8) {
        body.password = formValues.password;
      }
      const res = await fetch(`${BASE_URL}/v1/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data?.success) {
        alert(data?.message || "User updated");
        setEditUser(null);
        // update user in local list & selectedUser if open
        setUsers((prev) => prev.map((p) => (p.id === editUser.id ? { ...p, ...data.data } : p)));
        if (selectedUser?.id === editUser.id) setSelectedUser((s) => ({ ...s, ...data.data }));
      } else {
        alert(data?.message || "Failed to update user");
      }
    } catch (e) {
      alert("Failed to update user");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (data?.success) {
        alert(data?.message || "User deleted");
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        if (selectedUser?.id === userId) setSelectedUser(null);
      } else {
        alert(data?.message || "Failed to delete user");
      }
    } catch (e) {
      alert("Failed to delete user");
    }
  };

  // Patch status
  const handlePatchStatus = async () => {
    if (!selectedUser) return;
    if (!statusForm.status) {
      alert("Select a status");
      return;
    }
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/users/${selectedUser.id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ status: statusForm.status }),
      });
      const data = await res.json();
      if (data?.success) {
        // update table + modal
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, status: statusForm.status } : u)));
        setSelectedUser((prev) => ({ ...prev, status: statusForm.status }));
        alert(data?.message || "Status updated");
      } else {
        alert(data?.message || "Failed to update status");
      }
    } catch (e) {
      alert("Failed to update status");
    }
  };

  // Patch role
  const handlePatchRole = async () => {
    if (!selectedUser) return;
    if (!roleForm.role) {
      alert("Select a role");
      return;
    }
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/users/${selectedUser.id}/role`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ role: roleForm.role }),
      });
      const data = await res.json();
      if (data?.success) {
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, role: roleForm.role } : u)));
        setSelectedUser((prev) => ({ ...prev, role: roleForm.role }));
        alert(data?.message || "Role updated");
      } else {
        alert(data?.message || "Failed to update role");
      }
    } catch (e) {
      alert("Failed to update role");
    }
  };

  // Manage balance (POST)
  const handleManageBalance = async (e) => {
    e?.preventDefault?.();
    if (!selectedUser) return;
    if (!["credit", "debit"].includes(balanceForm.type) || Number(balanceForm.amount) <= 0) {
      alert("Provide valid balance type and positive amount");
      return;
    }
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/users/${selectedUser.id}/balance`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          type: balanceForm.type,
          amount: Number(balanceForm.amount),
          description: balanceForm.description || "",
        }),
      });
      const data = await res.json();
      if (data?.success) {
        alert(data?.message || "Balance updated");
        // update balance in selectedUser and users list if returned
        if (data?.data?.balance) {
          setSelectedUser((s) => ({ ...s, balance: data.data.balance }));
          setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, balance: data.data.balance } : u)));
        } else {
          // just refetch user
          const fresh = await fetchUserById(selectedUser.id);
          if (fresh) {
            setSelectedUser(fresh);
            setUsers((prev) => prev.map((u) => (u.id === fresh.id ? fresh : u)));
          }
        }
        setBalanceOpen(false);
        setBalanceForm({ type: "credit", amount: 0, description: "" });
      } else {
        alert(data?.message || "Failed to update balance");
      }
    } catch (e) {
      alert("Failed to manage balance");
    }
  };

  // Utility: render table rows (full name from response)
  const fullName = (u) => safe(u.full_name, `${safe(u.first_name, "")} ${safe(u.last_name, "")}`.trim() || "-");

  // UI rendering
  return (
    <div className="main-area">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <span className="section-title">View Users Personas</span>
        <span className="breadcrumb">Admin &gt; Users</span>
      </div>

      {/* Controls */}
      <div className="product-searchbar" style={{ gap: 12, flexWrap: "wrap" }}>
        <div className="perpage-selector" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <label>Show:</label>
          <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>per page</span>
        </div>

        <div className="perpage-selector" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <label>Role:</label>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="perpage-selector" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Search (min 2 chars)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ minWidth: 240 }}
        />

        <div >
          <button className="ducther2" onClick={() => { setCreateOpen(true); setEditUser(null); }}>
            + Create User
          </button>
          <button className="ducther2" onClick={() => fetchUsers()}>
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <p>Loading users...</p>
        ) : err ? (
          <p className="error">{err}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((u, i) => (
                  <tr key={u.id || i} style={{ cursor: "pointer" }} onClick={() => openUserDetails(u)}>
                    <td>{i + 1}</td>
                    <td>{fullName(u)}</td>
                    <td>{safe(u.email)}</td>
                    <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className={statusBadgeClass(u.status)}>
                        {safe(u.status)}
                      </span>

                      {/* Edit & Delete icons/buttons beside each user's status (table) */}
                      <div style={{ marginLeft: 8, display: "flex", gap: 6 }}>
                        <button
                          title="Edit user"
                          className="ducther2"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(u);
                          }}
                        >
                          ✏️
                        </button>
                  
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: 12 }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {createOpen && (
        <div className="product-modal-overlay">
          <div className="product-modal-content" style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <h3>Create User / Admin</h3>
            <form onSubmit={handleCreateUser} className="product-edit-form">
              <label>
                First name
                <input required value={formValues.first_name} onChange={(e) => setFormValues((p) => ({ ...p, first_name: e.target.value }))} />
              </label>
              <label>
                Last name
                <input required value={formValues.last_name} onChange={(e) => setFormValues((p) => ({ ...p, last_name: e.target.value }))} />
              </label>
              <label>
                Email
                <input required type="email" value={formValues.email} onChange={(e) => setFormValues((p) => ({ ...p, email: e.target.value }))} />
              </label>
              <label>
                Username
                <input required value={formValues.username} onChange={(e) => setFormValues((p) => ({ ...p, username: e.target.value }))} />
              </label>
              <label>
                Phone
                <input value={formValues.phone} onChange={(e) => setFormValues((p) => ({ ...p, phone: e.target.value }))} />
              </label>
              <label>
                Password
                <input required type="password" value={formValues.password} onChange={(e) => setFormValues((p) => ({ ...p, password: e.target.value }))} />
              </label>
              <label>
                Role
                <select value={formValues.role} onChange={(e) => setFormValues((p) => ({ ...p, role: e.target.value }))}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
              <label>
                Status
                <select value={formValues.status} onChange={(e) => setFormValues((p) => ({ ...p, status: e.target.value }))}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              <div className="product-modal-actions">
                <button type="submit" className="product-btn-update">Create</button>
                <button type="button" className="product-btn-close" onClick={() => setCreateOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editUser && (
        <div className="product-modal-overlay">
          <div className="product-modal-content" style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <h3>Edit User</h3>
            <form onSubmit={handleUpdateUser} className="product-edit-form">
              <label>
                First name
                <input required value={formValues.first_name} onChange={(e) => setFormValues((p) => ({ ...p, first_name: e.target.value }))} />
              </label>
              <label>
                Last name
                <input required value={formValues.last_name} onChange={(e) => setFormValues((p) => ({ ...p, last_name: e.target.value }))} />
              </label>
              <label>
                Email
                <input required type="email" value={formValues.email} onChange={(e) => setFormValues((p) => ({ ...p, email: e.target.value }))} />
              </label>
              <label>
                Username
                <input required value={formValues.username} onChange={(e) => setFormValues((p) => ({ ...p, username: e.target.value }))} />
              </label>
              <label>
                Phone
                <input value={formValues.phone} onChange={(e) => setFormValues((p) => ({ ...p, phone: e.target.value }))} />
              </label>
              <label>
                New password (leave blank to keep)
                <input type="password" value={formValues.password} onChange={(e) => setFormValues((p) => ({ ...p, password: e.target.value }))} />
              </label>

              <div className="product-modal-actions">
                <button type="submit" className="product-btn-update">Save</button>
                <button type="button" className="product-btn-close" onClick={() => setEditUser(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div className="product-modal-overlay">
          <div className="product-modal-content" style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>{safe(selectedUser.full_name, `${safe(selectedUser.first_name, "")} ${safe(selectedUser.last_name, "")}`)}</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="ducther2" onClick={() => startEdit(selectedUser)}>✏️ Edit</button>
                <button className="ducther2" onClick={() => handleDeleteUser(selectedUser.id)}>🗑️ Delete</button>
              </div>
            </div>

            {detailsLoading ? (
              <p>Loading user details...</p>
            ) : (
              <>
                <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
                  {selectedUser.image ? (
                    <img src={selectedUser.image} alt="user" style={{ width: 84, height: 84, borderRadius: 8, objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 84, height: 84, borderRadius: 8, background: "#eaeaea" }} />
                  )}
                  <div>
                    <div><b>Username:</b> {safe(selectedUser.username)}</div>
                    <div><b>Email:</b> {safe(selectedUser.email)}</div>
                    <div><b>Phone:</b> {safe(selectedUser.phone)}</div>
                    <div style={{ marginTop: 6 }}>
                      <b>Role:</b> <span style={{ marginRight: 8 }}>{safe(selectedUser.role)}</span>
                      <b>Status:</b> <span className={statusBadgeClass(selectedUser.status)} style={{ marginLeft: 6 }}>{safe(selectedUser.status)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
                  <div><b>Balance:</b> ₦{safe(selectedUser.balance, "0")}</div>
                  <div><b>KYC Status:</b> {String(selectedUser.kyc_status ?? "-")}</div>
                  <div><b>Registered:</b> {safe(selectedUser.created_at)}</div>
                  <div><b>Gender:</b> {safe(selectedUser.gender)}</div>
                  <div><b>Email Verified:</b> {selectedUser.email_verify ? "Yes" : "No"}</div>
                </div>

                {/* Status & Role update controls */}
                <div className="product-edit-form" style={{ marginBottom: 12 }}>
                  <label>
                    Update Status
                    <select value={statusForm.status} onChange={(e) => setStatusForm((p) => ({ ...p, status: e.target.value }))}>
                      <option value="">Select status</option>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  <div className="product-modal-actions">
                    <button className="product-btn-approve" onClick={handlePatchStatus}>Update Status</button>
                  </div>
                </div>

                <div className="product-edit-form" style={{ marginBottom: 12 }}>
                  <label>
                    Update Role
                    <select value={roleForm.role} onChange={(e) => setRoleForm({ role: e.target.value })}>
                      <option value="">Select role</option>
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </label>
                  <div className="product-modal-actions">
                    <button className="product-btn-update" onClick={handlePatchRole}>Update Role</button>
                  </div>
                </div>

                {/* Manage balance */}
                <div style={{ marginBottom: 12 }}>
                  <button className="ducther2" onClick={() => setBalanceOpen(true)}>Manage Balance</button>
                </div>

                <div className="product-modal-actions" style={{ marginTop: 14 }}>
                  <button className="product-btn-close" onClick={() => setSelectedUser(null)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MANAGE BALANCE MODAL */}
      {balanceOpen && selectedUser && (
        <div className="product-modal-overlay">
          <div className="product-modal-content" style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <h3>Manage Balance - {fullName(selectedUser)}</h3>
            <form onSubmit={handleManageBalance} className="product-edit-form">
              <label>
                Type
                <select value={balanceForm.type} onChange={(e) => setBalanceForm((p) => ({ ...p, type: e.target.value }))}>
                  <option value="credit">credit</option>
                  <option value="debit">debit</option>
                </select>
              </label>
              <label>
                Amount
                <input type="number" value={balanceForm.amount} onChange={(e) => setBalanceForm((p) => ({ ...p, amount: e.target.value }))} />
              </label>
              <label>
                Description
                <input value={balanceForm.description} onChange={(e) => setBalanceForm((p) => ({ ...p, description: e.target.value }))} />
              </label>

              <div className="product-modal-actions">
                <button type="submit" className="product-btn-update">Submit</button>
                <button type="button" className="product-btn-close" onClick={() => setBalanceOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUser;
