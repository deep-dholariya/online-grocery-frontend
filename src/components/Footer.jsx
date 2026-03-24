import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
  };

  return (
    <footer className="w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <div>
            <h3 className="text-lg font-semibold text-black mb-4 border-b-2 border-green-500 inline-block pb-1">
              Company
            </h3>
            <p className="text-gray-600 text-sm leading-6">
              We provide fresh and organic products directly from farms.
              Our mission is to deliver healthy and quality food to your doorstep.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-black mb-4 border-b-2 border-green-500 inline-block pb-1">
              Quick Links
            </h3>
            <ul className="space-y-2 text-black text-sm">
              <li onClick={() => scrollToSection("home")} className="hover:text-green-600 cursor-pointer transition">Home</li>
              <li onClick={() => navigate("/products")} className="hover:text-green-600 cursor-pointer transition">Products</li>
              <li onClick={() => scrollToSection("categories")} className="hover:text-green-600 cursor-pointer transition">Category</li>
              <li onClick={() => scrollToSection("products")} className="hover:text-green-600 cursor-pointer transition">Sub Category</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-black mb-4 border-b-2 border-green-500 inline-block pb-1">
              Contact Us
            </h3>

            <ul className="space-y-3 text-gray-600 text-sm">

              <li
                className="flex items-start gap-3 cursor-pointer hover:text-green-600"
                onClick={() =>
                  window.open(
                    "https://www.google.com/maps/search/?api=1&query=Ahmedabad",
                    "_blank"
                  )
                }
              >
                <FaMapMarkerAlt className="text-green-600 mt-1" />
                <span>Ahmedabad, Gujarat, India</span>
              </li>

              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-green-600" />
                <a href="tel:+919876543210" className="hover:text-green-600">
                  +91 98765 43210
                </a>
              </li>

              <li className="flex items-center gap-3">
                <FaEnvelope className="text-green-600" />
                <a
                  href="mailto:support@organicshop.com"
                  className="hover:text-green-600"
                >
                  support@organicshop.com
                </a>
              </li>

            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-black mb-4 border-b-2 border-green-500 inline-block pb-1">
              Follow Us
            </h3>

            <div className="flex space-x-4 mt-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-green-600 hover:text-white transition cursor-pointer"
                  >
                    <Icon />
                  </div>
                )
              )}
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;