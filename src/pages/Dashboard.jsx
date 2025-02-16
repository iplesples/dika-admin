// src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      // Hapus token dari localStorage
      localStorage.removeItem('adminToken');
      // Redirect ke halaman login
      navigate('/');
    };

      const goToCreateProducts = () => {
        navigate('/createproducts');
      };

      const goToProductList = () => {
        navigate('/productlist');
      };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p>Selamat bekerja bos q</p>
        <div className='flex gap-2 mt-5'>
        <button
          onClick={goToProductList}
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          update
        </button>
        <button
          onClick={goToCreateProducts}
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-700 transition duration-200"
          >
          create
        </button>
        <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
        >
        Logout
        </button>
        </div>
    </div>
  );
};

export default Dashboard;
