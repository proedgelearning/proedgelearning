// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsAppIcon,
  XIconTwitter,
} from "./icons/Icons";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a214d] text-gray-300 pt-20 pb-8">
      <div className="container mx-auto px-6 grid gap-12 md:grid-cols-4">
        {/* Brand + Description */}
        <div>
          <h3 className="text-3xl font-bold mb-4">
            <span className="text-[#fca532]">PRO</span>
            <span className="text-white">EDGE</span>
          </h3>
          <p className="mb-6 leading-relaxed">
            Empowering learners with professional, practical skill development.
          </p>

          {/* Social Icons */}
          <div className="flex items-center space-x-4 mb-6">
            {/* WhatsApp (click-to-chat) */}
            <a
              href="https://wa.me/918105751886"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp ProEdge Learning"
              className="hover:text-[#fca532] transition-colors"
            >
              <WhatsAppIcon className="w-6 h-6" />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@ProEdgeLearning"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube ProEdge Learning"
              className="hover:text-[#fca532] transition-colors"
            >
              {/* If you have a YoutubeIcon component, use that instead */}
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.6-.9-2-1-2.8-.2-7-.2-7-.2s-4.2 0-7 .2c-.5 0-1.3.1-2 .9-.6.7-.8 2.4-.8 2.4S3.5 8 3.5 9.8v1.4c0 1.8.4 3.6.4 3.6s.2 1.7.8 2.4c.7.8 1.7.8 2.1.9 1.6.1 6.8.2 6.8.2s4.2 0 7-.2c.5 0 1.3-.1 2-.9.6-.7.8-2.4.8-2.4s.4-1.8.4-3.6V9.8c0-1.8-.4-3.6-.4-3.6zM9.9 14.6V8.4l5.2 3.1-5.2 3.1z" />
              </svg>
            </a>

            {/* X (formerly Twitter) */}
            <a
              href="https://x.com/ProEdgeLearning"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X ProEdge Learning"
              className="hover:text-[#fca532] transition-colors"
            >
              <XIconTwitter className="w-6 h-6" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/theproedgelearning/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram ProEdge Learning"
              className="hover:text-[#fca532] transition-colors"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>

            {/* Email */}
            <a
              href="mailto:proedgelearningofficial@gmail.com"
              aria-label="Email ProEdge Learning"
              className="hover:text-[#fca532] transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>

            {/* Optional: LinkedIn (if you have a page, replace href) */}
            {/* <a
              href="https://www.linkedin.com/company/proedgelearning"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn ProEdge Learning"
              className="hover:text-[#fca532] transition-colors"
            >
              <LinkedinIcon className="w-6 h-6" />
            </a> */}
          </div>

          {/* Map Embed */}
          <div className="h-56 sm:h-64 rounded-2xl overflow-hidden shadow-lg">
            <iframe
              title="ProEdge Learning Sirsi Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.623955801787!2d74.8353689!3d14.6194973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf1b1e9d8a3ef9%3A0x25db87c1e9c6a4b9!2sSimpi%20Galli%2C%20Sirsi%2C%20Karnataka%20581401!5e0!3m2!1sen!2sin!4v1731188740000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xl text-white mb-6">Contact Us</h4>
          <p className="mb-2">📞 +91 81057 51886</p>
          <p className="mb-2">🏠 1074, 1st Floor Simpi Galli, Sirsi</p>
          <p className="mb-2">Karnataka, 581401</p>
          <p>✉️ info@proedgelearning.in</p>
        </div>

        {/* Courses Column 1 */}
        <div>
          <h4 className="text-xl text-white mb-6">Quick Links</h4>
          <Link
            to="/"
            className="block mb-2 hover:text-[#fca532] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block mb-2 hover:text-[#fca532] transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/application"
            className="block mb-2 hover:text-[#fca532] transition-colors"
          >
            Application Form
          </Link>
        </div>

        {/* Courses Column 2 + Quick Links */}
        <div>
          <h4 className="text-xl text-white mb-6">Courses</h4>
          <Link
            to="/course/basic-computer"
            className="block mb-3 hover:text-[#fca532] transition-colors"
          >
            Basic Computer Skills
          </Link>
          <Link
            to="/course/excel-basic"
            className="block mb-3 hover:text-[#fca532] transition-colors"
          >
            Excel Basic
          </Link>
          <Link
            to="/course/excel-advanced"
            className="block mb-3 hover:text-[#fca532] transition-colors"
          >
            Excel Advanced
          </Link>
          <Link
            to="/course/excel-vba"
            className="block mb-3 hover:text-[#fca532] transition-colors"
          >
            Excel + VBA Scripting
          </Link>
          <Link
            to="/course/sql-basic"
            className="block mb-3 hover:text-[#fca532] transition-colors"
          >
            SQL Basic
          </Link>
          <Link
            to="/course/sql-advanced"
            className="block mb-3 hover:text-[#fca532] transition-colors"
          >
            SQL Advanced
          </Link>
          <Link
            to="/course/powerbi"
            className="block mb-3 hover:text-[#fca532] transition-colors"
          >
            Power BI
          </Link>
          <Link
            to="/course/power-automate"
            className="block mb-3 hover:text-[#fca532] transition-colors"
          >
            Power Automate
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 pt-8 text-center mt-10 text-sm text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} ProEdge Learning. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
}
