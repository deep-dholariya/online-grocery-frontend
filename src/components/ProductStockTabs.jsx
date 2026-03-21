import React, { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import API from "../api/axios";

const ProductStockTabs = ({ refreshProducts }) => {

  const [activeTab, setActiveTab] = useState("manage");
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [stockValue, setStockValue] = useState("");

  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products?admin=true");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= START EDIT ================= */

  const startEdit = (product) => {
    setEditingId(product._id);
    setStockValue(product.currentStock);
  };

  /* ================= SAVE STOCK ================= */

  const saveStock = async (id) => {
    try {

      await API.put(`/products/${id}/stock`, {
        quantity: stockValue
      });

      setEditingId(null);

      fetchProducts();
      refreshProducts && refreshProducts();

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Stock update failed");
    }
  };

  /* ================= MIN QTY CONVERSION ================= */

  const getMinQty = (product) => {
    return product.unit === "kg"
      ? product.minQty / 1000
      : product.minQty;
  };

  /* ================= STOCK OUT FILTER ================= */

  const stockOutProducts = products.filter((p) => {

    const minQtyDisplay =
      p.unit === "kg"
        ? p.minQty / 1000
        : p.minQty;

    return Number(p.currentStock) < Number(minQtyDisplay);

  });

  return (
    <div className="w-full">

      {/* ================= TAB BUTTONS ================= */}

      <div className="flex gap-3 mb-6">

        <button
          onClick={() => setActiveTab("manage")}
          className={`px-6 py-2 rounded-lg font-medium transition
          ${activeTab === "manage"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-800"
            }`}
        >
          Manage Stock
        </button>

        <button
          onClick={() => setActiveTab("stockout")}
          className={`px-6 py-2 rounded-lg font-medium transition
          ${activeTab === "stockout"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-800"
            }`}
        >
          Stock Out
        </button>

      </div>

      {/* ================= MANAGE STOCK ================= */}

      {activeTab === "manage" && (

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold text-green-700 mb-6">
            Manage Product Stock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {products.map((product) => {

              const minQtyDisplay = getMinQty(product);

              const isLowStock =
                Number(product.currentStock) < Number(minQtyDisplay);

              return (

                <div
                  key={product._id}
                  className="border border-gray-200 p-4 rounded-lg bg-white"
                >

                  <div className="flex justify-between items-center mb-3">

                    <h3 className="font-semibold text-gray-800">
                      {product.name}
                    </h3>

                    <button
                      onClick={() => startEdit(product)}
                      className="text-green-600"
                    >
                      <FiEdit2 />
                    </button>

                  </div>

                  <div className="w-full h-32 flex items-center justify-center bg-white mb-3">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full object-contain"
                      onError={(e) => {
                        e.target.src = "/no-image.png";
                      }}
                    />

                  </div>

                  <p className="text-sm text-gray-600">
                    Category : {product.category?.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    Price : ₹{product.price}
                  </p>

                  <p className="text-sm text-gray-600 mb-2">
                    Min Order : {minQtyDisplay} {product.unit}
                  </p>

                  {editingId === product._id ? (

                    <div className="flex items-center gap-2 mt-3">

                      <input
                        type="number"
                        value={stockValue}
                        onChange={(e) => setStockValue(e.target.value)}
                        className="border px-3 py-1 rounded w-full"
                      />

                      <span className="font-medium text-gray-700">
                        {product.unit}
                      </span>

                      <button
                        onClick={() => saveStock(product._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>

                    </div>

                  ) : (

                    <p
                      className={`font-medium mt-3
                      ${isLowStock
                          ? "text-red-600"
                          : "text-gray-800"
                        }`}
                    >
                      Stock : {product.currentStock} {product.unit}
                    </p>

                  )}

                </div>

              );
            })}

          </div>

        </div>

      )}

      {/* ================= STOCK OUT ================= */}

      {activeTab === "stockout" && (

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold text-red-600 mb-6">
            Stock Out Products
          </h2>

          {stockOutProducts.length === 0 && (
            <p className="text-gray-500">
              No stock out products
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {stockOutProducts.map((product) => {

              const minQtyDisplay = getMinQty(product);

              return (

                <div
                  key={product._id}
                  className="border border-gray-200 p-4 rounded-lg bg-white"
                >

                  <div className="flex justify-between items-center mb-3">

                    <h3 className="font-semibold text-gray-800">
                      {product.name}
                    </h3>

                    <button
                      onClick={() => startEdit(product)}
                      className="text-green-600"
                    >
                      <FiEdit2 />
                    </button>

                  </div>

                  <div className="w-full h-32 flex items-center justify-center bg-white mb-3">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full object-contain"
                    />

                  </div>

                  <p className="text-sm text-gray-600">
                    Category : {product.category?.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    Price : ₹{product.price}
                  </p>

                  <p className="text-sm text-gray-600 mb-2">
                    Min Order : {minQtyDisplay} {product.unit}
                  </p>

                  {editingId === product._id ? (

                    <div className="flex items-center gap-2 mt-3">

                      <input
                        type="number"
                        value={stockValue}
                        onChange={(e) => setStockValue(e.target.value)}
                        className="border px-3 py-1 rounded w-full"
                      />

                      <span className="font-medium text-gray-700">
                        {product.unit}
                      </span>

                      <button
                        onClick={() => saveStock(product._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>

                    </div>

                  ) : (

                    <p className="text-red-600 font-semibold mt-2">
                      Stock : {product.currentStock} {product.unit}
                    </p>

                  )}

                </div>

              );
            })}

          </div>

        </div>

      )}

    </div>
  );
};

export default ProductStockTabs;