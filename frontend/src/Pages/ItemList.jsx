import React, { useState, useContext } from 'react';
import './CSS/ItemList.css';
import { FiFilter, FiPlus } from 'react-icons/fi'; // FaTrash for delete icon
import { FaClipboardList, FaHome, FaArrowLeft, FaComment, FaTrash, FaBoxOpen} from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import step from '../Components/Assets/step.PNG';
import { Link, useNavigate } from 'react-router-dom';
import { ProductContext } from '../Contexts/ListingContext';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ItemList = () => {
  const navigate = useNavigate();
  const { myProducts, markAsSold, deleteProduct } = useContext(ProductContext);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const handleEditProduct = (product) => {
    navigate(`/edit_item/${product.id}`, { state: { product } });
  };

  const handleToggleStatus = (product) => {
    if (product.status !== 'sold') {
      if (window.confirm('Mark this item as sold?')) {
        markAsSold(product.id);
      }
    }
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const getProductImage = (product) => {
    if (product.thumbnail?.startsWith('http')) return product.thumbnail;
    if (product.thumbnail) return `${BASE_URL}${product.thumbnail}`;
    if (Array.isArray(product.images) && product.images.length) {
      const img = product.images[0];
      return img.startsWith('http') ? img : `${BASE_URL}${img}`;
    }
    return '/default-placeholder.jpg';
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header2">
        <Link to="/seller_dashboard"><FaArrowLeft className="back-icon2" /></Link>
        <h2 className="header-title2">Listings</h2>
        <div className="header-icons5">
          <FiFilter onClick={() => setShowFilter(true)} className="header-icon5" />
          <img src={step} onClick={() => setShowSort(true)} style={{ cursor: 'pointer' }} alt="sort" />
        </div>
      </div>

      {/* Popups */}
      {showFilter && (
        <div className="popup-overlay1" onClick={() => setShowFilter(false)}>
          <div className="popup-box1" onClick={e => e.stopPropagation()}>
            <h3 className="popup-title1">Filter</h3>
            <p className="popup-message1">Active</p>
            <p className="popup-message1">Sold</p>
            <p className="popup-message1">Date Listed</p>
            <p className="popup-message1">Price Range</p>
          </div>
        </div>
      )}
      {showSort && (
        <div className="popup-overlay1" onClick={() => setShowSort(false)}>
          <div className="popup-box1" onClick={e => e.stopPropagation()}>
            <h3 className="popup-title1">Sort</h3>
            <p className="popup-message1">Newest</p>
            <p className="popup-message1">Oldest</p>
            <p className="popup-message1">Higher Price</p>
            <p className="popup-message1">Lowest Price</p>
          </div>
        </div>
      )}

      {/* Product Cards */}
      <div className="item-cards">
        {myProducts.map(item => (
          <div className="item-card" key={item.id}>
            <img src={getProductImage(item)} alt={item.title} className="item-image" />
            <div className="item-info">
              <span
                className={`status ${item.status?.toLowerCase() || 'active'}`}
                onClick={() => handleToggleStatus(item)}
                style={{ cursor: item.status === 'sold' ? 'default' : 'pointer' }}
              >
                {item.status === 'sold' ? 'Sold' : 'Active'}
              </span>
              <span
                className="more-options"
                onClick={() => handleEditProduct(item)}
                title="Edit product"
                style={{ cursor: 'pointer' }}
              >
                •••
              </span>
              {/* Delete Icon */}
              <FaTrash
                onClick={() => handleDelete(item.id)}
                title="Delete product"
                style={{ cursor: 'pointer', color: 'red', marginLeft: 10 }}
              />
            </div>
            <p>{item.title}</p>
            <p>${item.price}</p>
          </div>
        ))}
      </div>

      {/* Add button */}
      <Link to="/add_items">
        <div className="plus-icon-wrapper">
          <FiPlus className="plus-icon" />
          <div className="horizontal-lines"></div>
        </div>
      </Link>

      {/* Bottom nav */}
      <nav className="bottom-nav2">
        <Link to="/seller_dashboard"><button className="nav-button2"><FaHome className="nav-icon2" /><span>Home</span></button></Link>
        <Link to="/items_list"><button className="nav-button2"><FaClipboardList className="nav-icon2" /><span>Listings</span></button></Link>
        <Link to="/buyers_chat"><button className="nav-button2"><FaComment className="nav-icon2" /><span>Messages</span></button></Link>
         <Link to="/seller_orders">
                <button className="nav-button">
                <FaBoxOpen  className="nav-icon" />
                <span className="nav-label">Buyer Orders</span>
                </button></Link>
        <Link to="/seller_profile_settings"><button className="nav-button2"><AiOutlineUser className="nav-icon2" /><span>Profile</span></button></Link>
      </nav>
    </div>
  );
};

export default ItemList;
