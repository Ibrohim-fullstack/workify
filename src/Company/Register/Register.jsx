import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BiSolidCity } from "react-icons/bi";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaSearch,
  FaChevronDown,
  FaLock,
} from "react-icons/fa";
import { PiFlagPennantFill } from "react-icons/pi";
import PasswordInput from "../common/PasswordInput";
import LoadingSpinner from "../common/LoadingSpinner";

import {
  companyApi,
  COUNTRIES,
  UZBEK_REGIONS,
  INDUSTRIES,
} from "../../services/api";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("company");

  const [formData, setFormData] = useState({
    company_name: "",
    phone: "",
    email: "",
    password: "",
    website: "",
    industry: "",
    country: "",
    city: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  const countryRef = useRef(null);
  const cityRef = useRef(null);
  const industryRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Faqat raqamlarni ajratib olamiz
      const digits = value.replace(/\D/g, "");

      // Agar foydalanuvchi hamma narsani o'chirib tashlasa
      if (digits.length === 0) {
        setFormData((prev) => ({ ...prev, [name]: "" }));
        return;
      }

      // Formatlash mantiqi: +998 (XX) XXX-XX-XX
      let formatted = "+998 ";

      // Kod qismi (masalan: 99, 90, 33)
      // Biz foydalanuvchi 998 bilan boshlasa ham, boshlamasa ham to'g'ri ishlashini ta'minlaymiz
      let mainDigits = digits.startsWith("998") ? digits.slice(3) : digits;

      if (mainDigits.length > 0) {
        formatted += "(" + mainDigits.substring(0, 2);
      }
      if (mainDigits.length >= 2) {
        formatted += ") " + mainDigits.substring(2, 5);
      }
      if (mainDigits.length >= 5) {
        formatted += "-" + mainDigits.substring(5, 7);
      }
      if (mainDigits.length >= 7) {
        formatted += "-" + mainDigits.substring(7, 9);
      }

      setFormData((prev) => ({ ...prev, [name]: formatted.trim() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validatePassword = (pass) => {
    if (!pass) return false;
    if (pass.length < 6) {
      setPasswordError("Min 6 characters!");
      return false;
    }
    if (!/[A-Z]/.test(pass)) {
      setPasswordError("Uppercase required!");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validatePassword(formData.password))
      return toast.error(passwordError || "Password weak");

    try {
      setIsLoading(true);
      await companyApi.registerCompany(formData);
      toast.success("Details saved!");
      navigate("/signup/telegram", {
        state: { email: formData.email, companyName: formData.company_name },
      });
    } catch (err) {
      toast.error(err.message || "Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target))
        setShowCountryDropdown(false);
      if (cityRef.current && !cityRef.current.contains(event.target))
        setShowCityDropdown(false);
      if (industryRef.current && !industryRef.current.contains(event.target))
        setShowIndustryDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  );
  const filteredCities = UZBEK_REGIONS;
  const filteredIndustries = INDUSTRIES.filter((i) =>
    i.toLowerCase().includes(industrySearch.toLowerCase()),
  );

  // Stil o'zgaruvchilari
  const inputStyle =
    "w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#163D5C] outline-none transition-all text-gray-700 bg-white";
  const iconStyle =
    " w-[30px] absolute left-4 top-1/2 -translate-y-1/2 text-[#163D5C] text-lg pr-2 border-r border-gray-100";
  const labelStyle = "text-xl font-medium text-gray-600 mb-2 block";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-6xl bg-white rounded-[40px] shadow-2xl p-8 md:p-16 text-left">
        {/* Toggle Talent/Company - Saqlab qolindi */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-12 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setUserType("talent")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${userType === "talent" ? "bg-white shadow-md text-black" : "text-gray-400"}`}
          >
            Talent
          </button>
          <button
            type="button"
            onClick={() => setUserType("company")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${userType === "company" ? "bg-white shadow-md text-black" : "text-gray-400"}`}
          >
            Company
          </button>
        </div>

        <form onSubmit={handleNext} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            {/* CHAP USTUN */}
            <div className="space-y-8">
              <div>
                <label className={labelStyle}>Company name</label>
                <div className="relative">
                  <BiSolidCity className={iconStyle} />
                  <input
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="TechCells"
                  />
                </div>
              </div>

              <div>
                <label className={labelStyle}>Email</label>
                <div className="relative">
                  <FaEnvelope className={iconStyle} />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="TechCells@mail.ru"
                  />
                </div>
              </div>

              <div>
                <label className={labelStyle}>Website</label>
                <div className="relative">
                  <FaGlobe className={iconStyle} />
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="www.TechCells.com"
                  />
                </div>
              </div>

              <div className="relative" ref={countryRef}>
                <label className={labelStyle}>Country</label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  <PiFlagPennantFill className={iconStyle} />
                  <input
                    readOnly
                    value={formData.country}
                    className={`${inputStyle} cursor-pointer`}
                    placeholder="Uzbekistan"
                  />
                </div>
                {showCountryDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                    {filteredCountries.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          setFormData((p) => ({ ...p, country: c, city: "" }));
                          setShowCountryDropdown(false);
                        }}
                        className="px-5 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* O'NG USTUN */}
            <div className="space-y-8">
              <div>
                <label className={labelStyle}>Phone</label>
                <div className="relative">
                  <FaPhoneAlt className={iconStyle} />
                  <input
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="+998 (99) 123-45-67" // Placeholder yangilandi
                    maxLength={19} // Maksimal uzunlikni cheklaymiz
                  />
                </div>
              </div>

              <div>
                <label className={labelStyle}>Password</label>
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({ ...prev, password: val }));
                    validatePassword(val);
                  }}
                  error={passwordError}
                />
              </div>

              <div className="relative" ref={industryRef}>
                <label className={labelStyle}>Industry</label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                >
                  <BiSolidCity className={iconStyle} />
                  <input
                    readOnly
                    value={formData.industry}
                    className={`${inputStyle} cursor-pointer`}
                    placeholder="Computer Software Company"
                  />
                  <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                </div>
                {showIndustryDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                    {filteredIndustries.map((i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setFormData((p) => ({ ...p, industry: i }));
                          setShowIndustryDropdown(false);
                        }}
                        className="px-5 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={cityRef}>
                <label className={labelStyle}>City</label>
                <div
                  className="relative cursor-pointer"
                  onClick={() =>
                    formData.country === "Uzbekistan" &&
                    setShowCityDropdown(!showCityDropdown)
                  }
                >
                  <BiSolidCity className={iconStyle} />
                  <input
                    readOnly
                    value={formData.city}
                    className={`${inputStyle} ${formData.country === "Uzbekistan" ? "cursor-pointer" : "bg-gray-50"}`}
                    placeholder="Tashkent"
                  />
                </div>
                {showCityDropdown && formData.country === "Uzbekistan" && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <div
                        key={city}
                        onClick={() => {
                          setFormData((p) => ({ ...p, city: city }));
                          setShowCityDropdown(false);
                        }}
                        className="px-5 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* NEXT VA BACK TUGMALARI - O'RTADA */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-12">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full md:w-72 py-4 border-2 border-[#163D5C] text-[#163D5C] rounded-full font-bold text-xl hover:bg-blue-50 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-72 py-4 bg-[#163D5C] text-white rounded-full font-bold text-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isLoading ? <LoadingSpinner /> : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
