import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CoursePageLayout from "../../components/CoursePageLayout";
import courses from "../../pages/courses/data/courses";

export default function PowerBI() {
  const course = courses.find(c => c.slug === "PowerBI");

  return (
    <div>
      <Header />
      <CoursePageLayout
        title={course.title}
        description={course.description}
        imageUrl={course.img}
        mrp={course.mrp}
        price={course.price}
        points={course.points}
      />
      <Footer />
    </div>
  );
}
