import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Carousel, Spin } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getHeroBanners } from "../services/HeroBannerApi";

export default function HomeSection() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Init AOS */
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  /* Fetch banners */
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getHeroBanners();
        setBanners(res.data || []);
      } catch (error) {
        console.error("Failed to load hero banners", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  /* Refresh AOS after banners load */
  useEffect(() => {
    if (banners.length) {
      setTimeout(() => {
        AOS.refreshHard();
      }, 300);
    }
  }, [banners]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!banners.length) return null;

  return (
    <section
      id="home"
      className="relative h-screen overflow-hidden group"
    >
      <Carousel
        autoplay
        autoplaySpeed={3000}
        pauseOnHover={false}
        effect="fade"
        dots
        arrows
        prevArrow={<PrevArrow />}
        nextArrow={<NextArrow />}
      >
        {banners.map((banner) => (
          <div key={banner._id}>
            <div
              className="h-screen w-full bg-cover bg-center"
              data-aos="fade-in"
              style={{
                backgroundImage: `url(${banner.bannerImage})`,
              }}
            />
          </div>
        ))}
      </Carousel>
    </section>
  );
}

/* ================== Custom Lucide Arrows ================== */

const arrowBase =
  "absolute top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto";

const PrevArrow = (props) => (
  <div {...props} className={`${arrowBase} left-5`}>
    <ChevronLeft size={28} strokeWidth={2.5} />
  </div>
);

const NextArrow = (props) => (
  <div {...props} className={`${arrowBase} right-5`}>
    <ChevronRight size={28} strokeWidth={2.5} />
  </div>
);
