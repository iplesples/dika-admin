

function UpdateProductModal({ product, onClose }) {
    const [formData, setFormData] = useState({
      title: product.title,
      brand: product.brand,
      description: product.description,
      price: product.price,
      color: product.color,
    });
    const [photoDisplay, setPhotoDisplay] = useState(null);
    const [photoDetails, setPhotoDetails] = useState([]);
    const API_URL = "https://dika-server.vercel.app/api/products/update/";
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleFileChange = (e) => {
      if (e.target.name === "photoDisplay") {
        setPhotoDisplay(e.target.files[0]);
      } else {
        setPhotoDetails([...e.target.files]);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (photoDisplay) data.append("photoDisplay", photoDisplay);
      photoDetails.forEach((file) => data.append("photoDetails", file));
      
      try {
        await axios.put(`${API_URL}${product._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        window.location.reload();
      } catch (error) {
        console.error("Error updating product:", error);
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">Update Produk</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded mb-2" placeholder="Title" required />
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border rounded mb-2" placeholder="Brand" required />
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded mb-2" placeholder="Description" required></textarea>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded mb-2" placeholder="Price" required />
            <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full p-2 border rounded mb-2" placeholder="Color" required />
            <input type="file" name="photoDisplay" onChange={handleFileChange} className="w-full p-2 border rounded mb-2" />
            <input type="file" name="photoDetails" onChange={handleFileChange} multiple className="w-full p-2 border rounded mb-2" />
            <div className="flex justify-between mt-4">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Update</button>
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default UpdateProductModal;
  