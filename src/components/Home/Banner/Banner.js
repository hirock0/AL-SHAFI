"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBanners } from "@/hooks/banners/useBanners";
const Banner = () => {
  const { fetchBanners, loading } = useBanners();
  const flterBanners = fetchBanners?.filter((bn) =>
    bn?.alt?.toLowerCase().startsWith("banner")
  );
  const flterPosters = fetchBanners?.filter((pos) =>
    pos?.alt?.toLowerCase().startsWith("poster")
  );
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % flterBanners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [flterBanners.length, isHovered]);

  const goToPrevious = () => {
    setIndex((prev) => (prev - 1 + flterBanners.length) % flterBanners.length);
  };

  const goToNext = () => {
    setIndex((prev) => (prev + 1) % flterBanners.length);
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="w-full h-[300px] rounded-lg bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!fetchBanners.length) return null;

  return (
    <div className="max-w-[1440px] mx-auto xl:px-20 md:px-10 sm:px-4 px-4 py-4 md:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 md:gap-4 w-full">
        {/* Main Banner */}
        <div
          className="relative w-full h-[200px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] lg:col-span-8 overflow-hidden rounded md:rounded-md shadow-lg group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Images */}
          {flterBanners.map((src, i) => (
            <Image
              key={i}
              src={src?.secure_url}
              alt={`Banner ${i + 1}`}
              fill
              priority={i === 0}
              className={`object-cover transition-all duration-700 ease-in-out ${
                i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-2 md:p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-2 md:p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-2.5 z-10">
            {flterBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  index === i
                    ? "w-8 md:w-10 h-2.5 md:h-3 bg-primary shadow-md"
                    : "w-2.5 md:w-3 h-2.5 md:h-3 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold">
            {index + 1} / {flterBanners.length}
          </div>
        </div>

        {/* Side Banners */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4 lg:col-span-2">
          {/* Small Image 1 */}
          <div className="relative w-full h-[170px] md:h-[195px] lg:h-[218px] xl:h-[243px] overflow-hidden rounded md:rounded-md shadow-md group">
            <Image
              src={flterPosters[0]?.secure_url}
              alt={flterPosters[0]?.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Small Image 2 */}
          <div className="relative w-full h-[170px] md:h-[195px] lg:h-[218px] xl:h-[243px] overflow-hidden rounded md:rounded-md shadow-md group">
            <Image
              src={flterPosters[1]?.secure_url}
              alt={flterPosters[1]?.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>

      {/* Optional: Progress Bar */}
      {/* <div className="max-w-[1440px] mx-auto mt-4 hidden md:block">
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary to-primary-light transition-all duration-300 ease-linear"
            style={{
              width: `${((index + 1) / slides.length) * 100}%`,
            }}
          />
        </div>
      </div> */}
    </div>
  );
};

export default Banner;
