// src/sections/EducationSystem.jsx
import React from "react";
import Button from "../components/Button";
import { CheckCircleIcon } from "../components/icons/Icons"

export default function EducationSystem() {
  const images = [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop"
  ];

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="grid grid-cols-2 gap-6">
          {images.map((img, i) => (
            <img key={i} src={img} className="rounded-xl shadow-lg" alt={`Education system ${i + 1}`} />
          ))}
        </div>

        <div>
          <span className="text-[#fca532] font-semibold text-lg uppercase">Our System</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0a214d] my-4">Our Education System Inspires</h2>

          {["Expert-led Guidance", "Real-world Projects","Ai & Future-Ready Skills","Budget-Friendly Courses","Career Focused Programs","Smart Classes","Job Readiness","Skill Contribution"].map((text) => (
            <div key={text} className="flex items-center mb-4">
              <CheckCircleIcon className="w-6 h-6 text-[#fca532] mr-3" /> <span>{text}</span>
            </div>
          ))}

          {/* <Button>Learn More</Button> */}
        </div>
      </div>
    </div>
  );
}