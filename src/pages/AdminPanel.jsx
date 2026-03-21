import React, { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import Products from "../components/AdminProducts";
import AdminOrders from "../components/AdminOrders";
import UsersSection from "../components/AdminUser";
import AdminFeature from "../components/AdminFeature";
import AdminBlog from "../components/AdminBlog";
import AdminHero from "../components/AdminHero";
import AdminCategoryManager from "../components/AdminCategoryManager";
import AdminAreaManager from "../components/AdminAreaManager";
import AdminDeliveryBoy from "../components/AdminDeliveryBoy.jsx";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");

  /* ---------------- CATEGORY DATA ---------------- */
  const categoryData = {
    Vegetables: ["Leafy", "Root", "Seasonal"],
    Fruits: ["Citrus", "Tropical", "Dry"],
    Dairy: ["Milk", "Cheese", "Butter"],
    Grocery: ["Rice", "Oil", "Spices"],
  };

  const categories = Object.keys(categoryData);

  /* ---------------- DEFAULT PRODUCTS ---------------- */
  const defaultProducts = [
    {
      id: 1,
      name: "Fresh Tomato",
      price: 40,
      description: "Fresh farm red tomatoes",
      image: "https://images.unsplash.com/photo-1582281298055-e25b84a30b0b",
      category: "Vegetables",
      subCategory: "Seasonal",
      addedBy: "Admin Deep",
    },
    {
      id: 2,
      name: "Potato",
      price: 30,
      description: "Organic farm potatoes",
      image: "https://images.unsplash.com/photo-1518976024611-4885d1e4caa8",
      category: "Vegetables",
      subCategory: "Root",
      addedBy: "Rahul Sharma",
    },
    {
      id: 3,
      name: "Fresh Milk",
      price: 60,
      description: "Pure cow milk 1L",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      category: "Dairy",
      subCategory: "Milk",
      addedBy: "Admin Deep",
    },
  ];

  /* ---------------- DEFAULT ORDERS ---------------- */
  const defaultOrders = [
    {
      id: "ORD101",
      user: "Rahul Sharma",
      date: "23 Feb 2026",
      location: "Ahmedabad, Gujarat",
      payment: "Prepaid",
      status: "Pending",
      items: [
        { name: "Fresh Tomato", qty: 2, price: 40 },
        { name: "Potato", qty: 3, price: 30 },
      ],
    },
    {
      id: "ORD102",
      user: "Priya Patel",
      date: "22 Feb 2026",
      location: "Surat, Gujarat",
      payment: "COD",
      status: "Accepted",
      items: [{ name: "Milk", qty: 2, price: 60 }],
    },
  ];

  /* ---------------- SAFE LOAD ---------------- */
  const storedProducts = JSON.parse(localStorage.getItem("adminProducts"));
  const storedOrders = JSON.parse(localStorage.getItem("adminOrders"));

  const [products, setProducts] = useState(
    storedProducts && storedProducts.length > 0
      ? storedProducts
      : defaultProducts
  );

  const [orders, setOrders] = useState(
    storedOrders && storedOrders.length > 0
      ? storedOrders
      : defaultOrders
  );

  /* ---------------- SAVE TO LOCAL STORAGE ---------------- */
  useEffect(() => {
    localStorage.setItem("adminProducts", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("adminOrders", JSON.stringify(orders));
  }, [orders]);

  /* ---------------- UPDATE ORDER STATUS ---------------- */
  const updateOrderStatus = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  /* ---------------- REVENUE CALCULATION ---------------- */
  const revenue = orders.reduce((total, order) => {
    if (Array.isArray(order.items)) {
      const orderTotal = order.items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
      return total + orderTotal;
    }
    return total;
  }, 0);

  return (
    <div className="bg-green-50 mt-16">
      
      {/* ================= SIDEBAR (FIXED) ================= */}
      <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-green-800 text-white p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <ul className="space-y-3">
          <li onClick={() => setActiveTab("dashboard")} className="cursor-pointer hover:bg-green-700 p-2 rounded">
            Dashboard
          </li>

          <li onClick={() => setActiveTab("products")} className="cursor-pointer hover:bg-green-700 p-2 rounded">
            Products
          </li>

          <li onClick={() => setActiveTab("orders")} className="cursor-pointer hover:bg-green-700 p-2 rounded">
            Orders
          </li>

          <li onClick={() => setActiveTab("users")} className="cursor-pointer hover:bg-green-700 p-2 rounded">
            Users
          </li>

          <li onClick={() => setActiveTab("feature")} className="cursor-pointer hover:bg-green-700 p-2 rounded">
            Feature
          </li>

          <li onClick={() => setActiveTab("category")} className="cursor-pointer hover:bg-green-700 p-2 rounded">
            Category
          </li>

          <li onClick={() => setActiveTab("area")} className="cursor-pointer hover:bg-green-700 p-2 rounded">
            Area
          </li>

          <li onClick={() => setActiveTab("deliveryBoy")} className="cursor-pointer hover:bg-green-700 p-2 rounded">
            Delivery Boys
          </li>

          <li onClick={() => setActiveTab("blog")} className="cursor-pointer hover:bg-green-700 p-2 rounded">
            Blog
          </li>

          <li onClick={() => setActiveTab("header")} className="cursor-pointer hover:bg-green-700 p-2 rounded">
            Hero
          </li>
        </ul>
      </div>

      {/* ================= MAIN CONTENT (SCROLLABLE) ================= */}
      <div className="ml-64 p-8 min-h-screen overflow-y-auto">
        {activeTab === "dashboard" && (
          <Dashboard products={products} orders={orders} revenue={revenue} />
        )}

        {activeTab === "products" && (
          <Products
            products={products}
            setProducts={setProducts}
            categoryData={categoryData}
            categories={categories}
          />
        )}

        {activeTab === "orders" && (
          <AdminOrders
            orders={orders}
            updateOrderStatus={updateOrderStatus}
          />
        )}

        {activeTab === "users" && <UsersSection />}
        {activeTab === "feature" && <AdminFeature />}
        {activeTab === "category" && <AdminCategoryManager />}
        {activeTab === "blog" && <AdminBlog />}
        {activeTab === "area" && <AdminAreaManager />}
        {activeTab === "header" && <AdminHero />}
        {activeTab === "deliveryBoy" && <AdminDeliveryBoy />}
      </div>
    </div>
  );
}

export default AdminPanel;