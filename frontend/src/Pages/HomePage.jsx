import React, { useState } from 'react'
import './CSS/HomePage.css'
import { FiSearch } from "react-icons/fi"; // Search icon
import { IoNotifications } from "react-icons/io5"; // Notification icon
import { Link } from 'react-router-dom';
import pp from '../Components/Assets/pp.jpg'
import { FaTag, FaHome, FaShoppingCart, FaClipboardList, FaCog, FaChevronDown } from 'react-icons/fa';
import product_1 from "../Components/Assets/product_1.png";
import product_6 from "../Components/Assets/product_6.png";
import product_7 from "../Components/Assets/product_7.png";
import product_8 from "../Components/Assets/product_8.png";
import product_9 from "../Components/Assets/product_9.png";
import product_10 from "../Components/Assets/product_10.png";
import product_11 from "../Components/Assets/product_11.png";
import product_12 from "../Components/Assets/product_12.png";
import product_13 from "../Components/Assets/product_13.png";
import product_14 from "../Components/Assets/product_14.png";
import product_15 from "../Components/Assets/product_15.png";
import product_34 from "../Components/Assets/product_34.png";
import empty_star from "../Components/Assets/empty_star.png";
import star from "../Components/Assets/star.jpg";





function HomePage() {
  const [currentLocation, setCurrentLocation] = useState("Ikorodu");
  const [showDropdown, setShowDropdown] = useState(false);

  const locations = ["Ikorodu", "Ajegunle", "Ajah", "Ikeja", "Victoria Island"];

  const categories = [
    { label: "Electronics", img: product_8 },
          { label: "Fashion", img: product_9 },
          { label: "Home Goods", img: product_10 },
          { label: "Sports", img: product_11 },
  ];

  const products = [
    { id: 1, image: product_1, name: "Vintage Lamp", price: "$50", location: "Lagos", popularity: "Trending" },
    { id: 2, image: product_8, name: "Gaming Chair", price: "$120", location: "Abuja", popularity: "50 Likes" },
    { id: 3, image: product_9, name: "Smart Watch", price: "$250", location: "Kano", popularity: "New Arrival" },
    { id: 4, image: product_10, name: "Bluetooth Speaker", price: "$75", location: "Kaduna", popularity: "30 Likes" },
    { id: 5, image: product_11, name: "Leather Sofa", price: "$450", location: "Enugu", popularity: "Trending" },
    { id: 6, image: product_12, name: "Bookshelf", price: "$120", location: "Jos", popularity: "20 Likes" },
    { id: 7, image: product_13, name: "Camera", price: "$500", location: "Ibadan", popularity: "100 Likes" },
    { id: 8, image: product_14, name: "Air Conditioner", price: "$300", location: "Port Harcourt", popularity: "60 Likes" },
    { id: 9, image: product_15, name: "Electric Fan", price: "$90", location: "Benin", popularity: "40 Likes" },
    { id: 10, image: product_34, name: "Dining Table", price: "$600", location: "Uyo", popularity: "Trending" },
  ];
  

  const featuredItems = [
    { image: product_6, name: "Black Collar Plain Oxford" },
    { image: product_7, name: "Casual White Sneakers" },
    { image: product_8, name: "Stylish Leather Wallet" },
    { image: product_9, name: "Classic Denim Jacket" },
    { image: product_10, name: "Elegant Wrist Watch" },
    { image: product_11, name: "Sports Running Shoes" },
    { image: product_12, name: "Formal Black Trousers" },
    { image: product_13, name: "Blue Striped T-Shirt" },
    { image: product_14, name: "Retro Sunglasses" },
    { image: product_15, name: "Minimalist Backpack" },
  ];

  const featuredOffers = [
    { image: product_6, name: "Black Collar Plain Oxford" },
    { image: product_7, name: "Casual White Sneakers" },
    { image: product_8, name: "Stylish Leather Wallet" },
    { image: product_9, name: "Classic Denim Jacket" },
    { image: product_10, name: "Elegant Wrist Watch" },
    { image: product_11, name: "Sports Running Shoes" },
    { image: product_12, name: "Formal Black Trousers" },
    { image: product_13, name: "Blue Striped T-Shirt" },
    { image: product_14, name: "Retro Sunglasses" },
    { image: product_15, name: "Minimalist Backpack" },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
        <Link to="/account_settings" style={{ textDecoration: "none" }}>
        <div className="profile-container">  
      <img src={pp} alt="" style={{ width: '60px', height: '60px' }} className="profile-pic" />
      <span className="status-indicator1"></span>
        </div></Link>
              <div className='navt'>
          <h3>Hello, Alex</h3>
          <p className="part">What would you like to do today? Click Explore Profile </p>
          </div>
          </div>
        <div className="header-right">
         {/* Search Icon */}
         <Link to="/search_views" style={{ textDecoration: "none" }}>
         <div className="icon-wrapper">
          <FiSearch className="icon" />
        </div> </Link>       
         {/* Notification Bell with Indicator */}
         <Link to="/notifications" style={{ textDecoration: "none" }}>
        <div className="icon-wrapper">
          <IoNotifications className="icon" />
          <span className="status-indicator"></span>
        </div></Link>

        </div>
      </header>
      
  
      {/* Dropdown Section */}
      <div
        className="location-dropdown"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <span>Currently shopping at {currentLocation}</span>
        <FaChevronDown className="dropdown-icon" />
      </div>

      {showDropdown && (
        <ul className="dropdown-options">
          {locations.map((location) => (
            <li
              key={location}
              className="dropdown-option"
              onClick={() => {
                setCurrentLocation(location);
                setShowDropdown(false); // Close dropdown after selection
              }}
            >
              {location}
            </li>
          ))}
        </ul>
      )}

      
      {/* Categories */}
      <section className="categories-section">
        <h2 className="categories-title">Categories</h2>
        <div className="categories">
          {categories.map((category) => (
            <div className="category" key={category.label}>
              <img src={category.img} alt={category.label} className="category-img" />
              <span className="category-label">{category.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section className="featured-items">
      <h2 className="featured-title">Featured Items</h2>
      <div className="slider">
        {featuredItems.map((item, index) => (
          <div className="slide" key={index}>
            <img src={item.image} alt={item.name} className="featured-image" />
            <div className="overlay">
              <div className="left-section">
                <p className="item-name">{item.name}</p>
                <div className="offer-section">
                  <FaTag className="offer-icon" />
                  <p className="offer-text">Enjoy 20% Offers</p>
                </div>
              </div>
              <p className="orders-text">13 Orders Placed</p>
            </div>
          </div>
        ))}
      </div>
    </section>
      {/* Featured Offers */}
      <section className="featured-offers">
      <h2 className="offers-title">Featured Offers</h2>
      <div className="slider2">
        {featuredOffers.map((offer, index) => (
          <div className="offer-container" key={index}>
            <div className="image-wrapper">
              <img src={offer.image} alt={offer.name} className="offer-image" />
            </div>
            <div className="button-area">
              <div className="left-buttons">
                <p className="offer-name">{offer.name}</p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
              <Link style={{ width:'100%' }} to='/product_details'><button type="submit" className="view-details">View Details</button></Link>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/*Recently viewed */}
    <div className="recently-viewed">
      <div className="header1">
        <h3>Recently Viewed</h3>
        <a href="#see-all" className="see-all">
          See All
        </a>
      </div>
      <div className="card7">
        <div className="image-container7">
          <img
            src={product_34}
            alt="Electric Stand Mixer"
            className="product-image"
          />
        </div>
        <div className="content">
          <div className="discount-tag">
            <FaTag className="tag-icon" />
          </div>
          <h4>Electric Stand Mixer</h4>
          <div className="stars">
          <img src={star} className="star_full" alt=''/>
           <img src={star} className="star_full" alt=''/>
           <img src={star} className="star_full" alt=''/>
           <img src={star} className="star_full" alt=''/>
           
           <img src={empty_star} className="star_empty" alt=''/>
          </div>
          <div className="price1">
            <span className="discount1">20% Off</span> | <span>$12.99</span>
          </div>
          <Link style={{ width:'100%' }} to='/product_details'><button type="submit" className="view-details1">View Details</button></Link>
        </div>
      </div>
    </div>

    {/*Popular */}
    <div className="product-list-container">
      <h2 className='head2'>Popular Near You</h2>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="image-container">
              <img src={product.image} alt={product.name} className="product-image" />
            </div>
            <div className='poptext'>
            <h3>{product.name}</h3>
            <p className='ppr'>{product.price}</p>
            <p className='ppr1'>Location: {product.location}</p>
            <p className='ppr2'>Popularity: {product.popularity}</p>
            </div>
            <button className='cartadd'>Add to cart</button>
          </div>
        ))}
      </div>
    </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
       <Link to="/home" style={{ textDecoration: "none" }}>
      <button className="nav-button">
      <FaHome className="nav-icon" />
      <span className="nav-label">Home</span>
            </button></Link>
            <Link to="/cart_items" style={{ textDecoration: "none" }}>
      <button className="nav-button">
      <FaShoppingCart className="nav-icon" />
      <span className="nav-label">Cart</span>
            </button></Link>
      <Link to="/orders_product" style={{ textDecoration: "none" }}>
      <button className="nav-button">
      <FaClipboardList className="nav-icon" />
      <span className="nav-label">Orders</span>
      </button></Link>
    <Link to="/settings" style={{ textDecoration: "none" }}>
      <button className="nav-button">
      <FaCog className="nav-icon" />
      <span className="nav-label">Settings</span>
      </button></Link>
    </nav>
    </div>
  );
};

export default HomePage;
