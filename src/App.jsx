import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./Company/Layout/LoyoUt.jsx";
import Talents from "./Company/Talent/Talent.jsx";
import Jobs from "./Company/Jobs/Jobs.jsx";
import Home from "./Company/Home/Home.jsx";
import SignUpPage from "./Company/Register/Register.jsx";
import TelegramVerify from "./Company/Register/TelegramVerify.jsx";
import SignIn from "./Company/Login/Login.jsx";
import ForgotPassword1 from "./Company/ForgotPassword1/ForgotPassword1.jsx";
import ForgotPassword2 from "./Company/ForgotPassword2/ForgotPassword2.jsx";
import ForgotPassword3 from "./Company/ForgotPassword3/ForgotPassword3.jsx";
import ForgotPassword4 from "./Company/ForgotPassword4/ForgotPassword4.jsx";
import Dashboard from "./Company/Dashboard/Dashboard.jsx";
import MainLoyout from "./Company/Layout/MainLoyout.jsx";
import TelegramVerify from "./Company/Register/TelegramVerify.jsx";
import Verify from "./Company/Register/Verify.jsx";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    // Agar token bo'lmasa, Login sahifasiga jo'natish
    return <Navigate to="/signin" replace />;
  }

  return children;
};

import Verify from "./Company/Register/Verify.jsx";

function App() {
  return (
    <div className="min-h-screen bg-white font-mulish"> {/* Mulish shriftini shu yerda bersangiz ham bo'ladi */}
      <ToastContainer position="top-right" autoClose={3000} />
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />

        <Route element={<Layout />}>
          {/* Ochiq sahifalar */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signup/telegram" element={<TelegramVerify />} />
          <Route path="/signup/verify" element={<Verify />} />
          <Route path="/forgot-password-1" element={<ForgotPassword1 />} />
          <Route path="/forgot-password-2" element={<ForgotPassword2 />} />
          <Route path="/forgot-password-3" element={<ForgotPassword3 />} />
          <Route path="/forgot-password-4" element={<ForgotPassword4 />} />

          {/* Barcha uchun ochiq bo'lishi mumkin bo'lgan sahifalar (ixtiyoriy) */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/talents" element={<Talents />} />

          {/* FAQAT LOGIN QILGANLAR UCHUN (HIMOYALANGAN) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-company"
            element={
              <ProtectedRoute>
                <div>My Company Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-jobs"
            element={
              <ProtectedRoute>
                <div>My Jobs</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <div>FAQ Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <div>Contacts Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div>Settings Page</div>
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
}

export default App;