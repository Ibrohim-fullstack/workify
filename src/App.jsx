import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toaster } from "react-hot-toast";
import 'react-toastify/dist/ReactToastify.css';

import Layout from "./Company/Layout/LoyoUt.jsx";
import Talents from "./Company/Talent/Talent.jsx";
import Jobs from "./Company/Jobs/Jobs.jsx";
import Home from "./Company/Home/Home.jsx";
import SignUpPage from "./Company/Register/Register.jsx";
import SignIn from "./Company/Login/Login.jsx";
import ForgotPassword1 from './Company/ForgotPassword1/ForgotPassword1.jsx';
import ForgotPassword2 from './Company/ForgotPassword2/ForgotPassword2.jsx';
import ForgotPassword3 from './Company/ForgotPassword3/ForgotPassword3.jsx';
import ForgotPassword4 from './Company/ForgotPassword4/ForgotPassword4.jsx';
import Dashboard from './Company/Dashboard/Dashboard.jsx';
import MainLoyout from './Company/Layout/MainLoyout.jsx';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />

        {/* <Route element={<MainLoyout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-company" element={<div>My Company Page</div>} />
        <Route path="/faq" element={<div>FAQ Page</div>} />
        <Route path="/contacts" element={<div>Contacts Page</div>} />
        </Route> */}


        <Route element={<Layout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password-1" element={<ForgotPassword1 />} />
          <Route path="/forgot-password-2" element={<ForgotPassword2 />} />
          <Route path="/forgot-password-3" element={<ForgotPassword3 />} />
          <Route path="/forgot-password-4" element={<ForgotPassword4 />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/talents" element={<Talents />} />

          <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-company" element={<div>My Company Page</div>} />
        <Route path="/faq" element={<div>FAQ Page</div>} />
        <Route path="/contacts" element={<div>Contacts Page</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
}

export default App;