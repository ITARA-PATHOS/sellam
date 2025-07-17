import React, { createContext, useEffect, useState } from 'react';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const ProductContext = createContext();

const normalizeImageUrl = (img) => {
  // img can be a string (url) or object like { url: '...' }
  if (typeof img === 'string') {
    if (img.startsWith('http')) return img;
    return `https://demo.jadesdev.com.ng${img}`;
  }
  if (typeof img === 'object' && img !== null) {
    if (img.url) {
      if (img.url.startsWith('http')) return img.url;
      return `https://demo.jadesdev.com.ng${img.url}`;
    }
    // fallback
    return '';
  }
  return '';
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);

  // Inside your ProductProvider in ListingContext.js

const deleteProduct = async (productId) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE_URL}/v1/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    const json = await res.json();

    if (json.success) {
      // Remove from both products lists
      setProducts(prev => prev.filter(p => p.id !== productId));
      setMyProducts(prev => prev.filter(p => p.id !== productId));
      alert('Product deleted successfully.');
    } else {
      alert('Failed to delete product: ' + (json.message || 'Unknown error'));
    }
  } catch (error) {
    alert('Network error while deleting product: ' + error.message);
  }
};


  const markAsSold = async (productId) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE_URL}/v1/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'sold' }),
    });
    const json = await res.json();

    if (json.success && json.data) {
      updateProduct(json.data);
    } else {
      alert('Failed to mark as sold: ' + (json.message || 'Unknown error'));
    }
  } catch (error) {
    alert('Network error: ' + error.message);
  }
};


  // Fetch all products (for homepage)
  const fetchAllProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/v1/products`);
      const json = await res.json();
      if (json.success) {
        // Normalize images
        const normalized = json.data.map((prod) => ({
          ...prod,
          images: (prod.images || []).map(normalizeImageUrl),
          thumbnail: prod.thumbnail ? normalizeImageUrl(prod.thumbnail) : '',
        }));
        setProducts(normalized);
      }
    } catch (err) {
      console.error('Error fetching all products:', err);
    }
  };

  // Fetch user's products (for seller dashboard)
  const fetchMyProducts = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/products/my`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success) {
        const normalized = json.data.map((prod) => ({
          ...prod,
          images: (prod.images || []).map(normalizeImageUrl),
          thumbnail: prod.thumbnail ? normalizeImageUrl(prod.thumbnail) : '',
        }));
        setMyProducts(normalized);
      }
    } catch (err) {
      console.error('Error fetching my products:', err);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchMyProducts();
  }, []);

  const addProduct = (product) => {
    const normalized = {
      ...product,
      images: (product.images || []).map(normalizeImageUrl),
      thumbnail: product.thumbnail ? normalizeImageUrl(product.thumbnail) : '',
    };
    setProducts((prev) => [normalized, ...prev]);
    setMyProducts((prev) => [normalized, ...prev]);
  };

  // For updates, you may want an updateProduct function too:
  const updateProduct = (updatedProduct) => {
    const normalized = {
      ...updatedProduct,
      images: (updatedProduct.images || []).map(normalizeImageUrl),
      thumbnail: updatedProduct.thumbnail ? normalizeImageUrl(updatedProduct.thumbnail) : '',
    };
    setProducts((prev) =>
      prev.map((p) => (p.id === normalized.id ? normalized : p))
    );
    setMyProducts((prev) =>
      prev.map((p) => (p.id === normalized.id ? normalized : p))
    );
  };

  return (
    <ProductContext.Provider value={{ 
      
      products, myProducts, addProduct, updateProduct, markAsSold, deleteProduct,
 }}>
      {children}
    </ProductContext.Provider>
  );
};
