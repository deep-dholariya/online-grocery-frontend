import React, { useEffect, useState } from "react";
import API from "../api/axios";
import SectionTitle from "../components/SectionTitle";
import { useProfile } from "../context/ProfileContext";

const Cart = () => {

  const { user } = useProfile();
  const userId = user?._id;

  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartId, setCartId] = useState(null);
  const [manualQty, setManualQty] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);

  const [checkoutForm, setCheckoutForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    country: "India",
    state: "",
    city: "",
    area: "",
    pincode: "",
    paymentMethod: "COD"
  });

  const [areasData, setAreasData] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const countries = [...new Set(areasData.map(a => a.country))];

  const fetchAreas = async () => {
    try {
      const res = await API.get("/areas/get-areas");  // ✔ correct endpoint
      setAreasData(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  const states =
    [
      ...new Set(
        areasData
          .filter(a => a.country === checkoutForm.country)
          .map(a => a.state)
      )
    ];

  const cities =
    areasData
      .filter(
        a =>
          a.country === checkoutForm.country &&
          a.state === checkoutForm.state.toLowerCase()
      )
      .map(a => a.city);

  const areas =
    areasData.find(
      a =>
        a.country === checkoutForm.country &&
        a.state === checkoutForm.state.toLowerCase() &&
        a.city === checkoutForm.city.toLowerCase()
    )?.areas || [];

  const handleAreaChange = (areaName) => {


    const cityData = areasData.find(
      a =>
        a.state === checkoutForm.state.toLowerCase() &&
        a.city === checkoutForm.city.toLowerCase()
    );

    const area = cityData?.areas.find(a => a.name === areaName);

    if (!area) return;

    setCheckoutForm(prev => ({
      ...prev,
      area: area.name,
      pincode: area.pincode
    }));

    setDeliveryCharge(area.deliveryCharge);
    setMinOrderAmount(area.minOrderAmount);


  };

  const fetchCart = async () => {


    try {

      const cartRes = await API.get(`/cart/user/${userId}`);
      setCartId(cartRes.data.cartId);
      const cart = cartRes.data?.items || [];

      const detailedItems = await Promise.all(

        cart.map(async (item) => {

          const res = await API.get(
            `/products/${item.productId}/preview`,
            {
              params: {
                userId
              }
            }
          );

          const product = res.data.product;

          const displayQty =
            product.unit === "kg"
              ? item.quantity / 1000
              : item.quantity;

          const preview = await API.get(
            `/products/${item.productId}/preview`,
            {
              params: {
                quantity: displayQty,
                userId
              }
            }
          );

          return {
            ...preview.data.product,
            productId: item.productId
          };

        })

      );

      const total = detailedItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );

      setCartItems(detailedItems);
      setCartTotal(total);

    } catch (error) {

      console.log("Cart fetch error:", error);

    }


  };

  useEffect(() => {
    if (!userId) return;
    fetchCart();
  }, [userId]);

  useEffect(() => {
    fetchAreas();
  }, []);

  const updateQuantity = async (item, newQty) => {


    try {

      await API.get(`/products/${item.productId}/preview`, {
        params: {
          quantity: newQty,
          userId
        }
      });

      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (error) {

      console.log(error);

    }


  };

  const increaseQty = (item) => {


    const step = parseFloat(item.minOrder);
    const currentQty = parseFloat(item.quantity);
    const stock = parseFloat(item.currentStock);

    const newQty = parseFloat((currentQty + step).toFixed(2));

    if (newQty > stock) {
      alert("Maximum stock reached");
      return;
    }

    updateQuantity(item, newQty);


  };

  const decreaseQty = (item) => {

    const step = parseFloat(item.minOrder);
    const currentQty = parseFloat(item.quantity);

    let newQty = parseFloat((currentQty - step).toFixed(2));

    if (newQty < step) {
      newQty = step;
    }

    if (newQty === currentQty) return;

    updateQuantity(item, newQty);

  };

  const removeItem = async (productId) => {


    try {

      await API.delete("/cart/remove", {
        data: { userId, productId }
      });

      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (error) {

      console.log(error);

    }


  };

  const clearCart = async () => {

    try {

      await API.delete(`/cart/clear/${userId}`);

      setCartItems([]);
      setCartTotal(0);

      window.dispatchEvent(new Event("cartUpdated"));

    } catch (error) {

      console.log(error);

    }


  };

  const handleCheckoutInput = (e) => {


    const { name, value } = e.target;

    setCheckoutForm({
      ...checkoutForm,
      [name]: value
    });


  };

  const placeOrder = async () => {

    // 🚨 duplicate click stop
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);

    // ❗ validation ke case me reset karna zaruri hai
    if (
      !checkoutForm.fullName ||
      !checkoutForm.phone ||
      !checkoutForm.street ||
      !checkoutForm.city ||
      !checkoutForm.state ||
      !checkoutForm.pincode
    ) {
      alert("Please fill all address fields");
      setIsPlacingOrder(false); // ✅ important
      return;
    }

    try {

      if (checkoutForm.paymentMethod === "COD") {

        await API.post("/orders/place", {
          cartId,
          paymentMethod: "COD",
          address: checkoutForm
        });

        alert("Order placed successfully");

        setShowCheckout(false);
        fetchCart();
        window.dispatchEvent(new Event("cartUpdated"));

        return;
      }

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        setIsPlacingOrder(false); // ✅ important
        return;
      }

      const orderRes = await API.post("/orders/place", {
        cartId,
        paymentMethod: "ONLINE",
        address: checkoutForm
      });

      const razorpayData = orderRes.data.razorpay;

      if (!razorpayData) {
        alert("Payment initialization failed");
        setIsPlacingOrder(false); // ✅ important
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        order_id: razorpayData.orderId,

        modal: {
          ondismiss: async function () {
            try {
              await API.post("/orders/payment-failed", {
                orderId: orderRes.data.orderId
              });
              alert("Payment cancelled");
            } catch (err) {
              console.log(err);
            } finally {
              setIsPlacingOrder(false);
            }
          }
        },

        handler: async function (response) {
          try {
            await API.post("/orders/verify-payment", {
              orderId: orderRes.data.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            alert("Payment successful");

            setShowCheckout(false);
            fetchCart();
            window.dispatchEvent(new Event("cartUpdated"));

          } catch (err) {
            await API.post("/orders/payment-failed", {
              orderId: orderRes.data.orderId
            });

            alert("Payment verification failed");
          } finally {
            setIsPlacingOrder(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function () {

        await API.post("/orders/payment-failed", {
          orderId: orderRes.data.orderId
        });

        alert("Payment failed");

        setIsPlacingOrder(false); // ✅ IMPORTANT
      });

      rzp.open();

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

      setIsPlacingOrder(false); // ✅ IMPORTANT

    }
  };
  return (


    <section className="w-full min-h-screen bg-[#f9fdf9] pt-[100px] px-6 pb-20">

      <SectionTitle id="cart" highlightText="Cart" firstText="" />

      <div className="max-w-5xl mx-auto mt-10 grid gap-6">

        {cartItems.length === 0 && (

          <div className="text-center py-16">

            <h2 className="text-2xl font-semibold text-gray-600">
              Your cart is empty
            </h2>

            <p className="text-gray-400 mt-2">
              Add some products to start shopping
            </p>

          </div>

        )}

        {cartItems.map((item) => (

          <div
            key={item.productId}
            className="bg-white shadow-md rounded-xl p-5 border border-green-100"
          >

            <div className="flex justify-between items-center">

              <div className="flex gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-contain rounded-lg"
                />

                <div>

                  <h2 className="text-lg font-semibold text-green-700">
                    {item.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-1">

                    <span className="text-green-600 font-bold text-lg">
                      ₹{item.discountPrice}
                    </span>

                    {item.discount > 0 && (
                      <>
                        <span className="text-gray-400 line-through text-sm">
                          ₹{item.price}
                        </span>

                        <span className="text-red-500 text-sm font-semibold">
                          {item.discount}% OFF
                        </span>
                      </>
                    )}

                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Min Order: {item.minOrder} {item.unit}
                  </p>

                  <p className="text-sm text-gray-500">
                    Stock: {item.currentStock} {item.unit}
                  </p>

                </div>

              </div>

              <div className="flex flex-col items-end gap-3">

                <div className="flex items-center gap-2">

                  <button
                    onClick={() => decreaseQty(item)}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    -
                  </button>

                  <input
                    type="text"
                    value={manualQty[item.productId] ?? item.quantity}
                    className="w-16 border text-center rounded"
                    onChange={(e) => {

                      const value = e.target.value;

                      if (!/^\d*\.?\d*$/.test(value)) return;

                      setManualQty({
                        ...manualQty,
                        [item.productId]: value
                      });

                    }}

                    onKeyDown={(e) => {

                      if (e.key === "Enter") {

                        let value = parseFloat(manualQty[item.productId]);

                        if (isNaN(value)) return;

                        if (value < item.minOrder) value = item.minOrder;
                        if (value > item.currentStock) value = item.currentStock;

                        updateQuantity(item, value);

                        setManualQty(prev => {
                          const copy = { ...prev };
                          delete copy[item.productId];
                          return copy;
                        });

                      }

                    }}

                    onBlur={() => {

                      const value = manualQty[item.productId];

                      if (value === undefined) return;

                      let qty = parseFloat(value);

                      if (isNaN(qty)) return;

                      if (qty < item.minOrder) qty = item.minOrder;
                      if (qty > item.currentStock) qty = item.currentStock;

                      updateQuantity(item, qty);

                      setManualQty(prev => {
                        const copy = { ...prev };
                        delete copy[item.productId];
                        return copy;
                      });

                    }}
                  />

                  <span className="text-sm text-gray-500">
                    {item.unit}
                  </span>

                  <button
                    onClick={() => increaseQty(item)}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    +
                  </button>

                </div>

                <div className="text-green-700 font-semibold">
                  ₹{item.totalPrice}
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {cartItems.length > 0 && (

        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl border border-green-200 flex justify-between items-center">

          <h2 className="text-2xl font-bold text-green-700">
            Total: ₹{cartTotal}
          </h2>

          <div className="flex gap-4">

            <button
              onClick={clearCart}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
            >
              Clear Cart
            </button>

            <button
              onClick={() => setShowCheckout(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Buy Now
            </button>

          </div>

        </div>

      )}

      {showCheckout && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white w-[520px] rounded-2xl shadow-2xl p-7">

            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Checkout Details
            </h2>

            <div className="flex flex-col gap-4 mt-2">

              <input
                name="fullName"
                placeholder="Full Name"
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={handleCheckoutInput}
              />

              <input
                name="phone"
                placeholder="Phone Number"
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={handleCheckoutInput}
              />

              <div className="grid grid-cols-2 gap-3">

                <select
                  name="country"
                  className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={checkoutForm.country}
                  onChange={handleCheckoutInput}
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  name="state"
                  className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={!checkoutForm.country}
                  onChange={handleCheckoutInput}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <select
                  name="city"
                  className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={!checkoutForm.state}
                  onChange={handleCheckoutInput}
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  name="area"
                  className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={(e) => handleAreaChange(e.target.value)}
                >
                  <option value="">Select Area</option>
                  {areas.map((a) => (
                    <option key={a._id} value={a.name}>{a.name}</option>
                  ))}
                </select>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <input
                  name="street"
                  placeholder="Apartment / House / Block"
                  className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={handleCheckoutInput}
                />

                <input
                  name="pincode"
                  value={checkoutForm.pincode}
                  readOnly
                  className="border border-gray-300 p-2.5 rounded-lg bg-gray-100"
                />

              </div>

              {/* Order Summary */}

              <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-sm mt-2">

                <p>
                  Cart Total :
                  <span className="font-semibold text-green-700"> ₹{cartTotal}</span>
                </p>

                <p>
                  Minimum Order :
                  <span className="font-semibold text-green-700"> ₹{minOrderAmount}</span>
                </p>

                <p>
                  Delivery Charge :
                  <span className="font-semibold text-green-700"> ₹{deliveryCharge}</span>
                </p>

                <hr className="my-2" />

                <p className="text-base font-bold">
                  Final Total :
                  <span className="text-green-700"> ₹{cartTotal + deliveryCharge}</span>
                </p>

              </div>

              <select
                name="paymentMethod"
                className="border border-gray-300 p-2.5 rounded-lg"
                onChange={handleCheckoutInput}
              >
                <option value="COD">Cash On Delivery</option>
                <option value="ONLINE">Online Payment</option>
              </select>

            </div>

            <div className="flex justify-end gap-4 mt-7">

              <button
                onClick={() => setShowCheckout(false)}
                className="px-4 py-2 rounded bg-gray-400 text-white"
              >
                Cancel
              </button>

              <button
                onClick={placeOrder}
                disabled={isPlacingOrder}
                className={`px-4 py-2 rounded text-white ${isPlacingOrder ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
                  }`}
              >
                {isPlacingOrder ? "Processing..." : "Place Order"}
              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  );

};

export default Cart;
