// src/pages/UpdateProduct.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
  });
  const [photoDisplay, setPhotoDisplay] = useState(null);
  const [photoDisplayPreview, setPhotoDisplayPreview] = useState(null);
  const [photoDetails, setPhotoDetails] = useState([]); // new photos chosen
  const [photoDetailsPreview, setPhotoDetailsPreview] = useState([]); // preview for new photos
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Refs untuk input file tersembunyi
  const photoDisplayInputRef = useRef(null);
  const photoDetailInputRef = useRef(null);

  // Fetch product data berdasarkan id
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://dika-server.vercel.app/api/products/${id}`);
        const product = response.data;
        setForm({
          title: product.title,
          brand: product.brand,
          description: product.description,
          price: product.price,
          stock: product.stock,
        });
        // Untuk preview, gunakan foto yang ada di database
        setPhotoDisplayPreview(product.photoDisplay);
        // Untuk photoDetails, kita asumsikan foto yang ada sudah di-preview; 
        // jika ingin menampilkan foto lama secara terpisah, bisa disesuaikan.
        setPhotoDetailsPreview(product.photoDetails);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product data");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Ubah Photo Display
  const handlePhotoDisplayChange = (e) => {
    const file = e.target.files[0];
    setPhotoDisplay(file);
    if (file) {
      setPhotoDisplayPreview(URL.createObjectURL(file));
    }
  };

  // Tambahkan satu foto detail (file baru)
  const handleAddPhotoDetail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Maksimal 5 file untuk foto detail (gabungan foto lama dan baru)
    if (photoDetailsPreview.length + photoDetails.length >= 5) {
      alert("You can upload a maximum of 5 photo details.");
      return;
    }
    setPhotoDetails(prev => [...prev, file]);
    setPhotoDetailsPreview(prev => [...prev, URL.createObjectURL(file)]);
  };

  const handleRemovePhotoDetail = (index) => {
    // Kita asumsikan index yang dihapus merujuk pada file baru (yang di-upload)
    // Jika Anda ingin menghapus foto lama dari database, itu memerlukan endpoint khusus.
    setPhotoDetails(prev => prev.filter((_, i) => i !== index));
    setPhotoDetailsPreview(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup URL untuk menghindari memory leak
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

      // Jika ada file baru untuk photoDisplay, kirim; jika tidak, biarkan backend mempertahankan foto lama
      if (photoDisplay) {
        formData.append('photoDisplay', photoDisplay);
      }
      // Untuk photoDetails, jika ada file baru, lampirkan file tersebut.
      if (photoDetails.length > 0) {
        photoDetails.forEach(file => {
          formData.append('photoDetails', file);
        });
      }
      
      const response = await axios.put(
        `https://dika-server.vercel.app/api/products/update/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setSuccess(response.data.message || 'Product updated successfully!');
      // Navigate ke halaman Product Management setelah update sukses
      navigate('/productlist');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  if (loading) return <p className="text-center">Loading product data...</p>;

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Update Product</h1>
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
        {/* Photo Display */}
        <div>
          <label className="block font-semibold mb-1">
            Photo Display (1 image) - {photoDisplay ? "New file selected" : "Existing image shown"}
          </label>
          <button
            type="button"
            onClick={() => photoDisplayInputRef.current.click()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-2"
          >
            Change Photo Display
          </button>
          <input
            type="file"
            name="photoDisplay"
            onChange={handlePhotoDisplayChange}
            accept="image/*"
            ref={photoDisplayInputRef}
            style={{ display: 'none' }}
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
        {/* Photo Details */}
        <div>
          <label className="block font-semibold mb-1">
            Photo Details (max 5) - {photoDetailsPreview.length} total (new selected: {photoDetails.length})
          </label>
          {photoDetails.length + photoDetailsPreview.length < 5 && (
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
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
