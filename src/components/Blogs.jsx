import React, { useState, useEffect } from "react";
import { FaUser, FaCalendar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import API from "../api/axios";

import "swiper/css";
import "swiper/css/navigation";

/* ===============================
   BLOG CARD COMPONENT
=============================== */
const BlogCard = ({ blog, id }) => {
  const [expanded, setExpanded] = useState(false);

  const words =
    blog.description?.trim().split(/\s+/).filter(Boolean) || [];

  const showButton = words.length > 10;

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-56 object-cover"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/400x300?text=Image+Not+Found";
        }}
      />

      <div className="p-6">
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <FaUser className="text-green-600" />
            <span>By {blog.author || "Grocery Team"}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaCalendar className="text-green-600" />
            <span>
              {blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>
        </div>

        <div className="border-b mb-4"></div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-sm mb-6">
          {expanded
            ? blog.description
            : words.slice(0, 10).join(" ") +
              (showButton ? "..." : "")}
        </p>

        {showButton && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-6 py-2 border border-gray-800 rounded-md hover:bg-gray-800 hover:text-white transition duration-300"
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
};

/* ===============================
   MAIN BLOGS COMPONENT
=============================== */
const Blogs = ({id}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blogs");

      const blogData = res.data?.data || res.data || [];

      setBlogs(Array.isArray(blogData) ? blogData : []);
    } catch (error) {
      console.error("Blog fetch error:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#f3f3f3] pb-10" id={id}>
      <div className="max-w-7xl mx-auto px-6">

        {loading && (
          <p className="text-center text-gray-500">
            Loading blogs...
          </p>
        )}

        {!loading && blogs.length === 0 && (
          <p className="text-center text-gray-500">
            No blogs found.
          </p>
        )}

        {!loading && blogs.length > 0 && (
          <Swiper
            modules={[Autoplay]}
            slidesPerView={3}
            spaceBetween={30}
            autoplay={
              blogs.length > 1
                ? {
                    delay: 3000,
                    disableOnInteraction: false,
                  }
                : false
            }
            loop={blogs.length > 3}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog._id}>
                <BlogCard blog={blog} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Blogs;