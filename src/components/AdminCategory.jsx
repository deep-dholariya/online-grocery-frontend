import React, { useEffect, useState, useRef } from "react";
import API from "../api/axios";

function AdminCategory() {
  const BASE_URL = "/categories";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    sortOrder: "",
    status: true,
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  /* ===============================
     Load Categories
  =============================== */
  const loadCategories = async () => {
    try {
      const res = await API.get(BASE_URL);
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Load error:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ===============================
     Handle Input Change
  =============================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ===============================
     Handle Image Change
  =============================== */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const objectUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(objectUrl);

    e.target.value = null;
  };

  /* ===============================
     Submit (Add / Update)
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id && !formData.image) {
      alert("Category image is required");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", formData.name);
      form.append("sortOrder", formData.sortOrder);
      form.append("status", formData.status);

      if (formData.image) {
        form.append("image", formData.image);
      }

      if (formData.id) {
        await API.put(`${BASE_URL}/${formData.id}`, form);
      } else {
        await API.post(BASE_URL, form);
      }

      resetForm();
      loadCategories();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     Edit
  =============================== */
  const handleEdit = (cat) => {
    setFormData({
      id: cat._id,
      name: cat.name,
      sortOrder: cat.sortOrder,
      status: cat.status,
      image: null,
    });

    setPreview(cat.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===============================
     Delete
  =============================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await API.delete(`${BASE_URL}/${id}`);
      loadCategories();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* ===============================
     Reset
  =============================== */
  const resetForm = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setFormData({
      id: "",
      name: "",
      sortOrder: "",
      status: true,
      image: null,
    });

    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-8">
        Category Management
      </h2>

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Sort Order</label>
            <input
              type="number"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <span>Active</span>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition shadow"
            >
              {loading ? "Saving..." : formData.id ? "Update" : "Add"}
            </button>

            {formData.id && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition shadow"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="border-2 border-gray-300 rounded-2xl p-10 text-center shadow-sm">
          <h3 className="text-xl font-semibold mb-8">Category Image</h3>

          {preview && (
            <div className="flex justify-center mb-6">
              <img
                src={preview}
                alt="Preview"
                className="w-56 h-56 object-contain"
              />
            </div>
          )}

          <label className="inline-block cursor-pointer">
            <span className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition">
              Upload Image
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </form>

      {/* TABLE SECTION (UI SAME) */}
      <div className="overflow-x-auto">
        <table className="w-full border text-left rounded-lg overflow-hidden">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Sort</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={cat.image}
                    alt=""
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                </td>
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3">{cat.sortOrder}</td>
                <td className="p-3">
                  {cat.status ? (
                    <span className="px-3 py-1 text-sm bg-green-200 text-green-800 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm bg-red-200 text-red-700 rounded-full">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition shadow"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition shadow"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategory;