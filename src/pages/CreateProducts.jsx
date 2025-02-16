import { useState } from "react";
import axios from "axios";

const CreateProduct = () => {
  const initialFormData = {
    title: "",
    brand: "",
    description: "",
    price: "",
    color: "",
    photoDisplay: null,
    photoDetails: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [preview, setPreview] = useState({ photoDisplay: null, photoDetails: [] });
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (field === "photoDetails" && formData.photoDetails.length >= 5) {
      alert("Maksimal 5 foto detail.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: field === "photoDetails" ? [...prev.photoDetails, file] : file,
    }));

    setPreview((prev) => ({
      ...prev,
      [field]: field === "photoDetails" ? [...prev.photoDetails, URL.createObjectURL(file)] : URL.createObjectURL(file),
    }));
  };

  const removePhoto = (field, index = null) => {
    if (field === "photoDetails") {
      setFormData((prev) => ({
        ...prev,
        photoDetails: prev.photoDetails.filter((_, i) => i !== index),
      }));
      setPreview((prev) => ({
        ...prev,
        photoDetails: prev.photoDetails.filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: null }));
      setPreview((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "photoDetails") {
        formData[key].forEach((file) => data.append(key, file));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.post("https://dika-server.vercel.app/api/products/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product created successfully!");

      // Kosongkan form setelah sukses upload
      setFormData(initialFormData);
      setPreview({ photoDisplay: null, photoDetails: [] });
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    }

    setIsUploading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="text" name="title" value={formData.title} placeholder="Title" onChange={handleChange} className="border p-3 rounded-lg w-full" required />
        <input type="text" name="brand" value={formData.brand} placeholder="Brand" onChange={handleChange} className="border p-3 rounded-lg w-full" required />
        <textarea name="description" value={formData.description} placeholder="Description" onChange={handleChange} className="border p-3 rounded-lg w-full" required />
        <input type="number" name="price" value={formData.price} placeholder="Price" onChange={handleChange} className="border p-3 rounded-lg w-full" required />
        <input type="text" name="color" value={formData.color} placeholder="Color" onChange={handleChange} className="border p-3 rounded-lg w-full" required />

        <div>
          <label className="block font-medium mb-2">Photo Display</label>
          {preview.photoDisplay ? (
            <div className="relative">
              <img src={preview.photoDisplay} alt="Display" className="w-full h-40 object-cover rounded-lg" />
              <button onClick={() => removePhoto("photoDisplay")} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">✕</button>
            </div>
          ) : (
            <label className="block border-dashed border-2 p-4 text-center cursor-pointer">
              <input type="file" className="hidden" onChange={(e) => handleFileChange(e, "photoDisplay")} />
              + Add Photo
            </label>
          )}
        </div>

        <div>
          <label className="block font-medium mb-2">Photo Details (Max 5)</label>
          <div className="grid grid-cols-3 gap-2">
            {preview.photoDetails.map((src, index) => (
              <div key={index} className="relative">
                <img src={src} alt="Detail" className="w-full h-24 object-cover rounded-lg" />
                <button onClick={() => removePhoto("photoDetails", index)} className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded">✕</button>
              </div>
            ))}
            {formData.photoDetails.length < 5 && (
              <label className="block border-dashed border-2 p-4 text-center cursor-pointer">
                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, "photoDetails")} />
                + Add
              </label>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`w-full text-white py-2 rounded-lg transition-colors duration-300 ${
            isUploading ? "bg-red-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
          }`}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
