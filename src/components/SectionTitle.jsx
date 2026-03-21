import React from "react";

const SectionTitle = ({ firstText = "Our", highlightText = "Features",id }) => {
  return (
    <div className="w-full bg-[#f3f3f3] py-12 flex justify-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-4">

        {/* Normal Text */}
        <span>{firstText}</span>

        {/* Green Ribbon Highlight */}
        <span className="relative bg-green-600 text-white px-10 py-2" id={id}>

          {highlightText}

          {/* Left Cut */}
          <span
            className="absolute left-0 top-0 w-0 h-0 
            border-t-[28px] border-t-transparent
            border-b-[28px] border-b-transparent
            border-l-[22px] border-l-[#f3f3f3]"
          ></span>

          {/* Right Cut */}
          <span
            className="absolute right-0 top-0 w-0 h-0 
            border-t-[28px] border-t-transparent
            border-b-[28px] border-b-transparent
            border-r-[22px] border-r-[#f3f3f3]"
          ></span>

        </span>

      </h2>
    </div>
  );
};

export default SectionTitle;