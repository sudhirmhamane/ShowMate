import React from "react";
import { Link } from "react-router-dom";
import { ClockIcon, CalendarIcon } from "lucide-react";

const HeroSection = () => {
  return (
    <div
      className="relative h-[100vh] w-full bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://www.91-cdn.com/metareel-images/content/backdrops-6-1749825222548-pyiQcMpPkNK0WGjvefKhJnQljHM.jpg?tr=,w-1351,q-40,fo-center&version=2')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl px-6 md:px-12 lg:px-24">
        <div className="max-w-xl space-y-4">
          {/* Studio */}
          <div className="bg-red-600 inline-block px-3 py-1 text-xs uppercase font-semibold rounded-sm tracking-wide">
            Vipul S Arora Studios
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Kesari Chapter 2: The Untold Story of Jallianwala Bagh
          </h1>

          {/* Genres & Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-300 font-medium">
            <span>History</span>
            <span>|</span>
            <span>Drama</span>
            <span>|</span>
            <span>Biography</span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              2025
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              2h 12m
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm md:text-base">
            Sir Chettur Sankaran Nair was known for being a passionate advocate
            for social reforms and a firm believer in the self-determination of India.
          </p>

          {/* CTA Button */}
          <Link
            onClick={() => navigate("/movies")}
            to="/movies"
            className="inline-block mt-4 px-6 py-2 bg-primary hover:bg-primary-dull transition rounded-full text-white font-medium text-sm md:text-base"
          >
            Explore Movies →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
