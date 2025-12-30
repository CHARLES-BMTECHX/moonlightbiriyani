import React from "react";

// Chicken SVG icon for preloader


const ChickenIcon = () => (
  <svg
    className="w-16 h-16 text-black animate-pulse"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 2s2.7-.6 3.5 1c.8 1.6-.6 3-1.5 4.5-1.2 2-3 3.5-5 3.5-3 0-5-2.5-5-5.5S5 2 8 2h3z" />
    <path d="M8 10v3l-3 3" />
    <path d="M13 10l3 3" />
    <circle cx="6" cy="6" r="1" />
  </svg>
);

const Preloader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-1000">
      <div className="animate-fade-in-out">
        <ChickenIcon />
      </div>
    </div>
  );
};

export default Preloader;