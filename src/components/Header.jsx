import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaUserAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaTruck
} from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import API from "../api/axios";

const Header = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useProfile();


  /* ================= SCROLL ================= */

  const scrollToSection = (id) => {

    const scrollWhenReady = () => {

      const element = document.getElementById(id);
      const header = document.querySelector("header");

      if (element && header) {

        const headerHeight = header.offsetHeight;
        const extraGap = 155;

        const y =
          element.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          extraGap;

        window.scrollTo({
          top: y,
          behavior: "smooth"
        });

      } else {

        requestAnimationFrame(scrollWhenReady);

      }

    };

    if (location.pathname !== "/") {

      navigate("/");
      setTimeout(scrollWhenReady, 100);

    } else {

      scrollWhenReady();

    }

    setMenuOpen(false);

  };


  /* ================= CART COUNT ================= */

  useEffect(() => {

    const fetchCartCount = async () => {

      if (!user?._id) return;

      try {

        const res = await API.get(`/cart/user/${user._id}`);
        const items = res.data?.items || [];

        setCartCount(items.length);

      } catch (error) {

        console.log(error);

      }

    };

    fetchCartCount();

    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };

  }, [user?._id]);


  return (

    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">


        {/* Logo */}

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => scrollToSection("home")}
        >
          <div className="text-green-600 text-2xl font-bold">🛒</div>

          <h1 className="text-2xl font-bold text-gray-800">
            Grocery
          </h1>
        </div>



        {/* Desktop Menu */}

        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">

          <button onClick={() => scrollToSection("home")} className="hover:text-green-600 transition">
            Home
          </button>

          <button onClick={() => scrollToSection("features")} className="hover:text-green-600 transition">
            Features
          </button>

          <button onClick={() => scrollToSection("categories")} className="hover:text-green-600 transition">
            Categories
          </button>

          <button onClick={() => scrollToSection("products")} className="hover:text-green-600 transition">
            Sub Categories
          </button>

          <button onClick={() => navigate("/products")} className="hover:text-green-600 transition">
            Products
          </button>

          <button onClick={() => scrollToSection("blogs")} className="hover:text-green-600 transition">
            Blogs
          </button>

          <button onClick={() => navigate("/order")} className="hover:text-green-600 transition">
            Order
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="hover:text-green-600 transition"
            >
              Admin
            </button>
          )}

        </nav>



        {/* Right Icons */}

        <div className="hidden md:flex items-center gap-4">


          {/* Search */}

          <div
            onClick={() => navigate("/search")}
            className="bg-gray-100 p-2 rounded-md hover:bg-green-600 hover:text-white cursor-pointer transition duration-300"
          >
            <FaSearch />
          </div>



          {/* Cart */}

          <div
            onClick={() => navigate("/cart")}
            className="relative bg-gray-100 p-2 rounded-md hover:bg-green-600 hover:text-white cursor-pointer transition duration-300"
          >

            <FaShoppingCart />

            {cartCount > 0 && (

              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>

            )}

          </div>



          {/* User */}

          <div
            onClick={() => navigate(user ? "/profile" : "/login")}
            className="bg-gray-100 p-2 rounded-md hover:bg-green-600 hover:text-white cursor-pointer transition duration-300"
          >
            <FaUserAlt />
          </div>



          {/* Delivery Boy */}

          <div
            onClick={() => navigate("/delivery")}
            className="bg-gray-100 p-2 rounded-md hover:bg-green-600 hover:text-white cursor-pointer transition duration-300"
            title="Delivery Boy Login"
          >
            <FaTruck />
          </div>


        </div>



        {/* Mobile Menu Button */}

        <div
          className="md:hidden text-xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

      </div>



      {/* Mobile Menu */}

      {menuOpen && (

        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4 text-gray-700 font-medium">

          <button onClick={() => scrollToSection("home")} className="block hover:text-green-600">
            Home
          </button>

          <button onClick={() => scrollToSection("features")} className="block hover:text-green-600">
            Features
          </button>

          <button onClick={() => scrollToSection("categories")} className="block hover:text-green-600">
            Categories
          </button>

          <button onClick={() => scrollToSection("products")} className="block hover:text-green-600">
            Sub Categories
          </button>

          <button onClick={() => navigate("/products")} className="block hover:text-green-600">
            Products
          </button>

          <button onClick={() => scrollToSection("blogs")} className="block hover:text-green-600">
            Blogs
          </button>

          <button onClick={() => navigate("/order")} className="block hover:text-green-600">
            Order
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="block hover:text-green-600"
            >
              Admin
            </button>
          )}



          {/* Mobile Icons */}

          <div className="flex gap-4 pt-4 border-t">

            <FaSearch
              className="cursor-pointer hover:text-green-600"
              onClick={() => navigate("/search")}
            />

            <div className="relative">

              <FaShoppingCart
                onClick={() => navigate("/cart")}
                className="cursor-pointer hover:text-green-600"
              />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}

            </div>


            <FaUserAlt
              onClick={() => navigate(user ? "/profile" : "/login")}
              className="cursor-pointer hover:text-green-600"
            />


            <FaTruck
              onClick={() => navigate("/delivery")}
              className="cursor-pointer hover:text-green-600"
            />

          </div>

        </div>

      )}

    </header>

  );

};

export default Header;