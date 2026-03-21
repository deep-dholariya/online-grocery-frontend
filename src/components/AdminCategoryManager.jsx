import React, { useState } from "react";
import AdminCategory from "./AdminCategory";
import AdminSubCategory from "./AdminSubCategory"; // tumhara dusra page

function AdminCategoryManager() {
  const [activeTab, setActiveTab] = useState("category");

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">

      {/* TOP BUTTONS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("category")}
          className={`px-6 py-2 rounded-lg font-medium transition shadow ${
            activeTab === "category"
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Category
        </button>

        <button
          onClick={() => setActiveTab("subcategory")}
          className={`px-6 py-2 rounded-lg font-medium transition shadow ${
            activeTab === "subcategory"
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          SubCategory
        </button>
      </div>

      {/* CONTENT SWITCH */}
      {activeTab === "category" ? (
        <AdminCategory />
      ) : (
        <AdminSubCategory />
      )}
    </div>
  );
}

export default AdminCategoryManager;