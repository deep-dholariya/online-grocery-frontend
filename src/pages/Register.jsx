import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import imageCompression from "browser-image-compression"; // ✅ Only Added

function Register() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= TIMER ================= */

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && otpSent) {
      setOtp("");
      setOtpSent(false);
    }
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile || formData.mobile.length !== 10)
      newErrors.mobile = "Valid 10 digit mobile required";
    if (!formData.image) newErrors.image = "Profile image required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/users/register", {
        name: formData.name,
        phone: `+91${formData.mobile}`,
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

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      alert("Enter valid 4 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", `+91${formData.mobile}`);
      data.append("otp", otp);
      data.append("image", formData.image);

      const res = await API.post("/users/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
        window.location.reload();
      }

    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 px-4 py-10">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account 🛒
        </h2>

        {!otpSent && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-green-400 to-green-600 p-1">
                  <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Photo</span>
                    )}
                  </div>
                </div>

                <label
                  htmlFor="profileImage"
                  className="absolute bottom-1 right-1 bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                >
                  ✏️
                </label>

                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {errors.image && (
              <p className="text-red-500 text-sm text-center">
                {errors.image}
              </p>
            )}

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 border rounded-lg"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mobile: e.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="Mobile Number"
              className="w-full px-4 py-3 border rounded-lg"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Submit"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-green-600 cursor-pointer hover:underline font-medium"
              >
                Login Here
              </span>
            </p>

          </form>
        )}

        {otpSent && (
          <div className="mt-8 space-y-5">

            <p className="text-center font-semibold text-gray-700">
              Enter 4 Digit OTP
            </p>

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
                  className="w-14 h-14 text-center text-xl font-bold border rounded-lg"
                />
              ))}
            </div>

            {timeLeft > 0 && (
              <p className="text-center text-red-600 text-sm font-medium">
                Expires in {formatTime()}
              </p>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}

export default Register;