"use client";

import { useState } from "react";
import Image from "next/image";

const GalleryImages = ({ product }) => {
  const parseProduct =
    typeof product === "string" ? JSON.parse(product) : product;

  const thumb = parseProduct?.thumbnail;
  const imgs = parseProduct?.images || [];

  const [mainImage, setMainImage] = useState(thumb);
  const [backgroundPos, setBackgroundPos] = useState("50% 50%");
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allImages = [thumb, ...imgs].filter(Boolean);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setBackgroundPos(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setBackgroundPos("50% 50%");
  };

  const handleThumbnailClick = (image, index) => {
    setMainImage(image);
    setSelectedIndex(index);
  };

  const handlePrevious = () => {
    const newIndex =
      selectedIndex > 0 ? selectedIndex - 1 : allImages.length - 1;
    setMainImage(allImages[newIndex]);
    setSelectedIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      selectedIndex < allImages.length - 1 ? selectedIndex + 1 : 0;
    setMainImage(allImages[newIndex]);
    setSelectedIndex(newIndex);
  };

  if (!mainImage) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative group">
        <div
          className="relative w-fit rounded-md overflow-hidden shadow-lg"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Zoom View */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isZoomed ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              backgroundImage: `url(${mainImage?.secure_url})`,
              backgroundSize: "250%",
              backgroundPosition: backgroundPos,
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Normal View */}
          <Image
            src={mainImage?.secure_url}
            width={500}
            height={500}
            priority
            alt={mainImage?.alt || "Product image"}
            className={`  transition-opacity duration-300 ${
              isZoomed ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Zoom Indicator */}
          <div
            className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-md transition-opacity duration-300 ${
              isZoomed ? "opacity-0" : "opacity-100"
            }`}
          >
            🔍 Hover to zoom
          </div>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <svg
                  className="w-5 h-5 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <svg
                  className="w-5 h-5 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
              {selectedIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails Grid */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(img, idx)}
              className={`relative aspect-square rounded-md overflow-hidden transition-all duration-200 ${
                selectedIndex === idx
                  ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-105"
                  : "ring-1 ring-gray-200 hover:ring-gray-300 hover:scale-105 shadow-sm"
              }`}
            >
              <Image
                src={img?.secure_url}
                width={150}
                height={150}
                alt={img?.alt || `Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Selected Overlay */}
              {selectedIndex === idx && (
                <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryImages;
