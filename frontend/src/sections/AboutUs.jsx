import React, { useState } from "react";
import Button from "../components/Button";
import { CheckCircleIcon } from "../components/icons/Icons";

export default function AboutUs() {
  const [imgSrc, setImgSrc] = useState(
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=900&fit=crop"
  );

  const bullets = [
    {
      title: "Courses by Industry Experts",
      desc: "Curriculum built and taught by senior engineers and hiring managers, updated every quarter."
    },
    {
      title: "Hands-On Practical Learning",
      desc: "Project-driven modules: build real apps, portfolios, and deploy to production."
    },
    {
      title: "Dedicated Career Support",
      desc: "1:1 mentorship, resume reviews, mock interviews and employer introductions."
    },
  ];

  const stats = [
    { label: "Graduates", value: "9,400+" },
    { label: "Placement Rate", value: "87%" },
    { label: "Avg. Salary Rise", value: "+36%" },
  ];

  // simple SVG placeholder if image fails
  const placeholder =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900' viewBox='0 0 1200 900'><rect width='1200' height='900' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239aa4c7' font-family='Arial, Helvetica, sans-serif' font-size='36'>ProEdge — Learn by Doing</text></svg>`
    );

  return (
    // <section className="py-24 bg-white">
    <section className=" bg-white">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-[#fca532] font-semibold text-lg uppercase tracking-wider">
            About ProEdge
          </span>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0a214d] my-4">
            Who We Are & What We Do
          </h2>

          <p className="text-gray-600 text-lg mb-6">
            ProEdge Learning helps ambitious professionals transition into high-growth
            tech roles through immersive, project-based training, hands-on mentorship,
            and employer-aligned career support. We blend practical engineering work with
            soft-skill coaching so graduates are interview-ready and confident on day one.
          </p>

          <div className="grid gap-4 mb-6">
            {bullets.map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-[#fca532] mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-800">{title}</div>
                  <div className="text-gray-600 text-sm">{desc}</div>
                </div>
              </div>
            ))}
          </div>
{/* 
          <div className="flex items-center gap-6 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-[#0a214d]">{s.value}</div>
                <div className="text-sm text-gray-600">{s.label}</div>
              </div>
            ))}
          </div> */}

          <div className="flex items-center gap-4">
            {/* <Button>Read More</Button> */}
            <Button>
            <a href="/courses" className="text-sm font-medium text-[#0a214d] hover:underline">
              Browse Courses
            </a></Button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-2xl">
          {/* Image with graceful fallback + accessible alt text */}
          <img
            src={imgSrc}
            alt="Students collaborating on a software project in a modern classroom"
            className="w-full h-[420px] md:h-[520px] object-cover block"
            loading="lazy"
            onError={() => setImgSrc(placeholder)}
          />

          {/* Optional caption / testimonial */}
          {/* <div className="p-6 bg-white">
            <p className="text-gray-700 font-medium">“I landed my first developer role within 3 months — the projects and interview prep made all the difference.”</p>
            <div className="mt-3 text-sm text-gray-500">— Aisha Khan, Full‑Stack Graduate</div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
