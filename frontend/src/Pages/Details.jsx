import React, { useEffect, useState, useRef } from 'react';
import './CSS/Details.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from '../Contexts/CartContext';
import { getAccessToken } from '../utils/token';


const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Details = () => {
const sellerSliderRef = useRef();

const scrollSellerSlider = (direction) => {
  if (sellerSliderRef.current) {
    const scrollAmount = 300;
    sellerSliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }
};

  const { addToCart, cartCount } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [errorRelated, setErrorRelated] = useState(null);

  const [sellerProducts, setSellerProducts] = useState([]);
  const [loadingSellerProducts, setLoadingSellerProducts] = useState(false);
  const [errorSellerProducts, setErrorSellerProducts] = useState(null);



const handleChatWithSeller = async () => {
  const token = await getAccessToken();
  const buyer = JSON.parse(sessionStorage.getItem('user'));
  const sellerId = product?.seller?.id || product?.user_id;

  if (!token || !buyer || !sellerId) {
    alert("Missing token, user, or seller information");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        recipient_id: sellerId,
        message: "Hi, I am interested in this product."
      })
    });

    const data = await res.json();

    if (data.success && data.data) {
      const conversationId = data.data.id;

      // Optional: Save for use later (still helpful)
      sessionStorage.setItem('conversationId', conversationId);
      sessionStorage.setItem('chatParticipant', JSON.stringify(product.seller));

      // ✅ Navigate using param
      navigate(`/chat_seller/${conversationId}`);
    } else {
      console.error('❌ Conversation failed:', data);
      alert(data.message || "Failed to start conversation.");
    }

  } catch (error) {
    console.error("❌ Network error:", error);
    alert("An error occurred. Please try again.");
  }
};



  // Fetch product details by ID on mount or id change
  useEffect(() => {
    if (!id) return;

    console.log(`Fetching product by ID: ${id}`);

    fetch(`${BASE_URL}/v1/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProduct(data.data);
          console.log("Product fetched:", data.data);
        } else {
          setProduct(null);
          console.warn("Product not found or invalid response");
        }
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setProduct(null);
      });
  }, [id]);

  // Save current ID in sessionStorage
  useEffect(() => {
    if (id) {
      sessionStorage.setItem('lastProductId', id);
    }
  }, [id]);

  // Fetch product details
  useEffect(() => {
    const fullId = id || sessionStorage.getItem('lastProductId');
    if (!fullId) {
      console.warn("No product ID in URL or sessionStorage.");
      return;
    }

    const fullURL = `${BASE_URL}/v1/products/${fullId}`;
    console.log("📦 Fetching product:", fullId);

    fetch(fullURL)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          setProduct(null);
        }
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setProduct(null);
      });
  }, [id]);
  // Fetch seller's other products
useEffect(() => {
  if (!product) return;

  const fetchSellerProducts = async () => {
    setLoadingSellerProducts(true);
    setErrorSellerProducts(null);

    const userId = product.user_id || product.seller?.id;
    console.log("Fetching seller products for user ID:", userId);

    if (!userId) {
      setErrorSellerProducts("Seller info not available");
      setLoadingSellerProducts(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/v1/products/user/${userId}?page=1&per_page=10`);
      const data = await res.json();

      if (data.success) {
        const filtered = data.data.filter(p => p.id !== product.id);
        setSellerProducts(filtered);
        console.log("Seller's other products:", filtered);
      } else {
        setErrorSellerProducts(data.message || "Failed to load seller's products");
      }
    } catch (err) {
      setErrorSellerProducts(err.message || "Error fetching seller's products");
    } finally {
      setLoadingSellerProducts(false);
    }
  };

  fetchSellerProducts();
}, [product]);

