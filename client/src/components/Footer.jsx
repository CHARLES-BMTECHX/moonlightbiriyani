import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import FooterLogo from '../assets/admin-logo.png'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const links = ['About', 'Services', 'Testimonial', 'Contact'];

  return (
    <footer className="bg-[#672674] text-white py-10" id='contact'>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1 - Logo & Text */}
        <div className="flex flex-col items-start max-w-xs">
          <img src={FooterLogo} alt="BMTechx Logo" className="h-14 mb-3 rounded-full" />
          <p className="text-sm ">
            Moonlight briyani is a dedicated night-time culinary destination in Cuddalore, offering a diverse menu of authentic briyanis, grills, and special midnight dishes. Our mission is to serve high-quality, flavour-rich food with exceptional customer satisfaction at the heart of everything we do.
          </p>
        </div>

        {/* Column 2 - Useful Links */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-3 text-[#ffecad] font-quicksand">Useful Links</h3>
          <ul className="space-y-1 text-base">
            {links.map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`} className="hover:text-red-400 transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>


        {/* Column 3 - Contact Info */}
        <div className="flex flex-col max-w-xs">
          <h3 className="text-lg font-semibold mb-3 text-[#ffecad] font-quicksand">Contact Us</h3>
         <div className='flex gap-2'>
             <FaMapMarkerAlt className="mr-2" size={30} />
          <p className="text-sm mb-4 flex items-center">
            Moonlight briyani Truck,
            Opposite to GRT,
            Near by Amma Unavagam, Velmurugan Cinema, Uzhavar Market,
            Chidhambaram Hightway,
            Cuddalore
          </p>
         </div>
          <p className="text-sm mb-4 flex items-center">
            <FaPhone className="mr-2" size={16} />
            <a href="tel:+919566037235" className="hover:text-red-400 transition-colors">
              +91 9500371517
            </a>
          </p>
          <p className="text-sm flex items-center">
            <FaEnvelope className="mr-2" size={16} />
            <a href="mailto:premanand783@gmail.com" className="hover:text-red-400 transition-colors">
              moonlightbriyanicuddalore@gmail.com
            </a>
          </p>
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-3 text-[#ffecad] font-quicksand">Follow Us</h3>
          <div className="flex space-x-4 items-center">
            <a
              href="https://www.instagram.com/cudmoonlightbriyani?igsh=MWFma3R5cWNhMHh2cQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400"
            >
              <img
                src="Footer/instagram.png"
                alt="Get it on Google Play"
                className="h-10"
              />
            </a>
            {/* <a
              href="https://play.google.com/store/apps/details?id=com.spiderindia.ChopChop" // Replace with your actual Play Store URL
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src="/Footer/playstore.svg"
                alt="Get it on Google Play"
                className="h-10"
              />
            </a> */}
          </div>
        </div>

      </div>


    </footer>
  );
};

export default Footer;
