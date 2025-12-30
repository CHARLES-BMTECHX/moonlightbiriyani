import React from "react";
import { FaStar, FaGooglePlay, FaTruck } from "react-icons/fa";
import { GoPackageDependents } from "react-icons/go";

const Mobile = () => {
  return (
    <div className="min-h-screen bg-[#9c0202] flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Wave background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/mobile/banner.jpg"
          alt="Wave Background"
          className="w-full h-full object-cover opacity-50 sm:opacity-60"
        />
      </div>
      <div className="container mx-auto max-w-full sm:max-w-7xl relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[400px] sm:min-h-[600px]">
          {/* Left side - Mobile mockup */}
          <div className="w-full md:w-2/5 flex items-center justify-center p-4 sm:p-8 relative">
            <div className="relative transform rotate-[10deg] shadow-2xl rounded-[30px] sm:rounded-[40px] border-4 sm:border-8 border-gray-800 bg-gray-800 w-[200px] sm:w-[280px] h-[400px] sm:h-[580px]">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-5 sm:h-7 bg-gray-800 rounded-b-lg sm:rounded-b-xl z-10"></div>
              {/* Phone screen */}
              <div className="w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden">
                <img
                  src="/mobile/mobile.jpg"
                  alt="Play Store Interface"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              {/* Phone buttons */}
              <div className="absolute right-[-4px] sm:right-[-8px] top-20 sm:top-32 h-12 sm:h-16 w-1 sm:w-2 bg-gray-700 rounded-l-md sm:rounded-l-lg"></div>
              <div className="absolute left-[-4px] sm:left-[-8px] top-16 sm:top-24 h-8 sm:h-12 w-1 sm:w-2 bg-gray-700 rounded-r-md sm:rounded-r-lg"></div>
              <div className="absolute left-[-4px] sm:left-[-8px] top-28 sm:top-40 h-8 sm:h-12 w-1 sm:w-2 bg-gray-700 rounded-r-md sm:rounded-r-lg"></div>
            </div>
            {/* Decorative elements - hidden on mobile */}
            <div className="hidden sm:block absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-[#9c0202]/20 rounded-full filter blur-3xl"></div>
            <div className="hidden sm:block absolute top-10 right-10 w-16 sm:w-20 h-16 sm:h-20 bg-[#9c0202]/20 rounded-full filter blur-2xl"></div>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-3/5 p-4 sm:p-8 lg:p-16 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Download Our App
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-xl">
              Experience the taste of quality with our user-friendly app. Order farm-fresh meat from home. Chop Chop ensures hygiene, freshness, and fast delivery.
            </p>

            <div className="space-y-4 sm:space-y-6">
              {/* Star Rating */}
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-[#9c0202] p-2 sm:p-3 rounded-full text-white">
                  <FaStar className="text-lg sm:text-xl" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">4.9 Star Rating</h3>
                  <p className="text-sm sm:text-gray-600 mt-1">Loved by meat lovers for top-tier quality & service.</p>
                </div>
              </div>

              {/* Download Orders */}
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-[#9c0202] p-2 sm:p-3 rounded-full text-white">
                  <GoPackageDependents className="text-lg sm:text-xl" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">1M+ Orders Delivered</h3>
                  <p className="text-sm sm:text-gray-600 mt-1">Join thousands who trust us for their daily protein fix.</p>
                </div>
              </div>

              {/* Delivery Speed */}
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-[#9c0202] p-2 sm:p-3 rounded-full text-white">
                  <FaTruck className="text-lg sm:text-xl" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Same-Day Delivery</h3>
                  <p className="text-sm sm:text-gray-600 mt-1">Order now, cook tonight!</p>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-6 sm:mt-10">
              <a
                href="https://play.google.com/store/apps/details?id=com.spiderindia.ChopChop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-[#9c0202] text-white rounded-lg hover:bg-[#8c0202] transition-all shadow-lg text-sm sm:text-base"
              >
                <FaGooglePlay className="mr-2 sm:mr-3 text-xl sm:text-2xl" />
                <div className="flex flex-col">
                  <span className="text-xs sm:text-xs">GET IT ON</span>
                  <span className="text-base sm:text-xl font-semibold">Google Play</span>
                </div>
              </a>

              <div className="flex flex-col sm:flex-row items-start sm:items-center mt-3 sm:mt-4 space-y-2 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                <p>Available for Android devices running version 8.0 and above</p>
                <span className="hidden sm:inline text-[#9c0202]">•</span>
                <p>Free to download</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mobile;
