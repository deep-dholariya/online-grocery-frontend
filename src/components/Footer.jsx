import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Company Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-black mb-4 border-b-2 border-green-500 inline-block pb-1">
                            Company
                        </h3>
                        <p className="text-gray-600 text-sm leading-6">
                            We provide fresh and organic products directly from farms.
                            Our mission is to deliver healthy and quality food to your doorstep.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-black mb-4 border-b-2 border-green-500 inline-block pb-1">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-black text-sm">
                            <li className="hover:text-green-600 cursor-pointer transition">About Us</li>
                            <li className="hover:text-green-600 cursor-pointer transition">Our Services</li>
                            <li className="hover:text-green-600 cursor-pointer transition">Privacy Policy</li>
                            <li className="hover:text-green-600 cursor-pointer transition">Contact Us</li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-black mb-4 border-b-2 border-green-500 inline-block pb-1">
                            Contact Us
                        </h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-green-600 mt-1" />
                                <span>123 Organic Street, Healthy City, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhoneAlt className="text-green-600" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-green-600" />
                                <span>support@organicshop.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-black mb-4 border-b-2 border-green-500 inline-block pb-1">
                            Follow Us
                        </h3>

                        <div className="flex space-x-4 mt-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-green-600 hover:text-white transition cursor-pointer">
                                <FaFacebookF />
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-green-600 hover:text-white transition cursor-pointer">
                                <FaTwitter />
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-green-600 hover:text-white transition cursor-pointer">
                                <FaInstagram />
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-green-600 hover:text-white transition cursor-pointer">
                                <FaLinkedinIn />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </footer>
    );
};

export default Footer;