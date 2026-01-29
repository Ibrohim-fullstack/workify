import React, { useState } from "react";
import img1 from "../../assets/Group 8634.svg";
import img2 from "../../assets/phone.svg";
import img3 from "../../assets/08-Email.svg";
import img4 from "../../assets/Group (1).svg";
import img5 from "../../assets/Vector.svg";
import img7 from "../../assets/Group (2).svg";
import img90 from "../../assets/Group 9067.svg";

import axios from "axios";
import "./Register.css";

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setError("");
    setSuccess("");

    if (userType === "company") {
      const { company_name, email, password } = companyData;
      if (!company_name || !email || !password) {
        setError("Please fill all required fields");
        return;
      }

      try {
        setIsLoading(true);

        await axios.post(
          "https://workifybackend-production.up.railway.app/api/company/register",
          companyData,
          { headers: { "Content-Type": "application/json" } },
        );

        setSuccess("Company registered! Now verify your code.");
        setStep(2);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Registration failed. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Talent registration functionality will be implemented here");
    }
  };

  // 2-STEP: Verification
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsLoading(true);

      console.log("Sending verification request:", {
        email: companyData.email,
        code: verificationCode,
      });

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
        console.log("Response:", response.data);
      } catch (err1) {
        console.log("Variant 1 failed:", err1.response?.status);

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
          console.log("Variant 2 response:", response.data);
        } catch (err2) {
          console.log("Variant 2 failed:", err2.response?.status);

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
            console.log("Variant 3 response:", response.data);
          } catch (err3) {
            console.log("Variant 3 failed:", err3.response?.status);
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
        setSuccess("✅ Verification successful! Redirecting to homepage...");

        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("companyEmail", companyData.email);
          localStorage.setItem("companyName", companyData.company_name);
        }

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setError("❌ Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Verification error details:", {
        status: err.response?.status,
        data: err.response?.data,
        config: err.config?.data,
      });

      if (err.response?.status === 400) {
        if (err.response?.data?.message) {
          setError(`❌ ${err.response.data.message}`);
        } else if (err.response?.data?.error) {
          setError(`❌ ${err.response.data.error}`);
        } else {
          setError("❌ Bad request. Please check your code and try again.");
        }
      } else if (err.response?.data?.message) {
        setError(`❌ ${err.response.data.message}`);
      } else if (err.response?.data?.error) {
        setError(`❌ ${err.response.data.error}`);
      } else {
        setError("❌ Verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openTelegramBot = () => {
    window.open("https://t.me/Workify1_bot", "_blank");
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setVerificationCode("");
      setError("");
      setSuccess("");
    } else {
      window.history.back();
    }
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
      <div className="code-inputs-container" onPaste={handlePaste}>
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
            className="single-digit-input"
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
      <div className="signup-page">
        <div className="signup-container">
          <main className="signup-main">
            {/* Step Indicator */}

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form className="signup-form" onSubmit={handleStep1Submit}>
              <h2 className="form-title">
                {userType === "company"
                  ? "Company Registration"
                  : "Talent Registration"}
              </h2>
              {/* User Type Selector */}
              <div className="user-type-selector">
                <div className="user-type-tabs">
                  <button
                    type="button"
                    className={`user-tab ${userType === "talent" ? "active" : ""}`}
                    onClick={() => setUserType("talent")}
                  >
                    Talent
                  </button>
                  <button
                    type="button"
                    className={`user-tab ${userType === "company" ? "active" : ""}`}
                    onClick={() => setUserType("company")}
                  >
                    Company
                  </button>
                </div>
              </div>

              {userType === "company" ? (
                <div className="form-grid">
                  {/* Company Name */}
                  <div className="form-group">
                    <label>Company name </label>
                    <div className="input-with-icon">
                      <img src={img1} alt="company" className="input-icon" />
                      <input
                        type="text"
                        name="company_name"
                        value={companyData.company_name}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label>Phone </label>
                    <div className="input-with-icon">
                      <img src={img2} alt="phone" className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={companyData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label>Email </label>
                    <div className="input-with-icon">
                      <img src={img3} alt="email" className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={companyData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label>Password </label>
                    <div className="input-with-icon password-container">
                      <img src={img4} alt="lock" className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={companyData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                         {showPassword ? (
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Website */}
                  <div className="form-group">
                    <label>Website</label>
                    <div className="input-with-icon">
                      <img src={img5} alt="website" className="input-icon" />
                      <input
                        type="url"
                        name="website"
                        value={companyData.website}
                        onChange={handleChange}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="form-group">
                    <label>Industry </label>
                    <div className="input-with-icon">
                      <img src={img5} alt="industry" className="input-icon" />
                      <select
                        name="industry"
                        value={companyData.industry}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select industry</option>
                        {industries.map((ind, i) => (
                          <option key={i} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Country */}
                  <div className="form-group">
                    <label>Country </label>
                    <div className="input-with-icon">
                      <img src={img7} alt="country" className="input-icon" />
                      <select
                        name="country"
                        value={companyData.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select country</option>
                        {countries.map((c, i) => (
                          <option key={i} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* City */}
                  <div className="form-group">
                    <label>City </label>
                    <div className="input-with-icon">
                      <img src={img1} alt="city" className="input-icon" />
                      <input
                        type="text"
                        name="city"
                        value={companyData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="talent-placeholder">
                  <p>Talent registration form will be available soon.</p>
                </div>
              )}

              {/* Back va Next buttons */}
              <div className="button-container">
                <button type="button" className="back-btn" onClick={goBack}>
                  Back
                </button>
                <button type="submit" className="next-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner"></span> Loading...
                    </>
                  ) : (
                    "Next →"
                  )}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    );
  }

  // STEP 2: Verification Page
  return (
    <div className="verification-page">
      <div className="verification-container">
        <main className="verification-main">
          {/* Step Indicator */}

          <form className="verification-form" onSubmit={handleStep2Submit}>
            <div className="verification-instructions">
              <p className="telegram-message">
                Start our Telegram bot to be notified when we find the best
                talent for you!
              </p>
            </div>

            {/* Telegram Button */}
            <div className="telegram-action">
              <button
                className="telegram-open-btn"
                type="button"
                onClick={openTelegramBot}
              >
                <span className="telegram-text">Click here !</span>
              </button>

              <img src={img90} alt="img90" className="img900" />
            </div>

            {/* Code Input (6 separate inputs) */}
            <div className="code-input-section">
              <div className="code-input-group">
                <CodeInput
                  value={verificationCode}
                  onChange={setVerificationCode}
                />
              </div>
            </div>

            {/* Back and Verify buttons */}
            <div className="button-container">
              <button type="button" className="back-btn" onClick={goBack}>
                Back
              </button>
              <button type="submit" className="verify-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner"></span> Verifying...
                  </>
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default SignUpPage;
