// src/pages/ProductManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filterBrand, setFilterBrand] = useState("All");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ambil data produk dari API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://dika-server.vercel.app/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fungsi untuk update produk: navigasi ke halaman update
  const handleUpdate = (id) => {
    navigate(`/updateproduct/${id}`);
  };

  // Fungsi untuk menghapus produk
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`https://dika-server.vercel.app/api/products/delete/${id}`);
        setProducts(products.filter(product => product._id !== id));
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  // Dapatkan daftar brand unik dari produk
  const brands = Array.from(new Set(products.map(product => product.brand)));

  // Filter produk berdasarkan brand (jika filterBrand bukan "All")
  const filteredProducts = filterBrand === "All"
    ? products
    : products.filter(product => product.brand === filterBrand);

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Product Management</h1>
      
      {/* Dropdown Filter untuk Brand */}
      <div className="mb-6 flex justify-center">
        <select 
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Brands</option>
          {brands.map((brand, index) => (
            <option key={index} value={brand}>{brand}</option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={product.photoDisplay} 
                alt={product.title} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-1">Brand: {product.brand}</p>
                <p className="text-green-600 font-semibold mb-1">Price: Rp {product.price}</p>
                <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
                <div className="flex justify-between">
                  <button 
                    onClick={() => handleUpdate(product._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
