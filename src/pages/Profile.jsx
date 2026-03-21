import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import imageCompression from "browser-image-compression";

function Profile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        if (res.data.success) {
          setUser(res.data.user);
          setEditData(res.data.user);
          setPreview(res.data.user.image);
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    await API.post("/users/logout");
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  /* ================= IMAGE CHANGE ================= */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setEditData({ ...editData, image: file });
    }
  };

  /* ================= SAVE CHANGES ================= */

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", editData.name);

      if (editData.image instanceof File) {
        formData.append("image", editData.image);
      }

      const res = await API.put("/users/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setUser(res.data.user);
        setIsEditing(false);
        alert("Profile Updated Successfully ✅");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <section className="min-h-screen bg-[#f3f3f3] pt-28 pb-16 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          My Profile 👤
        </h2>

        {!isEditing ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-400 to-green-600 p-1">
                  <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Photo</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-gray-500 text-sm">Full Name</label>
                <div className="text-lg font-semibold">{user.name}</div>
              </div>

              <div>
                <label className="text-gray-500 text-sm">Mobile Number</label>
                <div className="text-lg font-semibold">{user.phone}</div>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 border border-green-600 text-green-600 py-3 rounded-md font-semibold hover:bg-green-600 hover:text-white transition"
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 text-white py-3 rounded-md font-semibold hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSaveChanges} className="space-y-6">

            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-400 to-green-600 p-1">
                  <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
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

            <div>
              <label className="text-gray-500 text-sm">Full Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="text-gray-500 text-sm">Mobile Number</label>
              <input
                type="text"
                value={editData.phone}
                disabled
                className="w-full mt-2 px-4 py-3 border rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>

          </form>
        )}
      </div>
    </section>
  );
}

export default Profile;