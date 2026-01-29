import { Link } from "react-router-dom";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaFacebook, FaYoutube, FaTelegram } from "react-icons/fa";

function Footer() {
    return (
        <footer className="w-full min-h-[497px] flex items-center justify-center bg-[#163D5C] py-8">
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
                {/* TOP */}
                <div className="w-full h-auto md:h-[252px] flex flex-col md:flex-row justify-between gap-8 md:gap-6 mb-8 md:mb-0">
                    {/* BRAND */}
                    <div className="w-full md:w-[250px] h-auto md:h-[175px] flex flex-col justify-between gap-4 md:gap-0">
                        <div>
                            <p className="text-white text-[28px] md:text-[35px] font-bold">workify</p>
                            <p className="text-white text-[16px] md:text-[20px] mt-1 md:mt-2">Job posting platform</p>
                        </div>

                        <button className="
                            w-full md:w-[211px] h-[45px] md:h-[50px] bg-white text-[#163D5C] font-bold text-[16px] md:text-[20px] rounded-[8px] 
                            hover:bg-[#163D5C] hover:text-white hover:border hover:border-white 
                            transition-all duration-300 cursor-pointer mt-4 md:mt-0">
                            Contacts
                        </button>
                    </div>

                    {/* GENERAL */}
                    <div className="flex flex-col gap-3 md:gap-[20px]">
                        <p className="text-white font-semibold text-[18px] md:text-[20px]">General</p>
                        <div className="flex flex-col gap-2 md:gap-[10px]">
                            <Link to="/signup" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">Sign Up</Link>
                            <Link to="/contacts" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">Contacts</Link>
                            <Link to="/about" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">About</Link>
                            <Link to="/faq" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">FAQ</Link>
                            <Link to="/partners" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">Partners</Link>
                        </div>
                    </div>

                    {/* COMPANY */}
                    <div className="flex flex-col gap-3 md:gap-[20px]">
                        <p className="text-white font-semibold text-[18px] md:text-[20px]">Company</p>
                        <div className="flex flex-col gap-2 md:gap-[10px]">
                            <Link to="/post-job" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">Post a job</Link>
                            <Link to="/talents" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">Search talents</Link>
                            <Link to="/company-login" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">Company login</Link>
                            <Link to="/company-advice" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">Company advice</Link>
                        </div>
                    </div>

                    {/* TALENTS */}
                    <div className="flex flex-col gap-3 md:gap-[20px]">
                        <p className="text-white font-semibold text-[18px] md:text-[20px]">Talents</p>
                        <div className="flex flex-col gap-2 md:gap-[10px]">
                            <Link to="/jobs" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">Search jobs</Link>
                            <Link to="/talent-login" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">Talent login</Link>
                            <Link to="/talent-advice" className="text-white hover:text-slate-400 transition-colors duration-300 text-[14px] font-medium">Talent advice</Link>
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="w-full h-auto md:h-[105px] flex flex-col gap-4 md:gap-[15px] mt-8 md:mt-0">
                    <hr className="border-[#D2A9FF]" />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                        <p className="text-[#E1E6F0] text-[16px] md:text-[20px] font-[300] text-center md:text-left">
                            All rights reserved 2021
                        </p>

                        <div className="flex gap-4 md:gap-[20px] text-white text-[20px] md:text-[24px]">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                className="hover:text-slate-300 transition-transform hover:-translate-y-1">
                                <BiLogoInstagramAlt />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                className="hover:text-slate-300 transition-transform hover:-translate-y-1">
                                <FaFacebook />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                                className="hover:text-slate-300 transition-transform hover:-translate-y-1">
                                <FaYoutube />
                            </a>
                            <a href="https://t.me" target="_blank" rel="noopener noreferrer"
                                className="hover:text-slate-300 transition-transform hover:-translate-y-1">
                                <FaTelegram />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;