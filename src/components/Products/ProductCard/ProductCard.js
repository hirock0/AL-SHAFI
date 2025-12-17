"use client";
import AddCartBtn from "@/components/Ui/Products/AddCartBtn/AddCartBtn";
import { addActiveFlag } from "@/utils/redux/slices/slice";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const dispatch = useDispatch();
  const { activeFlag } = useSelector((state) => state?.slice);
  const parseProduct =
    typeof product === "string" ? JSON.parse(product) : product;

  const viewHistoryHandler = () => {
    const histoieIds = localStorage.getItem("p_slug");
    let parseHistoyIds = [];
    try {
      parseHistoyIds = histoieIds ? JSON.parse(histoieIds) : [];
    } catch (err) {
      console.error("Failed to parse history IDs", err);
      parseHistoyIds = [];
    }
    if (!parseHistoyIds.includes(parseProduct?.slug)) {
      const newHistoyIds = [parseProduct?.slug, ...parseHistoyIds];
      localStorage.setItem("p_slug", JSON.stringify(newHistoyIds));
    }
    dispatch(addActiveFlag(!activeFlag));
  };

  // Calculate discount percentage
  const discountPercentage =
    parseProduct?.regularPrice && parseProduct?.offerPrice
      ? Math.round(
          ((parseProduct.regularPrice - parseProduct.offerPrice) /
            parseProduct.regularPrice) *
            100
        )
      : 0;

  return (
    <div className="group relative flex flex-col justify-between items-center p-4 md:p-5 border border-text/20  shadow-sm hover:shadow-xl transition-all duration-300 bg-surface overflow-hidden hover:-translate-y-1 rounded-md lg:rounded-lg">
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-linear-to-br from-error to-[#e53e3e] text-white px-3 py-1.5 rounded-full text-[10px] md:text-xs font-normal shadow-md">
          {discountPercentage}% OFF
        </div>
      )}

      {/* Favorite Button */}
      {/* <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 group/fav"
        aria-label="Add to favorites"
      >
        <Heart
          className={`w-4 h-4 transition-all duration-200 ${
            isFavorite
              ? "fill-error text-error"
              : "text-text-secondary group-hover/fav:text-error"
          }`}
          strokeWidth={2}
        />
      </button> */}

      {/* Product Image */}
      <Link
        onClick={viewHistoryHandler}
        href={`/product/product-details/${parseProduct?.slug}`}
        className="w-full h-48 md:h-56 relative mb-2 md:mb-4 overflow-hidden group/image"
      >
        {/* Loading Skeleton */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-linear-to-r from-background via-border to-background animate-pulse" />
        )}

        <Image
          src={parseProduct?.thumbnail?.secure_url || "/placeholder.png"}
          alt={parseProduct?.productName || "Product"}
          fill
          className={`object-contain  transition-all duration-500 group-hover/image:scale-110 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
          priority
        />

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="bg-white text-text px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
            <Eye className="w-4 h-4" strokeWidth={2} />
            <span>Quick View</span>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="w-full text-center mb-4 px-2">
        <Link
          onClick={viewHistoryHandler}
          href={`/product/product-details/${parseProduct?.slug}`}
        >
          <h3 className="text-sm md:text-base font-normal text-text transition-colors duration-200 line-clamp-2 mb-2 md:mb-4">
            {parseProduct?.productName || "Unnamed Product"}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
          <p className="font-bold text-base md:text-lg text-text">
            ৳{parseProduct?.offerPrice || 0}
          </p>
          {parseProduct?.regularPrice &&
            parseProduct?.regularPrice > parseProduct?.offerPrice && (
              <p className="text-text-muted line-through text-xs md:text-sm">
                ৳{parseProduct?.regularPrice}
              </p>
            )}
        </div>

        {/* Savings Badge */}
        {parseProduct?.regularPrice &&
          parseProduct?.regularPrice > parseProduct?.offerPrice && (
            <p className="text-text text-xs md:text-sm font-medium mt-0.5 md:mt-1">
              Save ৳{parseProduct.regularPrice - parseProduct.offerPrice}
            </p>
          )}
      </div>

      {/* Add to Cart Button */}
      {/* <div className="w-full">
        <AddCartBtn
          product={product}
          styles="w-full px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:from-primary-dark hover:to-primary transition-all duration-300 font-semibold text-sm md:text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingCart
            className="w-4 h-4 group-hover/btn:scale-110 transition-transform"
            strokeWidth={2}
          />
          <span>Add to Cart</span>
        </AddCartBtn>
      </div> */}
      <div className="w-full">
        <AddCartBtn
          product={product}
          styles="w-full px-4 py-2 md:py-3 bg-text text-white hover:bg-black transition-all duration-300 font-medium text-sm md:text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingCart
            className="w-4 h-4 group-hover/btn:scale-110 transition-transform"
            strokeWidth={2}
          />
          <span className="">Add to Cart</span>
        </AddCartBtn>
      </div>

      {/* Organic Badge (Optional - add if product has organic property) */}
      {parseProduct?.isOrganic && (
        <div className="absolute bottom-3 left-3 bg-primary-lighter text-primary-dark px-2 py-1 rounded text-xs font-semibold">
          🌿 Organic
        </div>
      )}
    </div>
  );
};

export default ProductCard;
