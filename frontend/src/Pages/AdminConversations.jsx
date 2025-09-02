// src/pages/AdminConversations.jsx
import React, { useEffect, useState } from "react";
import { getAccessToken } from "../utils/token";
import "./CSS/AdminProduct.css";
import "./CSS/AdminCategory.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // pagination / controls
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // selected conversation / modal
  const [selectedConv, setSelectedConv] = useState(null);
  const [convLoading, setConvLoading] = useState(false);

  // fetch conversations list
  const fetchConversations = async (p = page, pp = perPage) => {
    try {
      setLoading(true);
      setErr("");
      const token = await getAccessToken();
      const url = `${BASE_URL}/v1/conversations/admin-conversations?page=${p}&per_page=${pp}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Full API response:", data);
      console.log("Conversation list:", data?.data);


      if (data?.success) {
        setConversations(Array.isArray(data.data) ? data.data : []);
        // try to get pagination from response (sample uses pagination object)
        const pagination = data.pagination || {};
        setTotalPages(Number(pagination.last_page || pagination.lastPage || 1));
      } else {
        setConversations([]);
        setTotalPages(1);
        setErr(data?.message || "Failed to fetch conversations");
      }
    } catch (e) {
      setErr(e.message || "Failed to fetch conversations");
      setConversations([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(page, perPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage]);

  // attempt to fetch fresh single conversation by id (if endpoint existed) otherwise fallback
  const fetchConversationById = async (id) => {
    try {
      setConvLoading(true);
      const token = await getAccessToken();
      const url = `${BASE_URL}/v1/conversations/admin-conversations/${id}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // If endpoint exists & returns success
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data.data) return data.data;
      }
      // fallback: return null and let caller use the conversation from list
      return null;
    } catch (e) {
      return null;
    } finally {
      setConvLoading(false);
    }
  };

  // open modal for conversation (try to fetch fresh single conv, else use list item)
  const openConversation = async (conv) => {
    const fresh = await fetchConversationById(conv.id);
    setSelectedConv(fresh || conv);
  };



  // helpers to format


  // render
  return (
    <div className="main-area">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <span className="section-title">Manage Users Conversation</span>
        <span className="breadcrumb">Admin &gt; Conversations</span>
      </div>

      {/* Controls */}
      <div className="product-searchbar" style={{ gap: 12, alignItems: "center" }}>
        <div className="perpage-selector" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <label>Show:</label>
          <select
            value={perPage}
            onChange={(e) => {
              const v = Number(e.target.value);
              setPerPage(v);
              setPage(1);
              // fetchConversations(1, v); // effect will trigger
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span> per page</span>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            className="ducther2"
            onClick={() => {
              setPage(1);
              fetchConversations(1, perPage);
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <p>Loading conversations...</p>
        ) : err ? (
          <p className="error">{err}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Participants</th>
                <th>Name</th>
                <th>Recents Time</th>
                <th>Unread Counts</th>
              </tr>
            </thead>
            <tbody>
              {conversations.length > 0 ? (
                conversations.map((c) => (
                  <tr
                    key={c.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => openConversation(c)}
                  >
                  <td
  style={{
    display: "flex",
    flexWrap: "wrap", // allow wrapping on small screens
    alignItems: "center",
    gap: "8px",
  }}
>
  {Array.isArray(c.participants) && c.participants.length > 0 ? (
    c.participants.map((p, idx) => (
      <span
        key={p.id || idx}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          flex: "1 1 150px", // force stacking on narrow screens
          minWidth: "120px",
        }}
      >
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            p.name || p.username || "User"
          )}&background=280769&color=fff`}
          alt={p.name}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <span style={{ whiteSpace: "nowrap" }}>{p.name || p.username}</span>
      </span>
    ))
  ) : (
    <span>-</span>
  )}
</td>


                    <td>{c.name || "Unnamed Conversation"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{c.last_message_at || "-"}</td>
                    <td>{typeof c.unread_messages_count !== "undefined" ? c.unread_messages_count : 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: 12 }}>
                    No conversations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button disabled={page >= (totalPages || 1)} onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}>
          Next
        </button>
      </div>

      {/* Conversation Modal */}
      {selectedConv && (
        <div className="product-modal-overlay">
          <div
            className="product-modal-content"
            style={{ maxHeight: "85vh", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ marginBottom: 8 }}>{selectedConv.name || `Conversation ${selectedConv.id}`}</h3>
              <div>
                <button className="product-btn-close" onClick={() => setSelectedConv(null)}>
                  Close
                </button>
              </div>
            </div>

            {convLoading ? (
              <p>Loading conversation...</p>
            ) : (
              <>
                {/* Meta / IDs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  <div style={{ borderRadius: 8, border: "1px solid #e5e7eb", padding: 10, background: "#fff" }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Conversation Info</div>
                    <div><b>ID:</b> {selectedConv.id}</div>
                    {selectedConv.transaction_id && <div><b>Transaction:</b> {selectedConv.transaction_id}</div>}
                    {selectedConv.product_id && <div><b>Product ID:</b> {selectedConv.product_id}</div>}
                    <div><b>Created:</b> {selectedConv.created_at || "-"}</div>
                    <div><b>Updated:</b> {selectedConv.updated_at || "-"}</div>
                    <div><b>Last message at:</b> {selectedConv.last_message_at || "-"}</div>
                    <div><b>Unread count:</b> {selectedConv.unread_messages_count ?? 0}</div>
                  </div>

                  <div style={{ borderRadius: 8, border: "1px solid #e5e7eb", padding: 10, background: "#fff" }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Participants</div>
                    {Array.isArray(selectedConv.participants) && selectedConv.participants.length > 0 ? (
                      selectedConv.participants.map((p, idx) => (
                        <div key={p.id || idx} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || p.username || 'User')}&background=280769&color=fff`}
    alt={p.name} 
                            style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 700 }}>{p.name || p.username}</div>
                            <div style={{ fontSize: 12, color: "#666" }}>
                              <div>Username: {p.username || "-"}</div>
                              <div>Last read: {p.last_read_at || "-"}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>No participants.</div>
                    )}
                  </div>
                </div>

                {/* Latest message */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Latest Message</div>
                  {selectedConv.latest_message ? (
                    <div style={{ borderRadius: 8, border: "1px solid #e5e7eb", padding: 10, background: "#fff" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <img
                         src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConv.latest_message.sender?.name || selectedConv.latest_message.sender?.username || 'User')}&background=280769&color=fff`}
    alt={selectedConv.latest_message.sender?.name} 
                          style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{selectedConv.latest_message.sender?.name || "-"}</div>
                          <div style={{ marginTop: 6 }}>{selectedConv.latest_message.message || "-"}</div>
                          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>{selectedConv.latest_message.created_at || "-"}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>No latest message.</div>
                  )}
                </div>

                {/* Message history */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Message History</div>
                  <div style={{ maxHeight: 320, overflowY: "auto", paddingRight: 6 }}>
                    {Array.isArray(selectedConv.messages) && selectedConv.messages.length > 0 ? (
                      selectedConv.messages.map((m, idx) => (
                        <div key={m.id || idx} style={{ borderRadius: 8, border: "1px solid #e5e7eb", padding: 10, background: "#fff", marginBottom: 8 }}>
                          <div style={{ display: "flex", gap: 10 }}>
                            <img
                             src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender?.name || m.sender?.username || 'User')}&background=280769&color=fff`}
    alt={m.sender?.name} 
                              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700 }}>{m.sender?.name || m.sender?.username || "-"}</div>
                              <div style={{ marginTop: 6 }}>{m.message || m?.text || "-"}</div>
                              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>{m.created_at || "-"}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>No messages in this conversation.</div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button className="product-btn-close" onClick={() => setSelectedConv(null)}>
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConversations;
