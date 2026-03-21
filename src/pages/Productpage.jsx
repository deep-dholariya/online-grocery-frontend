import { useEffect, useState } from "react";
import API from "../api/axios";
import { useProduct } from "../context/ProductSelectionContext";
import { useProfile } from "../context/ProfileContext";
import SectionTitle from "../components/SectionTitle";

function Productpage() {

  const { selectedProductName } = useProduct();
  const { user } = useProfile();

  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);

  const userId = user?._id;

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {

    const fetchProducts = async () => {
      try {

        const res = await API.get("/products");

        let filteredProducts = res.data;

        if (
          selectedProductName &&
          selectedProductName !== "All" &&
          selectedProductName !== "All Products"
        ) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.subCategory?.name === selectedProductName
          );
        }

        setProducts(filteredProducts);

      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();

  }, [selectedProductName]);

  /* ================= FETCH CART ================= */

  useEffect(() => {

    const fetchCart = async () => {

      try {

        if (!userId) return;

        const res = await API.get(`/cart/user/${userId}`);

        const ids = res.data.items.map((item) => item.productId);

        setAddedProducts(ids);

      } catch (error) {
        console.log(error);
      }

    };

    fetchCart();

  }, [userId]);

  /* ================= ADD TO CART ================= */

const addToCart = async (product) => {

  try {

    if (!userId) {
      alert("Please login first");
      return;
    }

    const quantity =
      product.unit === "kg"
        ? product.minQty / 1000
        : product.minQty;

    const res = await API.post("/cart/add", {
      userId,
      productId: product._id,
      quantity
    });

    if (res.data.success) {

      setAddedProducts((prev) => [...prev, product._id]);

      window.dispatchEvent(new Event("cartUpdated"));

    }

  } catch (error) {

    alert(error.response?.data?.message || "Failed to add cart");

  }

};

  return (

    <section className="w-full bg-[#f3f3f3] mt-16 pb-16">

      <div className="max-w-7xl mx-auto px-6">

        <SectionTitle
          id="products"
          highlightText={selectedProductName || "All Products"}
          firstText=""
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-10">

          {products.map((item) => {

            const discount = Number(item.discount) || 0;
            const originalPrice = Number(item.price) || 0;

            const offerPrice =
              discount > 0
                ? Math.round(originalPrice - (originalPrice * discount) / 100)
                : originalPrice;

            /* ================= UNIT CONVERSIONS ================= */

            const displayMinQty =
              item.unit === "kg"
                ? item.minQty / 1000
                : item.minQty;

            const displayStock = item.currentStock;

            const isLowStock = displayStock < displayMinQty;

            const isOutOfStock = displayStock === 0;

            return (

              <div
                key={item._id}
                className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition p-3"
              >

                <div className="border border-gray-200 rounded-lg p-4 h-full flex flex-col">

                  {/* OUT OF STOCK BADGE */}

                  {isOutOfStock && (

                    <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-md font-semibold">
                      Out of Stock
                    </div>

                  )}

                  {/* PRODUCT IMAGE */}

                  <div className="w-full h-[170px] flex items-center justify-center rounded-md">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full object-contain"
                    />

                  </div>

                  {/* PRODUCT NAME */}

                  <h3 className="text-[16px] font-semibold mt-4 text-gray-800">
                    {item.name}
                  </h3>

                  {/* DESCRIPTION */}

                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  {/* PRICE */}

                  <div className="flex items-center gap-2 mt-3">

                    <span className="text-green-600 font-bold text-lg">
                      ₹{offerPrice}
                    </span>

                    {discount > 0 && (
                      <>
                        <span className="text-gray-400 line-through text-sm">
                          ₹{originalPrice}
                        </span>

                        <span className="text-red-500 text-sm font-semibold">
                          {discount}% OFF
                        </span>
                      </>
                    )}

                  </div>

                  {/* MIN ORDER */}

                  <p className="text-xs text-gray-500 mt-2">
                    Min Order: {displayMinQty} {item.unit}
                  </p>

                  {/* STOCK */}

                  <p
                    className={`text-xs mb-3 ${
                      isLowStock
                        ? "text-red-500 font-semibold"
                        : "text-gray-400"
                    }`}
                  >
                    Stock: {displayStock} {item.unit}
                  </p>

                  {/* ADD TO CART */}

                  <button
                    onClick={() => addToCart(item)}
                    disabled={
                      isOutOfStock ||
                      addedProducts.includes(item._id)
                    }
                    className="mt-auto w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-medium disabled:bg-gray-400"
                  >

                    {addedProducts.includes(item._id)
                      ? "Added"
                      : "Add to Cart"}

                  </button>

                </div>

              </div>

            );

          })}

        </div>

        {products.length === 0 && (

          <div className="text-center text-gray-500 mt-10">
            No Products Found
          </div>

        )}

      </div>

    </section>

  );

}

export default Productpage;