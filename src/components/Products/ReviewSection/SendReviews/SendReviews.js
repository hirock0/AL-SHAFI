"use client";
import axios from "axios";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addActiveFlag } from "@/utils/redux/slices/slice";
const SendReviews = ({ product }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const parseProduct = JSON.parse(product);
  const { activeFlag } = useSelector((state) => state?.slice);
  const reviews = parseProduct?.reviews || [];
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      slug: "",
      name: "",
      email: "",
      rating: 0,
      comment: "",
    },
  });

  const rating = watch("rating");
  const onSubmit = async (formData) => {
    try {
      formData.slug = parseProduct.slug;
      const { data } = await axios.post(
        "/pages/api/products/reviews",
        formData
      );
      if (data?.success) {
        toast.success("Review submitted successfully");
        const existReviews = localStorage.getItem("reviews");
        if (!existReviews) {
          localStorage.setItem("reviews", JSON.stringify([data?.review]));
          dispatch(addActiveFlag(!activeFlag));
          router.refresh();
          reset();
        } else {
          const parseReview = JSON.parse(existReviews);
          localStorage.setItem(
            "reviews",
            JSON.stringify([data?.review, ...parseReview])
          );
          dispatch(addActiveFlag(!activeFlag));
          router.refresh();
          reset();
        }
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };
  return (
    <div className="mt-10 border-t border-border pt-6">
      <h2 className="text-xl font-semibold mb-4">
        Customer Reviews ({reviews.length})
      </h2>
      {reviews.length === 0 && (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{review.name}</h4>
                {review.email && (
                  <p className="text-xs text-gray-400">{review.email}</p>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* ✍️ Add Review */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Write a Review</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Your name"
              {...register("name", { required: "Name is required" })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Rating */}
          <div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setValue("rating", star)}
                  className={`h-6 w-6 cursor-pointer transition ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            {errors.rating && (
              <p className="text-xs text-red-500 mt-1">
                {errors.rating.message}
              </p>
            )}
            <input
              type="hidden"
              {...register("rating", {
                required: "Rating is required",
                min: { value: 1, message: "Select at least 1 star" },
              })}
            />
          </div>

          {/* Comment */}
          <div>
            <textarea
              rows={4}
              placeholder="Write your review..."
              {...register("comment", {
                required: "Comment is required",
                minLength: {
                  value: 2,
                  message: "Comment must be at least 2 characters",
                },
              })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            {errors.comment && (
              <p className="text-xs text-red-500 mt-1">
                {errors.comment.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md text-sm"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendReviews;