// Fetch related products by product ID (not slug)
useEffect(() => {
  if (!product?.id) return;

  setLoadingRelated(true);
  setErrorRelated(null);

  fetch(`${BASE_URL}/v1/products/related/${product.id}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (data.success && Array.isArray(data.data)) {
        const filtered = data.data.filter(p => p.id !== product.id);
        setRelatedProducts(filtered);
        if(filtered.length === 0) console.warn("No related products found.");
      } else {
        setErrorRelated("No related products found.");
        setRelatedProducts([]);
      }
    })
    .catch(err => {
      setErrorRelated("Failed to fetch related products.");
      setRelatedProducts([]);
      console.error("Error fetching related products:", err);
    })
    .finally(() => setLoadingRelated(false));
}, [product]);


  const handleViewDetails = (prod) => {
    navigate(`/product_details/${prod.id}`);
  };

  if (!product) {
    return (
      <div className="product-container">
        <p>Product not found. Please go back.</p>
        <Link to="/home">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="product-container">
      <div className="header1">
        <Link to="/home"><FaArrowLeft className="back-icon1" /></Link>
        <Link to="/cart_items">
          <div className="cart-icon-container">
            <AiOutlineShoppingCart className="cart-icon" />
            <span className="cart-count">{cartCount}</span>
          </div>
        </Link>
      </div>

      <div className="content-wrapper">
        <div className="image-section">
          <img
            src={product.thumbnail || product.image || '/default-product.png'}
            alt={product.title || product.name}
            className="product-image"
          />
        </div>
        <div className="details-section">
          <h2 className="product-title">{product.title || product.name || "N/A"}</h2>
          <p className="product-price">${product.price || "N/A"}</p>
          <p className="product-condition"><strong>Condition:</strong> {product.condition || "N/A"}</p>
          <p className="product-location"><strong>Location:</strong> {product.location?.name || "N/A"}</p>
          <button className="add-to-cart1" onClick={() => addToCart(product)}>Add to Cart</button>
<button className="chat-seller" onClick={handleChatWithSeller}>
  Chat with Seller
</button>
        </div>
      </div>

      {/* More from this Seller Section */}
      <section className="seller-products-slider">
  <div className="header1">
    <h3>More from this Seller</h3>
  </div>

  {/* Left Arrow */}
  <button
    className="slide-arrow left"
    onClick={() => scrollSellerSlider('left')}
    aria-label="Scroll left"
  >
    &lt;
  </button>

  {/* Scrollable Container */}
  <div
    className="seller-products-list"
    ref={sellerSliderRef}
  >
    {loadingSellerProducts && <p>Loading seller's products...</p>}
    {errorSellerProducts && <p className="error-text">{errorSellerProducts}</p>}
    {!loadingSellerProducts && !errorSellerProducts && sellerProducts.length === 0 && (
      <p>No other products from this seller.</p>
    )}

    {sellerProducts.map(p => (
      <div
        key={p.id}
        className="seller-product-card"
        onClick={() => handleViewDetails(p)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') handleViewDetails(p); }}
      >
        <div className="image-box">
          <img
            src={p.thumbnail || p.image || 'https://via.placeholder.com/150'}
            alt={p.title}
            className="seller-product-image"
          />
        </div>
        <div className="seller-product-info">
          <p className="seller-product-name">{p.title}</p>
          <p className="seller-product-price">${p.price}</p>
        </div>
      </div>
    ))}
  </div>

  {/* Right Arrow */}
  <button
    className="slide-arrow right"
    onClick={() => scrollSellerSlider('right')}
    aria-label="Scroll right"
  >
    &gt;
  </button>
</section>


      {/* Related Products Section */}
      <section className="related-products-section">
        <h3>Related Products</h3>
        {loadingRelated && <p>Loading related products...</p>}
        {errorRelated && <p className="error-text">{errorRelated}</p>}

        <div className="slider2">
          {relatedProducts.length === 0 && !loadingRelated && !errorRelated && (
            <p>No related products available.</p>
          )}
          {relatedProducts.map((rp, i) => (
            <div
              key={i}
              className="offer-container"
              onClick={() => handleViewDetails(rp)}
              style={{ cursor: 'pointer' }}
            >
              <div className="image-wrapper">
                <img
                  src={rp.thumbnail || rp.image || '/default-product.png'}
                  alt={rp.title || rp.name}
                  className="offer-image"
                />
              </div>
              <div className="button-area">
                <div className="left-buttons">
                  <div className="ppr4">
                    Seller: {rp.seller?.full_name || rp.seller?.username || 'Unknown'}
                  </div>
                  <p className="offer-name">{rp.title || rp.name || "N/A"}</p>
                  <p className="product-price">${rp.price || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Details;
