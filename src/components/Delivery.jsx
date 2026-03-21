import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useProfile } from "../context/ProfileContext";

import DeliveryApplyForm from "./DeliveryApplyForm";
import DeliveryDashboard from "./DeliveryDashboard";

function Delivery() {

  const { user } = useProfile(); // ✅ ADD THIS

  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [loading, setLoading] = useState(true);

const fetchDeliveryBoy = async () => {
  try {
    const res = await API.get("/delivery-boy/me");
setDeliveryBoy(res.data);
console.log("DELIVERY BOY:", res.data); // ✅ correct
  } catch (error) {

    if (error.response && error.response.status === 404) {
      // ✅ NOT APPLIED
      setDeliveryBoy(null);
    } else {
      console.error("ERROR:", error);
    }

  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (user?._id) {
    fetchDeliveryBoy();
  } else {
    setLoading(false);
    setDeliveryBoy(null);
  }
}, [user]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  /* ===== CONDITION ===== */

  // ✅ NOT APPLIED
  if (!deliveryBoy) {
    return <DeliveryApplyForm refresh={fetchDeliveryBoy} />;
  }

  // ⏳ PENDING
  if (deliveryBoy.isApproved === false) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg font-semibold text-gray-600">
        Application sent. Waiting for admin approval.
      </div>
    );
  }

  // 🚀 APPROVED + ACTIVE
  if (deliveryBoy.isApproved === true) {
    return <DeliveryDashboard deliveryBoy={deliveryBoy} />;
  }

}

export default Delivery;