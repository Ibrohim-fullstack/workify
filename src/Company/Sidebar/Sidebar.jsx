import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  MdDashboard,
  MdBusiness,
  MdWork,
  MdPeople,
  MdQuestionAnswer,
  MdContactPhone,
  MdLogout
} from 'react-icons/md';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', city: '', img: null });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Modal uchun state

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: userInfo.company_name || decoded.email || 'TechCells Corp.',
          city: userInfo.city || 'Tashkent',
          img: userInfo.profileimg_url
        });
      } catch (error) {
        console.error("Token xatosi:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/signin');
    window.location.reload();
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <MdDashboard size={22} /> },
    { name: 'Job matches', path: '/my-company', icon: <MdBusiness size={22} /> },
    { name: 'Job alerts', path: '/jobss', icon: <MdWork size={22} /> },
    { name: 'Settings', path: '/faq', icon: <MdQuestionAnswer size={22} /> },
    { name: 'Profile', path: '/contacts', icon: <MdContactPhone size={22} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white border-t border-gray-100 flex flex-row items-center justify-around px-2 z-[100] md:relative md:flex-col md:w-[300px] md:h-screen md:border-r md:border-t-0 md:py-8 md:px-6 md:justify-start">

      {/* LOGOUT MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <h3 className="text-[18px] font-bold text-[#163D5C] mb-2">Logout</h3>
            <p className="text-[#343C44] mb-6">Do you really want to logout?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-semibold hover:bg-white border-[2px] border-[#163D5C] hover:text-[#163D5C] bg-[#163D5C] text-white">
                No
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl font-semibold border-[2px] border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500">
                Yes, logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE SECTION */}
      <div className="hidden md:flex items-center gap-4 mb-10 px-2">
        <div className="w-12 h-12 rounded-xl bg-[#00A79D] flex items-center justify-center shrink-0 overflow-hidden">
          {user.img ? (
            <img src={user.img} alt="logo" className="w-full h-full object-cover" />
          ) : (
            <div className="text-white border-4 border-white/30 rounded-lg p-1">
              <MdBusiness size={24} />
            </div>
          )}
        </div>
        <div className="flex flex-col truncate">
          <h3 className="text-[#343C44] font-bold text-[17px] truncate leading-tight">{user.name}</h3>
          <p className="text-[#C2C2C2] text-[14px] font-medium">{user.city}</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-row md:flex-col gap-1 md:gap-2 flex-grow w-full justify-around md:justify-start">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col md:flex-row items-center gap-1 md:gap-4 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200
              ${isActive
                ? "text-[#8B5CF6] md:bg-[#163D5C] md:text-white"
                : "text-[#C2C2C2] hover:text-[#163D5C]"}
            `}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="text-[10px] md:text-[16px] font-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className="hidden md:flex mt-auto items-center gap-4 px-4 py-3 rounded-lg font-semibold text-[16px] text-red-400 hover:bg-red-50 transition-all duration-200"
      >
        <MdLogout size={22} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;