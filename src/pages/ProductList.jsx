import { useEffect, useState } from "react";
import axios from "axios";
import UpdateProductModal from "../components/UpdateProductModal";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const API_URL = "https://dika-server.vercel.app/api/products";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    try {
      await axios.delete(`${API_URL}/delete/${id}`)
  // Update state agar UI langsung berubah tanpa reload
  setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="p-4 shadow-md border rounded-lg">
            <img
              src={product.photoDisplay}
              alt={product.brand}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">{product.brand}</h2>
            <div className="flex justify-between mt-2">
              <button 
                onClick={() => handleUpdate(product)} 
                className="px-4 py-2 border rounded text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
                Update
              </button>
              <button 
                onClick={() => handleDelete(product._id)} 
                className="px-4 py-2 border rounded text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && <UpdateProductModal product={selectedProduct} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

