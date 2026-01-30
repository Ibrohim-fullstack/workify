import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkResetCode } from "../../services/api";
import { toast } from 'react-toastify';

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
        if (isExpired) return;
        const pastedText = e.clipboardData.getData('text/plain');
        if (pastedText.length === 6 && /^\d+$/.test(pastedText)) {
            const newCode = pastedText.split('').slice(0, 6);
            setCode(newCode);
            inputRefs.current[5].focus();
        }
    };

    const handleChange = (index, value) => {
        if (isExpired || isNaN(value)) return;
        const newCode = [...code];
        newCode[index] = value.substring(value.length - 1);
        setCode(newCode);
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async () => {
        if (isExpired) {
            toast.error("Vaqt tugagan!");
            return;
        }
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            toast.info("Kodni to'liq kiriting");
            return;
        }
        setLoading(true);
        try {
            await checkResetCode(email, fullCode);
            localStorage.removeItem(`resetTimer_${email}`);
            localStorage.removeItem(`resetStartTime_${email}`);
            navigate('/forgot-password-4', { state: { email, code: fullCode } });
        } catch (err) {
            toast.error("Kod noto'g'ri!");
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
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white font-sans p-4 pt-10">
            <div className="w-full max-w-[600px] px-4 text-center">

                <h1 className="text-[26px] md:text-[32px] font-bold text-[#1e3a5a] mb-8 md:mb-10 tracking-tight">
                    Reset your password
                </h1>

                {/* CODE INPUTS */}
                <div
                    className="flex justify-center gap-2 md:gap-3 mb-8"
                    onPaste={handlePaste}
                >
                    {code.map((num, idx) => (
                        <input
                            key={idx}
                            ref={(el) => (inputRefs.current[idx] = el)}
                            type="text"
                            maxLength={1}
                            className="w-[42px] h-[52px] md:w-[56px] md:h-[64px] border-2 border-gray-200 rounded-xl text-center text-[20px] md:text-[24px] font-bold shadow-sm focus:border-blue-500 focus:outline-none transition-all disabled:bg-gray-100 disabled:opacity-70"
                            value={num}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            inputMode="numeric"
                            disabled={isExpired}
                        />
                    ))}
                </div>

                {/* TIMER */}
                <div className="mb-8 md:mb-10 text-[16px] md:text-[18px] font-bold text-[#1e3a5a]">
                    Kodni kiriting:
                    <span
                        className="ml-2 font-mono"
                        style={{ color: isExpired ? '#ef4444' : timeLeft < 60 ? '#f59e0b' : '#1e3a5a' }}
                    >
                        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                    </span>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col items-center gap-4">
                    {isExpired && (
                        <button
                            onClick={handleRequestNewCode}
                            className="w-full max-w-[280px] bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-all shadow-md"
                        >
                            Yangi kod so'rash
                        </button>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || isExpired}
                            className={`w-full sm:w-auto px-12 md:px-16 py-3 rounded-xl font-bold text-[18px] text-white shadow-md transition-all active:scale-95 ${isExpired ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1e3a5a] hover:bg-[#152c45]'
                                }`}
                        >
                            {loading ? "Verifying..." : "Next"}
                        </button>

                        <button
                            onClick={handleBack}
                            className="w-full sm:w-auto px-8 py-3 bg-white border-2 border-[#1e3a5a] text-[#1e3a5a] rounded-xl font-semibold hover:bg-[#1e3a5a] hover:text-white transition-all"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword3;