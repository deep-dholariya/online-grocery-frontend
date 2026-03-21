import React, { useEffect, useState } from "react";
import API from "../api/axios";

function AdminSubCategory() {
  const CATEGORY_API = "/categories";
  const SUBCATEGORY_API = "/subcategories";

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    sortOrder: "",
    status: true,
    image: null,
  });

  const [preview, setPreview] = useState(null);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      const catRes = await API.get(CATEGORY_API);
      const subRes = await API.get(SUBCATEGORY_API);

      setCategories(catRes.data.data || []);
      setSubCategories(subRes.data.data || []);
    } catch (err) {
      console.error("Load Error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id && !formData.image) {
      alert("Please select an image");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("sortOrder", formData.sortOrder);
      form.append("status", formData.status);

      if (formData.image) {
        form.append("image", formData.image);
      }

      if (formData.id) {
        await API.put(`${SUBCATEGORY_API}/${formData.id}`, form);
      } else {
        await API.post(SUBCATEGORY_API, form);
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (sub) => {
    setFormData({
      id: sub._id,
      name: sub.name,
      category: sub.category?._id || "",
      sortOrder: sub.sortOrder,
      status: sub.status,
      image: null,
    });

    setPreview(sub.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subcategory?")) return;

    try {
      await API.delete(`${SUBCATEGORY_API}/${id}`);
      loadData();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const resetForm = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setFormData({
      id: "",
      name: "",
      category: "",
      sortOrder: "",
      status: true,
      image: null,
    });

    setPreview(null);
  };

  /* ================= FILTER ================= */
  const filteredSubCategories = subCategories.filter((sub) =>
    selectedCategory ? sub.category?._id === selectedCategory : true
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold text-green-700 mb-8">
        SubCategory Management
      </h2>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">

          <div>
            <label className="block mb-2 font-medium">Parent Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">SubCategory Name</label>
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

        {/* IMAGE */}
        <div className="border-2 border-gray-300 rounded-2xl p-10 text-center shadow-sm">
          <h3 className="text-xl font-semibold mb-8">SubCategory Image</h3>

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
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </form>

      {/* ================= FILTER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-700">
          SubCategory List
        </h3>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded-lg focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full border text-left rounded-lg overflow-hidden">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Sort</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubCategories.map((sub) => (
              <tr key={sub._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={sub.image}
                    alt=""
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                </td>
                <td className="p-3 font-medium">{sub.name}</td>
                <td className="p-3">{sub.category?.name}</td>
                <td className="p-3">{sub.sortOrder}</td>
                <td className="p-3">
                  {sub.status ? (
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
                      onClick={() => handleEdit(sub)}
                      className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 shadow"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 shadow"
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

export default AdminSubCategory;