import { ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import GalleryImages from "../GalleryImages/GalleryImages";
import AddCartBtn from "@/components/Ui/Products/AddCartBtn/AddCartBtn";
import ConverterToHtml from "@/components/ConverterToHtml/ConverterToHtml";

const ProductBenefits = ({ setIsBenefitsOpen, showBenefits }) => {
  if (!showBenefits) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setIsBenefitsOpen(false);
  };
  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    >
      <div className="bg-surface w-full max-w-4xl rounded-lg shadow-2xl overflow-y-scroll max-h-[90vh]">
        {/* Body */}
        <div className="flex flex-col-reverse lg:flex-row h-full">
          {/* Left Image Section */}
          <div className="w-full lg:w-1/2 p-5">
            <GalleryImages product={JSON.stringify(showBenefits)} />
          </div>

          {/* Right Content (SCROLLS) */}
          <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsBenefitsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <h1 className="text-2xl font-bold">{showBenefits.productName}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  TK{showBenefits.offerPrice?.toLocaleString()}
                </span>
                {showBenefits.regularPrice > showBenefits.offerPrice && (
                  <span className="text-gray-500 line-through">
                    TK{showBenefits.regularPrice?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              {showBenefits.shortDescriptions && (
                <div className="leading-relaxed ">
                  <ConverterToHtml html={showBenefits.shortDescriptions} />
                </div>
              )}

              {/* CTA */}
              <AddCartBtn
                product={JSON.stringify(showBenefits)}
                styles="w-full px-4 py-3 bg-text text-white hover:bg-black transition-all font-medium shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </AddCartBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBenefits;
