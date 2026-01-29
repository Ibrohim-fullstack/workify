import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { IoWalletOutline, } from "react-icons/io5";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { IoMdArrowDropdown, IoMdLogOut, IoMdPerson } from "react-icons/io";
import { MdDashboard } from "react-icons/md";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('Eng');
  const [showLang, setShowLang] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false); // User menyusi uchun
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const userInfo = localStorage.getItem("user_info") || sessionStorage.getItem("user_info");
    
    if (token && userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/home");
    window.location.reload(); 
  };

  return (
    <header className="w-full h-[90px] flex items-center justify-center bg-white shadow-sm sticky top-0 z-50">
      <div className="w-[90%] max-w-[1300px] flex items-center justify-between h-full relative">

        {/* LOGO */}
        <Link to="/" className="text-[#343C44] font-semibold text-[32px] font-['Mulish'] tracking-tight shrink-0">
          workify
        </Link>
    
        {/* NAV (CENTER) */}
        <nav className="hidden lg:flex items-center gap-x-8">
          <NavLink to="/talents" className={({ isActive }) => `flex items-center gap-2 font-semibold text-[19px] font-['Mulish'] transition-all duration-300 hover:-translate-y-0.5 ${isActive ? "text-[#163D5C]" : "text-[#C2C2C2]"} hover:text-[#163D5C]`}>
            <CiUser className="text-[24px]" />
            Talents
          </NavLink>

          <NavLink to="/jobs" className={({ isActive }) => `flex items-center gap-2 font-semibold text-[19px] font-['Mulish'] transition-all duration-300 hover:-translate-y-0.5 ${isActive ? "text-[#163D5C]" : "text-[#C2C2C2]"} hover:text-[#163D5C]`}>
            <IoWalletOutline className="text-[24px]" />
            Jobs
          </NavLink>
        </nav>

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-4">
            
            {user ? (
              <div className="flex items-center gap-4">
                {/* 1. DASHBOARD TUGMASI */}
                <Link to="/dashboard">
                  <button className="flex items-center gap-2 px-5 h-[52px] bg-[#163D5C] text-white rounded-xl font-bold text-[16px] transition-all hover:bg-[#1c4d74] active:scale-95 shadow-md">
                    <MdDashboard size={20} />
                    Dashboard
                  </button>
                </Link>

                {/* 2. USER PROFILE DROPDOWN */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 h-[52px] bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#343C44] hover:bg-white transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#163D5C] text-white flex items-center justify-center text-[14px]">
                      {user.company_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">{user.company_name}</span>
                    <IoMdArrowDropdown className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute top-[60px] right-0 w-[200px] bg-white shadow-2xl rounded-2xl py-3 border border-gray-100 z-[110]">
                      <Link 
                        to="/my-company" 
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-[#343C44] font-semibold"
                      >
                        <IoMdPerson size={20} className="text-[#163D5C]" />
                        My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 font-semibold transition-colors"
                      >
                        <IoMdLogOut size={20} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/signin">
                  <button className="w-[155px] h-[52px] border-2 border-[#163D5C] rounded-xl font-bold text-[18px] text-[#163D5C] bg-white transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer">
                    Sign in
                  </button>
                </Link>

                <Link to="/signup">
                  <button className="w-[155px] h-[52px] bg-[#163D5C] border-2 border-[#163D5C] rounded-xl font-bold text-[18px] text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 cursor-pointer">
                    Join Now
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* TIL DROPDOWN */}
          <div className="relative">
            <button onClick={() => setShowLang(!showLang)} className="flex items-center gap-1 font-bold text-[17px] text-[#343C44] cursor-pointer">
              {lang} <IoMdArrowDropdown className={`text-xl transition-transform ${showLang ? 'rotate-180' : ''}`} />
            </button>
            {showLang && (
              <div className="absolute top-[45px] right-0 w-[100px] bg-white shadow-xl rounded-lg py-2 z-[100]">
                {['Eng', 'Uzb', 'Rus'].map((item) => (
                  <button key={item} onClick={() => handleLangChange(item)} className="w-full text-left px-4 py-2 hover:bg-gray-50 font-semibold text-[15px]">
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE BURGER */}
        <button className="lg:hidden text-[35px] text-[#163D5C] z-[60]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>
    </header>
  );
}

export default Header;