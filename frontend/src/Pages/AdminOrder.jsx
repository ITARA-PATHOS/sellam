import React, { useEffect, useMemo, useState } from "react";
import { getAccessToken } from "../utils/token";
import "./CSS/AdminProduct.css";
import "./CSS/AdminCategory.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Allowed filters from your API docs
const PAYMENT_STATUS_OPTIONS = [
  "pending",
  "paid",
  "failed",
  "processing",
  "refunded",
];

const ORDER_STATUS_OPTIONS = [
  "pending",
  "processing",
  "partially_completed",
  "shipped",
  "partially_delivered",
  "delivered",
  "completed",
  "disputed",
  "cancelled",
];

// Map your many order statuses to existing badge styles
function statusBadgeClass(status = "") {
  const s = String(status).toLowerCase();
  if (
    s === "completed" ||
    s === "delivered" ||
    s === "shipped" ||
    s === "partially_delivered"
  ) {
    return "status-badge status-approved"; // green
  }
  if (s === "cancelled" || s === "disputed" || s === "failed") {
    return "status-badge status-rejected"; // red
  }
  // pending, processing, partially_completed, others
  return "status-badge status-pending"; // amber
}

// Best-effort safe getters (list responses can vary)
const getSellerName = (o) =>
  o?.seller?.full_name ||
  o?.seller?.fullName ||
  [o?.seller?.first_name, o?.seller?.last_name].filter(Boolean).join(" ") ||
  "-";

const getSellerImg = (o) => o?.seller?.image || "";

const getBuyerName = (o) =>
  o?.buyer?.full_name ||
  o?.user?.full_name ||
  o?.user_full_name ||
  o?.user_name ||
  [o?.buyer?.first_name, o?.buyer?.last_name].filter(Boolean).join(" ") ||
  "-";


/**
 * AdminOrder
 * - Lists all orders (per_page + filters)
 * - Click row → details popup
 *    - Update notes (PUT /orders/{order})
 *    - Change status + reason (PUT /orders/{order}/status)
 *    - Items list (cards) with its own per_page
 *    - Click item → nested popup using /order-items/{id}/show
 */
