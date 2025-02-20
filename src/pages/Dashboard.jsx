// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [waitingCount, setWaitingCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const goToCreateProducts = () => {
    navigate('/createproducts');
  };

  const goToProductList = () => {
    navigate('/productlist');
  };

  const goToOrder = () => {
    navigate('/orders');
  };

  const goToCustomers = () => {
    navigate('/customers'); // Pastikan route CustomerList sudah terdaftar
  };

  // Fetch pesanan dari API dan hitung jumlah berdasarkan status
  const fetchOrdersCount = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("https://dika-server.vercel.app/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orders = response.data;
      const waiting = orders.filter(order => order.status === "Menunggu Konfirmasi").length;
      const processing = orders.filter(order => order.status === "Diproses").length;
      setWaitingCount(waiting);
      setProcessingCount(processing);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrdersCount();
  }, []);

  return (
    <div className="p-4">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Selamat bekerja, Bos!</p>
      </header>

      {/* Notifikasi Pesanan */}
      <div className="mb-4 space-y-2">
        {waitingCount > 0 && (
          <div className="bg-yellow-200 p-2 rounded text-center">
            Kamu memiliki {waitingCount} pesanan yang menunggu konfirmasi.
          </div>
        )}
        {processingCount > 0 && (
          <div className="bg-yellow-200 p-2 rounded text-center">
            Kamu memiliki {processingCount} pesanan yang belum diproses.
          </div>
        )}
      </div>

      {/* Navigasi dengan SwiperJS */}
      <Swiper
        spaceBetween={10}
        slidesPerView={'auto'}
        freeMode={true}
        className="mb-6"
      >
        <SwiperSlide style={{ width: '120px' }}>
          <button
            onClick={goToProductList}
            className="w-full px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition duration-200"
          >
            Update
          </button>
        </SwiperSlide>
        <SwiperSlide style={{ width: '120px' }}>
          <button
            onClick={goToCreateProducts}
            className="w-full px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition duration-200"
          >
            Create
          </button>
        </SwiperSlide>
        <SwiperSlide style={{ width: '120px' }}>
          <button
            onClick={goToCustomers}
            className="w-full px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition duration-200"
          >
            Customers
          </button>
        </SwiperSlide>

        <SwiperSlide style={{ width: '120px' }}>
          <button
            onClick={goToOrder}
            className="w-full px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition duration-200"
          >
            Pesanan
          </button>
        </SwiperSlide>
      </Swiper>

      {/* Tombol Logout */}
      <div className="flex justify-center">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
