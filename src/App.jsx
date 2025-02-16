// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import CreateProduct from './pages/CreateProducts';
import ProtectedRoute from './components/ProtectedRoute';
import ProductList from './pages/ProductList';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
        path="/createproducts" 
        element={
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/productlist" 
        element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        }
      />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
