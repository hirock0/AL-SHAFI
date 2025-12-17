"use client";

import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ApprovedBtn = ({ id }) => {
  const router = useRouter();
  const parseId = JSON.parse(id);
  const [loading, setLoading] = useState(false);

  const approvedHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `/pages/api/products/reviews/${parseId}`,
        {
          status: true,
        }
      );

      if (data?.success) {
        toast.success("Approved successfully");
        router.refresh();
      } else {
        toast.warning("Approval failed");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={approvedHandler}
      disabled={loading}
      className={`flex items-center justify-center gap-2 ${
        loading
          ? "bg-green-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
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
        "Approve"
      )}
    </button>
  );
};

export default ApprovedBtn;
