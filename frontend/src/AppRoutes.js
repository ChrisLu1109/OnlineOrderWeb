// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import HomePage from "./pages/Home/HomePage";
// import FoodPage from "./pages/Food/FoodPage";
// import Login from "./pages/Login/login"
// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/search/:searchTerm" element={<HomePage />} />
//       <Route path="/tag/:tag" element={<HomePage />} />
//       <Route path="/food/:id" element={<FoodPage />} />
//     </Routes>
//   );
// }

import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import FoodPage from "./pages/Food/FoodPage";
import Login from "./pages/Login/login"; // Make sure the path is correct
import SearchBar from "./pages/restrictions/restrictions"; // Make sure the path is correct

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/search/:searchTerm" element={<HomePage />} />
      <Route path="/tag/:tag" element={<HomePage />} />
      <Route path="/food/:id" element={<FoodPage />} />
      <Route path="/dietary" element={<SearchBar />} />
    </Routes>
  );
}
