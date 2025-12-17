"use client";

import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ReviewDeleteBtn = ({ id }) => {
  const router = useRouter();
  const parseId = JSON.parse(id);
  const [loading, setLoading] = useState(false);
  const deleteHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `/pages/api/products/reviews/${parseId}`
      );

      if (data?.success) {
        toast.success("Review deleted successfully");
        router.refresh(); // refresh the page or component
      } else {
        toast.warning("Failed to delete review");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={deleteHandler}
      disabled={loading}
      className={`flex items-center justify-center gap-2 ${
        loading
          ? "bg-red-400 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
      } text-white px-3 py-1.5 rounded-md text-sm transition`}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        "Delete"
      )}
    </button>
  );
};

export default ReviewDeleteBtn;
