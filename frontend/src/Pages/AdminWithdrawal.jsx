import React, { useEffect, useState } from "react";
import { getAccessToken } from "../utils/token";
import "./CSS/AdminProduct.css";
import "./CSS/AdminCategory.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminWithdrawal = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [perPage, setPerPage] = useState(20);



  useEffect(() => {
      // Fetch withdrawals
  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      setError("");
      const token = await getAccessToken();
      const res = await fetch(
        `${BASE_URL}/v1/admin/withdrawals?per_page=${perPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      console.log("Withdrawals response:", data);

      if (data.success) {
        setWithdrawals(data.data);
        setFilteredWithdrawals(data.data);
      } else {
        setError(data.message || "Failed to fetch withdrawals");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
    fetchWithdrawals();
  }, [perPage]);

  // Search filter
  useEffect(() => {
    let data = withdrawals;
    if (search.trim() !== "") {
      data = withdrawals.filter((w) =>
        w.user?.full_name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredWithdrawals(data);
  }, [search, withdrawals]);

  // Approve withdrawal
  const handleApprove = async (id) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(
        `${BASE_URL}/v1/admin/withdrawals/${id}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();
      console.log("Approve response:", data);

      if (data.success) {
        setWithdrawals((prev) =>
          prev.map((w) => (w.id === id ? { ...w, status: "approved" } : w))
        );
        setSelectedWithdrawal((prev) => ({ ...prev, status: "approved" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reject withdrawal
  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    try {
      console.log("Rejecting withdrawal ID:", id);

            const token = await getAccessToken();


      const res = await fetch(
        `${BASE_URL}/v1/admin/withdrawals/${id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: rejectReason }),
        }
      );

      const data = await res.json();
      console.log("Reject response:", data);

      if (data.success) {
        setRejectingId(null);
        setRejectReason("");
        setWithdrawals((prev) =>
          prev.map((w) => (w.id === id ? { ...w, status: "rejected" } : w))
        );
        setSelectedWithdrawal((prev) => ({ ...prev, status: "rejected" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open details modal
  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
  };

  return (
    <div className="main-area">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <span className="section-title">Manage Sellers Withdrawal</span>
        <span className="breadcrumb">Admin &gt; Withdrawals</span>
      </div>

      {/* Search bar + per page */}
      <div className="product-searchbar">
        <div className="perpage-selector">
          <label>Show: </label>
          <select value={perPage} onChange={(e) => setPerPage(e.target.value)}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span> per page</span>
        </div>

        <input
          type="text"
          placeholder="Search by user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <p>Loading withdrawals...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map((w, i) => (
                <tr
                  key={w.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleViewDetails(w)}
                >
                  <td>{i + 1}</td>
                  <td>{w.user?.full_name || "-"}</td>
                  <td>${w.amount}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        w.status === "approved"
                          ? "status-approved"
                          : w.status === "rejected"
                          ? "status-rejected"
                          : "status-pending"
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details modal */}
      {selectedWithdrawal && (
        <div className="product-modal-overlay">
          <div className="product-modal-content" style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <h3>Withdrawal Details</h3>
            <p><b>User:</b> {selectedWithdrawal.user?.full_name}</p>
            <p><b>First Name:</b> {selectedWithdrawal.user?.first_name}</p>
            <p><b>Last Name:</b> {selectedWithdrawal.user?.last_name}</p>
            <p><b>Username:</b> {selectedWithdrawal.user?.username}</p>
            <p><b>Phone:</b> {selectedWithdrawal.user?.phone}</p>
            <p><b>Amount:</b> ${selectedWithdrawal.amount}</p>
            <p><b>Fee:</b> ${selectedWithdrawal.fee}</p>
            <p><b>Total:</b> ${selectedWithdrawal.total_amount}</p>
            <p><b>Status:</b> {selectedWithdrawal.status}</p>
            <p><b>Code:</b> {selectedWithdrawal.code}</p>
            <p><b>Note:</b> {selectedWithdrawal.note}</p>
            <p><b>Rejection Reason:</b> {selectedWithdrawal.rejection_reason}</p>
            <p><b>Approved At:</b> {selectedWithdrawal.approved_at}</p>
            <p><b>Rejected At:</b> {selectedWithdrawal.rejected_at}</p>
            <p><b>Created At:</b> {selectedWithdrawal.created_at}</p>

            <div className="product-modal-actions">
              <button
                className="product-btn-approve"
                onClick={() => handleApprove(selectedWithdrawal.id)}
              >
                ✅ Approve
              </button>

              <button
                onClick={() =>
                  setRejectingId(
                    rejectingId === selectedWithdrawal.id ? null : selectedWithdrawal.id
                  )
                }
                className="product-btn-reject"
              >
                Reject
              </button>

              {rejectingId === selectedWithdrawal.id && (
                <div className="reject-form">
                  <input
                    type="text"
                    placeholder="Enter reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <button
                    onClick={() => handleReject(selectedWithdrawal.id)}
                    className="reject-submit-btn"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setRejectingId(null)}
                    className="reject-cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <button
                className="product-btn-close"
                onClick={() => setSelectedWithdrawal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawal;
