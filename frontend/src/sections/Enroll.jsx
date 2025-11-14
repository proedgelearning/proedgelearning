// src/sections/Enroll.jsx
import React from "react";
import Button from "../components/Button";

export default function Enroll() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-5 py-10">
        <div className="bg-[#fca532] rounded-xl p-10  flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="text-white">
            <h2 className="text-3xl lg:text-4xl font-extrabold">Enroll Today & Start Your Journey</h2>
            <p className="text-lg text-gray-800 mt-2">Build your future with ProEdge.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
