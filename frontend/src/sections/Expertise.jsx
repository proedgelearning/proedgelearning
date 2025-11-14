import React, { useState } from "react";
import Button from "../components/Button";
import {
  LightBulbIcon,
  SparklesIcon,
  BriefcaseIcon,
  ClockIcon,
} from "../components/icons/Icons";
import EnrollModal from "../components/EnrollModal";

export default function Expertise() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [imgSrc, setImgSrc] = useState(
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=900&fit=crop"
  );

  const cards = [
    {
      Icon: LightBulbIcon,
      title: "Innovative Curriculum",
      desc: "Hands-on projects inspired by real product problems — we teach modern architectures, testing, and best practices.",
    },
    {
      Icon: SparklesIcon,
      title: "Creative Problem Solving",
      desc: "Design thinking + engineering: build elegant solutions that balance user needs and technical constraints.",
    },
    {
      Icon: BriefcaseIcon,
      title: "Professional Readiness",
      desc: "Interview workshops, portfolio reviews, and employer networking — bridge the gap to your next role.",
    },
    {
      Icon: ClockIcon,
      title: "Flexible, Focused Learning",
      desc: "Self-paced modules with weekly live labs so you progress quickly without sacrificing quality.",
    },
  ];

  const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900' viewBox='0 0 1200 900'><rect width='1200' height='900' fill='%2310283a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23fca532' font-family='Inter, Arial' font-size='36'>ProEdge — Expertise</text></svg>`
    );

  return (
    <section className="bg-[#0a214d] py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-white">
          <span className="text-[#fca532] font-semibold text-sm uppercase tracking-widest">
            Why Choose Us
          </span>

          <h2
            class="text-4xl lg:text-5xl font-extrabold my-4 rounded-[5px] bg-black py-1 
         bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-orange-500"
          >
            Innovative. Creative. Professional.
          </h2>

          <p className="text-gray-200 max-w-xl text-justify">
            At ProEdge we combine industry-grade engineering, creative product
            thinking, and professional career coaching to fast-track your
            growth. Our approach blends theory, studio-style collaboration, and
            employer-aligned projects so you graduate with market-ready skills
            and a standout portfolio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            {cards.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white text-[#0a214d] p-6 rounded-xl shadow-lg transform transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-3">
                  <Icon className="w-7 h-7 text-[#fca532]" />
                  <h3 className="text-xl font-semibold">{title}</h3>
                </div>
                <p className="text-sm text-gray-700">{desc}</p>
              </div>
            ))}
          </div>

          {/* <div className="mt-8 flex items-center gap-4">
            <Button>See Our Programs</Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="text-lg px-8 py-3"
            >
              Apply Now
            </Button>
          </div> */}
        </div>

        <div className="rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#081733] to-[#07203a]">
          <img
            src={imgSrc}
            alt="Collaborative team workshop with designers and engineers working on a product"
            className="w-full h-[420px] md:h-[520px] object-cover block"
            loading="lazy"
            onError={() => setImgSrc(placeholder)}
          />

          <div className="p-6 bg-gradient-to-t from-[#07142a]/80 to-transparent text-white">
            <p className="font-medium">Your Career Deserves More Than Theory</p>
            <div className="mt-3 text-sm font-bold text-white font-['PT Sans']">
              Because{" "}
              <span className="text-[#fca532]">we don’t just teach</span> — we
              transform
            </div>

            <div className="mt-1 font-bold font-['PT Sans'] text-sm">
              <span className="text-[#fca532]">At ProEdge</span>, every skill
              you learn is designed to move you closer to your
              <span className="text-[#fca532]"> career goals.</span>
            </div>
          </div>
        </div>
      </div>
      <EnrollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
