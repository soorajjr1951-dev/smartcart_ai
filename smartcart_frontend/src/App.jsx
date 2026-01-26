import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Layout from "./layout/Layout";

import Home from "./Pages/Home";
import ProductList from "./Pages/ProductList";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import Compare from "./Pages/Compare";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ChatBot from "./Pages/ChatBot";


function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Routes WITHOUT Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Routes WITH Navbar */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/chat" element={<ChatBot />} />
      </Route>
    </Routes>
  );
}

export default App;
