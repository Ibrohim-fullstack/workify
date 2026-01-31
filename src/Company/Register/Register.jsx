// import React, { useState, useEffect, useRef } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { BiSolidCity } from "react-icons/bi";
// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaGlobe,
//   FaSearch,
//   FaChevronDown,
// } from "react-icons/fa";
// import { PiFlagPennantFill } from "react-icons/pi";
// import PasswordInput from "../common/PasswordInput";
// import LoadingSpinner from "../common/LoadingSpinner";

// import {
//   companyApi,
//   COUNTRIES,
//   UZBEK_REGIONS,
//   INDUSTRIES,
// } from "../../services/api";

// const SignUpPage = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [userType, setUserType] = useState("company");

//   const [formData, setFormData] = useState({
//     company_name: "",
//     phone: "",
//     email: "",
//     password: "",
//     website: "",
//     industry: "",
//     country: "",
//     city: "",
//   });

//   const [passwordError, setPasswordError] = useState("");
//   const [countrySearch, setCountrySearch] = useState("");
//   const [citySearch, setCitySearch] = useState("");
//   const [industrySearch, setIndustrySearch] = useState("");
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);
//   const [showCityDropdown, setShowCityDropdown] = useState(false);
//   const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
//   const countryRef = useRef(null);
//   const cityRef = useRef(null);
//   const industryRef = useRef(null);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validatePassword = (pass) => {
//     if (!pass) return false;
//     if (pass.length < 6) {
//       setPasswordError("Min 6 characters!");
//       return false;
//     }
//     if (!/[A-Z]/.test(pass)) {
//       setPasswordError("Uppercase required!");
//       return false;
//     }
//     setPasswordError("");
//     return true;
//   };

//   const handleNext = async (e) => {
//     e.preventDefault();
//     if (!validatePassword(formData.password))
//       return toast.error(passwordError || "Password weak");

//     try {
//       setIsLoading(true);
//       await companyApi.registerCompany(formData);
//       toast.success("Details saved!");
//       navigate("/signup/telegram", {
//         state: { email: formData.email, companyName: formData.company_name },
//       });
//     } catch (err) {
//       toast.error(err.message || "Error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Click outside to close dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (countryRef.current && !countryRef.current.contains(event.target))
//         setShowCountryDropdown(false);
//       if (cityRef.current && !cityRef.current.contains(event.target))
//         setShowCityDropdown(false);
//       if (industryRef.current && !industryRef.current.contains(event.target))
//         setShowIndustryDropdown(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filtered lists
//   const filteredCountries = COUNTRIES.filter((c) =>
//     c.toLowerCase().includes(countrySearch.toLowerCase()),
//   );
//   const filteredCities = UZBEK_REGIONS.filter((c) =>
//     c.toLowerCase().includes(citySearch.toLowerCase()),
//   );
//   const filteredIndustries = INDUSTRIES.filter((i) =>
//     i.toLowerCase().includes(industrySearch.toLowerCase()),
//   );

  



//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <ToastContainer />
//       <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8">
//         {/* Toggle Talent/Company */}
//         <div className="flex bg-gray-100 p-1.5 rounded-xl mb-10 max-w-sm mx-auto">
//           <button
//             type="button"
//             onClick={() => setUserType("talent")}
//             className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${userType === "talent" ? "bg-white shadow-sm text-black" : "text-gray-400"}`}
//           >
//             Talent
//           </button>
//           <button
//             type="button"
//             onClick={() => setUserType("company")}
//             className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${userType === "company" ? "bg-white shadow-sm text-black" : "text-gray-400"}`}
//           >
//             Company
//           </button>
//         </div>

//         <form onSubmit={handleNext} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
//             {/* Company Name */}
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase ml-1">
//                 Company Name *
//               </label>
//               <div className="relative">
//                 <BiSolidCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
//                 <input
//                   name="company_name"
//                   required
//                   value={formData.company_name}
//                   onChange={handleChange}
//                   className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163D5C] outline-none transition-all"
//                   placeholder="Workify LLC"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase ml-1">
//                 Email *
//               </label>
//               <div className="relative">
//                 <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   name="email"
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163D5C] outline-none transition-all"
//                   placeholder="info@mail.com"
//                 />
//               </div>
//             </div>

//             {/* Password - FIXED INPUT */}
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase ml-1">
//                 Password *
//               </label>
//               <PasswordInput
//                 name="password"
//                 value={formData.password}
//                 onChange={(e) => {
//                   const val = e.target.value;
//                   setFormData((prev) => ({ ...prev, password: val }));
//                   validatePassword(val);
//                 }}
//                 error={passwordError}
//               />
//             </div>

