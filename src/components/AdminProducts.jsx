import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import API from "../api/axios";
import ProductStockTabs from "./ProductStockTabs";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("product");

  const [categories, setCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    price: "",
    discount: "",
    minQty: "",
    unit: "kg",
    stock: "",
    status: "active",
    image: null,
  });

  /* ================= LOAD CATEGORIES ================= */
  const loadCategories = async () => {
    const res = await API.get("/categories");
    const data = res.data;
    setCategories(Array.isArray(data) ? data : data.data);
  };


  /* ================= LOAD SUBCATEGORIES ================= */
  const loadSubCategories = async () => {
    const res = await API.get("/subcategories");
    const data = res.data;
    const list = Array.isArray(data) ? data : data.data;
    setAllSubCategories(list);
  };

  /* ================= LOAD PRODUCTS ================= */
  const loadProducts = async () => {
    const res = await API.get("/products?admin=true");
    setProducts(res.data);
  };

  useEffect(() => {
    loadCategories();
    loadSubCategories();
    loadProducts();
  }, []);

  /* ================= FILTER SUBCATEGORY ================= */
  useEffect(() => {
    if (!formData.category) {
      setSubCategories([]);
      return;
    }

    const filtered = allSubCategories.filter(
      (sub) =>
        sub.category === formData.category ||
        sub.category?._id === formData.category
    );

    setSubCategories(filtered);
  }, [formData.category, allSubCategories]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        status: checked ? "active" : "inactive",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* ================= ADD / UPDATE PRODUCT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // START LOADING

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (
        formData[key] !== null &&
        formData[key] !== "" &&
        formData[key] !== undefined
      ) {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = editId
        ? await API.put(`/products/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        : await API.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      const result = res.data;

      alert("Product Saved Successfully");

      setFormData({
        name: "",
        description: "",
        category: "",
        subCategory: "",
        price: "",
        discount: "",
        minQty: "",
        unit: "kg",
        stock: "",
        status: "active",
        image: null,
      });

      setImagePreview(null);
      setEditId(null);
      loadProducts();
    } catch (error) {

      const message =
        error.response?.data?.message || "Something went wrong";

      alert(message);

    }

    setLoading(false); // STOP LOADING
  };
  /* ================= EDIT PRODUCT ================= */
  const handleEdit = (product) => {
    setEditId(product._id);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category?._id || "",
      subCategory: product.subCategory?._id || "",
      price: product.price || "",
      discount: product.discount || "",

      minQty:
        product.unit === "kg"
          ? product.minQty / 1000
          : product.minQty,

      unit: product.unit || "kg",

      stock:
        product.unit === "kg"
          ? product.stock / 1000
          : product.stock,

      status: product.status || "inactive",
      image: null,
    });

    setImagePreview(product.image || null);
    setActiveTab("product");
  };

  /* ================= DELETE PRODUCT ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    await API.delete(`/products/${id}`);

    loadProducts();
  };

  return (
    <div className="bg-[#fff] p-8 rounded-3xl">
      {/* Top Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("product")}
          className={`px-6 py-2 rounded-lg font-semibold ${activeTab === "product"
            ? "bg-green-600 text-white"
            : "bg-gray-300"
            }`}
        >
          Product
        </button>

        <button
          onClick={() => setActiveTab("stock")}
          className={`px-6 py-2 rounded-lg font-semibold ${activeTab === "stock"
            ? "bg-green-600 text-white"
            : "bg-gray-300"
            }`}
        >
          Product Stock
        </button>

      </div>

      {/* PRODUCT TAB */}
      {activeTab === "product" && (
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">
            {editId ? "Edit Product" : "Add / Edit Product"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* LEFT SIDE FORM */}
              <div className="md:col-span-2 space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />

                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2"
                  >
                    <option value="">Select SubCategory</option>
                    {subCategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2"
                  />

                  <input
                    type="number"
                    name="discount"
                    placeholder="Discount %"
                    value={formData.discount}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex">
                    <input
                      type="number"
                      name="minQty"
                      placeholder="Min Quantity"
                      value={formData.minQty}
                      onChange={handleChange}
                      className="w-full border rounded-l-lg px-4 py-2"
                    />
                    <div className="bg-gray-100 border border-l-0 px-4 flex items-center rounded-r-lg">
                      {formData.unit}
                    </div>
                  </div>

                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2"
                  >
                    <option value="kg">KG</option>
                    <option value="gm">GM</option>
                  </select>
                </div>

                <div className="flex">
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border rounded-l-lg px-4 py-2"
                  />
                  <div className="bg-gray-100 border border-l-0 px-4 flex items-center rounded-r-lg">
                    {formData.unit}
                  </div>
                </div>

                {/* Status Checkbox */}
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status === "active"}
                    onChange={handleChange}
                    className="w-4 h-4 accent-green-600"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active Product
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-70"
                >
                  {loading
                    ? editId
                      ? "Updating Product..."
                      : "Adding Product..."
                    : editId
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>

              {/* IMAGE BOX */}
              <div className="border rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Product Image
                </h3>

                <div className="w-full h-40 rounded-lg flex items-center justify-center mb-4 overflow-hidden bg-white">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">
                      No Image Selected
                    </span>
                  )}
                </div>

                <label className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition">
                  Upload Image
                  <input
                    type="file"
                    name="image"
                    hidden
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>
          </form>

          {/* PRODUCT LIST */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((prod) => {
              const discount = Number(prod.discount) || 0;
              const originalPrice = Number(prod.price) || 0;
              const discountPrice =
                discount > 0
                  ? Math.round(
                    originalPrice -
                    (originalPrice * discount) / 100
                  )
                  : originalPrice;

              return (
                <div
                  key={prod._id}
                  className="bg-white shadow-sm border border-gray-300 p-5 hover:shadow-md transition duration-200 relative"
                >
                  {/* Top Right Icons */}
                  <div className="absolute top-3 right-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>

                  {/* Image Section */}
                  <div className="flex justify-center items-center bg-white p-4 mb-4 h-44">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-full object-contain"
                    />
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {prod.name}
                  </h3>

                  {/* Status Badge */}
                  <div className="mb-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${prod.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {prod.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-3">
                    {prod.description}
                  </p>

                  {/* Category & SubCategory */}
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p>
                      <span className="font-medium text-gray-700">Category:</span>{" "}
                      {prod.category?.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">SubCategory:</span>{" "}
                      {prod.subCategory?.name || "N/A"}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-600 text-lg font-bold">
                      ₹{discountPrice}
                    </span>

                    {discount > 0 && (
                      <>
                        <span className="line-through text-gray-400 text-sm">
                          ₹{originalPrice}
                        </span>
                        <span className="text-red-500 text-xs font-semibold">
                          {discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stock & Min */}
                  <div className="flex justify-between text-sm text-gray-600 border-t pt-3">
                    <span>
                      <span className="font-medium text-gray-700">Stock:</span>{" "}
                      {prod.currentStock} {prod.unit}
                    </span>
                    <span>
                      <span className="font-medium text-gray-700">Min:</span>{" "}
                      {prod.unit === "kg" ? prod.minQty / 1000 : prod.minQty} {prod.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STOCK TAB */}
      {activeTab === "stock" && (
        <ProductStockTabs refreshProducts={loadProducts} />
      )}
    </div>
  );
};

export default ProductTabs;