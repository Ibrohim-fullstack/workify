import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendResetCode } from "../../services/api";
import './ForgotPassword1.css';

const ForgotPassword1 = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleNext = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await sendResetCode(email);
            navigate('/forgot-password-2', { state: { email } });
        } catch (err) {
            setError(typeof err === 'string' ? err : "Email topilmadi!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-content">
                <h1 className="forgot-password-title">
                    Reset your password
                </h1>

                <form onSubmit={handleNext} className="forgot-password-form">
                    <div className="input-container">
                        <span className="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </span>
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            className="email-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? "..." : "Next"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword1;