//             {/* Phone */}
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase ml-1">
//                 Phone *
//               </label>
//               <div className="relative">
//                 <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   name="phone"
//                   required
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163D5C] outline-none transition-all"
//                   placeholder="+998 90 123 45 67"
//                 />
//               </div>
//             </div>

//             {/* Industry Dropdown */}
//             <div className="space-y-1 relative" ref={industryRef}>
//               <label className="text-xs font-bold text-gray-500 uppercase ml-1">
//                 Industry *
//               </label>
//               <div
//                 className="relative cursor-pointer"
//                 onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
//               >
//                 <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   readOnly
//                   value={formData.industry}
//                   className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg cursor-pointer outline-none"
//                   placeholder="Select Industry"
//                 />
//                 <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
//               </div>
//               {showIndustryDropdown && (
//                 <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-52 overflow-y-auto">
//                   <div className="p-2 sticky top-0 bg-white border-b">
//                     <input
//                       autoFocus
//                       placeholder="Search..."
//                       className="w-full p-2 text-sm border rounded outline-none"
//                       onChange={(e) => setIndustrySearch(e.target.value)}
//                     />
//                   </div>
//                   {filteredIndustries.map((item) => (
//                     <div
//                       key={item}
//                       onClick={() => {
//                         setFormData((p) => ({ ...p, industry: item }));
//                         setShowIndustryDropdown(false);
//                       }}
//                       className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer"
//                     >
//                       {item}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Website */}
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase ml-1">
//                 Website
//               </label>
//               <div className="relative">
//                 <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   name="website"
//                   value={formData.website}
//                   onChange={handleChange}
//                   className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163D5C] outline-none"
//                   placeholder="https://example.com"
//                 />
//               </div>
//             </div>

