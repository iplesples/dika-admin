// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import CreateProduct from './pages/CreateProducts';
import ProtectedRoute from './components/ProtectedRoute';
import ProductList from './pages/ProductList';
import CustomerList from './pages/CustomerList';
import ProductManagement from './pages/ProductManagement';
import AddProduct from './pages/AddProduct';
import UpdateProduct from './pages/UpdateProduct';

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
            <ProductManagement />
          </ProtectedRoute>
        }
      />
        <Route 
        path="/addproduct" 
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/updateproduct/:id" 
        element={
          <ProtectedRoute>
            <UpdateProduct />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/productlist" 
        element={
          <ProtectedRoute>
            <ProductManagement />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/customers" 
        element={
          <ProtectedRoute>
            <CustomerList />
          </ProtectedRoute>
        }
      />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
