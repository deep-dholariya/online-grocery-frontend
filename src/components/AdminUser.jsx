import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function AdminUser() {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeType, setActiveType] = useState("users");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
    fetchUsers("users");
    fetchCounts();
  }, []);

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setAdmin(res.data.user);
    } catch (error) {
      navigate("/login");
    }
  };

  /* ================= FETCH COUNTS ================= */

  const fetchCounts = async () => {
    try {
      const usersRes = await API.get("/users/all-users");
      const adminsRes = await API.get("/users/all-admins");

      const usersData =
        usersRes.data.users ||
        usersRes.data.data ||
        [];

      const adminsData =
        adminsRes.data.admins ||
        adminsRes.data.data ||
        [];

      setTotalUsers(usersData.length);
      setTotalAdmins(adminsData.length);
    } catch (error) {
      console.error("Count fetch failed");
    }
  };

  /* ================= FETCH USERS / ADMINS ================= */

  const fetchUsers = async (type) => {
    try {
      const endpoint =
        type === "admins"
          ? "/users/all-admins"
          : "/users/all-users";

      const res = await API.get(endpoint);

      const data =
        res.data.users ||
        res.data.admins ||
        res.data.data ||
        [];

      setUsers(Array.isArray(data) ? data : []);
      setActiveType(type);
    } catch (error) {
      setUsers([]);
      alert("Failed to load data");
    }
  };

  /* ================= CHANGE ROLE ================= */

  const handleRoleChange = async (user) => {
    if (admin && user._id === admin._id) {
      alert("You cannot change your own role.");
      return;
    }

    const newRole = user.role === "admin" ? "user" : "admin";

    try {
      const res = await API.put("/users/change-role", {
        userId: user._id,
        role: newRole,
      });

      alert(res.data.message);
      fetchUsers(activeType);
      fetchCounts();
    } catch (error) {
      alert(error.response?.data?.message || "Role update failed");
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-green-800 mb-6">
        Users & Admin
      </h2>

      {/* ================= COUNTERS ================= */}
      <div className="flex gap-6 mb-6">
        <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-semibold shadow">
          Total Users: {totalUsers}
        </div>

        <div className="bg-red-100 text-red-700 px-6 py-3 rounded-lg font-semibold shadow">
          Total Admins: {totalAdmins}
        </div>
      </div>

      {/* ================= ADMIN CARD ================= */}
      {admin && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border-l-4 border-green-600">
          <h3 className="text-xl font-semibold mb-2 text-green-700">
            Admin Information
          </h3>

          {admin.image && (
            <img
              src={admin.image}
              alt="Admin"
              className="w-20 h-20 rounded-full object-cover border my-[3px]"
            />
          )}

          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Mobile:</strong> {admin.phone}</p>
          <p><strong>Role:</strong> {admin.role}</p>
        </div>
      )}

      {/* ================= TOGGLE BUTTONS ================= */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => fetchUsers("users")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeType === "users"
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Show Users
        </button>

        <button
          onClick={() => fetchUsers("admins")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeType === "admins"
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Show Admins
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-green-700">
          {activeType === "admins"
            ? "All Admins"
            : "Registered Users"}
        </h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-green-50"
                >
                  <td className="py-2">{index + 1}</td>

                  <td>
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover border my-[3px]"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>{user.name}</td>
                  <td>{user.phone}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleRoleChange(user)}
                      disabled={
                        admin && user._id === admin._id
                      }
                      className="px-4 py-1 rounded-lg font-semibold transition bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminUser;