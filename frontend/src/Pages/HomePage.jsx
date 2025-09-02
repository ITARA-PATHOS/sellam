import React, { useState, useEffect } from 'react'
import './CSS/HomePage.css'
import { FiSearch } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import { Link, useNavigate  } from 'react-router-dom';
import pp from '../Components/Assets/pp.jpg'
import { FaTag, FaHome, FaShoppingCart, FaClipboardList, FaCog, FaChevronDown } from 'react-icons/fa';
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
import { useCart } from '../Contexts/CartContext';
import { getAccessToken } from '../utils/token';
import { getFcmToken } from '../utils/fcm';



const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function HomePage() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
// Location Dropdown UI states
const [locations, setLocations] = useState([]);
const [currentLocation, setCurrentLocation] = useState('Select location');

// Selected location logic
const [selectedLocationId, setSelectedLocationId] = useState(null);
const [selectedLocation, setSelectedLocation] = useState(null);
const [locationChildren, setLocationChildren] = useState([]);
const [locationBreadcrumbs, setLocationBreadcrumbs] = useState([]);
const [locationDetails, setLocationDetails] = useState(null); // ✅ you can set this from fetched location if needed

void selectedLocationId
void selectedLocation
void locationDetails

const [showDropdown, setShowDropdown] = useState(false);

  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [popularPage, setPopularPage] = useState(1);
  const [popularHasMore, setPopularHasMore] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);  
  const [categoryInfo, setCategoryInfo] = useState(null); 


  const [trendingProducts, setTrendingProducts] = useState([]);
  const [trendingPage, setTrendingPage] = useState(1);
  const [trendingHasMore, setTrendingHasMore] = useState(true);

  const ITEMS_LIMIT_COLLAPSED = 3;

const [recentlyViewed, setRecentlyViewed] = React.useState([]);
const [recentlyViewedAll, setRecentlyViewedAll] = React.useState(false);
const [loadingRecentlyViewed, setLoadingRecentlyViewed] = React.useState(false);
const [recentlyViewedHasMore, setRecentlyViewedHasMore] = React.useState(false);

void loadingRecentlyViewed
void recentlyViewedHasMore

const sliderRef = React.useRef(null);

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

const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
const [HasUnread, setHasUnread] = useState(0);

void notifications
void HasUnread

