import React, { useState, useEffect } from 'react';
import './CSS/AdminDashboard.css';
import {
  FaTachometerAlt, FaChartBar, FaMoneyCheck, FaGlobe, FaCogs, FaUser, FaKey,
  FaCoins, FaCreditCard, FaGift, FaAngleDown, FaBell, FaEllipsisV, FaBars
} from 'react-icons/fa';

const sidebarItems = [
  { section: 'MENU', items: [
    { icon: <FaTachometerAlt />, label: 'Dashboard' },
    { icon: <FaChartBar />, label: 'Statistics' },
    { icon: <FaMoneyCheck />, label: 'API Balance' }
  ]},
  { section: 'SERVICES', items: [
    { icon: <FaGift />, label: 'Bill Plans' },
    { icon: <FaGlobe />, label: 'API Websites' },
    { icon: <FaCogs />, label: 'Bills Setting' },
    { icon: <FaCogs />, label: 'API Selection' }
  ]},
  { section: 'USERS', items: [
    { icon: <FaUser />, label: 'Users' },
    { icon: <FaKey />, label: 'User Setting' },
    { icon: <FaKey />, label: 'KYC' }
  ]},
  { section: 'CRYPTOCURRENCY', items: [
    { icon: <FaCoins />, label: 'Cryptocurrencies' },
    { icon: <FaCoins />, label: 'Crypto Orders' }
  ]},
  { section: 'GIFTCARD', items: [
    { icon: <FaCreditCard />, label: 'Giftcards' },
    { icon: <FaCreditCard />, label: 'Giftcard Plans' }
  ]}
];

const AdminDashboard = () => {
  const [selected, setSelected] = useState('Giftcards');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const nowMobile = window.innerWidth < 768;
      setIsMobile(nowMobile);
      setShowSidebar(!nowMobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isGiftcardPage = selected === 'Giftcards';

  return (
    <div className="admin-dashboard">
      {isMobile && (
        <button className="toggle-sidebar-btn" onClick={() => setShowSidebar(!showSidebar)}>
          <FaBars /> SidePanel
        </button>
      )}

      <aside className={`sidebar ${showSidebar ? 'visible' : 'hidden'}`}>
        <div className="sidebar-logo">LOGO</div>
        <div className="sidebar-menu">
          {sidebarItems.map(group => (
            <div key={group.section}>
              <p className="sidebar-section">{group.section}</p>
              {group.items.map(item => (
                <a
                  href="#"
                  key={item.label}
                  className={`menu-item ${selected === item.label ? 'active' : ''}`}
                  onClick={() => {
                    setSelected(item.label);
                    if (isMobile) setShowSidebar(false);
                  }}
                >
                  {item.icon} {item.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </aside>

      <div className="main-area">
        <div className="topbar-fixed">
          <FaBars className="topbar-icon-left" />
          <div className="topbar-right">
            <div className="notification-wrapper">
              <FaBell className="topbar-icon" />
              <span className="notif-dot" />
            </div>
            <img src="https://via.placeholder.com/30" alt="profile" className="topbar-profile" />
            <div className="super-admin">
              Super Admin <FaAngleDown />
              <div className="dropdown-menu">
                <a href="#">Logout</a>
              </div>
            </div>
          </div>
        </div>

        <div className="breadcrumb-area">
          <span className="section-title">{selected}</span>
          <span className="breadcrumb">Bills &gt; {selected}</span>
        </div>

        {isGiftcardPage && (
          <div className="table-controls">
            <div className="entries">
              Show
              <select>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
              entries
            </div>
            <div className="search-box">
              <input type="text" placeholder="Search..." />
            </div>
          </div>
        )}

        {isGiftcardPage ? (
          <div className="giftcard-section">
            <div className="section-header">
              <h2>Giftcard</h2>
              <button className="add-btn">Add Giftcard</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Plans</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, name: 'Apple', status: 'active' },
                    { id: 2, name: 'Amazon', status: 'active' },
                    { id: 3, name: 'Bitcoin', status: 'disabled' },
                    { id: 4, name: 'Steam', status: 'active' },
                    { id: 5, name: 'Google Play', status: 'active' }
                  ].map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td><img src={`https://via.placeholder.com/40x30?text=${item.name[0]}`} alt={item.name} className="table-img" /></td>
                      <td>{index}</td>
                      <td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
                      <td><FaEllipsisV className="action-icon" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">Showing 1 to 5 of 5 entries</div>
            </div>
          </div>
        ) : (
          <div className="placeholder-message">This is the {selected} section.</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
