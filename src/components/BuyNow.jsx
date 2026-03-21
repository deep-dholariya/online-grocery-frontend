import React, { useState } from "react";

function BuyNow() {
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    pincode: "",
    addressLine: "",
  });

  // Dummy Selected Products
  const products = [
    { id: 1, name: "Tomatoes", quantity: 2, price: 30 },
    { id: 2, name: "Milk", quantity: 1, price: 55 },
  ];

  const totalAmount = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (
      !address.fullName ||
      !address.mobile ||
      !address.city ||
      !address.pincode ||
      !address.addressLine
    ) {
      alert("Please fill all address details!");
      return;
    }

    alert(`Order Placed Successfully via ${paymentMethod}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 pb-20">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6">

        <h1 className="text-3xl font-bold text-center text-green-600 mb-8">
          Buy Now
        </h1>

        {/* Product Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {products.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b py-3"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="font-semibold text-green-600">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-green-700">₹{totalAmount}</span>
          </div>
        </div>

        {/* Address Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Delivery Address
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border p-3 rounded-lg"
              onChange={(e) =>
                setAddress({ ...address, fullName: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Mobile Number"
              className="border p-3 rounded-lg"
              onChange={(e) =>
                setAddress({ ...address, mobile: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="City"
              className="border p-3 rounded-lg"
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Pincode"
              className="border p-3 rounded-lg"
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
            />

            <textarea
              placeholder="Full Address"
              className="border p-3 rounded-lg md:col-span-2"
              rows="3"
              onChange={(e) =>
                setAddress({
                  ...address,
                  addressLine: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Select Payment Method
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "Online"}
                onChange={() => setPaymentMethod("Online")}
              />
              Online Payment (Card / Net Banking)
            </label>

            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
              />
              UPI Payment
            </label>

            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={() => setPaymentMethod("Cash on Delivery")}
              />
              Cash on Delivery
            </label>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="text-center">
          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyNow;