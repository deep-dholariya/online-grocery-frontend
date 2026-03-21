import React, { useEffect, useState } from "react";
import API from "../api/axios";   // 👈 axios instance import

const Categories = ({ setSelectedCategory, id }) => {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories?frontend=true"); 
      const list = res.data.data || [];
      setCategories(list);
    } catch (error) {
      console.error(
        "Category fetch error:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleClick = (slug) => {
    setActive(slug);
    setSelectedCategory(slug);
  };

  return (
    <section className="w-full bg-[#f3f3f3] py-2" id={id}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => handleClick(cat.slug)}
              className={`group cursor-pointer bg-white rounded-2xl p-5 transition-all duration-300
              ${
                active === cat.slug
                  ? "shadow-2xl ring-2 ring-green-500"
                  : "shadow-md hover:shadow-2xl hover:-translate-y-2"
              }`}
            >
              <div className="w-full h-28 flex items-center justify-center mb-6 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/150?text=No+Image")
                  }
                />
              </div>

              <div className="h-[1px] bg-gray-100 mb-4"></div>

              <h3
                className={`text-base font-semibold text-center
                ${
                  active === cat.slug
                    ? "text-green-600"
                    : "text-gray-800 group-hover:text-green-600"
                }`}
              >
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;