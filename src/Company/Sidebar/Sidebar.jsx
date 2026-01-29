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

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        // JWT dan yoki user_info dan ma'lumotlarni yig'amiz
        setUser({
          name: userInfo.company_name || decoded.email || 'TechCells Corp.',
          city: userInfo.city || 'Tashkent',
          img: userInfo.profileimg_url // null bo'lsa placeholder chiqadi
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
    { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard size={22} /> },
    { name: 'My company', path: '/my-company', icon: <MdBusiness size={22} /> },
    { name: 'My jobs', path: '/jobss', icon: <MdWork size={22} /> },
    { name: 'Talents', path: '/talentss', icon: <MdPeople size={22} /> },
    { name: 'FAQ', path: '/faq', icon: <MdQuestionAnswer size={22} /> },
    { name: 'Contacts', path: '/contacts', icon: <MdContactPhone size={22} /> },
  ];

  return (
    <div className="w-[300px] h-screen bg-white border-r border-gray-100 flex flex-col py-8 px-6">
      
      {/* PROFILE SECTION */}
      <div className="flex items-center gap-4 mb-10 px-2">
        <div className="w-12 h-12 rounded-xl bg-[#00A79D] flex items-center justify-center shrink-0 overflow-hidden">
          {user.img ? (
            <img src={user.img} alt="logo" className="w-full h-full object-cover" />
          ) : (
            /* Rasmdagi logoga o'xshash placeholder */
            <div className="text-white border-4 border-white/30 rounded-lg p-1">
               <MdBusiness size={24} />
            </div>
          )}
        </div>
        <div className="flex flex-col truncate">
          <h3 className="text-[#343C44] font-bold text-[17px] truncate leading-tight">
            {user.name}
          </h3>
          <p className="text-[#C2C2C2] text-[14px] font-medium">
            {user.city}
          </p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-lg font-semibold text-[16px] transition-all duration-200
              ${isActive 
                ? "bg-[#163D5C] text-white shadow-lg shadow-blue-900/20" 
                : "text-[#C2C2C2] hover:bg-gray-50 hover:text-[#163D5C]"}
            `}
          >
            <span className="shrink-0">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT BUTTON */}
      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-4 px-4 py-3 rounded-lg font-semibold text-[16px] text-red-400 hover:bg-red-50 transition-all duration-200 cursor-pointer"
      >
        <MdLogout size={22} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;