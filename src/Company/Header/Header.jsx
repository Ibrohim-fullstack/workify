import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { IoWalletOutline } from "react-icons/io5";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { IoMdArrowDropdown, IoMdLogOut, IoMdPerson } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { GoChevronDown } from "react-icons/go";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('Eng');
  const [showLang, setShowLang] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Modal state
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
    setIsOpen(false);
    setIsLogoutModalOpen(false); // Modalni yopish
    navigate("/home");
    window.location.reload();
  };

  const handleLangChange = (val) => {
    setLang(val);
    setShowLang(false);
  };

  return (
    <>
      <header className="w-full h-[70px] lg:h-[90px] flex items-center justify-center bg-white shadow-sm sticky top-0 z-50 px-4 md:px-0">
        <div className="w-full md:w-[90%] max-w-[1300px] flex items-center justify-between h-full relative">
          {/* LOGO */}
          <Link to="/" className="text-[#343C44] font-semibold text-[26px] lg:text-[32px] font-['Mulish'] tracking-tight shrink-0">
            workify
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-x-8">
            <NavLink to="/talents" className={({ isActive }) => `flex items-center gap-2 font-semibold text-[18px] transition-all duration-300 hover:-translate-y-0.5 ${isActive ? "text-[#163D5C]" : "text-[#C2C2C2]"} hover:text-[#163D5C]`}>
              <CiUser className="text-[22px]" />
              Talents
            </NavLink>
            <NavLink to="/jobs" className={({ isActive }) => `flex items-center gap-2 font-semibold text-[18px] transition-all duration-300 hover:-translate-y-0.5 ${isActive ? "text-[#163D5C]" : "text-[#C2C2C2]"} hover:text-[#163D5C]`}>
              <IoWalletOutline className="text-[22px]" />
              Jobs
            </NavLink>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 lg:gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="hidden sm:block">
                  <button className="flex items-center gap-2 px-5 h-[48px] bg-[#163D5C] text-white rounded-xl font-bold text-[15px] transition-all hover:shadow-lg active:scale-95">
                    <MdDashboard size={18} />
                    Dashboard
                  </button>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 h-[48px] bg-gray-50 border border-gray-100 rounded-xl font-bold text-[#343C44] hover:bg-white transition-all">
                    <div className="w-8 h-8 rounded-full bg-[#163D5C] text-white flex items-center justify-center text-[12px]">
                      {user.company_name?.charAt(0).toUpperCase()}
                    </div>
                    <IoMdArrowDropdown className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-[55px] right-0 w-[200px] bg-white shadow-2xl rounded-2xl py-2 border border-gray-100 animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-[12px] text-gray-400">Company</p>
                        <p className="text-[14px] font-bold truncate">{user.company_name}</p>
                      </div>
                      <Link to="/my-company" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-[#343C44] font-semibold">
                        <IoMdPerson size={18} className="text-[#163D5C]" /> My Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setIsLogoutModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-500 font-semibold transition-colors">
                        <IoMdLogOut size={18} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <Link to="/signin" className="hidden sm:flex px-2 md:px-4 py-2 md:text-[18px] items-center justify-center bg-white border-[2px] border-[#163D5C] rounded-xl font-bold text-[#163D5C] hover:text-white hover:bg-[#163D5C]">
                  Sign in
                </Link>
                <Link to="/signup" className="sm:flex px-2 md:px-4 py-2 md:text-[18px] items-center justify-center bg-[#163D5C] border-[2px] border-[#163D5C] rounded-xl font-bold text-white hover:text-[#163D5C] hover:bg-white">
                  Join Now
                </Link>
              </div>
            )}

            {/* LANG DESKTOP */}
            <div className="hidden lg:block relative ml-2">
              <button
                onClick={() => setShowLang(!showLang)}
                className="flex items-center gap-1 font-bold text-[#343C44] group"
              >
                {lang}
                <GoChevronDown className={`text-xl text-[#163D5C] mt-1.5 transition-transform duration-300 ${showLang ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              <div className={`absolute top-[40px] right-0 w-[100px] bg-white shadow-xl rounded-xl py-2 border border-gray-100 transition-all duration-300 ease-in-out origin-top ${showLang ? 'opacity-100 translate-y-0 visible scale-100' : 'opacity-0 -translate-y-2 invisible scale-95'}`}>
                {['Eng', 'Uzb', 'Rus'].map((item) => (
                  <button key={item} onClick={() => handleLangChange(item)} className="w-full text-left px-4 py-2 hover:bg-gray-50 font-semibold text-[14px] transition-colors">
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* MOBILE BURGER */}
            <button className="lg:hidden text-[32px] text-[#163D5C] p-1" onClick={() => setIsOpen(true)}>
              <HiMenuAlt3 />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU (SIDEBAR) */}
      <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 flex items-center justify-between border-b">
            <span className="text-xl font-bold text-[#343C44]">Menu</span>
            <button onClick={() => setIsOpen(false)} className="text-3xl text-gray-400"><HiX /></button>
          </div>
          <div className="p-6 flex flex-col gap-6 overflow-y-auto">
            {user && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-2">
                <div className="w-12 h-12 rounded-full bg-[#163D5C] text-white flex items-center justify-center text-lg font-bold">
                  {user.company_name?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold truncate text-[#343C44]">{user.company_name}</p>
                  <p className="text-xs text-gray-500">Welcome back!</p>
                </div>
              </div>
            )}
            <nav className="flex flex-col gap-4">
              <NavLink to="/talents" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-gray-600 p-2 hover:bg-gray-50 rounded-lg">
                <CiUser size={24} /> Talents
              </NavLink>
              <NavLink to="/jobs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-gray-600 p-2 hover:bg-gray-50 rounded-lg">
                <IoWalletOutline size={24} /> Jobs
              </NavLink>
              {user && (
                <>
                  <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-gray-600 p-2 hover:bg-gray-50 rounded-lg">
                    <MdDashboard size={24} /> Dashboard
                  </NavLink>
                  <NavLink to="/my-company" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-gray-600 p-2 hover:bg-gray-50 rounded-lg">
                    <IoMdPerson size={24} /> My Profile
                  </NavLink>
                </>
              )}
            </nav>
            <hr className="border-gray-100" />
            <div className="flex flex-col gap-3">
              {!user ? (
                <>
                  <Link to="/signin" onClick={() => setIsOpen(false)} className="w-full h-[50px] flex items-center justify-center border-2 border-[#163D5C] rounded-xl font-bold text-[#163D5C]">
                    Sign in
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full h-[50px] flex items-center justify-center bg-[#163D5C] rounded-xl font-bold text-white">
                    Join Now
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full h-[50px] flex items-center justify-center gap-2 bg-red-50 text-red-500 rounded-xl font-bold">
                  <IoMdLogOut size={20} /> Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200] px-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <h3 className="text-[20px] font-bold text-[#163D5C] mb-3">Logout</h3>
            <p className="text-[#343C44] mb-8 text-[15px]">Do you really want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 rounded-2xl font-bold border-2 border-[#163D5C] bg-[#163D5C] text-white hover:bg-white hover:text-[#163D5C] transition-all"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-2xl font-bold border-2 border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 transition-all"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;