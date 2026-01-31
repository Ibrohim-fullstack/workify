import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTelegramPlane } from "react-icons/fa";
import img1 from "../../assets/img1.svg";

const TelegramVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, companyName } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
        <p className="text-gray-500 text-sm mb-8">
          <b>
            Start our Telegram bot to be notified when we find the best talent
            for you!
          </b>
        </p>

        <button
          onClick={() => window.open("https://t.me/Workify1_bot", "_blank")}
          className="w-[185px] py-3 bg-[#24A1DE] text-white rounded-2xl font-bold shadow-md hover:bg-[#208aba] transition-all mb-6"
        >
          Click here!
        </button>

        {/* <img src={img1} alt="Kompaniya logotipi" width="200" /> */}
        <img
          src={img1}
          alt="Kompaniya logotipi"
          className="w-[536.75px] h-[400px] 
                   sm:w-full sm:h-auto 
                   md:w-3/4 md:h-auto 
                   lg:w-[536.75px] lg:h-[400px] 
                   max-w-full"
        />

        <div className="flex gap-4 pt-6 border-t">
          <button
            onClick={() => navigate("/signup")}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-500 font-medium"
          >
            Back
          </button>
          <button
            onClick={() =>
              navigate("/signup/verify", { state: { email, companyName } })
            }
            className="flex-1 py-3 bg-[#163D5C] text-white rounded-xl font-bold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default TelegramVerify;
