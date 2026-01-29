import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";

const Layout = () => {
  const location = useLocation();

  // Dashboard qismiga kiruvchi barcha yo'llar ro'yxati
  const dashboardPaths = [
    "/dashboard", 
    "/my-company", 
    "/faq", 
    "/contacts", 
    "/my-jobs"
  ];

  // Hozirgi yo'l dashboard'ga tegishlimi yoki yo'qmi tekshiramiz
  const isDashboard = dashboardPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {isDashboard ? (
        /* --- DASHBOARD REJIMI (Faqat Sidebar) --- */
        <div className="flex h-screen overflow-hidden">
          <aside className="w-[280px] h-full shrink-0 border-r border-gray-100 bg-white z-50">
            <Sidebar />
          </aside>
          <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <Outlet />
          </main>
        </div>
      ) : (
        /* --- ODDIY REJIM (Header + Content + Footer) --- */
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Layout;