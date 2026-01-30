import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmResetPassword } from "../../services/api";
import { toast } from 'react-toastify';

const ForgotPassword4 = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const code = location.state?.code;

    const handleBack = () => {
        navigate('/forgot-password-3', { state: { email, code } });
    };

    const handleReset = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError("Iltimos, parolni kiriting!");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Parollar mos kelmadi!");
            return;
        }

        if (newPassword.length < 6) {
            setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
            return;
        }

        setLoading(true);
        setError('');

        try {
            await confirmResetPassword(email, code, newPassword);
            toast.success("Parol muvaffaqiyatli yangilandi!");
            navigate('/login');
        } catch (err) {
            setError(err.message || "Xatolik yuz berdi");
            toast.error("Parolni yangilashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white font-sans p-4 pt-10">
            <div className="w-full max-w-[500px] px-6 text-center">
                
                {/* TITLE */}
                <h1 className="text-[28px] md:text-[34px] font-bold text-[#1e3a5a] mb-10 tracking-tight">
                    Create New Password
                </h1>

                <form onSubmit={handleReset} className="flex flex-col items-center space-y-6">
                    
                    {/* NEW PASSWORD INPUT */}
                    <div className="w-full">
                        <input
                            type="password"
                            placeholder="New password"
                            required
                            className="w-full px-5 py-4 border border-gray-300 rounded-[12px] text-[18px] shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setError('');
                            }}
                            minLength="6"
                        />
                    </div>

                    {/* CONFIRM PASSWORD INPUT */}
                    <div className="w-full">
                        <input
                            type="password"
                            placeholder="Confirm password"
                            required
                            className="w-full px-5 py-4 border border-gray-300 rounded-[12px] text-[18px] shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError('');
                            }}
                            minLength="6"
                        />
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <p className="text-red-500 text-sm self-start pl-2 animate-pulse">
                            {error}
                        </p>
                    )}

                    {/* BUTTON CONTAINER - Responsive: Mobileda ustma-ust, MD'da yonma-yon */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-4">
                        
                        {/* UPDATE BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-8 py-3.5 bg-[#1e3a5a] hover:bg-[#152c45] text-white rounded-[12px] font-bold text-[18px] shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>

                        {/* BACK BUTTON */}
                        <button
                            type="button"
                            onClick={handleBack}
                            className="w-full sm:w-auto px-10 py-3 bg-white border-2 border-[#1e3a5a] text-[#1e3a5a] rounded-[12px] font-semibold text-[17px] hover:bg-[#1e3a5a] hover:text-white transition-all shadow-sm"
                        >
                            Back
                        </button>
                        
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword4;