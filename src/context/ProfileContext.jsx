import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await API.get("/users/profile");
      setUser(res.data.user);

    } catch (error) {
      console.log("Profile error:", error.response?.data?.message);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= AUTO LOGOUT IF TOKEN DELETED ================= */

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        window.location.href = "/login";
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        fetchProfile,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);