import React, { useEffect, useState } from "react";
import API from "../api/axios";
import SectionTitle from "../components/SectionTitle";

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");

  const [areaData, setAreaData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [deliveryBoys, setDeliveryBoys] = useState({});
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong";
      alert(message);
    }
  };

  const fetchAreaData = async () => {
    try {
      const res = await API.get("/areas/get-areas");
      if (res.data.success) {
        const data = res.data.data;
        setAreaData(data);

        const uniqueCountries = [...new Set(data.map(d => d.country))];
        setCountries(uniqueCountries);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAreaData();
  }, []);

  useEffect(() => {
    orders.forEach(order => {
      if (!deliveryBoys[order._id]) {
        fetchDeliveryBoys(order._id);
      }
    });
  }, [orders]);

  const handleCountry = (value) => {
    setCountry(value);
    setState("");
    setCity("");
    setAreaFilter("all");

    const filteredStates = [
      ...new Set(
        areaData
          .filter(a => a.country === value)
          .map(a => a.state)
      )
    ];
    setStates(filteredStates);
  };

  const handleState = (value) => {
    setState(value);
    setCity("");
    setAreaFilter("all");

    const filteredCities = areaData.filter(
      a => a.country === country && a.state === value
    );

    setCities(filteredCities);
  };

  const handleCity = (value) => {
    setCity(value);
    setAreaFilter("all");

    const cityData = areaData.find(
      a => a.country === country && a.state === state && a.city === value
    );

    setAreas(cityData?.areas || []);
  };

  const fetchDeliveryBoys = async (orderId) => {
    try {
      const res = await API.get(`/orders/order/${orderId}/delivery-boys`);

      if (res.data.success) {
        setDeliveryBoys(prev => ({
          ...prev,
          [orderId]: res.data.deliveryBoys || []
        }));
      }

    } catch (error) {
      console.log(error);
    }
  };

  const assignDeliveryBoy = async (orderId) => {
    try {

      const deliveryBoyId = selectedDeliveryBoy[orderId];

      if (!deliveryBoyId) {
        return alert("Select delivery boy");
      }

      const res = await API.put(
        `/orders/order/${orderId}/assign-delivery`,
        { deliveryBoyId }
      );

      if (res.data.success) {
        alert("Assigned successfully");

        await fetchOrders();
        fetchDeliveryBoys(orderId);
      }

    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong";
      alert(message);
    }
  };

  const filteredOrders = orders.filter((order) => {

    let statusMatch = true;
    let areaMatch = true;

    if (filter !== "all") {
      if (filter === "cancelled_user") {
        statusMatch = order.status === "cancelled" && order.cancelledBy === "user";
      } else if (filter === "cancelled_admin") {
        statusMatch = order.status === "cancelled" && order.cancelledBy === "admin";
      } else {
        statusMatch = order.status === filter;
      }
    }

    if (areaFilter !== "all") {
      const orderArea = order?.address?.area?.toLowerCase()?.trim();
      const selectedArea = areaFilter?.toLowerCase()?.trim();
      areaMatch = orderArea === selectedArea;
    }

    return statusMatch && areaMatch;
  });

  const statusColor = (status) => {
    switch (status) {
      case "placed": return "bg-gray-200 text-gray-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "out_for_delivery": return "bg-orange-100 text-orange-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "";
    }
  };

  return (
    <div className="p-6">

      <SectionTitle title="Manage Orders" />

      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={() => setFilter("all")} className="bg-black text-white px-3 py-1 text-xs">All</button>
        <button onClick={() => setFilter("placed")} className="bg-gray-200 px-3 py-1 text-xs">Placed</button>
        <button onClick={() => setFilter("packing")} className="bg-blue-200 px-3 py-1 text-xs">Packing</button>
        <button onClick={() => setFilter("ready_for_delivery")} className="bg-yellow-200 px-3 py-1 text-xs">Ready</button>
        <button onClick={() => setFilter("out_for_delivery")} className="bg-orange-200 px-3 py-1 text-xs">Out</button>
        <button onClick={() => setFilter("delivered")} className="bg-green-200 px-3 py-1 text-xs">Delivered</button>
        <button onClick={() => setFilter("cancelled")} className="bg-red-200 px-3 py-1 text-xs">Cancelled</button>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <select value={country} onChange={(e) => handleCountry(e.target.value)} className="border px-3 py-1 text-xs rounded">
          <option value="">Country</option>
          {countries.map(c => <option key={c}>{c}</option>)}
        </select>

        <select value={state} onChange={(e) => handleState(e.target.value)} className="border px-3 py-1 text-xs rounded">
          <option value="">State</option>
          {states.map(s => <option key={s}>{s}</option>)}
        </select>

        <select value={city} onChange={(e) => handleCity(e.target.value)} className="border px-3 py-1 text-xs rounded">
          <option value="">City</option>
          {cities.map(c => <option key={c._id} value={c.city}>{c.city}</option>)}
        </select>

        <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="border px-3 py-1 text-xs rounded">
          <option value="all">All Areas</option>
          {areas.map(a => <option key={a._id} value={a.name}>{a.name}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border">

          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3 border">Order</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Items</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Assign</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>

            {filteredOrders.map(order => {

              const isLocked =
                order.status === "delivered" || order.status === "cancelled";

              return (
                <tr key={order._id} className="text-xs">

                  <td className="p-3 border">
                    <p className="font-bold">{order.orderNumber}</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>

                  <td className="p-3 border">
                    <p><b>Account:</b> {order.userId?.name || "N/A"}</p>
                    <p><b>Phone:</b> {order.userId?.phone || "N/A"}</p>
                    <p><b>Order Name:</b> {order.address?.fullName || "N/A"}</p>
                    <p><b>Order Phone:</b> {order.address?.phone || "N/A"}</p>
                    <p>{order.address?.street}</p>
                    <p>{order.address?.area}, {order.address?.city}</p>
                    <p>{order.address?.state} - {order.address?.pincode}</p>
                  </td>

                  <td className="p-3 border">
                    {order.items.map((item, i) => (
                      <div key={i}>
                        <p>{item.productName}</p>
                        <p>{item.quantity} {item.unit}</p>
                        <p>₹{item.totalPrice}</p>
                      </div>
                    ))}
                  </td>

                  <td className="p-3 border">
                    <p><b>Method:</b> {order.paymentMethod}</p>
                    <p>
                      <b>Status:</b>{" "}
                      <span className={
                        order.paymentStatus === "paid"
                          ? "text-green-600"
                          : order.paymentStatus === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }>
                        {order.paymentStatus}
                      </span>
                    </p>
                  </td>

                  <td className="p-3 border">
                    <p>Items: ₹{order.grandTotal}</p>
                    <p>Delivery: ₹{order.deliveryCharge}</p>
                    <p className="font-bold">Total: ₹{order.finalAmount}</p>
                  </td>

                  <td className="p-3 border">

                    <select
                      disabled={isLocked}
                      className="border w-full mt-1"
                      onChange={(e) =>
                        setSelectedDeliveryBoy({
                          ...selectedDeliveryBoy,
                          [order._id]: e.target.value
                        })
                      }
                    >
                      <option value="">Select</option>

                      {(deliveryBoys[order._id] || []).length === 0 ? (
                        <option disabled>No Delivery Boy</option>
                      ) : (
                        (deliveryBoys[order._id] || []).map(db => (
                          <option key={db._id} value={db._id}>
                            {db.userId?.name} | {db.status === "active" ? "🟢 Active" : "🔴 Inactive"} | Orders: {db.currentOrders || 0}
                          </option>
                        ))
                      )}
                    </select>

                    <button
                      disabled={isLocked}
                      onClick={() => assignDeliveryBoy(order._id)}
                      className={`w-full mt-1 ${
                        isLocked
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-black text-white"
                      }`}
                    >
                      Assign
                    </button>

                    {isLocked && (
                      <p className="text-red-500 text-xs mt-1">
                        Cannot assign (Order {order.status})
                      </p>
                    )}

                  </td>

                  <td className="p-3 border">
                    <span className={`px-2 py-1 ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminOrders;