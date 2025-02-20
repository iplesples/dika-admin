import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "../components/OrderCard";

const Orders = () => {
  // Default filter diatur ke "Menunggu Konfirmasi"
  const [filterStatus, setFilterStatus] = useState("Menunggu Konfirmasi");
  const [orders, setOrders] = useState([]);

  // Hanya menggunakan opsi status yang spesifik, tanpa "All"
  const filterOptions = [
    "Menunggu Konfirmasi",
    "Diproses",
    "Selesai",
    "Dibatalkan",
  ];

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("https://dika-server.vercel.app/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdated = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
    );
  };

  const handleOrderDeleted = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
  };

  // Filter orders berdasarkan status yang dipilih (tidak ada opsi "All")
  const filteredOrders = orders.filter((order) => order.status === filterStatus);

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Daftar Pesanan Masuk</h1>
      {/* Navigasi filter */}
      <div className="flex flex-wrap justify-center mb-6 gap-4">
        {filterOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded ${
              filterStatus === status
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">
          Tidak ada pesanan dengan status "{filterStatus}".
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusUpdated={handleStatusUpdated}
              onOrderDeleted={handleOrderDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