const AdminOrder = () => {
  // Table state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Filters/search
  const [perPage, setPerPage] = useState(20);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [query, setQuery] = useState("");

  // Derived (client filter for small UX polish; API still does server filtering)
  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return orders;
    return orders.filter((o) => {
      const seller = getSellerName(o).toLowerCase();
      const buyer = getBuyerName(o).toLowerCase();
      const code = String(o?.code || "").toLowerCase();
      return seller.includes(q) || buyer.includes(q) || code.includes(q);
    });
  }, [orders, query]);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);

  // Notes + status form
  const [notes, setNotes] = useState("");
  const [statusForm, setStatusForm] = useState({ status: "", reason: "" });

  // Items under an order
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [orderItemsPerPage, setOrderItemsPerPage] = useState(10);

  // Nested item details
  const [itemDetails, setItemDetails] = useState(null);
  const [itemDetailsLoading, setItemDetailsLoading] = useState(false);

  // Fetch orders (List All Orders)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErr("");
      const token = await getAccessToken();

      const params = new URLSearchParams();
      if (perPage) params.append("per_page", String(perPage));
      if (paymentStatus) params.append("payment_status", paymentStatus);
      if (orderStatus) params.append("status", orderStatus);
      if (query.trim().length >= 2) params.append("query", query.trim());

      const res = await fetch(
        `${BASE_URL}/v1/admin/orders?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();

      if (data?.success) {
        // API returns data.data as the list
        setOrders(Array.isArray(data.data) ? data.data : []);
      } else {
        setErr(data?.message || "Failed to fetch orders");
        setOrders([]);
      }
    } catch (e) {
      setErr(e.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial + on filter changes
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, paymentStatus, orderStatus]);

  // Debounce API query on typing (but still client-filter live above)
  useEffect(() => {
    const t = setTimeout(() => {
      fetchOrders();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Fetch a single order by id for freshest details (Show order)
  const fetchOrderById = async (orderId) => {
    try {
      setOrderDetailsLoading(true);
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (data?.success) {
        return data.data;
      }
      return null;
    } catch (e) {
      return null;
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  // Fetch order items (List All order items — filtered by order)
  const fetchOrderItems = async (orderId, itemsPer = orderItemsPerPage) => {
    try {
      setItemsLoading(true);
      const token = await getAccessToken();

      // Preferred: server-side filter by order_id if supported
      const params = new URLSearchParams();
      if (itemsPer) params.append("per_page", String(itemsPer));
      // Many APIs let you pass order_id; if not supported, fallback below
      params.append("order_id", orderId);

      let res = await fetch(
        `${BASE_URL}/v1/admin/order-items?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      let data = await res.json();

      if (data?.success && Array.isArray(data.data)) {
        setOrderItems(data.data);
        return;
      }

      // Fallback: fetch items without order_id and filter client-side
      res = await fetch(
        `${BASE_URL}/v1/admin/order-items?per_page=${itemsPer}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        const filtered = data.data.filter((it) => it?.order_id === orderId);
        setOrderItems(filtered);
      } else {
        setOrderItems([]);
      }
    } catch (e) {
      setOrderItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  // Fetch a single order item (Show order item)
  const fetchOrderItemById = async (orderItemId) => {
    try {
      setItemDetailsLoading(true);
      const token = await getAccessToken();
      const res = await fetch(
        `${BASE_URL}/v1/admin/order-items/${orderItemId}/show`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();
      if (data?.success) return data.data;
      return null;
    } catch (e) {
      return null;
    } finally {
      setItemDetailsLoading(false);
    }
  };

  // Row click → open details modal
  const handleOpenOrderDetails = async (orderRow) => {
    // Pull freshest details
    const fresh = await fetchOrderById(orderRow.id);
    const order = fresh || orderRow;

    setSelectedOrder(order);
    setNotes(order?.notes || "");
    setStatusForm({
      status: order?.status || "",
      reason: "",
    });

    // Load items for this order
    fetchOrderItems(order.id, orderItemsPerPage);
  };

  // Change order status (PUT /orders/{order}/status)
  const handleChangeOrderStatus = async () => {
    if (!selectedOrder) return;
    if (!statusForm.status) {
      alert("Please select a status.");
      return;
    }
    try {
      const token = await getAccessToken();
      const res = await fetch(
        `${BASE_URL}/v1/admin/orders/${selectedOrder.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            status: statusForm.status,
            reason: statusForm.reason || null,
          }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        // Reflect in table + modal
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id ? { ...o, status: statusForm.status } : o
          )
        );
        setSelectedOrder((prev) => ({ ...prev, status: statusForm.status }));
        alert(data?.message || "Order status updated successfully.");
      } else {
        alert(data?.message || "Failed to update status.");
      }
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  // Update notes (PUT /orders/{order})
  const handleUpdateNotes = async () => {
    if (!selectedOrder) return;
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ notes: notes || null }),
      });
      const data = await res.json();
      if (data?.success) {
        setSelectedOrder((prev) => ({ ...prev, notes }));
        alert(data?.message || "Order updated successfully.");
      } else {
        alert(data?.message || "Failed to update order.");
      }
    } catch (e) {
      alert("Failed to update order.");
    }
  };

  // Item card click → nested details modal
  const handleOpenItemDetails = async (orderItem) => {
    const fresh = await fetchOrderItemById(orderItem.id);
    setItemDetails(fresh || orderItem);
  };

  // UI
  return (
    <div className="main-area">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <span className="section-title">Manage Users Order</span>
        <span className="breadcrumb">Admin &gt; Orders</span>
      </div>

      {/* Filters / Controls */}
      <div className="product-searchbar" style={{ flexWrap: "wrap", gap: 12 }}>
        {/* Per Page */}
        <div className="perpage-selector" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <label>Show:</label>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>per page</span>
        </div>

        {/* Payment Status Filter */}
        <div className="perpage-selector" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <label>Payment:</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="">All</option>
            {PAYMENT_STATUS_OPTIONS.map((ps) => (
              <option key={ps} value={ps}>{ps}</option>
            ))}
          </select>
        </div>

        {/* Order Status Filter */}
        <div className="perpage-selector" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <label>Status:</label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <option value="">All</option>
            {ORDER_STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Query (server-side) + client filter */}
        <input
          type="text"
          placeholder="Search by code / buyer / seller (min 2 chars)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ minWidth: 240 }}
        />
      </div>

      {/* Table */}
      <div className="table-container" >
        {loading ? (
          <p>Loading orders...</p>
        ) : err ? (
          <p className="error">{err}</p>
        ) : (
          <table >
            <thead>
              <tr>
                <th>#</th>
                <th>Seller</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o, i) => (
                <tr
                  key={o.id || i}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenOrderDetails(o)}
                >
                  <td>{i + 1}</td>
                  <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {getSellerImg(o) ? (
                      <img
                        src={getSellerImg(o)}
                        alt=""
                        className="table-avatar"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          display: "inline-block",
                          background: "#eaeaea",
                        }}
                      />
                    )}
                    <span>{getSellerName(o)}</span>
                  </td>
                 
                  <td>₦{o?.total || o?.amount || "-"}</td>
                  <td>
                    <span className={statusBadgeClass(o?.status)}>
                      {o?.status || "-"}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 12 }}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="product-modal-overlay">
          <div
            className="product-modal-content"
            style={{ maxHeight: "85vh", overflowY: "auto" }}
          >
            <h3 style={{ marginBottom: 8 }}>
              Order #{selectedOrder?.code || selectedOrder?.id}
            </h3>
            {orderDetailsLoading ? (
              <p>Loading order details...</p>
            ) : (
              <>
                <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                  <div>
                    <b>Total:</b> ₦{selectedOrder?.total || selectedOrder?.amount || "-"}
                  </div>
                  <div>
                    <b>Payment:</b> {selectedOrder?.payment_status || "-"}{" "}
                    {selectedOrder?.payment_method
                      ? `• ${selectedOrder.payment_method}`
                      : ""}
                    {selectedOrder?.payment_date
                      ? ` • ${selectedOrder.payment_date}`
                      : ""}
                  </div>
                  <div>
                    <b>Status:</b>{" "}
                    <span className={statusBadgeClass(selectedOrder?.status)}>
                      {selectedOrder?.status || "-"}
                    </span>
                  </div>
                </div>

                {/* Notes update */}
                <div className="product-edit-form" style={{ marginBottom: 12 }}>
                  <label>
                    Notes
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add or edit notes..."
                      rows={3}
                    />
                  </label>
                  <div className="product-modal-actions">
                    <button
                      className="product-btn-update"
                      onClick={handleUpdateNotes}
                    >
                      Save Notes
                    </button>
                  </div>
                </div>

                {/* Change status */}
                <div className="product-edit-form" style={{ marginBottom: 16 }}>
                  <label>
                    Change Status
                    <select
                      value={statusForm.status}
                      onChange={(e) =>
                        setStatusForm((p) => ({ ...p, status: e.target.value }))
                      }
                    >
                      <option value="">Select status</option>
                      {ORDER_STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Reason (optional)
                    <input
                      type="text"
                      maxLength={500}
                      placeholder="Enter reason for this change (≤ 500 chars)"
                      value={statusForm.reason}
                      onChange={(e) =>
                        setStatusForm((p) => ({ ...p, reason: e.target.value }))
                      }
                    />
                  </label>
                  <div className="product-modal-actions">
                    <button
                      className="product-btn-approve"
                      onClick={handleChangeOrderStatus}
                    >
                      Update Status
                    </button>
                  </div>
                </div>

                {/* Items per page */}
                <div
                  className="perpage-selector"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <label>Items per page:</label>
                  <select
                    value={orderItemsPerPage}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setOrderItemsPerPage(v);
                      fetchOrderItems(selectedOrder.id, v);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                {/* Items list */}
                <div
                  className="items-container"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 12,
                    maxHeight: 320,
                    overflowY: "auto",
                    paddingRight: 4,
                  }}
                >
                  {itemsLoading ? (
                    <p>Loading items...</p>
                  ) : orderItems.length > 0 ? (
                    orderItems.map((it) => (
                      <div
                        key={it.id}
                        className="item-card"
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: 10,
                          padding: 10,
                          cursor: "pointer",
                          background: "#fff",
                        }}
                        onClick={() => handleOpenItemDetails(it)}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>
                          {it?.product?.title || "Product"}
                        </div>
                        <div style={{ fontSize: 13 }}>
                          <div>Qty: {it?.quantity ?? "-"}</div>
                          <div>Price: ₦{it?.price ?? "-"}</div>
                          <div>Total: ₦{it?.total ?? "-"}</div>
                          <div>
                            Status:{" "}
                            <span className={statusBadgeClass(it?.status)}>
                              {it?.status || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: "1 / -1", padding: 8 }}>
                      No items found for this order.
                    </div>
                  )}
                </div>

                <div className="product-modal-actions" style={{ marginTop: 14 }}>
                  <button
                    className="product-btn-close"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ITEM DETAILS MODAL */}
      {itemDetails && (
        <div className="product-modal-overlay">
          <div
            className="product-modal-content"
            style={{ maxHeight: "85vh", overflowY: "auto" }}
          >
            {itemDetailsLoading ? (
              <p>Loading item...</p>
            ) : (
              <>
                <h3 style={{ marginBottom: 6 }}>
                  {itemDetails?.product?.title || "Order Item"}
                </h3>
                <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
                  <div>
                    <b>Item ID:</b> {itemDetails?.id}
                  </div>
                  <div>
                    <b>Status:</b>{" "}
                    <span className={statusBadgeClass(itemDetails?.status)}>
                      {itemDetails?.status || "-"}
                    </span>
                  </div>
                  <div>
                    <b>Qty:</b> {itemDetails?.quantity ?? "-"}
                  </div>
                  <div>
                    <b>Price:</b> ₦{itemDetails?.price ?? "-"}
                  </div>
                  <div>
                    <b>Total:</b> ₦{itemDetails?.total ?? "-"}
                  </div>
                </div>

                {/* People */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 10,
                      background: "#fff",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>
                      Seller
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {itemDetails?.seller?.image ? (
                        <img
                          src={itemDetails.seller.image}
                          alt=""
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            display: "inline-block",
                            background: "#eaeaea",
                          }}
                        />
                      )}
                      <span>
                        {itemDetails?.seller?.full_name ||
                          [itemDetails?.seller?.first_name, itemDetails?.seller?.last_name]
                            .filter(Boolean)
                            .join(" ") ||
                          "-"}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 10,
                      background: "#fff",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>
                      Buyer
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {itemDetails?.buyer?.image ? (
                        <img
                          src={itemDetails.buyer.image}
                          alt=""
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            display: "inline-block",
                            background: "#eaeaea",
                          }}
                        />
                      )}
                      <span>
                        {itemDetails?.buyer?.full_name ||
                          [itemDetails?.buyer?.first_name, itemDetails?.buyer?.last_name]
                            .filter(Boolean)
                            .join(" ") ||
                          "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Snapshot */}
                {itemDetails?.product && (
                  <div
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 10,
                      background: "#fff",
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>
                      Product
                    </div>
                    <div style={{ display: "grid", gap: 6 }}>
                      <div>
                        <b>Title:</b> {itemDetails.product.title}
                      </div>
                      <div>
                        <b>Price:</b> ₦{itemDetails.product.price}
                      </div>
                      {itemDetails?.product?.thumbnail && (
                        <img
                          src={itemDetails.product.thumbnail}
                          alt={itemDetails.product.title}
                          style={{
                            width: "100%",
                            maxHeight: 200,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="product-modal-actions">
                  <button
                    className="product-btn-close"
                    onClick={() => setItemDetails(null)}
                  >
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

export default AdminOrder;
