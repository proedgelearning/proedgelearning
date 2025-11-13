import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function Courses() {
  const courses = [
    {
      title: "Basic Computer Skills",
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      link: "/course/basic-computer"
    },
    {
      title: "Excel Basic",
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      link: "/course/excel-basic"
    },
    {
      title: "Excel Advanced",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      link: "/course/excel-advanced"
    },
    {
      title: "Excel + VBA Scripting",
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      link: "/course/excel-vba"
    },
    {
      title: "SQL Basic",
      img: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=1200&q=80",
      link: "/course/sql-basic"
    },
    {
      title: "SQL Advanced",
      img: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=800&q=80",
      link: "/course/sql-advanced"
    },
    {
      title: "Power BI",
      img: "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=800&q=80",
      link: "/course/powerbi"
    },
    {
      title: "Power Automate",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      link: "/course/power-automate"
    }
  ];

  return (
    <div className="bg-white py-20" id="courses">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0a214d] text-center mb-12">
          Explore Our Courses
        </h2>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, idx) => (
            <div 
              key={idx}
              className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition"
            >
              <img 
                src={course.img} 
                alt={course.title} 
                className="w-full h-48 object-cover"
              />

              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-[#0a214d] mb-4">
                  {course.title}
                </h3>

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
