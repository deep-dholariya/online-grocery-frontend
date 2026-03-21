import React, { useEffect, useState } from "react";
import { FaUser, FaCalendar } from "react-icons/fa";
import { Pencil, Trash2 } from "lucide-react";
import API from "../api/axios";

function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Memory cleanup for blob preview
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ✅ Fetch Blogs
  const fetchBlogs = async () => {
    try {
      setFetchLoading(true);
      const res = await API.get("/blogs");
      setBlogs(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error fetching blogs");
    } finally {
      setFetchLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setAuthor("");
    setImage(null);
    setPreview(null);
  };

  // ✅ Submit Blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("author", author);
      if (image) formData.append("image", image);

      if (editingId) {
        await API.put(`/blogs/${editingId}`, formData);
      } else {
        await API.post("/blogs", formData);
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving blog");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ✅ Edit
  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setTitle(blog.title);
    setDescription(blog.description);
    setAuthor(blog.author);
    setPreview(blog.image);
    setImage(null);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      setDeleteLoadingId(id);
      await API.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting blog");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <section className="w-full  py-10 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">

        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Blog Management
        </h2>

        {/* FORM */}
        <div className="bg-white p-8 rounded-xl shadow-md mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="text"
              placeholder="Title"
              className="w-full border rounded-md p-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Author"
              className="w-full border rounded-md p-3"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />

            <textarea
              rows="4"
              placeholder="Description"
              className="w-full border rounded-md p-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            {/* Image Upload */}
            <div className="border rounded-xl p-6 text-center">
              <h3 className="font-semibold mb-4">Blog Image</h3>

              <div className="h-40 flex justify-center items-center mb-4">
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
                {image ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    // Old blob cleanup
                    if (preview && preview.startsWith("blob:")) {
                      URL.revokeObjectURL(preview);
                    }

                    setImage(file);
                    setPreview(URL.createObjectURL(file));

                    e.target.value = null; // 🔥 IMPORTANT (allows same image re-select)
                  }}
                />
              </label>
            </div>

            <button
              disabled={submitLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition disabled:opacity-50"
            >
              {submitLoading
                ? editingId
                  ? "Updating..."
                  : "Adding..."
                : editingId
                  ? "Update Blog"
                  : "Add Blog"}
            </button>

          </form>
        </div>

        {/* BLOG LIST */}
        {fetchLoading ? (
          <div className="text-center font-semibold text-green-700">
            Loading blogs...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <AdminBlogCard
                key={blog._id}
                blog={blog}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleteLoadingId={deleteLoadingId}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

// 🔹 Blog Card
const AdminBlogCard = ({ blog, onEdit, onDelete, deleteLoadingId }) => {
  const [expanded, setExpanded] = useState(false);
  const words = blog.description.trim().split(/\s+/);
  const showButton = words.length > 10;

  return (
    <div className="relative bg-white shadow-md rounded-md overflow-hidden">

      <div className="absolute top-3 right-3 flex gap-2">
        <button onClick={() => onEdit(blog)} className="text-blue-500">
          <Pencil size={16} />
        </button>

        <button
          onClick={() => onDelete(blog._id)}
          className="text-red-500"
          disabled={deleteLoadingId === blog._id}
        >
          {deleteLoadingId === blog._id ? "Deleting..." : <Trash2 size={16} />}
        </button>
      </div>

      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-56 object-cover"
        onError={(e) =>
        (e.target.src =
          "https://via.placeholder.com/400x300?text=No+Image")
        }
      />

      <div className="p-6">

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <FaUser className="text-green-600" />
            <span>By {blog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendar className="text-green-600" />
            <span>
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-sm mb-6">
          {expanded
            ? blog.description
            : words.slice(0, 10).join(" ") +
            (showButton ? "..." : "")}
        </p>

        {showButton && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-6 py-2 border border-gray-800 rounded-md hover:bg-gray-800 hover:text-white transition"
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}

      </div>
    </div>
  );
};

export default AdminBlog;