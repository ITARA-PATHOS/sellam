import React, { useEffect, useState } from "react";
import { getAccessToken } from "../utils/token";
import "./CSS/AdminProduct.css";
import "./CSS/AdminCategory.css";



const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeView, setActiveView] = useState("all"); // "all" | "pending"
  const [rejectingId, setRejectingId] = useState(null);
const [rejectReason, setRejectReason] = useState("");
const [perPage, setPerPage] = useState(20); // default 20


  // top of component
const [formData, setFormData] = useState({
  title: "",
  description: "",
  price: "",
  category_id: "",
  condition: "",
  location_id: "",
  attributes: [],
  tags: [],
  images: [],         // ✅ always start as empty array
  delete_images: [],  // ✅ always start as empty array
});


  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/products?per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Full product response:", data); // 👈 check API structure

      if (data.success) {
        setProducts(data.data);
        setFilteredProducts(data.data);
        setActiveView("all");
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

      // Fetch pending products
  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/products/pending?per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log({"full pending response": data})
      if (data.success) {
        setProducts(data.data);
        setFilteredProducts(data.data);
        setActiveView("pending");
      } else {
        setError(data.message || "Failed to fetch pending products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
  if (activeView === "pending") {
    // Fetch pending products
  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/products/pending?per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setFilteredProducts(data.data);
        setActiveView("pending");
      } else {
        setError(data.message || "Failed to fetch pending products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
    fetchPendingProducts();
  } else {
    // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/products?per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Full product response:", data); // 👈 check API structure

      if (data.success) {
        setProducts(data.data);
        setFilteredProducts(data.data);
        setActiveView("all");
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
    fetchProducts();
  }
}, [perPage, activeView]);


  // search filter
  useEffect(() => {
    let data = products;
    if (search.trim() !== "") {
      data = products.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredProducts(data);
  }, [search, products]);

  // approve product
  const handleApprove = async (id) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/products/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json',
    Accept: 'application/json', },
      });
      const data = await res.json();
          console.log("Approve response:", data);

      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
        );
        setSelectedProduct((prev) => ({ ...prev, status: "approved" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // reject product
  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    try {
          console.log("Rejecting product ID:", id);

      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/products/${id}/reject`, {
        method: "PATCH",
        headers: { 
           'Content-Type': 'application/json',
    Accept: 'application/json',
          Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ reason: rejectReason }),

      });
      
      const data = await res.json();
                console.log("reject response:", data);

      if (data.success) {
      setRejectingId(null);
      setRejectReason("");
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p))
        );
        setSelectedProduct((prev) => ({ ...prev, status: "rejected" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // toggle featured
  const handleToggleFeatured = async (id) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(
        `${BASE_URL}/v1/admin/products/${id}/toggle-featured`,
        {
          method: "POST",
          headers: { 
             'Content-Type': 'application/json',
    Accept: 'application/json',
            Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
                      console.log("response:", data);

      if (data.success) {
       // `data.data` is the product object returned
  setSelectedProduct((prev) => ({
    ...prev,
    featured: data.data.featured ? "true" : "false",
  }));


 // ✅ Persist in sessionStorage
      sessionStorage.setItem(
        "selectedProduct_featured",
        data.data.featured ? "true" : "false"
      );

        // refresh list depending on current view
        if (activeView === "pending") {
          fetchPendingProducts();
        } else {
          fetchProducts();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // open details modal
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setEditingProduct(null);
  };

// start editing
const handleEdit = (product) => {
  setEditingProduct(product);
  setFormData({
    title: product.title || "",
    description: product.description || "",
    price: product.price || "",
    category_id: product.category_id || "",
    condition: product.condition || "",
    location_id: product.location_id || "",
    attributes: Array.isArray(product.attributes)
      ? product.attributes
      : product.attributes
      ? [product.attributes]
      : [],
    tags: Array.isArray(product.tags)
      ? product.tags
      : product.tags
      ? [product.tags]
      : [],
    images: [],          // 🚩 always empty until user uploads new ones
    existing_images: product.images || [], // show current
    delete_images: [],   // 🚩 start fresh (backend doesn’t send this)
  });
};

  // form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  if (!editingProduct) return;

  try {
    const token = await getAccessToken();
    const fd = new FormData();

    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("price", formData.price);
    fd.append("category_id", formData.category_id);
    fd.append("condition", formData.condition);
    fd.append("location_id", formData.location_id);

    formData.attributes.forEach((a) => fd.append("attributes[]", a));
    formData.tags.forEach((t) => fd.append("tags[]", t));
    formData.delete_images.forEach((d) => fd.append("delete_images[]", d));

    // Only send new files
    formData.images.forEach((img) => {
      if (img instanceof File) {
        fd.append("images[]", img);
      }
    });

    for (let [key, value] of fd.entries()) {
  console.log(key, value);
}


    const res = await fetch(
      `${BASE_URL}/v1/admin/products/${editingProduct.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: fd,
      }
    );

    const data = await res.json();
    console.log("⬅️ Update Response:", data);

    if (!res.ok) throw new Error(data.message || "Failed to update product");

    // Reset stale state before fetching
    setEditingProduct(null);
    setSelectedProduct(null);
    await fetchProducts();

  } catch (err) {
    console.error(err);
  }
};



  // Load formData (including featured) from sessionStorage if it exists
useEffect(() => {
  const savedFormData = sessionStorage.getItem("productFormData");
  if (savedFormData) {
    setFormData(JSON.parse(savedFormData));
  }
}, []);

useEffect(() => {
  // Save to sessionStorage whenever formData changes
  sessionStorage.setItem("productFormData", JSON.stringify(formData));
}, [formData]);


  return (
    <div className="main-area">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <span className="section-title">Manage Sellers Product</span>
        <span className="breadcrumb">Admin &gt; Products</span>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <button
          className={`toolbar-btn ${activeView === "all" ? "active" : ""}`}
          onClick={fetchProducts}
        >
          All Products
        </button>
        <button
          className={`toolbar-btn ${activeView === "pending" ? "active" : ""}`}
          onClick={fetchPendingProducts}
        >
          Pending
        </button>
      </div>

      {/* Search bar */}
      <div className="product-searchbar">
      {/* Per Page Selector */}
<div className="perpage-selector">
  <label>Show: </label>
  <select value={perPage} onChange={(e) => setPerPage(e.target.value)}>
    <option value={10}>10</option>
    <option value={20}>20</option>
    <option value={50}>50</option>
    <option value={100}>100</option>
  </select>
  <span> per page</span>
</div>

        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, i) => (
                <tr key={p.id}  style={{ cursor: "pointer" }}  onClick={() => handleViewDetails(p)}>
                  <td>{i + 1}</td>
                  <td>{p.title}</td>
                  <td>${p.price}</td>
                  <td>{p.category?.name || "-"}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        p.status === "approved"
                          ? "status-approved"
                          : p.status === "rejected"
                          ? "status-rejected"
                          : "status-pending"
                      }`}
                    >
                     {p.status || "unknown"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details modal */}
      {selectedProduct && !editingProduct && (
        <div className="product-modal-overlay">
          <div className="product-modal-content">
            <h3>{selectedProduct.title}</h3>
            <img
              src={selectedProduct.thumbnail}
              alt={selectedProduct.title}
              className="product-modal-thumb"
            />
            <p>
              <b>Price:</b> ${selectedProduct.price}
            </p>
            <p>
              <b>Category:</b> {selectedProduct.category?.name}
            </p>
            <p>
              <b>Description:</b> {selectedProduct.description}
            </p>
            <p>
              <b>Status:</b> {selectedProduct.status}
            </p>
            <p>
              <b>Featured:</b>{" "}
              {selectedProduct.featured  === "true" ? "Yes" : "No"}
            </p>

            <div className="product-modal-actions">
              <button
                className="product-btn-approve"
                onClick={() => handleApprove(selectedProduct.id)}
              >
                ✅ Approve
              </button>
              {/* Reject Button */}
      <button
        onClick={() =>
          setRejectingId(rejectingId === selectedProduct.id ? null : selectedProduct.id)
        }
        className="product-btn-reject"
      >
        Reject
      </button>

      {/* Small Reject Form */}
      {rejectingId === selectedProduct.id && (
        <div className="reject-form">
          <input
            type="text"
            placeholder="Enter reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <button
            onClick={() => handleReject(selectedProduct.id)}
            className="reject-submit-btn"
          >
            Submit
          </button>
          <button
              onClick={() => setRejectingId(null)}
              className="reject-cancel-btn"
            >
              Cancel
            </button>
        </div>
      )}
              <button
                className="product-btn-update"
                onClick={() => handleEdit(selectedProduct)}
              >
                ✏️ Update
              </button>
              <button
                className="product-btn-delete"
                onClick={() => handleDelete(selectedProduct.id)}
              >
                🗑️ Delete
              </button>
              <button
                className="product-btn-featured"
                onClick={() => handleToggleFeatured(selectedProduct.id)}
              >
                ⭐ {selectedProduct.featured === "true" ? "Unfeature" : "Feature"}
              </button>
              <button
                className="product-btn-close"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingProduct && (
        <div className="product-modal-overlay">
          <div className="product-modal-content">
            <h3>Edit Product</h3>
           <form onSubmit={handleUpdateSubmit} className="product-edit-form">
  {/* Title */}
  <label>
    Title
    <input
      type="text"
      name="title"
      value={formData.title}
      onChange={handleChange}
      required
    />
  </label>

  {/* Description */}
  <label>
    Description
    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      required
    />
  </label>

  {/* Price */}
  <label>
    Price
    <input
      type="number"
      name="price"
      value={formData.price}
      onChange={handleChange}
      required
    />
  </label>

  {/* Category ID */}
  <label>
    Category ID
    <input
      type="text"
      name="category_id"
      value={formData.category_id}
      onChange={handleChange}
    />
  </label>

  {/* Condition */}
  <label>
    Condition
    <input
      type="text"
      name="condition"
      value={formData.condition}
      onChange={handleChange}
    />
  </label>

  {/* Location ID */}
  <label>
    Location ID
    <input
      type="text"
      name="location_id"
      value={formData.location_id}
      onChange={handleChange}
    />
  </label>

  {/* Attributes */}
  <label>
    Attributes (comma separated)
    <input
      type="text"
      name="attributes"
      value={formData.attributes.join(", ")}
      onChange={(e) =>
        setFormData({
          ...formData,
          attributes: e.target.value
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean),
        })
      }
    />
  </label>

  {/* Tags */}
  <label>
    Tags (comma separated)
    <input
      type="text"
      name="tags"
      value={formData.tags.join(", ")}
      onChange={(e) =>
        setFormData({
          ...formData,
          tags: e.target.value
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        })
      }
    />
  </label>

  {/* Upload new images */}
  <label>
    Upload New Images
    <input
      type="file"
      name="images"
      accept="image/*"
      multiple
      onChange={(e) =>
        setFormData({
          ...formData,
          images: Array.from(e.target.files),
        })
      }
    />
  </label>

  {/* Show existing images with delete checkboxes */}
  {formData.existing_images?.length > 0 && (
    <div className="existing-images">
      <p>Existing Images (check to delete):</p>
      <div className="image-list5">
       {formData.existing_images?.length > 0 && (
  <div className="existing-images">
    <p>Existing Images (check to delete):</p>
    <div className="image-list5">
      {formData.existing_images.map((img, idx) => {
        // support both string and object from backend
        const imageUrl =
          typeof img === "string"
            ? img
            : img.thumb || img.original || img.url;

        const imageId =
          img.id || img.original || img.thumb || img; // use something unique for delete
        return (
          <div key={idx} className="image-item5">
            <img
              src={imageUrl}
              alt="product"
              className="preview-img2"
            />
            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input
                type="checkbox"
                className="juti"
                checked={formData.delete_images.includes(imageId)}
                onChange={(e) => {
                  const updatedDeletes = e.target.checked
                    ? [...formData.delete_images, imageId]
                    : formData.delete_images.filter((id) => id !== imageId);
                  setFormData({ ...formData, delete_images: updatedDeletes });
                }}
              />
              Delete
            </label>
          </div>
        );
      })}
    </div>
  </div>
)}

      </div>
    </div>
  )}

  {/* Buttons */}
  <div className="product-modal-actions">
    <button type="submit" className="product-btn-update">
      Save
    </button>
    <button
      type="button"
      className="product-btn-close"
      onClick={() => setEditingProduct(null)}
    >
      Cancel
    </button>
  </div>
</form>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProduct;
                                                                                                                                                                                                  