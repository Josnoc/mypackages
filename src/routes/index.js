import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from '../components/layout/Header';
import PrivateRoute from './PrivateRoute';
import Login from '../components/main/Login';
import Main from '../components/packets/Main';
import Productos from '../components/products/Main';
import AddProduct from '../components/packets/AddPackage';
import EditProduct from '../components/packets/EditPackage';
import CreatePackage from '../components/packets/CreatePackage';

const Router = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/products" element={<PrivateRoute><Layout /><Productos /></PrivateRoute>} />
    <Route path="/add" element={<PrivateRoute><Layout /><AddProduct /></PrivateRoute>} />
    <Route path="/edit/:id" element={<PrivateRoute><Layout /><EditProduct /></PrivateRoute>} />
    <Route path="/create" element={<PrivateRoute><Layout /><CreatePackage /></PrivateRoute>} />
    <Route path="/" element={<PrivateRoute><Layout /><Main /></PrivateRoute>} />
  </Routes>
);

export default Router;