useEffect(() => {
  const fetchNotifications = async () => {
    const token = await getAccessToken();
    try {
      const res = await fetch(`${BASE_URL}/v1/notifications`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setNotifications(json.data);
        const unreadExists = json.data.some(n => !n.is_read);
        setHasUnread(unreadExists);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  fetchNotifications();
}, []);

useEffect(() => {
  const fetchUnreadCount = async () => {
    const token = await getAccessToken();
    try {
      const res = await fetch(`${BASE_URL}/v1/notifications/unread`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setUnreadCount(json.data.length);
      }
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  };

  fetchUnreadCount();
}, []);



useEffect(() => {
  const fetchData = async () => {
    const token = await getAccessToken();

    // 1. Fetch user profile
    if (token) {
      try {
        const profileRes = await fetch(`${BASE_URL}/v1/auth/profile`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        });
        const profileJson = await profileRes.json();
        if (profileJson.success) {
          let img =
            sessionStorage.getItem(`profile_image_url_${profileJson.data.username}`) ||
            profileJson.data.image;
          if (img && !img.startsWith('http')) {
            img = `https://demo.jadesdev.com.ng${img.replace('/upload/', '/public/upload/')}`;
          }
          setUserProfile({ ...profileJson.data, image: img });
        }
        
        
      } catch (e) {
        console.error('Failed to fetch profile:', e);
      }
    }

    // 2. Fetch categories
    try {
      const catRes = await fetch(`${BASE_URL}/v1/categories`);
      const catJson = await catRes.json();
      if (catJson.success) setCategories(catJson.data);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }

    // 3. Fetch products (all or by selectedCategoryId)
    try {
      const url = selectedCategoryId
        ? `${BASE_URL}/v1/categories/${selectedCategoryId}/products`
        : `${BASE_URL}/v1/products`;

      const productRes = await fetch(url);
      const productJson = await productRes.json();
      if (productJson.success) setProducts(productJson.data);
    } catch (e) {
      console.error('Failed to fetch products:', e);
    }

    // 4. Fetch specific category info (by ID)
    if (selectedCategoryId) {
      try {
        const infoRes = await fetch(`${BASE_URL}/v1/categories/${selectedCategoryId}`);
        const infoJson = await infoRes.json();
        if (infoJson.success) setCategoryInfo(infoJson.data);
      } catch (e) {
        console.error('Failed to fetch category info:', e);
      }
    } else {
      setCategoryInfo(null);
    }

    // 5. Load popular, trending, and recently viewed
    try {
      await loadPopular(1);
      await loadTrending(1);
      await fetchRecentlyViewed();
    } catch (e) {
      console.error('Failed loading popular/trending/recent:', e);
    }

    // 6. Fetch locations list
    try {
      const locRes = await fetch(`${BASE_URL}/v1/locations`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
      });
      const locJson = await locRes.json();
      if (locJson.success) setLocations(locJson.data);
    } catch (e) {
      console.error('Failed to fetch locations:', e);
    }

    // 7. Fetch selected location's details if set (by ID)
    if (currentLocation?.id) {
      try {
        const res = await fetch(`${BASE_URL}/v1/locations/${currentLocation.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
        });
        const detailJson = await res.json();
        if (detailJson.success) {
          setLocationDetails(detailJson.data); // { location, children, breadcrumbs }
        }
      } catch (e) {
        console.error('Failed to fetch location details:', e);
      }
    }
    await getFcmToken();
  };

  fetchData();
}, [selectedCategoryId, currentLocation]);

const handleCategoryClick = (category) => {
  if (category.slug === selectedCategorySlug) {
    // Deselect category
    setSelectedCategorySlug(null);
    setSelectedCategoryId(null);
    setCategoryInfo(null);
    setProducts([]);
  } else {
    setSelectedCategorySlug(category.slug); // for UI display
    setSelectedCategoryId(category.id);     // for API calls
    setCategoryInfo(null);
    setProducts([]);
  }
};

const handleLocationSelect = async (locationObj) => {
  setSelectedLocationId(locationObj.id);             // for filtering logic
  setCurrentLocation(locationObj);                   // now setting full object
  setShowDropdown(false);

  try {
    const res = await fetch(`${BASE_URL}/v1/locations/${locationObj.id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });
    const data = await res.json();

    if (data.success) {
      const loc = data.data.location;

      setSelectedLocation(loc);                      // selected raw location info
      setLocationDetails(loc);                       // optional fallback for general use
      setLocationChildren(data.data.children || []);
      setLocationBreadcrumbs(data.data.breadcrumbs || []);
    }
  } catch (err) {
    console.error('Error fetching location details:', err);
  }
};


  // Pagination functions
  const loadPopular = async (page) => {
    const res = await fetch(`${BASE_URL}/v1/products/popular?page=${page}&per_page=5`);
    const json = await res.json();
    if (json.success) {
      setPopularProducts(prev => [...prev, ...json.data.map(p => ({
        id: p.id,
        name: p.title,
image: p.thumbnail 
          ? (p.thumbnail.startsWith('http') 
              ? p.thumbnail 
              : `https://demo.jadesdev.com.ng${p.thumbnail}`) 
          : product_6, // fallback image
        sellerName: p.seller?.full_name || p.seller?.username || 'Unknown Seller',
sellerImage: p.seller?.image 
          ? (p.seller.image.startsWith('http') 
              ? p.seller.image 
              : `https://demo.jadesdev.com.ng${p.seller.image}`) 
          : pp, // fallback profile pic
      }))]);
      if (!json.pagination.next_page) setPopularHasMore(false);
      else setPopularPage(json.pagination.current_page);
    }
  };
  const handleViewDetails = (product) => {
    navigate(`/product_details/${product.id}`);
  };
  const loadTrending = async (page) => {
    const res = await fetch(`${BASE_URL}/v1/products/trending?page=${page}&per_page=5`);
    const json = await res.json();
    if (json.success) {
      setTrendingProducts(prev => [...prev, ...json.data.map(p => ({
        id: p.id,
        name: p.title,
        image: p.thumbnail.startsWith('http') ? p.thumbnail : `https://demo.jadesdev.com.ng${p.thumbnail}`,
        sellerName: p.seller?.full_name || p.seller?.username || 'Unknown Seller',
        sellerImage: p.seller?.image && (p.seller.image.startsWith('http') ? p.seller.image : `https://demo.jadesdev.com.ng${p.seller.image}`)
      }))]);
      if (!json.pagination.next_page) setTrendingHasMore(false);
      else setTrendingPage(json.pagination.current_page);
    }
  };

   const fetchRecentlyViewed = async () => {
  setLoadingRecentlyViewed(true);
  try {
    const token = await getAccessToken();

    const res = await fetch(`${BASE_URL}/v1/products/recently-viewed`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    console.log('API response:', json);  // << Log entire API response for debugging

    if (json.success && Array.isArray(json.data)) {
      if (json.data.length === 0) {
        console.log('No recently viewed products found.');
        setRecentlyViewed([]);
        setRecentlyViewedHasMore(false);
        return;
      }

      // Map API data to your component format
      const mappedProducts = json.data.map((p) => ({
        id: p.id,
        name: p.title,
        image:
          p.thumbnail && p.thumbnail.startsWith('http')
            ? p.thumbnail
            : p.thumbnail
            ? `https://demo.jadesdev.com.ng${p.thumbnail}`
            : '', // fallback empty string if no thumbnail
        sellerName: p.seller?.full_name || p.seller?.username || 'Unknown Seller',
        sellerImage:
          p.seller?.image && (p.seller.image.startsWith('http')
            ? p.seller.image
            : `https://demo.jadesdev.com.ng${p.seller.image}`),
        createdAt: p.created_at,
        viewStats: p.view_stats,
        price: p.price || 'N/A',
        location: p.location?.name || 'Unknown',
      }));

      console.log('Mapped recently viewed:', mappedProducts);

      setRecentlyViewed(mappedProducts);
      setRecentlyViewedHasMore(false); // your API has no pagination so false
    } else {
      console.error('API call not successful or no data array');
      setRecentlyViewed([]);
      setRecentlyViewedHasMore(false);
    }
  } catch (err) {
    console.error('Fetch recently viewed failed:', err);
    setRecentlyViewed([]);
    setLoadingRecentlyViewed(false);
  }
  setLoadingRecentlyViewed(false);
};
const toggleRecentlyViewed = () => {
    setRecentlyViewedAll((prev) => !prev);
  };
  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
};  
// Helper to render seller info with image and name side by side
  const SellerInfo = ({ sellerName, sellerImage }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span>{sellerName}</span>
      {sellerImage && <img src={sellerImage} alt={sellerName} style={{ width: 25, height: 25, borderRadius: '50%', objectFit: 'cover' }} />}
    </div>
  );

          console.log("recentlyViewed:", recentlyViewed);


  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <Link to="/account_settings">
            <div className="profile-container">
              <img src={userProfile?.image || pp} className="profile-pic" alt="profile" />
              <span className="status-indicator1"></span>
            </div>
          </Link>
          <div className="navt">
            <h3>Hello, {userProfile?.username || 'Guest'}</h3>
            <p className="part">What would you like to do today? Click Explore Profile</p>
          </div>
        </div>
        <div className="header-right">
          <Link to="/search_views" className="icon-wrapper"><FiSearch className="icon" /></Link>
         <Link to="/notifications" className="icon-wrapper">
  <IoNotifications className="icon" />
  <span
    className="status-indicator"
    style={{
      backgroundColor: unreadCount > 0 ? 'red' : 'green',
    }}
  >
    {unreadCount > 0 ? unreadCount : ''}
  </span>
</Link>


        </div>
      </header>

      {/* Location Dropdown */}
    {/* LOCATION SELECTOR */}
<div className="location-dropdown" onClick={() => setShowDropdown((prev) => !prev)}>
  <span>Currently shopping at: {currentLocation?.name || 'Select location'}</span>
  <FaChevronDown className="dropdown-icon" />
</div>

{showDropdown && (
  <ul className="dropdown-options">
    {locations.map((loc) => (
      <li
        key={loc.id}
        onClick={() => handleLocationSelect(loc)} // ✅ Calls full handler
      >
        {loc.name}
      </li>
    ))}
  </ul>
)}

{/* LOCATION BREADCRUMBS */}
{locationBreadcrumbs.length > 0 && (
  <div className="breadcrumbs">
    <strong>Location Path:</strong>{' '}
    {locationBreadcrumbs.map((b, index) => (
      <span key={b.id}>
        {b.name}
        {index < locationBreadcrumbs.length - 1 && ' > '}
      </span>
    ))}
  </div>
)}

{/* CHILD LOCATIONS */}
{locationChildren.length > 0 && (
  <div className="child-locations">
    <strong>Sub-locations:</strong>{' '}
    {locationChildren.map((child) => (
      <span
        key={child.id}
        onClick={() => handleLocationSelect(child)} // ✅ Clicking children triggers it again
        className="child-location"
        style={{ cursor: 'pointer', marginRight: 10 }}
      >
        {child.name}
      </span>
    ))}
  </div>
)}


     {/* Categories */}
<section className="categories-section">
  <h2 className="categories-title">Categories</h2>
  <div className="categories categories-api">
 {categories.map((cat) => (
  <div
    key={cat.id}
    className="category"
    onClick={() => handleCategoryClick(cat)} // Pass full object, not just slug
  >
    <img src={cat.image} alt={cat.name} className="category-img" />
    <span className="category-label">{cat.name}</span>
  </div>
))}

  </div>
</section>




      {/* All Products */}
     <div className="product-list-container">
  <h2 className="head2">
    {selectedCategorySlug && categoryInfo?.name
      ? `Products under "${categoryInfo.name}"`
      : 'All our available Products'}
  </h2>

  <div className="product-list">
    {products.length === 0 ? (
      <p>No products available for this category.</p>
    ) : (
      products.map((p) => (
        <div key={p.id} className="product-card">
          <div className="image-container">
            <img
              src={
                p.thumbnail?.startsWith('http')
                  ? p.thumbnail
                  : `https://demo.jadesdev.com.ng${p.thumbnail}`
              }
              alt={p.title}
              className="product-image"
            />
          </div>

          <div className="poptext">
            <h3>{p.title}</h3>
            <div className="ppr3">
              Seller: {p.seller?.full_name || p.seller?.username || 'Unknown'}
            </div>

            {p.seller?.image && (
              <div className="seller-image-wrapper">
                <img
                  src={
                    p.seller.image.startsWith('http')
                      ? p.seller.image
                      : `https://demo.jadesdev.com.ng${p.seller.image}`
                  }
                  alt="Seller"
                  className="profile-pic"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', marginTop: '8px' }}
                />
              </div>
            )}

            <p className="ppr">${p.price}</p>
            <p className="ppr1">Location: {p.location?.name || 'Unknown'}</p>
          </div>

          <button className="cartadd" onClick={() => addToCart(p)}>
            Add to cart
          </button>
        </div>
      ))
    )}
  </div>
</div>



      {/* Featured Items */}
      <section className="featured-items">
        <h2 className="featured-title">Featured Items</h2>
        <div className="slider">
          {featuredItems.map((item, i) => (
            <div key={i} className="slide">
              <img src={item.image} alt={item.name} className="featured-image" />
              <div className="overlay">
                <div className="left-section">
                  <p className="item-name">{item.name}</p>
                  <div className="offer-section"><FaTag className="offer-icon" /><p className="offer-text">Enjoy 20% Offers</p></div>
                </div>
                <p className="orders-text">13 Orders Placed</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="featured-offers">
        <h2 className="offers-title">Popular Products</h2>
        <div className="slider2">
          {popularProducts.map((o, i) => (
            <div key={i} className="offer-container">
              <div className="image-wrapper"><img src={o.image} alt={o.name} className="offer-image" /></div>
              <div className="button-area">
                <div className="left-buttons">
                  <div className="ppr4">
                    Seller: <SellerInfo sellerName={o.sellerName} sellerImage={o.sellerImage} />
                  </div>
                  <p className="offer-name">{o.name}</p>
                  <button className="add-to-cart" onClick={() => addToCart(o)}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
          {popularHasMore && (
            <button className="load-more-btn" onClick={() => loadPopular(popularPage + 1)}>Load More</button>
          )}
        </div>
      </section>

      {/* Trending Products */}
     <section className="featured-offers">
  <h2 className="offers-title">Trending Products</h2>
  <div className="slider2">
    {trendingProducts.map((o, i) => (
      <div key={i} className="offer-container">
        <div className="image-wrapper">
          <img src={o.image} alt={o.name} className="offer-image" />
        </div>
        <div className="button-area">
          <div className="left-buttons">
            <div className="ppr4">
              Seller: <SellerInfo sellerName={o.sellerName} sellerImage={o.sellerImage} />
            </div>
            <p className="offer-name">{o.name}</p>
            <button className="add-to-cart" onClick={() => addToCart(o)}>Add to Cart</button>
          </div>
          <div className="right-button">
            <button className="view-details" onClick={() => handleViewDetails(o)}>View Details</button>
          </div>
        </div>
      </div>
    ))}
    {trendingHasMore && (
      <button className="load-more-btn" onClick={() => loadTrending(trendingPage + 1)}>Load More</button>
    )}
  </div>
</section>

      {/* Recently Viewed */}
      <section className="recently-viewed">
        <div className="header1">
          <h3>Recently Viewed</h3>
          <button className="see-all" onClick={toggleRecentlyViewed}>
            {recentlyViewedAll ? 'Collapse' : 'See All'}
          </button>
        </div>

        {/* Scroll Arrows */}
        <button
          className="slide-arrow left"
          onClick={() => scrollSlider('left')}
          aria-label="Scroll left"
        >
          &lt;
        </button>

        <div
          className="recently-viewed-list"
          ref={sliderRef}
          style={{ overflowX: 'auto', display: 'flex', gap: '1rem', paddingBottom: '1rem' }}
        >

          {(recentlyViewedAll ? recentlyViewed : recentlyViewed.slice(0, ITEMS_LIMIT_COLLAPSED)).map((item) => (
            <div key={item.id} className="product-card" style={{ minWidth: 250, flexShrink: 0 }}>
              <div className="image-container">
                <img src={item.image} alt={item.name} className="product-image" />
              </div>
              <div className="poptext">
                <h3>{item.name}</h3>
                <div className="ppr3">
                  Seller: <SellerInfo sellerName={item.sellerName} sellerImage={item.sellerImage} />
                </div>
                <p>Price: {item.price || 'N/A'}</p>
                <p>Location: {item.location}</p>
                <p>Viewed on: {new Date(item.createdAt).toLocaleDateString()}</p>
                <p>
                  Views: Total {item.viewStats?.total || 0} | Daily Unique {item.viewStats?.daily_unique || 0}
                </p>
              </div>
              <button className="cartadd" onClick={() => addToCart(item)}>
                Add to cart
              </button>
            </div>
          ))}
        </div>

        <button
          className="slide-arrow right"
          onClick={() => scrollSlider('right')}
          aria-label="Scroll right"
        >
          &gt;
        </button>
      </section>

      <nav className="bottom-nav">
        <Link to="/home"><button className="nav-button"><FaHome className="nav-icon" /><span className="nav-label">Home</span></button></Link>
        <Link to="/cart_items"><button className="nav-button"><FaShoppingCart className="nav-icon" /><span className="nav-label">Cart</span></button></Link>
        <Link to="/orders_product"><button className="nav-button"><FaClipboardList className="nav-icon" /><span className="nav-label">Orders</span></button></Link>
        <Link to="/settings"><button className="nav-button"><FaCog className="nav-icon" /><span className="nav-label">Settings</span></button></Link>
      </nav>
    </div>
  );
}

export default HomePage;
