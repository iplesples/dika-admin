// src/pages/AddProduct.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [form, setForm] = useState({
    title: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
  });
  const [photoDisplay, setPhotoDisplay] = useState(null);
  const [photoDisplayPreview, setPhotoDisplayPreview] = useState(null);
  const [photoDetails, setPhotoDetails] = useState([]);
  const [photoDetailsPreview, setPhotoDetailsPreview] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Refs untuk file input tersembunyi
  const photoDisplayInputRef = useRef(null);
  const photoDetailInputRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoDisplayChange = (e) => {
    const file = e.target.files[0];
    setPhotoDisplay(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoDisplayPreview(previewUrl);
    } else {
      setPhotoDisplayPreview(null);
    }
  };

  const handleAddPhotoDetail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (photoDetails.length >= 5) {
      alert("Anda hanya dapat mengupload maksimal 5 foto.");
      return;
    }
    setPhotoDetails(prev => [...prev, file]);
    setPhotoDetailsPreview(prev => [...prev, URL.createObjectURL(file)]);
  };

  const handleRemovePhotoDetail = (index) => {
    setPhotoDetails(prev => prev.filter((_, i) => i !== index));
    setPhotoDetailsPreview(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup preview URL untuk menghindari memory leak
  useEffect(() => {
    return () => {
      if (photoDisplayPreview) URL.revokeObjectURL(photoDisplayPreview);
      photoDetailsPreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photoDisplayPreview, photoDetailsPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('brand', form.brand);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('stock', form.stock);

      if (photoDisplay) {
        formData.append('photoDisplay', photoDisplay);
      } else {
        setError('Photo Display is required.');
        return;
      }
      
      if (photoDetails.length > 0) {
        photoDetails.forEach(file => {
          formData.append('photoDetails', file);
        });
      } else {
        setError('At least one Photo Detail is required.');
        return;
      }

      const response = await axios.post(
        'https://dika-server.vercel.app/api/products/create',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setSuccess(response.data.message || 'Product created successfully!');
      // Clear form
      setForm({ title: '', brand: '', description: '', price: '', stock: '' });
      setPhotoDisplay(null);
      setPhotoDisplayPreview(null);
      setPhotoDetails([]);
      setPhotoDetailsPreview([]);
      // Setelah sukses, navigasikan ke halaman Product Management
      navigate('/productlist');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Product</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Brand</label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          ></textarea>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">
            Photo Display (1 image) - {photoDisplay ? "1 file selected" : "No file selected"}
          </label>
          <button
            type="button"
            onClick={() => photoDisplayInputRef.current.click()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-2"
          >
            Add Photo Display
          </button>
          <input
            type="file"
            name="photoDisplay"
            onChange={handlePhotoDisplayChange}
            accept="image/*"
            ref={photoDisplayInputRef}
            style={{ display: 'none' }}
            required
          />
          {photoDisplayPreview && (
            <div className="mt-2">
              <img
                src={photoDisplayPreview}
                alt="Preview Display"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">
            Photo Details (max 5) - {photoDetails.length} file(s) selected
          </label>
          {photoDetails.length < 5 && (
            <button
              type="button"
              onClick={() => photoDetailInputRef.current.click()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-2"
            >
              Add Photo Detail
            </button>
          )}
          <input
            type="file"
            name="photoDetails"
            onChange={handleAddPhotoDetail}
            accept="image/*"
            ref={photoDetailInputRef}
            style={{ display: 'none' }}
            required
          />
          {photoDetailsPreview.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {photoDetailsPreview.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview Detail ${index + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhotoDetail(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
