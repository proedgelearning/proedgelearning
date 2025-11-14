import React from "react";
import Button from "../components/Button";

export default function About() {
  return (
    <div className="pt-24 pb-32 bg-white">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        <img
          src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80"
          className="rounded-xl shadow-2xl"
          alt="About ProEdge"
        />

        <div>
          <h2 className="text-4xl font-extrabold text-[#0a214d] mb-4">
            About ProEdge Learning
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            ProEdge Learning is dedicated to empowering students and professionals 
            with practical knowledge and real-world skills. We deliver job-oriented 
            training, guided learning, and hands-on project experience to help you 
            achieve your goals confidently.
          </p>

          <div className="space-y-3 mb-6">
            <p className="text-gray-700">✔ Industry Expert Trainers</p>
            <p className="text-gray-700">✔ Live & Practical Sessions</p>
            <p className="text-gray-700">✔ Job Support & Career Guidance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
