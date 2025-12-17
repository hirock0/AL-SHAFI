"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";

const UserManagementBtn = ({ user }) => {
  const router = useRouter();
  const parseUser = JSON.parse(user);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const targetRole = parseUser?.role === "user" ? "admin" : "user";

  const userHandler = async () => {
    try {
      setLoading(true);
      const payload = {
        role: parseUser?.role,
      };
      const { data } = await axios.patch(
        `/pages/api/user/${parseUser?._id}`,
        payload
      );
      if (data?.success) {
        toast.success(data?.message);
        router.refresh();
      } else {
        toast.warning(data?.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update user role"
      );
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    try {
      setDeleting(true);
      const { data } = await axios.delete(`/pages/api/user/${parseUser?._id}`);
      if (data?.success) {
        toast.success(data?.message || "User deleted successfully");
        router.refresh();
      } else {
        toast.warning(data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={userHandler}
        disabled={loading || deleting}
        className={`
          px-4 py-2 rounded-lg font-medium text-sm
          transition-all duration-200 ease-in-out
          ${
            targetRole === "admin"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }
          ${
            loading || deleting
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-lg"
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2 
          ${
            targetRole === "admin"
              ? "focus:ring-blue-500"
              : "focus:ring-gray-500"
          }
          disabled:hover:shadow-none
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Updating...
          </span>
        ) : (
          `Make ${targetRole}`
        )}
      </button>
      {!showConfirm ? (
        <button
          onClick={handleDeleteClick}
          disabled={loading || deleting}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200 ease-in-out
            bg-red-600 hover:bg-red-700 text-white
            ${
              loading || deleting
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-lg"
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
            disabled:hover:shadow-none
          `}
        >
          Delete
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={deleteHandler}
            disabled={deleting}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200 ease-in-out
              bg-red-600 hover:bg-red-700 text-white
              ${deleting ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
              disabled:hover:shadow-none
            `}
          >
            {deleting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </span>
            ) : (
              "Confirm"
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={deleting}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200 ease-in-out
              bg-gray-300 hover:bg-gray-400 text-gray-800
              ${deleting ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
              disabled:hover:shadow-none
            `}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagementBtn;
