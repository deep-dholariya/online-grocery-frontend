import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Trash2, Pencil } from "lucide-react";

function AdminFeature() {
  const BASE_URL = "/features";

  const [features, setFeatures] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const res = await API.get(BASE_URL);
      setFeatures(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // 👇 Only send image if selected
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      if (editingId) {
        await API.put(`${BASE_URL}/${editingId}`, formData);
      } else {
        await API.post(BASE_URL, formData);
      }

      resetForm();
      fetchFeatures();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  // EDIT
  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);

    setPreview(item.image);  // show old image
    setImage(null);          // IMPORTANT: reset image state
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feature?")) return;

    try {
      await API.delete(`${BASE_URL}/${id}`);
      fetchFeatures();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setImage(null);
    setPreview(null);
  };

  return (
    <section className="w-full py-10 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">

        <h4 className="text-2xl font-bold mb-8 text-gray-800">
          Admin Feature Section
        </h4>

        {/* Upload Form */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-10">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block font-medium mb-2">Title</label>
              <input
                type="text"
                required
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-green-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Description</label>
              <textarea
                rows="3"
                required
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-green-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className="border rounded-xl p-6 text-center">
              <h3 className="font-semibold mb-4">Feature Image</h3>

              <div className="h-32 flex justify-center items-center mb-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full object-contain"
                  />
                ) : (
                  <p className="text-gray-400">No Image Selected</p>
                )}
              </div>

              <label className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md cursor-pointer transition">
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setImage(file);
                    setPreview(URL.createObjectURL(file));

                    e.target.value = null; // 🔥 allows same image re-select
                  }}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition disabled:opacity-50"
            >
              {loading
                ? editingId
                  ? "Updating Feature..."
                  : "Adding Feature..."
                : editingId
                ? "Update Feature"
                : "Add Feature"}
            </button>

          </form>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {features.map((item) => (
            <FeatureCard
              key={item._id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

      </div>
    </section>
  );
}


// CARD COMPONENT
const FeatureCard = ({ item, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const words = item.description.split(" ");
  const shortText =
    words.length > 10
      ? words.slice(0, 10).join(" ") + "..."
      : item.description;

  const showButton = words.length > 10;

  return (
    <div className="relative bg-white border border-gray-200 rounded-md p-[10px] transition duration-300 hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]">
      <div className="border border-gray-200 rounded-md p-5 text-center flex flex-col h-full">

        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(item._id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="w-full h-32 flex justify-center items-center mb-4">
          <img
            src={item.image}
            alt={item.title}
            className="h-full object-contain"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {item.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4">
          {expanded ? item.description : shortText}
        </p>

        {showButton && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-auto px-4 py-2 border border-gray-800 rounded-md text-sm hover:bg-gray-800 hover:text-white transition"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}

      </div>
    </div>
  );
};

export default AdminFeature;