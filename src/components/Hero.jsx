import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Hero = ({ id }) => {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await API.get("/hero");
      setHero(res.data?.data || res.data);
    } catch (err) {
      console.error("Hero fetch error:", err);
    }
  };

  if (!hero) return null;

  const words = hero.header?.split(" ") || [];

  return (
    <section className="w-full bg-[#fff] overflow-hidden pt-[70px]" id={id}>
      <div className="w-full flex flex-col lg:flex-row items-center justify-between">

        {/* Left Image */}
        <div className="w-full lg:w-1/4 flex justify-center lg:justify-start mb-8 lg:mb-0">
          <img
            src={hero.leftImage}
            alt="left fruits"
            className="h-[250px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-contain"
          />
        </div>

        {/* Center Content */}
        <div className="w-full lg:w-1/2 text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            {words.map((word, index) => (
              <span
                key={index}
                className={index === 2 ? "text-green-600" : ""}
              >
                {word + " "}
              </span>
            ))}
          </h1>

          <p className="text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base leading-6 max-w-md mx-auto">
            {hero.description}
          </p>
        </div>

        {/* Right Image */}
        <div className="hidden lg:flex w-1/4 justify-end">
          <img
            src={hero.rightImage}
            alt="right fruits"
            className="h-[420px] object-contain"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;