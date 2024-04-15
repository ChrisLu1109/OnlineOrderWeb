import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import FoodPage from "./pages/Food/FoodPage";
import Login from "./pages/Login/login"; // Ensure the path is correct
import DietaryRestrictionsPage from "./pages/restrictions/restrictions"; // Ensure the path is correct
import CartPage from "./pages/Cart/CartPage";
import Profile from "./pages/Profile/profile"; // Import the Profile component
import AdminSetup from "./components/AdminSetup/AdminSetup";
import OrderPage from "./pages/Order/Order";
import FoodManagement from "./components/food-management/food-management";
import OrderManagement from "./pages/Order-Management/order-management";
import FoodList from "./components/FoodList/FoodList";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/search/:searchTerm" element={<HomePage />} />
      <Route path="/tag/:tag" element={<HomePage />} />
      <Route path="/food/:id" element={<FoodPage />} />
      <Route path="/dietary" element={<DietaryRestrictionsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<Profile />} />{" "}
      <Route path="/admin/setup" element={<AdminSetup />} />
      <Route path="/food-management" element = {<FoodManagement/>}></Route>
      <Route path="/order" element={<OrderPage />} />
      <Route path="/order-management" element={<OrderManagement />} />
      <Route path="/view-food" element={<FoodList />} />
    </Routes>
  );
}
