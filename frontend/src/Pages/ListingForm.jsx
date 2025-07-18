import React, { useEffect, useState, useContext } from 'react';
import './CSS/ListingForm.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import up from '../Components/Assets/up.PNG';
import { ProductContext } from '../Contexts/ListingContext';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListingForm = () => {
  const { id } = useParams(); // note: param name is 'id'
  const navigate = useNavigate();

  const { addProduct, updateProduct } = useContext(ProductContext);

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [form, setForm] = useState({
    title: '',
    category_id: '',
    description: '',
    price: '',
    condition: '',
    location_id: '',
    images: [], // new uploaded File objects
    tags: '',
  });

  const [attributes, setAttributes] = useState([]);
  const [newAttr, setNewAttr] = useState('');

  const [existingImages, setExistingImages] = useState([]); // URLs for images already uploaded
  const [deleteImages, setDeleteImages] = useState([]); // images marked for deletion

  // Fetch categories and locations once
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${BASE_URL}/v1/categories`);
      const data = await res.json();
      if (data.success) setCategories(data.data);
    };
    const fetchLocations = async () => {
      const res = await fetch(`${BASE_URL}/v1/locations`);
      const data = await res.json();
      if (data.success) setLocations(data.data);
    };
    fetchCategories();
    fetchLocations();
  }, []);

  // Fetch product data if editing (id param present)
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/v1/products/${id}`);
        const data = await res.json();
        if (data.success) {
          const p = data.data;
          setForm({
            title: p.title || '',
            category_id: p.category_id || '',
            description: p.description || '',
            price: p.price || '',
            condition: p.condition || '',
            location_id: p.location_id || '',
            images: [], // new uploads start empty
            tags: p.tags || '',
          });
          setAttributes(p.attributes || []);
          setExistingImages(p.images || []); // existing URLs
        } else {
          alert('❌ Failed to load product data.');
        }
      } catch (error) {
        console.error(error);
        alert('❌ Error fetching product data.');
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleRemoveExistingImage = (imgUrl) => {
    setExistingImages((prev) => prev.filter((img) => img !== imgUrl));
    setDeleteImages((prev) => [...prev, imgUrl]);
  };

  const handleRemoveNewImage = (index) => {
    setForm((prev) => {
      const newImgs = [...prev.images];
      newImgs.splice(index, 1);
      return { ...prev, images: newImgs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('category_id', form.category_id);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('condition', form.condition);
    formData.append('location_id', form.location_id);

    attributes.forEach(attr => formData.append('attributes[]', attr));
    formData.append('tags', form.tags || '');

    // Append new images if any
    if (form.images.length > 0) {
      form.images.forEach(imgFile => {
        formData.append('images[]', imgFile);
      });
    }

   if (deleteImages.length > 0) {
  deleteImages.forEach(img => {
    formData.append('delete_images[]', img);
  });
}

    const token = await getAccessToken();

    try {
      let res, data;
      if (id) {
        // Update existing product
        res = await fetch(`${BASE_URL}/v1/products/${id}`, {
          method: 'POST', // or PUT if your API uses PUT for update
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        data = await res.json();

        if (data.success) {
          alert('✅ Product updated successfully!');
          updateProduct(data.data);
          navigate('/seller_dashboard');
        } else {
          alert('❌ Update failed: ' + (data.message || 'Unknown error'));
        }
      } else {
        // Add new product
        res = await fetch(`${BASE_URL}/v1/products`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        data = await res.json();

        if (data.success) {
          alert('✅ Product added successfully!');
          addProduct(data.data);
          navigate('/seller_dashboard');
        } else {
          alert('❌ Adding product failed: ' + (data.message || 'Unknown error'));
        }
      }
    } catch (error) {
      console.error(error);
      alert('❌ Error submitting form');
    }
  };

  return (
    <div className="listing-form">
      <div className="header2">
        <Link to="/seller_dashboard">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">{id ? 'Edit Listing' : 'Listing Form'}</h2>
      </div>
      <br />
      <div className="chat-ap">
        <form onSubmit={handleSubmit}>
          <label className="sow">Product Title</label>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={form.title}
            placeholder="Name of product"
            required
          />

          <label className="sow">Category</label>
          <select
            name="category_id"
            onChange={handleChange}
            value={form.category_id}
            required
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <label className="sow">Description</label>
          <textarea
            name="description"
            onChange={handleChange}
            value={form.description}
            placeholder="Details about product"
            required
          />

          <label className="sow">Price</label>
          <div className="price-input">
            <input
              type="text"
              name="price"
              onChange={handleChange}
              value={form.price}
              placeholder="2,000,000"
              required
            />
            <div className="currency">
              <h3>$</h3>USD
            </div>
          </div>

          <label className="sow">Location</label>
          <select
            name="location_id"
            onChange={handleChange}
            value={form.location_id}
            required
          >
            <option value="">Select a Location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>

          <label className="sow">Images</label>

          {/* Existing images */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            {existingImages.map((img, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img
                  src={img}
                  alt={`existing-${idx}`}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(img)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    cursor: 'pointer',
                  }}
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* New images upload */}
          <div className="image-upload" style={{ marginBottom: 10 }}>
            <img src={up} alt="upload" />
            <p>Browse and choose the files you want to upload from your computer</p>
            <input type="file" multiple onChange={handleImageChange} />
            {/* Preview newly added images */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
              {form.images.map((file, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`new-${idx}`}
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      cursor: 'pointer',
                    }}
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="sow">Condition</label>
          <div className="conditions">
            {['new', 'used', 'fairly_used'].map((cond) => (
              <label className="checkbox-label2" key={cond}>
                <h4>{cond.replace('_', ' ').toUpperCase()}</h4>
                <div className="checkbox-container">
                  <input
                    type="radio"
                    name="condition"
                    value={cond}
                    checked={form.condition === cond}
                    className="payin2"
                    onChange={handleChange}
                    required
                  />
                  <span className="custom-checkbox2"></span>
                </div>
              </label>
            ))}
          </div>

          <label className="sow">Attributes</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="e.g. color:blue"
              value={newAttr}
              onChange={(e) => setNewAttr(e.target.value)}
            />
            <button
              type="button"
              className="upload-btn"
              onClick={() => {
                if (newAttr.trim()) {
                  setAttributes((prev) => [...prev, newAttr.trim()]);
                  setNewAttr('');
                }
              }}
            >
              Add
            </button>
          </div>
          <ul style={{ fontSize: '14px', marginBottom: '15px', listStyleType: 'disc', paddingLeft: '20px' }}>
            {attributes.map((attr, i) => (
              <li key={i}>
                {attr} &nbsp;
                <button
                  type="button"
                  style={{
                    background: 'none',
                    color: 'red',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  onClick={() => setAttributes((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <button type="submit" className="submit-btn3">
            {id ? 'Update Product' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
