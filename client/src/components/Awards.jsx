import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the AOS CSS

const AwardsSection = () => {
  const [currentAward, setCurrentAward] = useState(0);
  const [fade, setFade] = useState(true);

  const awards = [
    {
      image: '/award/one.JPG',
      title: 'Studio One Golden Icon Award',
      description: 'Golden Icon Award – Best E-Commerce in Fresh Mutton & Chicken. We are proud to announce that Studio One has honored us with the Golden Icon Award for Best E-Commerce in Mutton and Chicken (No Frozen) on March 30, 2025.',
      date: 'March 30, 2025'
    },
    {
      image: '/award/two.JPG',
      title: 'Studio One Golden Icon Award',
      description: 'Golden Icon Award – Best E-Commerce in Fresh Mutton & Chicken. We are proud to announce that Studio One has honored us with the Golden Icon Award for Best E-Commerce in Mutton and Chicken (No Frozen) on March 30, 2025.',
      date: 'March 30, 2025'
    },
    {
      image: '/award/three.JPG',
      title: 'Studio One Golden Icon Award',
      description: 'Golden Icon Award – Best E-Commerce in Fresh Mutton & Chicken. We are proud to announce that Studio One has honored us with the Golden Icon Award for Best E-Commerce in Mutton and Chicken (No Frozen) on March 30, 2025.',
      date: 'March 30, 2025'
    }
  ];

  const nextAward = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentAward((prev) => (prev + 1) % awards.length);
      setFade(true);
    }, 300); // Matches the transition duration
  };

  const prevAward = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentAward((prev) => (prev - 1 + awards.length) % awards.length);
      setFade(true);
    }, 300); // Matches the transition duration
  };

  const goToAward = (index) => {
    setFade(false);
    setTimeout(() => {
      setCurrentAward(index);
      setFade(true);
    }, 300); // Matches the transition duration
  };

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS
  }, []);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[#191716] relative">
      <div className="max-w-7xl mx-auto">
        {/* Heading and Subheading */}
        <div className="text-center mb-12">
          <p className="text-[#ffecad] text-3xl pt-8 font-dancing pb-5">Our Awards & Recognitions</p>
          <p className="text-4xl md:text-5xl font-bold pt-3 text-white font-opensans leading-tight pb-10">
            Award Winning
          </p>
        </div>

        {/* Carousel */}
        <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
          {/* Left Side - Image with fade effect */}
          <div className="w-full lg:w-1/2 rounded-lg overflow-hidden shadow-xl relative" data-aos="fade-up">
            <img 
              src={awards[currentAward].image} 
              alt={awards[currentAward].title}
              className={`w-full h-auto object-cover rounded-xl border-2 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>

          {/* Right Side - Content */}
          <div className="w-full lg:w-1/2" data-aos="fade-up" data-aos-delay="200">
            <h3 className={`text-2xl font-bold text-[#ffecad] mb-2 transition-opacity font-quicksand duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              {awards[currentAward].title}
            </h3>
            <p className={`text-white mb-4 transition-opacity font-opensans duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              {awards[currentAward].description}
            </p>
            <p className={`text-[#d79c5e] transition-opacity font-light duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              {awards[currentAward].date}
            </p>
            
            {/* Navigation Dots */}
            <div className="flex justify-center lg:justify-start gap-2 mt-8">
              {awards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToAward(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentAward === index ? 'bg-[#9c0202]' : 'bg-gray-300'}`}
                  aria-label={`Go to award ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <div className="flex justify-center lg:justify-start gap-4 mt-6">
              <button 
                onClick={prevAward}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Previous award"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextAward}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Next award"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Doodles Icon */}
      <img 
        src="/award/icon.png" 
        alt="Doodles Icon"
        className="absolute bottom-32 right-28 w-32 h-32 sm:w-48 sm:h-48 opacity-50 z-0 rotate-12"
      />
    </div>
  );
};

export default AwardsSection;