//             {/* Country Dropdown */}
//             <div className="space-y-1 relative" ref={countryRef}>
//               <label className="text-xs font-bold text-gray-500 uppercase ml-1">
//                 Country *
//               </label>
//               <div
//                 className="relative cursor-pointer"
//                 onClick={() => setShowCountryDropdown(!showCountryDropdown)}
//               >
//                 <PiFlagPennantFill className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
//                 <input
//                   readOnly
//                   value={formData.country}
//                   className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg cursor-pointer outline-none"
//                   placeholder="Select Country"
//                 />
//                 <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
//               </div>
//               {showCountryDropdown && (
//                 <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-52 overflow-y-auto">
//                   <div className="p-2 sticky top-0 bg-white border-b">
//                     <input
//                       autoFocus
//                       placeholder="Search..."
//                       className="w-full p-2 text-sm border rounded outline-none"
//                       onChange={(e) => setCountrySearch(e.target.value)}
//                     />
//                   </div>
//                   {filteredCountries.map((c) => (
//                     <div
//                       key={c}
//                       onClick={() => {
//                         setFormData((p) => ({ ...p, country: c, city: "" }));
//                         setShowCountryDropdown(false);
//                       }}
//                       className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer"
//                     >
//                       {c}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* City/Region Dropdown */}
//             <div className="space-y-1 relative" ref={cityRef}>
//               <label className="text-xs font-bold text-gray-500 uppercase ml-1">
//                 City/Region *
//               </label>
//               <div
//                 className="relative cursor-pointer"
//                 onClick={() =>
//                   formData.country === "Uzbekistan" &&
//                   setShowCityDropdown(!showCityDropdown)
//                 }
//               >
//                 <BiSolidCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   readOnly
//                   value={formData.city}
//                   className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg outline-none ${formData.country === "Uzbekistan" ? "cursor-pointer" : "bg-gray-50 text-gray-400"}`}
//                   placeholder={
//                     formData.country === "Uzbekistan"
//                       ? "Select City"
//                       : "Select Country first"
//                   }
//                 />
//                 {formData.country === "Uzbekistan" && (
//                   <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
//                 )}
//               </div>
//               {showCityDropdown && formData.country === "Uzbekistan" && (
//                 <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-52 overflow-y-auto">
//                   {filteredCities.map((city) => (
//                     <div
//                       key={city}
//                       onClick={() => {
//                         setFormData((p) => ({ ...p, city: city }));
//                         setShowCityDropdown(false);
//                       }}
//                       className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer"
//                     >
//                       {city}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="px-8 py-3 text-gray-400 font-medium hover:text-gray-600 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="px-12 py-3 bg-[#163D5C] text-white rounded-xl font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all min-w-[160px]"
//             >
//               {isLoading ? <LoadingSpinner /> : "Next"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;



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
  const [citySearch, setCitySearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const countryRef = useRef(null);
  const cityRef = useRef(null);
  const industryRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const filteredCities = UZBEK_REGIONS.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );
  const filteredIndustries = INDUSTRIES.filter((i) =>
    i.toLowerCase().includes(industrySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <ToastContainer />
      {/* max-w-lg iPad uchun, lg:max-w-4xl desktop uchun */}
      <div className="w-full max-w-lg lg:max-w-4xl bg-white rounded-3xl shadow-2xl p-6 md:p-10">
        
        {/* Toggle Talent/Company */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setUserType("talent")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${userType === "talent" ? "bg-white shadow-sm text-black" : "text-gray-400"}`}
          >
            Talent
          </button>
          <button
            type="button"
            onClick={() => setUserType("company")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${userType === "company" ? "bg-white shadow-sm text-black" : "text-gray-400"}`}
          >
            Company
          </button>
        </div>

        <form onSubmit={handleNext} className="space-y-5 lg:space-y-6">
          {/* O'ZGARISH: lg breakpointigacha grid-cols-1 (bir qator) bo'ladi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 text-left">
            
            {/* Company Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                Company Name *
              </label>
              <div className="relative">
                <BiSolidCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  name="company_name"
                  required
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163D5C] outline-none transition-all text-sm md:text-base"
                  placeholder="Workify LLC"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                Email *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163D5C] outline-none transition-all text-sm md:text-base"
                  placeholder="info@mail.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                Password *
              </label>
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

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                Phone *
              </label>
              <div className="relative">
                <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163D5C] outline-none transition-all text-sm md:text-base"
                  placeholder="+998 90 123 45 67"
                />
              </div>
            </div>

            {/* Industry Dropdown */}
            <div className="space-y-1 relative" ref={industryRef}>
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                Industry *
              </label>
              <div
                className="relative cursor-pointer"
                onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
              >
                <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  readOnly
                  value={formData.industry}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg cursor-pointer outline-none text-sm md:text-base"
                  placeholder="Select Industry"
                />
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
              </div>
              {showIndustryDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-52 overflow-y-auto">
                  <div className="p-2 sticky top-0 bg-white border-b">
                    <input
                      autoFocus
                      placeholder="Search..."
                      className="w-full p-2 text-sm border rounded outline-none"
                      onChange={(e) => setIndustrySearch(e.target.value)}
                    />
                  </div>
                  {filteredIndustries.map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setFormData((p) => ({ ...p, industry: item }));
                        setShowIndustryDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Website */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                Website
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163D5C] outline-none text-sm md:text-base"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Country Dropdown */}
            <div className="space-y-1 relative" ref={countryRef}>
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                Country *
              </label>
              <div
                className="relative cursor-pointer"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              >
                <PiFlagPennantFill className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  readOnly
                  value={formData.country}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg cursor-pointer outline-none text-sm md:text-base"
                  placeholder="Select Country"
                />
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
              </div>
              {showCountryDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-52 overflow-y-auto">
                  <div className="p-2 sticky top-0 bg-white border-b">
                    <input
                      autoFocus
                      placeholder="Search..."
                      className="w-full p-2 text-sm border rounded outline-none"
                      onChange={(e) => setCountrySearch(e.target.value)}
                    />
                  </div>
                  {filteredCountries.map((c) => (
                    <div
                      key={c}
                      onClick={() => {
                        setFormData((p) => ({ ...p, country: c, city: "" }));
                        setShowCountryDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* City/Region Dropdown */}
            <div className="space-y-1 relative" ref={cityRef}>
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                City/Region *
              </label>
              <div
                className="relative cursor-pointer"
                onClick={() =>
                  formData.country === "Uzbekistan" &&
                  setShowCityDropdown(!showCityDropdown)
                }
              >
                <BiSolidCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  readOnly
                  value={formData.city}
                  className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg outline-none text-sm md:text-base ${formData.country === "Uzbekistan" ? "cursor-pointer" : "bg-gray-50 text-gray-400"}`}
                  placeholder={
                    formData.country === "Uzbekistan"
                      ? "Select City"
                      : "Select Country first"
                  }
                />
                {formData.country === "Uzbekistan" && (
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                )}
              </div>
              {showCityDropdown && formData.country === "Uzbekistan" && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-52 overflow-y-auto">
                  {filteredCities.map((city) => (
                    <div
                      key={city}
                      onClick={() => {
                        setFormData((p) => ({ ...p, city: city }));
                        setShowCityDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: iPad da ustma-ust, Desktopda yonma-yon */}
          <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-6 lg:pt-8 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 text-gray-400 font-medium hover:text-gray-600 order-2 md:order-1 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-12 py-3 bg-[#163D5C] text-white rounded-xl font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all min-w-[160px] order-1 md:order-2"
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