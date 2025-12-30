import React, { useState } from 'react';
import Fssai from '../assets/certificate/fssai.jpg';
import Gst from '../assets/certificate/gst.jpg';
import Pin from '../assets/certificate/pin.png';
import { FaShieldAlt, FaFileInvoiceDollar } from 'react-icons/fa';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Certificate = () => {
  const [activeTab, setActiveTab] = useState('fssai');

  const certificates = {
    fssai: {
      image: Fssai,
      title: 'FSSAI Certified',
      subtitle: 'Food Safety Compliance',
      description:
        'We are proudly certified by the Food Safety and Standards Authority of India (FSSAI), ensuring our commitment to hygiene, quality, and food safety. Our certification reflects strict compliance with national food safety standards, so you can enjoy every bite with confidence. Your health and trust are our top priorities.',
      points: [
        'Regular quality inspections',
        'Government-approved processing',
        'Traceable sourcing',
        'Hygienic packaging standards',
      ],
      icon: <FaShieldAlt className="text-3xl" />,
    },
    gst: {
      image: Gst,
      title: 'GST Registered',
      subtitle: 'Tax Compliance',
      description:
        'Our business is registered under the Goods and Services Tax (GST), ensuring transparency and compliance with Indian tax laws. This certification reflects our commitment to running a legal and trustworthy food establishment. When you shop with us, you’re supporting a fully authorized and accountable business.',
      points: [
        'Proper invoicing',
        'Tax transparency',
        'Legal business operations',
      ],
      icon: <FaFileInvoiceDollar className="text-3xl" />,
    },
  };

  // Custom MUI Button Styling
  const CustomButton = styled(Button)(({ theme, isActive }) => ({
    backgroundColor: isActive ? '#9c0202' : 'white',
    color: isActive ? 'white' : '#9c0202',
    border: '1px solid #9c0202',
    padding: '8px 24px',
    margin: '0 4px',
    fontWeight: 500,
    textTransform: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: isActive ? '#7b011b' : '#f5f5f5',
      color: isActive ? 'white' : '#9c0202',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '6px 16px',
      fontSize: '0.875rem',
    },
  }));

  const CertificateImage = ({ src, alt }) => (
    <div className="w-full lg:w-1/2 p-4 lg:p-8 flex justify-center items-center overflow-hidden">
      <div
        className="relative p-4 sm:p-6 rounded-xl shadow-2xl bg-white transform transition-transform duration-300 max-w-full"
        style={{
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
          border: '2px solid #9c0202',
        }}
      >
        {/* Embossed Border Effect */}
        <div
          className="absolute inset-0 rounded-xl border-2 opacity-30"
          style={{ margin: '-4px' }}
        ></div>
        {/* Pin Image at Top-Right */}
        <img
          src={Pin}
          alt="Pin"
          className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 transform translate-x-2 -translate-y-2"
          style={{
            zIndex: 10,
          }}
        />
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-lg object-contain max-w-[90%] sm:max-w-[500px] mx-auto"
          loading="lazy"
        />
      </div>
    </div>
  );

  const CertificateContent = ({ data }) => (
    <div className="w-full lg:w-1/2 p-4 lg:p-8 flex items-center">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border-t-4 border-[#9c0202] transform transition-transform duration-300 w-full">
        <div className="flex items-center gap-4 mb-5">
          <div className="bg-[#9c0202] p-3 rounded-full text-white">
            {data.icon}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#9c0202]">
              {data.title}
            </h2>
            <p className="text-gray-600 text-sm">{data.subtitle}</p>
          </div>
        </div>
        <p className="text-gray-800 text-sm leading-relaxed mb-5 font-sans">
          {data.description}
        </p>
        <ul className="space-y-2">
          {data.points.map((point, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="h-4 w-4 text-[#9c0202] mt-1 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-800 text-sm font-sans">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Initialize AOS
  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      id="certificate"
    >
      <div className="max-w-6xl mx-auto overflow-hidden">
        <div className="text-center mb-12">
          <h1
            className="text-[#9c0202] text-2xl sm:text-3xl pt-8 font-dancing mb-2"
            data-aos="fade-up"
          >
            Our Certifications
          </h1>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#000000] font-sans leading-tight mb-6"
            data-aos="fade-up"
          >
            Trusted Quality & Compliance
          </h2>
        </div>

        <div className="flex justify-center mb-8 sm:mb-10" data-aos="fade-left">
          <div className="inline-flex bg-white rounded-md p-1 flex-wrap gap-2">
            <CustomButton
              isActive={activeTab === 'fssai'}
              onClick={() => setActiveTab('fssai')}
            >
              FSSAI
            </CustomButton>
            <CustomButton
              isActive={activeTab === 'gst'}
              onClick={() => setActiveTab('gst')}
            >
              GST
            </CustomButton>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-0">
          {activeTab === 'fssai' ? (
            <>
              <CertificateContent data={certificates.fssai} />
              <CertificateImage
                src={certificates.fssai.image}
                alt="FSSAI Certificate"
              />
            </>
          ) : (
            <>
              <CertificateImage
                src={certificates.gst.image}
                alt="GST Certificate"
              />
              <CertificateContent data={certificates.gst} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificate;