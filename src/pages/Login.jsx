import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const inputRefs = useRef([]);

  /* ================= TIMER ================= */

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ NEW: Hide OTP section when expired
  useEffect(() => {
    if (timeLeft === 0 && otpSent) {
      setOtp("");
      setOtpSent(false);
    }
  }, [timeLeft]);
  useEffect(() => {
    const hasShown = sessionStorage.getItem("adminAlertShown");

    if (!hasShown) {
      alert("9876543210 is an admin number and access is restricted.");
      sessionStorage.setItem("adminAlertShown", "true");
    }
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  /* ================= SEND OTP ================= */

  const handleSendOtp = async () => {

    if (mobile.length !== 10) {
      alert("Please enter valid 10 digit mobile number");
      return;
    }


    try {
      setLoading(true);

      const res = await API.post("/users/login", {
        phone: `+91${mobile}`,
      });

      if (res.data.success) {
        setOtp("");
        setOtpSent(true);
        setTimeLeft(60);

        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 200);

        alert("OTP: " + res.data.otp);
      }

    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN ================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      alert("Please click Send OTP first");
      return;
    }

    if (otp.length !== 4) {
      alert("Enter valid 4 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/users/login", {
        phone: `+91${mobile}`,
        otp: otp,
      });

      if (res.data.success) {

        // 🚨 Remove delivery boy login if exists
        localStorage.removeItem("deliveryBoyToken");
        localStorage.removeItem("deliveryBoyId");

        // Save user token
        localStorage.setItem("token", res.data.token);

        navigate("/");
        window.location.reload();
      }


    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP INPUT HANDLE ================= */

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Login With OTP 📱
        </h2>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">

          {/* Mobile Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mobile Number
            </label>

            <div className="flex">
              <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                +91
              </span>
              <input
                type="tel"
                maxLength="10"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter 10 digit number"
                className="w-full px-4 py-3 border border-gray-300 rounded-r-lg outline-none focus:border-gray-400"
              />
            </div>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={timeLeft > 0 || loading}
              className={`mt-3 text-sm font-medium ${timeLeft > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-green-600 hover:underline"
                }`}
            >
              {otpSent
                ? timeLeft > 0
                  ? `Resend OTP in ${formatTime()}`
                  : "Resend OTP"
                : "Send OTP"}
            </button>
          </div>

          {/* OTP Section */}
          {otpSent && timeLeft > 0 && (
            <div>
              <label className="block text-gray-700 font-medium mb-3 text-center">
                Enter 4 Digit OTP
              </label>

              <div className="flex justify-center gap-4">
                {[...Array(4)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={otp[index] || ""}
                    onChange={(e) =>
                      handleOtpChange(e.target.value, index)
                    }
                    className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg outline-none focus:border-gray-400 transition"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Login"}
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            New User?{" "}
            <span
              onClick={() => navigate("/Register")}
              className="text-green-600 cursor-pointer hover:underline font-medium"
            >
              Complete Profile
            </span>
          </p>

        </form>
      </div>
    </section>
  );
}

export default Login;