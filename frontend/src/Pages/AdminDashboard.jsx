import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaChartBar,
  FaMapMarkerAlt ,
  FaCamera,
  FaGlobe,
  FaCogs,
  FaUser,
  FaBars,
  FaAngleDown,
} from "react-icons/fa";
import { BiMoneyWithdraw } from "react-icons/bi";
import { GiCardboardBox } from "react-icons/gi";
import pp from '../Components/Assets/pp.jpg'
import { MdShoppingCart, MdChatBubbleOutline   } from "react-icons/md";


import "./CSS/AdminDashboard.css";

// Import your pages/components
import AdminSettings from "./AdminSettings";
import AdminCategory from "./AdminCategory";
import AdminLocation from "./AdminLocation";
import AdminWithdrawal from "./AdminWithdrawal";
import AdminNotifyTemplate from "./AdminNotifyTemplate";
import AdminOrder from "./AdminOrder";
import AdminProduct from "./AdminProduct";
import AdminUser from "./AdminUser";
import AdminConversations from "./AdminConversations";
import AdminDashboardPage from "./AdminDashboardPage";

// Sidebar config
const sidebarItems = [
  {
    section: "MENU",
    items: [
      { icon: <FaTachometerAlt />, label: "Dashboard" },
      { icon: <FaChartBar />, label: "Categories" },
      { icon: <FaMapMarkerAlt  />, label: "Locations" },
      { icon: <FaCogs />, label: "Settings" },
    ],
  },
  {
    section: "SERVICES",
    items: [
      { icon: <BiMoneyWithdraw />, label: "Withdrawals" },
      { icon: <FaGlobe />, label: "Notify Templates" },
      { icon: <MdShoppingCart  />, label: "Orders" },
      { icon: <GiCardboardBox />, label: "Products" },
      { icon: <MdChatBubbleOutline  />, label: "Conversations" },
    ],
  },
  {
    section: "USERS",
    items: [{ icon: <FaUser />, label: "Users" }],
  },
];

export default function AdminDashboard() {
  const [selected, setSelected] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);
  const [profilePic, setProfilePic] = useState(pp);


  // ✅ Get admin name from sessionStorage
  const [adminName, setAdminName] = useState(
    sessionStorage.getItem("adminName") || "Super Admin"
  );

  void setAdminName

  useEffect(() => {
    const handleResize = () => {
      const nowMobile = window.innerWidth < 768;
      setIsMobile(nowMobile);
      setShowSidebar(!nowMobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // Load stored profile image from sessionStorage
  useEffect(() => {
    const storedPic = sessionStorage.getItem("profilePic");
    if (storedPic) {
      setProfilePic(storedPic);
    }
  }, []);

  // Handle new upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        sessionStorage.setItem("profilePic", reader.result); // Save to sessionStorage
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPage = () => {
    switch (selected) {
      case "Dashboard":
        return <AdminDashboardPage />;
      case "Categories":
        return <AdminCategory />;
      case "Locations":
        return <AdminLocation />;
      case "Withdrawals":
        return <AdminWithdrawal />;
      case "Notify Templates":
        return <AdminNotifyTemplate />;
      case "Orders":
        return <AdminOrder />;
      case "Products":
        return <AdminProduct />;
      case "Users":
        return <AdminUser />;
      case "Conversations":
        return <AdminConversations />;
      case "Settings":
        return <AdminSettings />;
      default:
        return <AdminDashboardPage />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile toggle */}
      {isMobile && (
        <button
          className="toggle-sidebar-btn"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <FaBars /> SidePanel
        </button>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? "visible" : "hidden"}`}>
        <div className="sidebar-logo">LOGO</div>
        <div className="sidebar-menu">
          {sidebarItems.map((group) => (
            <div key={group.section}>
              <p className="sidebar-section">{group.section}</p>
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className={`menu-item ${
                    selected === item.label ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelected(item.label);
                    if (isMobile) setShowSidebar(false);
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Area */}
      <div className="main-area">
        {/* Topbar */}
        <div className="topbar-fixed">
          <h3 className="topbar-icon-left">Welcome Dear Admin</h3>
          <div className="topbar-right">
            
            <div className="profile-container4">
      <img
        src={profilePic || pp }
        alt="profile"
        className="topbar-profile"
      />
      <label className="camera-icon7">
        <FaCamera className="flip"/>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </label>
    </div>
             <div className="super-admin">
              {adminName} <FaAngleDown />
              <div className="dropdown-menu">
                <button
                  onClick={() => {
                    sessionStorage.removeItem("adminName");
                    window.location.href = "/"; // redirect back
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
         <div className="topbar-fixed">
        <div className="notification-wrapper1">
              <h3>NB: CLick randomly on each item in tables to access details</h3>
            </div></div>

        {/* Breadcrumb */}
        <div className="breadcrumb-area">
          <span className="section-title">{selected}</span>
          <span className="breadcrumb">Access &gt; {selected}</span>
        </div>

        {/* Page Content */}
        {renderPage()}
      </div>
    </div>
  );
}
