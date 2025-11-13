// src/components/Header.jsx
import React, { useState } from "react";
import Button from "./Button";
import EnrollModal from "./EnrollModal";

import {
  MenuIcon,
  XIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
} from "./icons/Icons";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Contact", path: "/application" }
  ];

  return (
    <>
      <nav className="bg-[#0a214d] text-white shadow-lg sticky top-0 z-50">
        {/* Top Mini Bar */}
        <div className="hidden md:block bg-gray-900 bg-opacity-30 text-sm">
          <div className="container mx-auto px-6 py-2 flex justify-between items-center">
            <div>
              <span>Email: info@proedgelearning.in</span>
              <span className="ml-4">Phone: +91 81057 51886</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Follow Us:</span>
              <FacebookIcon width={16} height={16} />
              <TwitterIcon width={16} height={16} />
              <LinkedinIcon width={16} height={16} />
              <InstagramIcon width={16} height={16} />
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">

          <Link to="/" className="text-3xl font-bold text-[#fca532]">
            PROEDGE
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-lg font-medium hover:text-[#fca532] transition"
              >
                {item.name}
              </Link>
            ))}

            {/* Login Link */}
            {/* <Link
              to="/login"
              className="text-lg font-medium hover:text-[#fca532] transition"
            >
              Login
            </Link> */}

            {/* Desktop Enroll Button */}
            <Button onClick={() => setIsModalOpen(true)}>
              Enroll Now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XIcon width={32} height={32} /> : <MenuIcon width={32} height={32} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#0a214d] pb-6 transition-all">
            <div className="flex flex-col items-center space-y-4 px-6 pt-4">

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-lg hover:text-[#fca532] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Login */}
              {/* <Link
                to="/login"
                className="text-lg hover:text-[#fca532] transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link> */}

              {/* ✅ Mobile Enroll Button (Fixed) */}
              <Button
                className="w-full"
                onClick={() => {
                  setIsModalOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                Enroll Now
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* ✅ Enroll Modal Component */}
      <EnrollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
