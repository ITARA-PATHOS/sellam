import React from 'react';
import './CSS/SalesOverview.css';
import { AiOutlineUser } from 'react-icons/ai';
import au from '../Components/Assets/au.PNG';
import ad from '../Components/Assets/ad.PNG';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaHome, FaComment, FaArrowLeft } from 'react-icons/fa';
import { FiPlus } from "react-icons/fi";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Filler, } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Filler);

const SalesOverview = () => {

    const createGradient = (ctx, area) => {
        const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
        gradient.addColorStop(0, 'rgba(0, 0, 255, 0.3)'); // Light blue at top
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)'); // Faint blue/white at bottom
        return gradient;
      };

    const data = {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [
          {
            label: 'Sales',
            data: [200, 400, 600, 500, 700, 400, 600],
            borderColor: '#0000FF',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            backgroundColor: (context) => {
                const { chart } = context;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                  return null; // Ensure chart area is ready
                }
                return createGradient(ctx, chartArea);
              },
          },
        ],
      };
    
       // Chart Options
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { drawBorder: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

    
  return (
    <div className="app">
                      {/* Header Section */}
                              <div className="header4" style={{ background: "#ffffff" }}>
                                <Link to="/seller_dashboard">
                                  <FaArrowLeft className="back-icon5" />
                                </Link>
                                <h2 className="header-title3">Sales Overview</h2>
                                
                              </div>
                      
                      <div className='chat-ap' >
                     
    
                      {/* Cards Section */}
      <div className="cards-container9">
        <div className="card9">
          <div className="card-text9">
            <p>Total Sales</p>
            <h2>$12,345.67</h2>
          </div>
          <div className="card-stats green">
            <span>1.3%</span>
          <img src={au} alt="odel" className="" style={{ height: "20px"}}/>
          </div>
        </div>
        <div className="card9">
          <div className="card-text9">
            <p>Completed Orders</p>
            <h2>21</h2>
          </div>
          <div className="card-stats red">
            <span>5%</span>
            <img src={ad} alt="odel" className="" style={{ height: "20px"}}/>
            </div>
        </div>
        <div className="card9">
          <div className="card-text9">
            <p>Pending Orders</p>
            <h2>15</h2>
          </div>
          <div className="card-stats green">
            <span>1.3%</span>
            <img src={au} alt="odel" className="" style={{ height: "20px"}}/>
            </div>
        </div>
      </div>

      {/* Sales Trend Section */}
      <div className="sales-trend-container">
        <p>Sales Trend</p>
        <select className="dropdown9">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Last 24 Hours</option>
        </select>
      </div>

        {/* Line Chart */}
        <div className="chart-container" style={{ height: '300px' }}>
        <Line data={data} options={options} />
      </div>

        
                      </div>
                       {/* Plus Icon */}
                       <Link to="/add_items" style={{ textDecoration: "none" }}>
                       <div className="plus-icon-wrapper">
                       <FiPlus className="plus-icon" />
                       <div className="horizontal-lines"></div>
                      </div></Link> 
                       {/* Bottom Navigation */}
                       <nav className="bottom-nav2">
                        <Link to="/seller_dashboard" style={{ textDecoration: "none" }}>
                          <button className="nav-button2">
                            <FaHome className="nav-icon2" />
                            <span className="nav-label2">Home</span>
                          </button>
                        </Link>
                        <Link to="/items_list" style={{ textDecoration: "none" }}>
                          <button className="nav-button2">
                            <FaClipboardList className="nav-icon2" />
                            <span className="nav-label2">Listings</span>
                          </button>
                        </Link>
                        
                        <Link to="/buyers_chat" style={{ textDecoration: "none" }}>
                          <button className="nav-button2">
                            <FaComment className="nav-icon2" />
                            <span className="nav-label2">Messages</span>
                          </button>
                        </Link>
                        <Link to="/seller_profile_settings" style={{ textDecoration: "none" }}>
                          <button className="nav-button2">
                            <AiOutlineUser className="nav-icon2" />
                            <span className="nav-label2">Profile</span>
                          </button>
                        </Link>
                      </nav>
                    </div>
  )
}

export default SalesOverview
