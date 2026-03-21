import React, { useEffect, useState } from "react";
import API from "../api/axios";

function AdminDeliveryBoy() {

  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [cities, setCities] = useState([]);

  const fetchData = async () => {
    try {
      const res1 = await API.get("/delivery-boy");
      const res2 = await API.get("/areas/get-areas");
      setDeliveryBoys(res1.data);
      setCities(res2.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAreaNames = (areaIds) => {
    if (!areaIds || areaIds.length === 0) return "No area";

    const names = [];

    cities.forEach((city) => {
      city.areas.forEach((area) => {
        if (areaIds.includes(area._id)) {
          names.push(
            `${city.country} / ${city.state} / ${city.city} / ${area.name} (${area.pincode})`
          );
        }
      });
    });

    return names.join(", ");
  };

  const pending = deliveryBoys.filter((d) => d.isApproved === false);

  const active = deliveryBoys.filter(
    (d) => d.isApproved === true && d.status === "active"
  );

  const inactive = deliveryBoys.filter(
    (d) => d.isApproved === true && d.status === "inactive"
  );

  const approve = async (id) => {
    try {
      await API.put(`/delivery-boy/${id}`, { isApproved: true });
      fetchData();
    } catch {
      alert("Approve failed");
    }
  };

  const reject = async (id) => {
    try {
      await API.delete(`/delivery-boy/${id}`);
      fetchData();
    } catch {
      alert("Reject failed");
    }
  };

  const getStatus = (boy) => {
    if (!boy.isApproved) return "Pending";
    return boy.status;
  };

  const getStatusColor = (boy) => {
    if (!boy.isApproved) return "text-yellow-600";
    if (boy.status === "active") return "text-green-600";
    return "text-red-600";
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Delivery Boy Manager</h1>

      {/* ================= PENDING ================= */}
      <h2 className="text-xl font-semibold mb-3">Pending Requests</h2>

      <table className="w-full border mb-10">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {pending.map((boy) => (
            <tr key={boy._id}>
              <td className="border p-2">{boy.userId?.name}</td>
              <td className="border p-2">{boy.userId?.phone}</td>
              <td className="border p-2">{getAreaNames(boy.areas)}</td>

              <td className={`border p-2 font-semibold ${getStatusColor(boy)}`}>
                {getStatus(boy)}
              </td>

              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => approve(boy._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>

                <button
                  onClick={() => reject(boy._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* ================= ACTIVE ================= */}
      <h2 className="text-xl font-semibold mb-3">Active Delivery Boys</h2>

      <table className="w-full border mb-10">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Orders</th>
            <th className="border p-2">COD</th>
            <th className="border p-2">ONLINE</th>
            <th className="border p-2">TOTAL</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {active.map((boy) => (
            <tr key={boy._id}>
              <td className="border p-2">{boy.userId?.name}</td>
              <td className="border p-2">{boy.userId?.phone}</td>
              <td className="border p-2">{getAreaNames(boy.areas)}</td>

              <td className={`border p-2 font-semibold ${getStatusColor(boy)}`}>
                {getStatus(boy)}
              </td>

              <td className="border p-2 text-center">
                {boy.currentOrders || 0}
              </td>

              <td className="border p-2 text-green-600">
                ₹{boy.earnings?.cod || 0}
              </td>

              <td className="border p-2 text-blue-600">
                ₹{boy.earnings?.online || 0}
              </td>

              <td className="border p-2 font-bold">
                ₹{boy.earnings?.total || 0}
              </td>

              <td className="border p-2">
                <button
                  onClick={() => {
                    if (window.confirm("Delete this delivery boy?")) {
                      reject(boy._id);
                    }
                  }}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>


      {/* ================= INACTIVE ================= */}
      <h2 className="text-xl font-semibold mb-3">Inactive Delivery Boys</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Orders</th>
            <th className="border p-2">COD</th>
            <th className="border p-2">ONLINE</th>
            <th className="border p-2">TOTAL</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {inactive.map((boy) => (
            <tr key={boy._id}>
              <td className="border p-2">{boy.userId?.name}</td>
              <td className="border p-2">{boy.userId?.phone}</td>
              <td className="border p-2">{getAreaNames(boy.areas)}</td>

              <td className={`border p-2 font-semibold ${getStatusColor(boy)}`}>
                {getStatus(boy)}
              </td>

              <td className="border p-2 text-center">
                {boy.currentOrders || 0}
              </td>

              <td className="border p-2 text-green-600">
                ₹{boy.earnings?.cod || 0}
              </td>

              <td className="border p-2 text-blue-600">
                ₹{boy.earnings?.online || 0}
              </td>

              <td className="border p-2 font-bold">
                ₹{boy.earnings?.total || 0}
              </td>

              <td className="border p-2">
                <button
                  onClick={() => {
                    if (window.confirm("Delete this delivery boy?")) {
                      reject(boy._id);
                    }
                  }}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminDeliveryBoy;