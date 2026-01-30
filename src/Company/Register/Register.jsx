import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import img1 from "../../assets/img1.svg";

import { BiSolidCity } from "react-icons/bi";
import { FaPhoneAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { PiFlagPennantFill } from "react-icons/pi";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { AiFillLock } from "react-icons/ai";

import axios from "axios";

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("company");
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [companyData, setCompanyData] = useState({
    company_name: "",
    phone: "",
    email: "",
    password: "",
    website: "",
    industry: "",
    country: "",
    city: "",
  });

  const countries = [
    "Uzbekistan",
    "USA",
    "United Kingdom",
    "Canada",
    "Germany",
    "France",
    "Russia",
    "China",
    "India",
    "Turkey",
    "Kazakhstan",
  ];

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Transportation",
    "Hospitality",
    "Other",
  ];

  const handleChange = (e) =>
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // 1-STEP: Registration
  const handleStep1Submit = async (e) => {
    e.preventDefault();

    if (userType === "company") {
      const { company_name, email, password } = companyData;
      if (!company_name || !email || !password) {
        toast.error("Please fill all required fields", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      try {
        setIsLoading(true);

        await axios.post(
          "https://workifybackend-production.up.railway.app/api/company/register",
          companyData,
          { headers: { "Content-Type": "application/json" } },
        );

        toast.success(
          "Company registered successfully! Now go to Telegram bot.",
          {
            position: "top-right",
            autoClose: 3000,
          },
        );
        setStep(2);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again.";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.info("Talent registration functionality will be implemented soon", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // 2-STEP: Telegram botga o'tish
  const handleStep2Submit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  // 3-STEP: Verification
  const handleStep3Submit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);

      let response;

      try {
        response = await axios.post(
          "https://workifybackend-production.up.railway.app/api/company/check-verify-code",
          {
            email: companyData.email,
            verify_code: verificationCode,
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
          },
        );
      } catch (err1) {
        try {
          response = await axios.post(
            "https://workifybackend-production.up.railway.app/api/company/check-verify-code",
            {
              email: companyData.email,
              code: verificationCode,
            },
            {
              headers: { "Content-Type": "application/json" },
              timeout: 10000,
            },
          );
        } catch (err2) {
          try {
            response = await axios.post(
              "https://workifybackend-production.up.railway.app/api/company/check-verify-code",
              {
                verificationCode: verificationCode,
              },
              {
                headers: { "Content-Type": "application/json" },
                timeout: 10000,
              },
            );
          } catch (err3) {
            throw err1;
          }
        }
      }

      if (
        response &&
        (response.data.message === "Company verified successfully" ||
          response.data.success === true ||
          response.status === 200)
      ) {
        toast.success("Verification successful! Redirecting to homepage...", {
          position: "top-right",
          autoClose: 2000,
        });

        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("companyEmail", companyData.email);
          localStorage.setItem("companyName", companyData.company_name);
        }

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        toast.error("Verification failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Verification failed. Please try again.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openTelegramBot = () => {
    window.open("https://t.me/Workify1_bot", "_blank");
    toast.info("Opening Telegram bot...", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const goBack = () => {
    if (step === 3) {
      setStep(2);
      setVerificationCode("");
    } else if (step === 2) {
      setStep(1);
    } else {
      window.history.back();
    }
    toast.info("Returning back", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Code Input Component (6 separate digits)
  const CodeInput = ({ value, onChange }) => {
    const digits = value.split("").concat(Array(6 - value.length).fill(""));

    const handleChange = (index, newValue) => {
      if (!/^\d?$/.test(newValue)) return;

      const newDigits = [...digits];
      newDigits[index] = newValue;

      const newCode = newDigits.join("");
      onChange(newCode.slice(0, 6));

      if (newValue && index < 5) {
        document.getElementById(`code-input-${index + 1}`)?.focus();
      }
    };

    const handleKeyDown = (index, e) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        document.getElementById(`code-input-${index - 1}`)?.focus();
      }
      if (e.key === "ArrowLeft" && index > 0) {
        document.getElementById(`code-input-${index - 1}`)?.focus();
      }
      if (e.key === "ArrowRight" && index < 5) {
        document.getElementById(`code-input-${index + 1}`)?.focus();
      }
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);
      if (pasteData.length === 6) {
        onChange(pasteData);
        document.getElementById(`code-input-5`)?.focus();
      }
    };

    return (
      <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={(e) => e.target.select()}
            className="w-12 h-12 text-center text-lg font-bold border-2 border-[#CCD2E3] rounded-lg focus:border-[#8B39E5] focus:outline-none focus:ring-2 focus:ring-[#8B39E5]/20"
            maxLength="1"
            autoComplete="off"
            autoFocus={index === 0}
          />
        ))}
      </div>
    );
  };

  // STEP 1: Registration Form
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 relative">
        <ToastContainer />
        <div className="mt-20 w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex">
            <div className="w-full p-8 lg:p-12">
              {/* User Type Tabs */}
              <div className="mb-8 flex justify-center">
                <div className="flex bg-[#EDEEF2] rounded-[20px] p-1 w-full max-w-md">
                  <button
                    type="button"
                    className={`flex-1 py-3 rounded-[20px] font-medium transition-all duration-200 text-lg ${
                      userType === "talent"
                        ? "bg-[#FFFFFF] shadow text-[#000000]"
                        : "text-[#808080] hover:text-[#404040] hover:bg-[#f7f7f7]"
                    }`}
                    onClick={() => setUserType("talent")}
                  >
                    Talent
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 rounded-[20px] font-medium transition-all duration-200 text-lg ${
                      userType === "company"
                        ? "bg-[#FFFFFF] shadow text-[#000000]"
                        : "text-[#808080] hover:text-[#404040] hover:bg-[#f7f7f7]"
                    }`}
                    onClick={() => setUserType("company")}
                  >
                    Company
                  </button>
                </div>
              </div>

              <form onSubmit={handleStep1Submit}>
                {userType === "company" ? (
                  <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Company Name */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-[#343C44]">
                          Company name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <BiSolidCity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#988ae8]" />

                          <input
                            type="text"
                            name="company_name"
                            value={companyData.company_name}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            required
                            className="w-full pl-10 pr-3 py-3 text-base border border-[#CCD2E3] rounded-lg focus:ring-2 focus:ring-[#8B39E5]/20 focus:border-[#8B39E5] focus:outline-none transition-all duration-200 hover:border-[#8B39E5] text-[#404040]"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-[#343C44]">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#988ae8]" />
                          <input
                            type="tel"
                            name="phone"
                            value={companyData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required
                            className="w-full pl-10 pr-3 py-3 text-base border border-[#CCD2E3] rounded-lg focus:ring-2 focus:ring-[#8B39E5]/20 focus:border-[#8B39E5] focus:outline-none transition-all duration-200 hover:border-[#8B39E5] text-[#404040]"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-[#343C44]">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#988ae8]" />
                          <input
                            type="email"
                            name="email"
                            value={companyData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                            className="w-full pl-10 pr-3 py-3 text-base border border-[#CCD2E3] rounded-lg focus:ring-2 focus:ring-[#8B39E5]/20 focus:border-[#8B39E5] focus:outline-none transition-all duration-200 hover:border-[#8B39E5] text-[#404040]"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-[#343C44]">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <AiFillLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-7  text-[#998ae8]" />

                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={companyData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                            className="w-full pl-10 pr-10 py-3 text-base border border-[#CCD2E3] rounded-lg focus:ring-2 focus:ring-[#8B39E5]/20 focus:border-[#8B39E5] focus:outline-none transition-all duration-200 hover:border-[#8B39E5] text-[#404040]"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#808080] hover:text-[#8B39E5] text-lg transition-colors duration-200"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword
                              ? [<FaRegEye />]
                              : [<FaRegEyeSlash />]}
                          </button>
                        </div>
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-[#343C44]">
                          Website
                        </label>
                        <div className="relative">
                          <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#988ae8]" />

                          <input
                            type="url"
                            name="website"
                            value={companyData.website}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            className="w-full pl-10 pr-3 py-3 text-base border border-[#CCD2E3] rounded-lg focus:ring-2 focus:ring-[#8B39E5]/20 focus:border-[#8B39E5] focus:outline-none transition-all duration-200 hover:border-[#8B39E5] text-[#404040]"
                          />
                        </div>
                      </div>

                      {/* Industry */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-[#343C44]">
                          Industry <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#988ae8] z-10" />

                          <select
                            name="industry"
                            value={companyData.industry}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-8 py-3 text-base border border-[#CCD2E3] rounded-lg focus:ring-2 focus:ring-[#8B39E5]/20 focus:border-[#8B39E5] focus:outline-none transition-all duration-200 hover:border-[#8B39E5] appearance-none bg-white cursor-pointer text-[#404040]"
                          >
                            <option value="">Select industry</option>
                            {industries.map((ind, i) => (
                              <option key={i} value={ind}>
                                {ind}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-[#808080]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Country */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-[#343C44]">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <PiFlagPennantFill className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#544fb4] z-10" />

                          <select
                            name="country"
                            value={companyData.country}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-8 py-3 text-base border border-[#CCD2E3] rounded-lg focus:ring-2 focus:ring-[#8B39E5]/20 focus:border-[#8B39E5] focus:outline-none transition-all duration-200 hover:border-[#8B39E5] appearance-none bg-white cursor-pointer text-[#404040]"
                          >
                            <option value="">Select country</option>
                            {countries.map((c, i) => (
                              <option key={i} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-[#808080]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* City */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-[#343C44]">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <BiSolidCity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#988ae8]" />

                          <input
                            type="text"
                            name="city"
                            value={companyData.city}
                            onChange={handleChange}
                            placeholder="Enter city"
                            required
                            className="w-full pl-10 pr-3 py-3 text-base border border-[#CCD2E3] rounded-lg focus:ring-2 focus:ring-[#8B39E5]/20 focus:border-[#8B39E5] focus:outline-none transition-all duration-200 hover:border-[#8B39E5] text-[#404040]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto bg-[#EDEEF2] border border-[#CCD2E3] rounded-xl p-6 mb-8">
                    <p className="text-[#808080] text-center text-base">
                      Talent registration form will be available soon.
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-center gap-6 pt-8 border-t border-[#CCD2E3] max-w-4xl mx-auto">
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-8 py-3 border border-[#CCD2E3] text-[#343C44] rounded-lg hover:bg-[#FAFAFA] hover:border-[#8B39E5] transition-all duration-200 font-medium text-base min-w-[140px]"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-[#163D5C] text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      "Next →"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Telegram Bot
  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 relative">
        <ToastContainer />

        <div className="mt-20 w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleStep2Submit}>
            {/* Telegram Section */}
            <div className="mb-8 text-center">
              <div className="rounded-xl p-6 mb-6">
                <p className="text-[#000000] font-medium text-lg">
                  Registration successful! Now please start our Telegram bot to
                  get verification code and be notified when we find the best
                  talent for you!
                </p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <button
                  type="button"
                  onClick={openTelegramBot}
                  className="px-8 py-3 bg-[#5ABF89] text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow flex items-center gap-3 text-lg"
                >
                  <span>Open Telegram Bot</span>
                  <span>→</span>
                </button>
                <img src={img1} alt="telegram" className="w-80 h-auto" />
              </div>

              <div className="mt-8 text-[#666]">
                <p className="mb-2">
                  After opening the bot, you will receive a 6-digit verification
                  code.
                </p>
                <p>Click "Next" to enter the code.</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-8 pt-8 border-t border-[#CCD2E3]">
              <button
                type="button"
                onClick={goBack}
                className="px-8 py-3 border border-[#CCD2E3] text-[#343C44] rounded-lg hover:bg-[#FAFAFA] hover:border-[#8B39E5] transition-all duration-200 font-medium text-base min-w-[140px]"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-[#163D5C] text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium text-base min-w-[140px]"
              >
                Next →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // STEP 3: Verification Page
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 relative">
      <ToastContainer />

      {/* Main Verification Container */}
      <div className="mt-20 w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleStep3Submit}>
          {/* Instructions */}
          <div className="mb-8 text-center">
            <div className="rounded-xl p-6 mb-6">
              <p className="text-[#000000] font-medium">
                Enter the 6-digit verification code you received from Telegram
                bot
              </p>
            </div>

            <div className="mb-4 text-[#666]">
              <p>Check your Telegram messages for the verification code</p>
            </div>
          </div>

          {/* Code Input */}
          <div className="mb-8">
            <label className="block text-base font-medium text-[#343C44] mb-4 text-center">
              Enter verification code:
            </label>
            <CodeInput
              value={verificationCode}
              onChange={setVerificationCode}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-8 pt-8 border-t border-[#CCD2E3]">
            <button
              type="button"
              onClick={goBack}
              className="px-8 py-3 border border-[#CCD2E3] text-[#343C44] rounded-lg hover:bg-[#FAFAFA] hover:border-[#8B39E5] transition-all duration-200 font-medium text-base min-w-[140px]"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-[#163D5C] text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
