import React, { useState, useEffect } from "react";
import API from "../api/axios";

const FeatureCard = ({ image, title, description, id }) => {
  const [expanded, setExpanded] = useState(false);

  const words = description.split(" ");
  const shortText =
    words.length > 10
      ? words.slice(0, 10).join(" ") + "..."
      : description;

  const showButton = words.length > 10;

  return (
    <div className="bg-white border border-gray-200 rounded-md p-[10px] transition duration-300 hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] h-full">
      <div className="border border-gray-200 rounded-md p-5 sm:p-6 md:p-8 text-center flex flex-col h-full">

        <div className="w-full h-32 sm:h-36 md:h-40 flex justify-center items-center mb-4 sm:mb-5 md:mb-6">
          <img
            src={image}
            alt={title}
            className="h-full object-contain"
          />
        </div>

        <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
          {title}
        </h3>

        <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 transition-all duration-300">
          {expanded ? description : shortText}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className={`mt-auto px-4 sm:px-5 md:px-6 py-2 border border-gray-800 rounded-md text-sm sm:text-base hover:bg-gray-800 hover:text-white transition duration-300 ${
            showButton ? "visible" : "invisible"
          }`}
        >
          {expanded ? "Read Less" : "Read More"}
        </button>

      </div>
    </div>
  );
};

const Features = ({ id }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const res = await API.get("/features");

      const data = res.data?.data || res.data || [];
      setFeatures(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching features:", error);
      setFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#f3f3f3]" id={id}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 items-start">

            {features.map((item) => (
              <FeatureCard
                key={item._id}
                image={item.image}
                title={item.title}
                description={item.description}
              />
            ))}

          </div>
        )}

      </div>
    </section>
  );
};

export default Features;