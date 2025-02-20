// src/components/OrderCard.jsx
import React, { useState } from "react";
import axios from "axios";

const OrderCard = ({ order, onStatusUpdated, onOrderDeleted }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `https://dika-server.vercel.app/api/orders/${order._id}`,
        { status: selectedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onStatusUpdated(response.data.order);
      alert("Pesanan berhasil diperbarui.");
    } catch (error) {
      console.error("Gagal memperbarui pesanan:", error);
      alert("Gagal memperbarui pesanan.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`https://dika-server.vercel.app/api/orders/${order._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onOrderDeleted(order._id);
      alert("Pesanan berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus pesanan:", error);
      alert("Gagal menghapus pesanan.");
    }
  };

  // Kontrol update hanya ditampilkan jika status masih "Menunggu Konfirmasi" atau "Diproses"
  const canUpdate = order.status === "Menunggu Konfirmasi" || order.status === "Diproses";
  // Kontrol delete hanya ditampilkan jika status sudah "Selesai" atau "Dibatalkan"
  const canDelete = order.status === "Selesai" || order.status === "Dibatalkan";

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
      {/* Header: Foto dan info produk */}
      <div className="flex items-center p-4 border-b">
        <img
          src={order.product.photoDisplay}
          alt={order.product.title}
          className="w-20 h-20 object-cover rounded mr-4"
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold">{order.product.title}</h2>
          <p className="text-sm text-gray-500">{order.product.brand}</p>
        </div>
      </div>
      {/* Konten Pesanan */}
      <div className="p-4">
        <p className="text-gray-700 mb-2">{order.product.description}</p>
        {/* Tampilkan total harga sesuai jumlah */}
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Total Harga:</span>
          <span className="text-green-600">Rp {order.product.price * order.quantity}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Jumlah:</span>
          <span>{order.quantity}</span>
        </div>
        {canUpdate && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border p-1 rounded"
              >
                <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
            <div className="flex justify-end mb-2">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
              >
                Update
              </button>
            </div>
          </>
        )}
        {canDelete && (
          <div className="flex justify-end mb-2">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {/* Footer: Info pelanggan & tanggal, beserta tombol Chat */}
      <div className="bg-gray-50 p-4 border-t flex flex-col">
        <p className="text-sm text-gray-600">Pelanggan: {order.user.name}</p>
        <div className="flex items-center">
          <p className="text-sm text-gray-600">WhatsApp: {order.user.whatsapp}</p>
          <a
            href={`https://wa.me/${order.user.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-block bg-green-500 text-white text-xs px-2 py-1 rounded"
          >
            Chat
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Dipesan: {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
