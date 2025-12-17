"use client";
import axios from "axios";
import { Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

const ShowReviews = ({ slug }) => {
  const { activeFlag } = useSelector((state) => state?.slice);
  const parseSlug = JSON.parse(slug);
  const [reviews, setReviews] = useState([]);
  const scrollContainerRef = useRef(null);
  
  const avgRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  useEffect(() => {
    const handler = async () => {
      try {
        const { data } = await axios.get(
          `/pages/api/products/reviews/${parseSlug}`
        );
        if (data?.success) {
          const existReviews = localStorage.getItem("reviews");
          if (existReviews) {
            const parseReviews = JSON.parse(existReviews);
            if (parseReviews?.length !== 0) {
              const trueIds = new Set(
                data?.reviews
                  .filter((item) => item.status === true)
                  .map((item) => item._id)
              );
              const filteredArray = parseReviews.filter(
                (item) => !trueIds.has(item._id)
              );
              localStorage.setItem("reviews", JSON.stringify(filteredArray));
              setReviews([...parseReviews, ...data?.reviews]);
            } else {
              localStorage.removeItem("reviews");
            }
          } else {
            setReviews(data?.reviews);
          }
        } else {
          setReviews([]);
        }
      } catch (error) {
        throw new Error(error?.message);
      }
    };
    handler();
  }, [activeFlag]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-8 bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border border-gray-200">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Reviews Yet
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Be the first to share your experience with this product
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Header Section */}
      <div className="bg-linear-to-r from-primary/5 to-primary/10 rounded-2xl p-6 mb-8 border border-primary/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              Customer Reviews
            </h3>
            <p className="text-sm text-gray-600">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-4xl font-bold text-gray-800">
                {avgRating}
              </span>
              <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Navigation Controls */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          What Customers Say
        </h4>
        
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Reviews Container */}
      <div className="relative">
        {/* Left Gradient Overlay */}
        <div className="absolute -left-3 top-0 bottom-0 w-8 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        
        {/* Reviews Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide -mx-2 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 min-w-[320px] max-w-[360px] shrink-0"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-linear-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>

                  {/* User Info */}
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base truncate max-w-[120px]">
                      {review.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">
                      {review.email}
                    </p>
                  </div>
                </div>

                {/* Date Badge */}
                <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 whitespace-nowrap">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 transition-all ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {review.rating}.0
                </span>
              </div>

              {/* Comment */}
              <div className="relative">
                <div className="absolute -left-2 top-0 w-1 h-full bg-linear-to-b from-primary/20 to-transparent rounded-full"></div>
                <p className="text-gray-700 leading-relaxed pl-4 line-clamp-4">
                  "{review.comment}"
                </p>
              </div>

              {/* Verified Badge */}
              {review.verified && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-full">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified Purchase
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Right Gradient Overlay */}
        <div className="absolute -right-3 top-0 bottom-0 w-8 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <div className="flex items-center gap-1.5">
          {reviews.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300 transition-all"
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 ml-2">
          Scroll horizontally to see more reviews
        </span>
      </div>
    </div>
  );
};

export default ShowReviews;