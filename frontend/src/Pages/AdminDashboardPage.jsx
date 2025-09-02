// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import "./CSS/AdminDashboardPage.css";
import { getAccessToken } from "../utils/token";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;


const AdminDashboardPage = () => {

   const [salesData, setSalesData] = useState([]);
    const [days, setDays] = useState(30); // default 30 days
  const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
   const [activities, setActivities] = useState([]);
  const [limit, setLimit] = useState(5); // default limit = 5

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
        console.error("No access token found. Please log in first.");
        setLoading(false);
        return;
      }
            console.log("🔍 Using token:", token);
        const url = `${BASE_URL}/v1/admin/sales-chart?days=${days}`;
      console.log("🔍 Fetching from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
             "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
              console.log("🔍 Response status:", response.status);
let rawText = await response.text();
      console.log("🔍 Raw response body:", rawText);

        if (!response.ok) {
          throw new Error("Failed to fetch sales chart data");
        }

       const result = JSON.parse(rawText);
      console.log("✅ Parsed response:", result);

      if (result.success) {
        setSalesData(result.data);
      } else {
        console.error("API error:", result.message);
      }
      } catch (error) {
        console.error("Error fetching sales chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [days]);

   useEffect(() => {
    const fetchRecentActivities = async () => {
      setLoading(true);
      try {
        const token = await getAccessToken();
        const response = await fetch(
          `${BASE_URL}/v1/admin/recent-activity?limit=${limit}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("🌐 Raw Response:", response);

        const data = await response.json();

              console.log("📦 Parsed Response JSON:", data);


        if (data.success && Array.isArray(data.data)) {
          console.log("✅ API Success Message:", data.message);
        console.log("📊 Activities Data:", data.data);
          setActivities(data.data);
        } else {
          setActivities([]);
        }
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, [limit]); // refetch when limit changes

   useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getAccessToken();
        console.log("🔑 Token retrieved:", token);

        const response = await fetch(`${BASE_URL}/v1/admin/stats`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("📊 Raw response from stats API:", data);

        if (data.success) {
          setStats(data.data);
          console.log("✅ Dashboard stats set:", data.data);
        } else {
          console.warn("⚠️ Failed to fetch stats:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
   <div className="admin-dashboard1">

     <h2 className="dashboard-title">Admin Dashboard Overview</h2>

      {/* Top Row */}
      
      {/* Second Row */}
<div className="dashboard-stats-grid">
      <h3>Statistics View</h3>
      {loading ? (
        <p>Loading stats...</p>
      ) :  stats ? (
        <>
          <div className="dashboard-card2">
            <h3>Users</h3>
            <p>Total: {stats.users?.total || 0}</p>
            <p>Active: {stats.users?.active || 0}</p>
          </div>

          <div className="dashboard-card2">
            <h3>Products</h3>
            <p>Total: {stats.products?.total || 0}</p>
            <p>Active: {stats.products?.active || 0}</p>
          </div>

          <div className="dashboard-card2">
            <h3>Orders</h3>
            <p>Total: {stats.orders?.total || 0}</p>
            <p>Pending: {stats.orders?.pending || 0}</p>
          </div>

          <div className="dashboard-card2">
            <h3>Sales</h3>
            <p>Total Volume: ₦{stats.sales?.total_volume || 0}</p>
            <p>Count: {stats.sales?.count || 0}</p>
          </div>

          <div className="dashboard-card2">
            <h3>Withdrawals</h3>
            <p>Pending Count: {stats.withdrawals?.pending_count || 0}</p>
            <p>Pending Volume: ₦{stats.withdrawals?.pending_volume || 0}</p>
          </div>
        </>
      )  : (
        <p>No stats available</p>
      )}
    </div>
      <div className="dashboard-card1 chart-card">
      <h3>Sales Chart</h3>

      {/* Dropdown for days */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="days" style={{ marginRight: '8px', fontWeight: 'bold' }}>
          Select Days:
        </label>
        <select
          id="days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
          }}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={60}>Last 60 days</option>
          <option value={90}>Last 90 days</option>
          <option value={180}>Last 180 days</option>
          <option value={365}>Last 365 days</option>
        </select>
      </div>

      {loading ? (
        <p>Loading sales data...</p>
      ) : salesData.length > 0 ? (
        <ul className="sales-list">
          {[...salesData].reverse().map((item, index) => (
            <li key={index} className="sales-item">
              <strong>{item.date}</strong>:₦{item.sales}
            </li>
          ))}
        </ul>
      ) : (
        <p>No sales data available</p>
      )}
    </div>   

      {/* Recent Activity Table */}
      <div className="dashboard-table">
      <h3 style={{ textAlign: "center" }}>Recent Activity</h3>

      {/* Limit Dropdown */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <label style={{ marginRight: "8px", fontWeight: "bold" }}>
          Show Limit:
        </label>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          style={{ padding: "5px 10px", borderRadius: "8px" }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={500}>500</option>
          <option value={1000}>1000</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Activity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                Loading activities...
              </td>
            </tr>
          ) : activities.length > 0 ? (
            activities.map((activity, index) => (
              <tr key={index}>
                <td>{activity.type || "Unknown User"}</td>
                <td>{activity.message || "No Activity"}</td>
                <td>{activity.timestamp || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No activities found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default AdminDashboardPage;
