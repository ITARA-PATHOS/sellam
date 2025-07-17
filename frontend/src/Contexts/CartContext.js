import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAccessToken } from '../utils/token';

const CartContext = createContext();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from sessionStorage
  useEffect(() => {
    const storedCart = sessionStorage.getItem('cartData');
    if (storedCart) {
      setCartData(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cartData', JSON.stringify(cartData));
  }, [cartData]);

  const fetchCart = async () => {
    const token = await getAccessToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/v1/carts`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      console.log("📦 Cart fetch:", json);

      if (json.success && json.data) {
        const { items = [], total } = json.data;

        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            try {
              const res = await fetch(`${BASE_URL}/v1/products/${item.product_id}`);
              const productDetails = await res.json();
              const availableStock = productDetails?.data?.available_stock ?? null;

              return {
                ...item,
                product: {
                  ...item.product,
                  available_stock: availableStock,
                },
              };
            } catch (err) {
              console.warn(`⚠️ Stock fetch failed for ${item.product_id}:`, err);
              return item;
            }
          })
        );

        const updatedCart = {
          items: enrichedItems,
          total: parseFloat(total) || 0,
        };

        setCartData(updatedCart);
        sessionStorage.setItem('cartData', JSON.stringify(updatedCart));
      }
    } catch (err) {
      console.error('❌ Error fetching cart:', err);
    }
  };

  const fetchCartCount = async () => {
    const token = await getAccessToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/v1/carts/count`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (json.success && json.data !== undefined) {
        setCartCount(parseInt(json.data, 10));
      }
    } catch (err) {
      console.error('❌ Fetch cart count error:', err);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCart();
      await fetchCartCount();
      setLoading(false);
    })();
  }, []);

  const addToCart = async (product) => {
    const token = await getAccessToken();
    if (!token || !product.id) return;

    const existing = cartData.items.find(i => i.product.id === product.id);
    const quantity = existing ? existing.quantity + 1 : 1;

    try {
      const res = await fetch(`${BASE_URL}/v1/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });

      const json = await res.json();
      console.log('✅ Add to Cart:', json);

      if (json.success) {
        await fetchCart();
        await fetchCartCount();
      } else {
        console.warn('⚠️ Add failed:', json.message);
      }
    } catch (err) {
      console.error('❌ Error adding to cart:', err);
    }
  };

  const updateCartItemQuantity = async (cartItemId, quantity) => {
    const token = await getAccessToken();
    if (!token || !cartItemId || !quantity) return;

    try {
      const res = await fetch(`${BASE_URL}/v1/carts/items/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const json = await res.json();
      if (json.success) {
        await fetchCart();
        await fetchCartCount();
      }
    } catch (err) {
      console.error('❌ Quantity update error:', err);
    }
  };

  const deleteCartItem = async (cartItemId) => {
    const token = await getAccessToken();
    if (!token || !cartItemId) return;

    try {
      const res = await fetch(`${BASE_URL}/v1/carts/items/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (json.success) {
        await fetchCart();
        await fetchCartCount();
      }
    } catch (err) {
      console.error('❌ Delete item error:', err);
    }
  };

  const clearCart = async () => {
    const token = await getAccessToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/v1/carts`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (json.success) {
        setCartData({ items: [], total: 0 });
        sessionStorage.removeItem('cartData');
        await fetchCartCount();
      }
    } catch (err) {
      console.error('❌ Clear cart error:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartData,
        cartCount,
        loading,
        addToCart,
        updateCartItemQuantity,
        deleteCartItem,
        clearCart,
        setCartData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
