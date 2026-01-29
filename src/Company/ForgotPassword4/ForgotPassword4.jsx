import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmResetPassword } from "../../services/api";
import { toast } from 'react-toastify';
import './ForgotPassword4.css';

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
        <div className="forgot-password4-container">
            <div className="forgot-password4-content">
                <h1 className="forgot-password4-title">
                    Create New Password
                </h1>

                <form onSubmit={handleReset} className="password-form">
                    <input
                        type="password"
                        placeholder="New password"
                        required
                        className="password-input"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            setError('');
                        }}
                        minLength="6"
                    />

                    <input
                        type="password"
                        placeholder="Confirm password"
                        required
                        className="password-input"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError('');
                        }}
                        minLength="6"
                    />

                    {error && <p className="error-message">{error}</p>}

                    {/* Button container - Update Password va Back yonma-yon */}
                    <div className="button-container">
                        <button
                            type="submit"
                            disabled={loading}
                            className="update-button"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>

                        <button
                            type="button"
                            onClick={handleBack}
                            className="back-button-righter"
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