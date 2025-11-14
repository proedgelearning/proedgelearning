// src/components/Header.jsx
import React, { useState } from "react";
import Button from "./Button";
import EnrollModal from "./EnrollModal";
import proweblogo from "../assets/proedgeweblogo.png";
import {
  MenuIcon,
  XIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  GmailIcon,
} from "./icons/Icons";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Contact", path: "/contactus" },
  ];

  return (
    <>
      <nav className="bg-[#0a214d] text-white shadow-lg sticky top-0 z-50">
        {/* Top Mini Bar */}
        <div className="hidden md:block bg-gray-900 bg-opacity-30 text-sm">
          <div className="container mx-auto px-6 py-2 flex justify-between items-center">
            <div>
              <a href="mailto:info@proedgelearning.in">
                Email: info@proedgelearning.in
              </a>
              <a href="tel:+918105751886" className="ml-4">
                Phone: +91 81057 51886
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <span>Follow Us:</span>

              <a
                href="https://www.youtube.com/@ProEdgeLearning"
                target="_blank"
                rel="noopener noreferrer"
              >
                <YoutubeIcon width={16} height={16} />
              </a>

              <a
                href="https://x.com/ProEdgeLearning"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon width={16} height={16} />
              </a>

              <a
                href="https://www.instagram.com/theproedgelearning/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon width={16} height={16} />
              </a>

              <a href="mailto:proedgelearningofficial@gmail.com">
                <GmailIcon width={16} height={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* ⭐ LOGO + TEXT */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={proweblogo}
              alt="Proedge Logo"
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />

            {/* PROEDGE TEXT – now visible on mobile */}
            <span className="block text-3xl font-bold">
              <span className="text-[#fca532]">PRO</span>
              <span className="text-white">EDGE</span>
            </span>
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

            <Button onClick={() => setIsModalOpen(true)}>Enroll Now</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XIcon width={32} height={32} />
            ) : (
              <MenuIcon width={32} height={32} />
            )}
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

      {/* Modal */}
      <EnrollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
