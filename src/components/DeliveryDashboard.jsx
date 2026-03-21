import React, { useEffect, useState } from "react";
import API from "../api/axios";

function DeliveryDashboard() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelData, setCancelData] = useState({
    orderId: null,
    reason: ""
  });

  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ FIXED STATE
  const [deliveryStatus, setDeliveryStatus] = useState("");

  const statusList = [
    "packing",
    "ready_for_delivery",
    "out_for_delivery",
    "delivered"
  ];

  const cancelReasons = [
    "Customer not available",
    "Wrong address",
    "Customer rejected order",
    "Payment issue",
    "Other"
  ];

  const fetchOrders = async () => {
    try {
      console.log("🚀 API CALL START");

      const res = await API.get("/delivery-boy/my-current-orders");

      console.log("✅ API RESPONSE:", res.data);

      setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);

    } catch (error) {
      console.log("❌ API ERROR:", error);
      console.log("❌ ERROR RESPONSE:", error?.response?.data);

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: fetch delivery status also
  useEffect(() => {
    console.log("📦 Dashboard Loaded");

    const fetchDeliveryStatus = async () => {
      try {
        const res = await API.get("/delivery-boy/me");
        setDeliveryStatus(res.data?.status);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDeliveryStatus();
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/delivery-boy/order/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      if (!cancelData.reason) {
        alert("Please enter cancel reason");
        return;
      }

      await API.put(`/delivery-boy/order/${cancelData.orderId}/status`, {
        status: "cancelled",
        cancelReason: cancelData.reason
      });

      setCancelData({ orderId: null, reason: "" });
      fetchOrders();

    } catch (error) {
      console.log(error);
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(o => o.status === statusFilter);

  const successfulPayments = orders.filter(o =>
    o.status === "delivered" &&
    (o.paymentStatus === "paid" || o.paymentMethod === "COD")
  );

  const codTotal = successfulPayments
    .filter(o => o.paymentMethod === "COD")
    .reduce((sum, o) => sum + (o.finalAmount || 0), 0);

  const onlineTotal = successfulPayments
    .filter(o => o.paymentMethod === "ONLINE")
    .reduce((sum, o) => sum + (o.finalAmount || 0), 0);

  const grandTotal = codTotal + onlineTotal;

  return (
    <div style={{
      padding: "20px",
      background: "#f9f9f9",
      minHeight: "100vh",
      marginTop: "50px"
    }}>

      {successfulPayments.length > 0 && (
        <div style={{
          background: "#e8f5e9",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
          border: "1px solid #c8e6c9"
        }}>
          <h3>💰 Payment Summary</h3>

          <p><b>COD Collected:</b> ₹{codTotal}</p>
          <p><b>ONLINE Received:</b> ₹{onlineTotal}</p>
          <hr />
          <p><b>Total Collection:</b> ₹{grandTotal}</p>
        </div>
      )}

      <h2 style={{ marginBottom: "20px" }}>🚚 Current Orders</h2>

      {/* ✅ ACTIVE / INACTIVE BUTTONS */}
      <div style={{ marginBottom: "15px" }}>
        {["active", "inactive"].map((type) => (
          <button
            key={type}

            onClick={async () => {
  if (type === "inactive") {
    const hasActiveOrders = orders.some(
      o => o.status !== "delivered" && o.status !== "cancelled"
    );

    if (hasActiveOrders) {
      alert("You cannot go inactive while having active orders");
      return;
    }
  }

  try {
    await API.put(`/delivery-boy/status`, {
      status: type
    });

    setDeliveryStatus(type);

  } catch (error) {
    console.log(error);
    alert("Status update failed");
  }
}}

            disabled={
              type === "inactive" &&
              orders.some(o => o.status !== "delivered" && o.status !== "cancelled")
            }

            style={{
              marginRight: "10px",
              padding: "6px 14px",
              borderRadius: "6px",
              border: "none",
              cursor:
                type === "inactive" &&
                  orders.some(o => o.status !== "delivered" && o.status !== "cancelled")
                  ? "not-allowed"
                  : "pointer",
              background: deliveryStatus === type ? "#28a745" : "#ccc", // ✅ FIXED
              color: deliveryStatus === type ? "#fff" : "#000", // ✅ FIXED
              opacity:
                type === "inactive" &&
                  orders.some(o => o.status !== "delivered" && o.status !== "cancelled")
                  ? 0.5
                  : 1
            }}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* बाकी code SAME (unchanged) */}
      {/* 👇 No changes below */}

      {/* FILTER BUTTONS */}
      <div style={{ marginBottom: "20px" }}>
        {["all", ...statusList, "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              marginRight: "8px",
              marginBottom: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background:
                statusFilter === status ? "#007bff" : "#ddd",
              color:
                statusFilter === status ? "#fff" : "#000"
            }}
          >
            {status.replaceAll("_", " ")}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {!loading && filteredOrders.length === 0 && <p>No orders found</p>}

      {!loading && filteredOrders.length > 0 &&
        filteredOrders.map((order, index) => (

          <div key={order._id || index} style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px",
            background: "#fff"
          }}>

            <h4>Order: {order.orderNumber}</h4>

            <p>
              <b>Status:</b>{" "}
              <span style={{
                color: "white",
                background:
                  order.status === "delivered"
                    ? "green"
                    : order.status === "cancelled"
                      ? "red"
                      : "#007bff",
                padding: "3px 8px",
                borderRadius: "5px"
              }}>
                {order.status.replaceAll("_", " ")}
              </span>
            </p>

            {/* ✅ ACCOUNT DETAILS */}
            <p>
              <b>Account Name:</b> {order?.userId?.name || "N/A"}
            </p>
            <p>
              <b>Account Phone:</b> {order?.userId?.phone || "N/A"}
            </p>

            {/* ✅ ORDER TIME DETAILS */}
            <p>
              <b>Order Name:</b> {order?.address?.fullName || "N/A"}
            </p>
            <p>
              <b>Order Phone:</b> {order?.address?.phone || "N/A"}
            </p>

            <p>
              <b>Address:</b>{" "}
              {order?.address?.street},
              {order?.address?.area},
              {order?.address?.city},
              {order?.address?.state},
              {order?.address?.country} - {order?.address?.pincode}
            </p>

            <p>
              <b>Payment:</b> {order.paymentMethod} |
              <span style={{
                color: order.paymentStatus === "paid" ? "green" : "red",
                marginLeft: "5px"
              }}>
                {order.paymentStatus}
              </span>
            </p>

            <h5>Items:</h5>

            {order.items?.map((item, i) => (
              <div key={i} style={{
                background: "#f5f5f5",
                padding: "10px",
                marginBottom: "8px",
                borderRadius: "8px"
              }}>
                <div style={{ fontWeight: "600" }}>{item.productName}</div>
                <div style={{ fontSize: "13px" }}>
                  Qty: {item.quantity} {item.unit}
                </div>
                <div>
                  ₹{item.pricePerUnit} × {item.quantity} = ₹{item.totalPrice}
                </div>
              </div>
            ))}

            <p><b>Total Amount:</b> ₹{order.finalAmount}</p>

            {order.status === "cancelled" && (
              <p style={{ color: "red", marginTop: "5px" }}>
                <b>Cancel Reason:</b> {order.cancelReason || "No reason provided"}
              </p>
            )}

            {order.status !== "delivered" && order.status !== "cancelled" && (
              <div style={{ marginTop: "10px" }}>
                {statusList.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(order._id, status)}
                    style={{
                      marginRight: "8px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "none",
                      background:
                        order.status === status ? "#28a745" : "#ddd"
                    }}
                  >
                    {status.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            )}

            {order.status !== "delivered" && order.status !== "cancelled" && (
              <button
                onClick={() =>
                  setCancelData({ orderId: order._id, reason: "" })
                }
                style={{
                  background: "red",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  marginTop: "10px"
                }}
              >
                Cancel Order
              </button>
            )}

          </div>
        ))
      }

      {cancelData.orderId && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999
        }}>
          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            width: "300px"
          }}>
            <h3>Cancel Order</h3>

            {cancelReasons.map((r, i) => (
              <div key={i}>
                <label>
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r}
                    checked={cancelData.reason === r}
                    onChange={(e) =>
                      setCancelData({
                        ...cancelData,
                        reason: e.target.value
                      })
                    }
                  /> {r}
                </label>
              </div>
            ))}

            <input
              type="text"
              placeholder="Other reason"
              disabled={cancelReasons.includes(cancelData.reason)}
              value={
                cancelReasons.includes(cancelData.reason)
                  ? ""
                  : cancelData.reason
              }
              onChange={(e) =>
                setCancelData({
                  ...cancelData,
                  reason: e.target.value
                })
              }
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "6px"
              }}
            />

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                onClick={handleCancelOrder}
                style={{ flex: 1, background: "red", color: "#fff" }}
              >
                Confirm
              </button>

              <button
                onClick={() =>
                  setCancelData({ orderId: null, reason: "" })
                }
                style={{ flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DeliveryDashboard;