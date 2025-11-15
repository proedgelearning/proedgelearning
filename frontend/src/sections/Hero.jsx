// src/sections/Hero.jsx
import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import EnrollModal from "../components/EnrollModal";
import { Link } from "react-router-dom";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Slider images
  const sliderImages = [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=800&h=600&fit=crop",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a214d] pt-20 pb-32">
      <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12">

        {/* Text Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-[#fca532] font-semibold text-lg uppercase tracking-wider">
            Welcome To The ProEdge
          </span>

          <h1 className="text-4xl lg:text-6xl text-white font-extrabold my-4 leading-tight">
            Success Is Just A Step Away
          </h1>

          <p className="text-lg text-gray-300 mb-8 max-w-lg">
            Certified courses and programs to help you build your career.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button onClick={() => setIsModalOpen(true)}>Get Started</Button>
          </div>
        </div>

        {/* 🎞 Auto-Sliding Hero Image */}
        <div className="hidden md:block w-full overflow-hidden rounded-xl shadow-2xl relative h-[380px]">
          <div
            className="flex transition-transform duration-[1200ms] ease-out h-full"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {sliderImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          {/* 🔘 Navigation Dots (optional + simple) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {sliderImages.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentIndex === i ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <EnrollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
