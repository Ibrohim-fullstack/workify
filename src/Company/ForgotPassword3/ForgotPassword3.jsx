import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkResetCode } from "../../services/api";
import { toast } from 'react-toastify';
import './ForgotPassword3.css';

const ForgotPassword3 = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(300);
    const [loading, setLoading] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const inputRefs = useRef([]);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const handleBack = () => {
        navigate('/forgot-password-2', { state: { email } });
    };

    useEffect(() => {
        const savedTime = localStorage.getItem(`resetTimer_${email}`);
        const savedStartTime = localStorage.getItem(`resetStartTime_${email}`);

        if (savedTime && savedStartTime) {
            const currentTime = Math.floor(Date.now() / 1000);
            const elapsedTime = currentTime - parseInt(savedStartTime);
            const remainingTime = parseInt(savedTime) - elapsedTime;

            if (remainingTime > 0) {
                setTimeLeft(remainingTime);
            } else {
                setTimeLeft(0);
                setIsExpired(true);
                localStorage.removeItem(`resetTimer_${email}`);
                localStorage.removeItem(`resetStartTime_${email}`);
            }
        } else {
            const startTime = Math.floor(Date.now() / 1000);
            localStorage.setItem(`resetTimer_${email}`, '300');
            localStorage.setItem(`resetStartTime_${email}`, startTime.toString());
        }
    }, [email]);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsExpired(true);
            localStorage.removeItem(`resetTimer_${email}`);
            localStorage.removeItem(`resetStartTime_${email}`);
            toast.warning("Vaqt tugadi, iltimos kodni qaytadan so'rang!");
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1;
                if (newTime % 10 === 0) {
                    localStorage.setItem(`resetTimer_${email}`, newTime.toString());
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, email]);

    const handlePaste = (e) => {
        e.preventDefault();

        if (isExpired) {
            toast.error("Vaqt tugagan! Iltimos, yangi kod so'rang");
            return;
        }

        const pastedText = e.clipboardData.getData('text/plain');

        if (pastedText.length === 6 && /^\d+$/.test(pastedText)) {
            const newCode = pastedText.split('').slice(0, 6);
            setCode(newCode);

            if (inputRefs.current[5]) {
                inputRefs.current[5].focus();
            }
        } else {
            toast.info("Iltimos, faqat 6 ta raqamdan iborat kodni kiriting");
        }
    };

    const handleChange = (index, value) => {
        if (isExpired) {
            toast.error("Vaqt tugagan! Iltimos, yangi kod so'rang");
            return;
        }

        if (isNaN(value)) return;

        const newCode = [...code];
        newCode[index] = value.substring(value.length - 1);
        setCode(newCode);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async () => {
        if (isExpired) {
            toast.error("Vaqt tugagan! Iltimos, yangi kod so'rang");
            return;
        }

        const fullCode = code.join('');
        if (fullCode.length < 6) {
            toast.info("Iltimos, 6 talik kodni to'liq kiriting");
            return;
        }

        setLoading(true);
        try {
            await checkResetCode(email, fullCode);
            toast.success("Kod tasdiqlandi!");
            localStorage.removeItem(`resetTimer_${email}`);
            localStorage.removeItem(`resetStartTime_${email}`);
            navigate('/forgot-password-4', { state: { email, code: fullCode } });
        } catch (err) {
            toast.error(err.message || "Kod noto'g'ri, qaytadan urinib ko'ring");
        } finally {
            setLoading(false);
        }
    };

    const handleRequestNewCode = () => {
        const startTime = Math.floor(Date.now() / 1000);
        localStorage.setItem(`resetTimer_${email}`, '300');
        localStorage.setItem(`resetStartTime_${email}`, startTime.toString());

        setTimeLeft(300);
        setIsExpired(false);
        setCode(['', '', '', '', '', '']);

        toast.info("Yangi kod yuborildi!");
    };

    return (
        <div className="forgot-password3-container">
            <div className="forgot-password3-content">
                <h1 className="forgot-password3-title">Reset your password</h1>

                <div
                    className="code-inputs-container"
                    onPaste={handlePaste}
                >
                    {code.map((num, idx) => (
                        <input
                            key={idx}
                            ref={(el) => (inputRefs.current[idx] = el)}
                            type="text"
                            maxLength={1}
                            className="code-input"
                            value={num}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            disabled={isExpired}
                        />
                    ))}
                </div>

                <div className="timer-container">
                    Kodni kiriting:
                    <span className="timer-value" style={{ color: isExpired ? '#ef4444' : timeLeft < 60 ? '#f59e0b' : '#1e3a5a' }}>
                        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                    </span>
                </div>

                {isExpired && (
                    <button
                        onClick={handleRequestNewCode}
                        className="submit-button request-new-button"
                    >
                        Yangi kod so'rash
                    </button>
                )}

                {/* Button container - Next va Back yonma-yon */}
                <div className="button-container">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || isExpired}
                        className="submit-button"
                        style={{
                            backgroundColor: isExpired ? '#9ca3af' : '#1e3a5a',
                            cursor: isExpired ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? "Verifying..." : "Next"}
                    </button>

                    <button onClick={handleBack} className="back-button-right">
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword3;