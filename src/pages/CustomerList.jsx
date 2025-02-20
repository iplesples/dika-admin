// src/pages/CustomerList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchWhatsapp, setSearchWhatsapp] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: '', whatsapp: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Fetch pelanggan dari API
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("https://dika-server.vercel.app/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter pelanggan berdasarkan nomor WhatsApp
  const filteredCustomers = customers.filter(customer =>
    customer.whatsapp.includes(searchWhatsapp)
  );

  // Saat tombol Update diklik, set ke mode edit
  const handleEditClick = (customer) => {
    setEditingCustomer(customer._id);
    setFormData({
      name: customer.name,
      whatsapp: customer.whatsapp,
      password: '', // kosongkan password, hanya diisi jika ingin mengganti
    });
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
    setFormData({ name: '', whatsapp: '', password: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Kirim update ke API
  const handleUpdateCustomer = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `https://dika-server.vercel.app/api/customers/${editingCustomer}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomers(customers.map(c => c._id === editingCustomer ? response.data.customer : c));
      setEditingCustomer(null);
      alert("Pelanggan berhasil diperbarui.");
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Gagal mengupdate pelanggan.");
    }
  };

  // Tombol copy nomor WhatsApp
  const handleCopyWhatsapp = (whatsapp) => {
    navigator.clipboard.writeText(whatsapp)
      .then(() => alert("Nomor WhatsApp disalin!"))
      .catch(() => alert("Gagal menyalin nomor WhatsApp."));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Daftar Pelanggan</h1>
      {/* Pencarian */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Cari berdasarkan nomor WhatsApp..."
          value={searchWhatsapp}
          onChange={(e) => setSearchWhatsapp(e.target.value)}
          className="border rounded p-2 w-full max-w-md"
        />
      </div>
      {loading ? (
        <p className="text-center">Loading pelanggan...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <div key={customer._id} className="bg-white shadow-md rounded-lg p-4 flex flex-col">
              {editingCustomer === customer._id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border rounded p-2 mb-2"
                    placeholder="Nama"
                  />
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="border rounded p-2 mb-2"
                    placeholder="WhatsApp"
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border rounded p-2 mb-2"
                    placeholder="Password baru (opsional)"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleUpdateCustomer}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-2">
                    <p className="font-semibold text-lg">{customer.name}</p>
                    <p className="text-gray-600">{customer.whatsapp}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-gray-500">Mendaftar: {new Date(customer.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <button
                      onClick={() => handleEditClick(customer)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleCopyWhatsapp(customer.whatsapp)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {filteredCustomers.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">Pelanggan tidak ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
