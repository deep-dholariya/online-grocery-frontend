import React, { useEffect, useState } from "react";
import API from "../api/axios";
import SectionTitle from "../components/SectionTitle";

const Order = () => {

    const [orders, setOrders] = useState([]);
    const [cancelReason, setCancelReason] = useState({});
    const [customReason, setCustomReason] = useState({});

    const cancelOptions = [
        "Product quality not good",
        "Ordered by mistake",
        "Delivery time too long",
        "Found cheaper elsewhere",
        "Other"
    ];

    const fetchOrders = async () => {
        try {
            const res = await API.get("/orders/my-orders");
            setOrders(res.data.orders || []);
        } catch (error) {
            console.log("Order fetch error:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const cancelOrder = async (orderId) => {

        try {

            let reason = cancelReason[orderId];

            if (!reason) {
                alert("Please select cancel reason");
                return;
            }

            if (reason === "Other") {

                if (!customReason[orderId] || customReason[orderId].trim() === "") {
                    alert("Please enter cancel reason");
                    return;
                }

                reason = customReason[orderId];

            }

            await API.put(`/orders/${orderId}/status`, {
                status: "cancelled",
                cancelReason: reason
            });

            alert("Order cancelled successfully");

            fetchOrders();

        } catch (error) {

            console.log(error);
            alert("Cancel failed");

        }

    };

    return (

        <section className="w-full min-h-screen bg-[#f6fbf6] pt-[100px] px-4 pb-16">

            <SectionTitle id="orders" highlightText="Orders" firstText="My" />

            <div className="max-w-4xl mx-auto mt-8 grid gap-5">

                {orders.length === 0 && (

                    <div className="text-center py-16">

                        <h2 className="text-xl font-semibold text-gray-600">
                            No orders found
                        </h2>

                        <p className="text-gray-400 mt-2">
                            Your orders will appear here
                        </p>

                    </div>

                )}

                {orders.map((order) => (

                    <div
                        key={order._id}
                        className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 hover:shadow-md transition"
                    >

                        <div className="flex justify-between items-start mb-3">

                            <div>

                                <h2 className="text-md font-bold text-green-700">
                                    Order #{order.orderNumber}
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Status:
                                    <span className="ml-1 capitalize font-semibold text-green-600">
                                        {order.status}
                                    </span>
                                </p>

                            </div>

                            <div className="text-right">

                                <p className="text-sm text-gray-600">
                                    Items: ₹{order.grandTotal}
                                </p>

                                <p className="text-sm text-gray-600">
                                    Delivery: ₹{order.deliveryCharge}
                                </p>

                                <p className="text-lg font-bold text-green-700">
                                    Total: ₹{order.finalAmount}
                                </p>

                                <div className="text-xs text-gray-500">
                                    <p>
                                        Payment Method:
                                        <span className="ml-1 font-semibold">
                                            {order.paymentMethod}
                                        </span>
                                    </p>

                                    <p>
                                        Payment Status:
                                        <span
                                            className={`ml-1 font-semibold ${order.paymentStatus === "paid"
                                                ? "text-green-600"
                                                : order.paymentStatus === "failed"
                                                    ? "text-red-600"
                                                    : "text-yellow-600"
                                                }`}
                                        >
                                            {order.paymentStatus}
                                        </span>
                                    </p>
                                </div>

                            </div>

                        </div>

                        <div className="border-t pt-3 grid gap-3">

                            {order.items.map((item, index) => {

                                const originalPrice = item.originalPrice || item.pricePerUnit;
                                const discount = item.discount || 0;
                                const discountPrice = item.pricePerUnit;

                                return (

                                    <div
                                        key={index}
                                        className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
                                    >

                                        <div>

                                            <p className="font-medium text-gray-800 text-sm">
                                                {item.productName}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Qty: {item.quantity} {item.unit} | Min: {item.minQuantity} {item.unit}
                                            </p>

                                            <div className="flex items-center gap-2 mt-1">

                                                <span className="line-through text-gray-400 text-xs">
                                                    ₹{originalPrice}
                                                </span>

                                                {discount > 0 && (
                                                    <span className="text-red-500 text-xs font-semibold">
                                                        {discount}% OFF
                                                    </span>
                                                )}

                                                <span className="text-green-600 font-semibold text-sm">
                                                    ₹{discountPrice}
                                                </span>

                                            </div>

                                        </div>

                                        <p className="font-bold text-green-700 text-sm">
                                            ₹{item.totalPrice}
                                        </p>

                                    </div>

                                );

                            })}

                        </div>

                        {order.address && (

                            <div className="border-t mt-3 pt-3 text-xs text-gray-600">

                                <p>
                                    <b>Address:</b>{" "}
                                    {order?.address?.street},
                                    {order?.address?.area},
                                    {order?.address?.city},
                                    {order?.address?.state},
                                    {order?.address?.country} - {order?.address?.pincode}
                                </p>

                            </div>

                        )}

                        {order.status === "placed" &&
                            (order.paymentMethod === "COD" || order.paymentStatus === "paid") && (

                                <div className="border-t mt-3 pt-3 flex flex-col gap-2">

                                    <select
                                        className="border text-sm p-2 rounded-md"
                                        onChange={(e) =>
                                            setCancelReason({
                                                ...cancelReason,
                                                [order._id]: e.target.value
                                            })
                                        }
                                    >

                                        <option value="">Select cancel reason</option>

                                        {cancelOptions.map((reason, i) => (

                                            <option key={i} value={reason}>
                                                {reason}
                                            </option>

                                        ))}

                                    </select>

                                    {cancelReason[order._id] === "Other" && (

                                        <input
                                            type="text"
                                            placeholder="Enter custom reason"
                                            className="border p-2 text-sm rounded-md"
                                            onChange={(e) =>
                                                setCustomReason({
                                                    ...customReason,
                                                    [order._id]: e.target.value
                                                })
                                            }
                                        />

                                    )}

                                    <button
                                        onClick={() => cancelOrder(order._id)}
                                        className="bg-red-600 text-white text-sm py-2 rounded-md hover:bg-red-700 transition"
                                    >

                                        Cancel Order

                                    </button>

                                </div>

                            )}

                        {order.status === "cancelled" && (

                            <div className="border-t mt-3 pt-3 text-red-600 text-xs space-y-1">

                                <p>
                                    Cancel Reason: <span className="font-semibold">{order.cancelReason}</span>
                                </p>

                                <p>
                                    Cancelled By: <span className="font-semibold capitalize">{order.cancelledBy}</span>
                                </p>



                            </div>

                        )}
                    </div>

                ))}

            </div>

        </section>

    );

};

export default Order;