import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Wishlist from "../pages/Wishlist";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  );
}


