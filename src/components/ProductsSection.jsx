import React, { useEffect, useState } from "react";
import { useProduct } from "../context/ProductSelectionContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import productImg from "../assets/right.png";

/* ===============================
   PRODUCT CARD
=============================== */
const ProductCard = ({ product, id }) => {
  const { setSelectedProductName } = useProduct();
  const navigate = useNavigate();

  const handleClick = () => {
    setSelectedProductName(product.name);
    navigate("/products");
  };

  return (
    <div className="group w-[250px] bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      
      {/* Image */}
      <div className="h-48 flex items-center justify-center p-6 bg-white">
        <img
          src={product.image || productImg}
          alt={product.name}
          className="h-full object-contain group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5 text-center bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
          {product.name}
        </h3>

        <button
          onClick={handleClick}
          className="w-full py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
        >
          View Products
        </button>
      </div>
    </div>
  );
};

/* ===============================
   CATEGORY LAYER
=============================== */
const CategoryLayer = ({ id, title, products, isLast }) => {
  if (!products.length) return null;

  return (
    <div id={id} className={`${isLast ? "" : "mb-16"} scroll-mt-28`}>
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {title}
        </h2>
        <div className="h-[2px] flex-1 bg-gray-300 ml-6"></div>
      </div>

      {/* Professional Grid (No Empty Columns) */}
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(250px,250px))]">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

/* ===============================
   MAIN SECTION
=============================== */
const ProductsSection = ({ selectedCategory, id }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const element = document.getElementById(
        `${selectedCategory}-layer`
      );
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const catRes = await API.get("/categories");
      const subRes = await API.get("/subcategories");

      const activeCategories = (catRes.data.data || []).filter(
        (cat) => cat.status
      );

      const activeSubCategories = (subRes.data.data || []).filter(
        (sub) => sub.status && sub.category?.status
      );

      setCategories(activeCategories);
      setSubCategories(activeSubCategories);
    } catch (error) {
      console.error("Data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-[#f3f3f3] py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-600">
          Loading Products...
        </h2>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#f3f3f3]" id={id}>
      <div className="max-w-7xl mx-auto px-6">
        {categories.map((category, index) => {
          const relatedSubCategories = subCategories.filter(
            (sub) => sub.category?._id === category._id
          );

          return (
            <CategoryLayer
              key={category._id}
              id={`${category.slug}-layer`}
              title={category.name}
              products={relatedSubCategories}
              isLast={index === categories.length - 1}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ProductsSection;