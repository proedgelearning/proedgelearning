import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function Courses() {
  const courses = [
    {
      title: "Basic Computer Skills",
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      link: "/course/basic-computer",
      mrp: 3999,
      price: 2499,
    },
    {
      title: "Excel Basic",
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      link: "/course/excel-basic",
      mrp: 7999,
      price: 4999,
    },
    {
      title: "Excel Advanced",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      link: "/course/excel-advanced",
      mrp: 9999,
      price: 6999,
    },
    {
      title: "Excel + VBA Scripting",
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      link: "/course/excel-vba",
      mrp: 14999,
      price: 9999,
    },
     {
      title: "Prompt Engineering with AI Tools",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      link: "/course/prompt-engineering",
      mrp: 20999,
      price: 17999,
    },
    {
      title: "SQL Basic",
      img: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=1200&q=80",
      link: "/course/sql-basic",
      mrp: 14999,
      price: 9999,
    },
    {
      title: "SQL Advanced",
      img: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=800&q=80",
      link: "/course/sql-advanced",
      mrp: 19999,
      price: 15999,
    },
    {
      title: "Power BI",
      img: "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=800&q=80",
      link: "/course/powerbi",
      mrp: 20999,
      price: 12999,
    },
    {
      title: "Power Automate",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      link: "/course/power-automate",
      mrp: 20999,
      price: 17999,
    },
    {
      title: "Power Platform",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      link: "/course/power-platform",
      mrp: 45999,
      price: 39999,
    },
    {
      title: "Corporate Financial Planning",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      link: "/course/financial-planning",
      mrp: 12999,
      price: 9999,
    },
    {
      title: "Human Resource Management",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      link: "/course/human-resource",
      mrp: 15999,
      price: 12999,
    },
   
  ];

  return (
    <div className="bg-white py-5" id="courses">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0a214d] text-center mb-3">
          Explore Our Courses
        </h2>

        {/* ✨ Creative Tagline */}
        <p className="text-center text-gray-600 mb-10 text-lg">
          Upgrade your skills with job-oriented courses —{" "}
          <span className="text-red-600 font-semibold animate-pulse">
            Special Fee for First Few Batches Only! 🔥
          </span>
        </p>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition relative"
            >
              {/* 🔥 Blinking Offer Badge */}
              <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-full animate-pulse">
                Limited Time Offer!
              </span>

              <img
                src={course.img}
                alt={course.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-[#0a214d] mb-2">
                  {course.title}
                </h3>

                {/* Pricing */}
                <div className="mb-4">
                  <p className="text-red-600 font-bold line-through text-lg">
                    MRP: ₹{course.mrp}
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    Now: ₹{course.price}
                  </p>
                </div>

                <Link to={course.link}>
                  <Button className="w-full">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
