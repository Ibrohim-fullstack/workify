import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ForgotPassword2.css';

const ForgotPassword2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const handleOpenBot = () => {
        window.open("https://t.me/Workify1_bot", "_blank");
    };

    const handleBack = () => {
        navigate('/forgot-password-1', { state: { email } });
    };

    return (
        <div className="forgot-password2-container">
            <div className="forgot-password2-content">
                <h1 className="forgot-password2-title">
                    Reset your password
                </h1>

                <p className="forgot-password2-description">
                    Start our Telegram bot to get reset code
                </p>

                <button
                    onClick={handleOpenBot}
                    className="telegram-button"
                >
                    Click here!
                </button>

                <div className="image-container">
                    <img
                        src="https://img.freepik.com/premium-vector/robot-holding-smartphone-online-chatting-bot-concept_270158-450.jpg"
                        alt="Telegram bot illustration"
                        className="bot-image"
                    />
                </div>

                {/* Button container - Back va Next yonma-yon */}
                <div className="button-container">
                    <button
                        onClick={() => navigate('/forgot-password-3', { state: { email } })}
                        className="next-button"
                    >
                        Next
                    </button>

                    <button onClick={handleBack} className="back-button-righting">
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword2;