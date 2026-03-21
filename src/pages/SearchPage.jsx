import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import API from "../api/axios";
import SectionTitle from "../components/SectionTitle";
import { useProfile } from "../context/ProfileContext";

function SearchPage() {

  const { user } = useProfile();

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const userId = user?._id;

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

  /* ================= SEARCH ================= */

  const handleSearch = async () => {

    if (!query.trim()) return;

    try {

      setLoading(true);
      setSearched(true);

      const res = await API.get(`/products/search?keyword=${query}`);

      setProducts(res.data);

    } catch (error) {

      console.error("Search error:", error);

    } finally {

      setLoading(false);

    }

  };

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      handleSearch();
    }

  };

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
          id="search"
          highlightText="Search Results"
          firstText=""
        />

        {/* SEARCH BAR */}

        <div className="w-full flex justify-center">

          <div className="w-full max-w-xl relative">

            <input
              type="text"
              placeholder="Search fresh vegetables, fruits..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-5 pr-14 py-3 rounded-full border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none shadow-sm transition"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition shadow-md disabled:opacity-60"
            >

              {loading ? "..." : <FaSearch size={16} />}

            </button>

          </div>

        </div>

        {/* PRODUCT GRID */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-10">

          {products.map((item) => {

            const discount = Number(item.discount) || 0;
            const originalPrice = Number(item.price) || 0;

            const offerPrice =
              discount > 0
                ? Math.round(originalPrice - (originalPrice * discount) / 100)
                : originalPrice;

            const displayMinQty =
              item.unit === "kg"
                ? item.minQty / 1000
                : item.minQty;

            const displayStock = item.currentStock;

            const isOutOfStock = displayStock === 0;

            const isLowStock = displayStock < displayMinQty;

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

                  {/* NAME */}

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

                  <p className={`text-xs mb-3 ${isLowStock ? "text-red-500 font-semibold" : "text-gray-400"}`}>
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

        {searched && products.length === 0 && (

          <div className="text-center text-gray-500 mt-10">
            No Products Found
          </div>

        )}

      </div>

    </section>

  );

}

export default SearchPage;