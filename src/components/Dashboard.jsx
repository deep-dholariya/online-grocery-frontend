import React, { useEffect, useState } from "react";
import API from "../api/axios";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeSection, setActiveSection] = useState("products");

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchDashboard();
  }, []);

  /* ================= PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products?admin=true");

      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  /* ================= DASHBOARD ================= */
  const fetchDashboard = async () => {
    try {
      const res = await API.get("/orders/dashboard");

      if (res.data?.success) {
        setOrders(res.data.recentOrders || []);
        setTotalRevenue(res.data.totalRevenue || 0);
        setPendingOrders(res.data.pendingOrders || 0);
        setTotalOrders(res.data.totalOrders || 0);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };

  /* ================= CALCULATIONS ================= */
  const recentProducts = [...products].slice(0, 10);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* ---------- STATS CARD ---------- */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-green-500 text-white p-6 rounded-xl shadow">
          <h3>Total Products</h3>
          <p className="text-3xl font-bold mt-2">
            {products.length}
          </p>
        </div>

        <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
          <h3>Total Orders</h3>
          <p className="text-3xl font-bold mt-2">
            {totalOrders}
          </p>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-xl shadow">
          <h3>Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">
            ₹{totalRevenue}
          </p>
        </div>

        <div className="bg-orange-500 text-white p-6 rounded-xl shadow">
          <h3>Pending Orders</h3>
          <p className="text-3xl font-bold mt-2">
            {pendingOrders}
          </p>
        </div>
      </div>

      {/* ---------- TOGGLE BUTTONS ---------- */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveSection("products")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeSection === "products"
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Recent Products
        </button>

        <button
          onClick={() => setActiveSection("orders")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeSection === "orders"
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Recent Orders
        </button>
      </div>

      {/* ================= PRODUCTS SECTION ================= */}
      {activeSection === "products" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProducts.length === 0 && (
            <p className="text-gray-500">
              No products added yet.
            </p>
          )}

          {recentProducts.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 flex flex-col"
            >
              <div className="w-full h-[200px] flex items-center justify-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-full object-contain"
                />
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                {item.name}
              </h3>

              <div className="mt-2">
                <span
                  className={`px-4 py-1 text-sm rounded-full font-medium ${
                    item.status === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-gray-600 mt-3">
                {item.description}
              </p>

              <p className="mt-3">
                <span className="font-semibold">Category:</span>{" "}
                {item.category?.name}
              </p>

              <p>
                <span className="font-semibold">SubCategory:</span>{" "}
                {item.subCategory?.name}
              </p>

              <div className="flex items-center gap-3 mt-4">
                <span className="text-green-600 text-2xl font-bold">
                  ₹{item.discountPrice || item.price}
                </span>

                {item.discount > 0 && (
                  <>
                    <span className="text-gray-400 line-through">
                      ₹{item.price}
                    </span>
                    <span className="text-red-500 font-semibold">
                      {item.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <hr className="my-4 border-gray-300" />

              <div className="flex justify-between text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Stock:</span>{" "}
                  {item.currentStock} {item.unit}
                </p>

                <p>
                  <span className="font-semibold">Min:</span>{" "}
                  {item.minQty /
                    (item.unit === "kg" ? 1000 : 1)}{" "}
                  {item.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ORDERS SECTION ================= */}
      {activeSection === "orders" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.length === 0 && (
            <p className="text-gray-500">No orders found.</p>
          )}

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-xl shadow border text-sm"
            >
              <p>
                <span className="font-semibold">Order:</span>{" "}
                {order.orderNumber}
              </p>

              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>

              <hr className="my-3" />

              <p>
                <span className="font-semibold">Account Name:</span>{" "}
                {order.userId?.name || "N/A"}
              </p>

              <p>
                <span className="font-semibold">Account Phone:</span>{" "}
                {order.userId?.phone || "N/A"}
              </p>

              <hr className="my-3" />

              <p>
                <span className="font-semibold">Order Name:</span>{" "}
                {order.address?.fullName}
              </p>

              <p>
                <span className="font-semibold">Order Phone:</span>{" "}
                {order.address?.phone}
              </p>

              <p>
                <span className="font-semibold">Address:</span>{" "}
                {order.address?.street},{order.address?.area},
                {order.address?.city},{order.address?.state},
                {order.address?.country} - {order.address?.pincode}
              </p>

              <hr className="my-3" />

              <p>
                <span className="font-semibold">Payment:</span>{" "}
                {order.paymentMethod} | {order.paymentStatus}
              </p>

              <hr className="my-3" />

              <div>
                <p className="font-semibold mb-2">Items:</p>

                {order.items.map((item, i) => (
                  <div key={i} className="mb-2">
                    <p>{item.productName}</p>

                    <p>
                      Qty: {item.quantity} {item.unit}
                    </p>

                    <p>
                      ₹{item.pricePerUnit} × {item.quantity} = ₹
                      {item.totalPrice}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-3" />

              <p className="font-bold text-lg">
                Total Amount: ₹{order.finalAmount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;