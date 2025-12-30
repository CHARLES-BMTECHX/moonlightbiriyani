import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import MeatImage from "../assets/meat.png"; // You might want to rename this file to biryani.png later
import { FaPhoneAlt } from "react-icons/fa";
import { BsPlusLg } from "react-icons/bs";

export default function AboutSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Set the duration of animations
      once: true,     // Animation happens once when scrolling
    });
    AOS.refresh();  // Ensures AOS works correctly when the page loads
  }, []);

  return (
    <section className="w-full py-16 mb-16 bg-white" id="about">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 lg:gap-12 gap-12 overflow-hidden">
        {/* Left content */}
        <div className="lg:w-1/2" data-aos="fade-right">
          <p className="text-[#672674] text-3xl font-dancing mb-2">About us</p>
          <h2 className="text-4xl md:text-5xl font-bold text-black font-opensans leading-tight mb-6" data-aos="fade-up">
            Moonlight Biriyani <br /> Flavours After Dark
          </h2>
          <p className="text-gray-600 text-base font-commissioner mb-8 leading-relaxed text-justify" data-aos="fade-up" data-aos-delay="200">
            Moonlight Biriyani is a dedicated night-time culinary destination in Cuddalore, offering a diverse menu of authentic biriyanis, grills, and special midnight dishes. Our mission is to serve high-quality, flavour-rich food with exceptional customer satisfaction at the heart of everything we do.
            <br /><br />
            From carefully selected spices to freshly prepared batches throughout the night, every detail reflects our commitment to taste and consistency. With exclusive night offers and a menu crafted to suit every food lover, Moonlight Biriyani stands as the perfect place to experience unforgettable flavours after dark.
          </p>

          {/* Contact */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-3 text-[#672674]" data-aos="fade-up" data-aos-delay="400">
              <FaPhoneAlt className="text-xl" />
              {/* Ensure this number is correct for the new business */}
              <span className="text-black font-bold text-base font-opensans">+91 9500371517</span>
            </div>
          </div>

          <button
            onClick={() => {
              const section = document.getElementById("services");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="group relative overflow-hidden bg-[#672674] text-white px-6 py-3 rounded-full flex items-center gap-3 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            <span className="transition-all duration-300 group-hover:-translate-x-1">
              Read more
            </span>
            <BsPlusLg className="text-sm transition-all duration-300 group-hover:rotate-90 group-hover:scale-125" />
            {/* Shine Effect */}
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          </button>
        </div>

        {/* Right image */}
        <div className="lg:w-1/2 flex justify-center" data-aos="fade-left">
          {/* Make sure to change the image source to a Biryani image if available */}
          <img
            src={MeatImage}
            alt="Moonlight Biriyani Special"
            className="w-full max-w-md sm:max-w-lg lg:max-w-md object-contain mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
