"use client";

import { addCommonData } from "@/utils/redux/slices/slice";
import { useDispatch } from "react-redux";

const UpdateBtn = ({ banner }) => {
  const dispatch = useDispatch();
  const parseBanner = JSON.parse(banner);
  return (
    <div>
      <button
        onClick={() => dispatch(addCommonData(parseBanner))}
        className="bg-white text-slate-700 p-2 rounded-lg shadow-md hover:bg-slate-100 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </button>
    </div>
  );
};

export default UpdateBtn;
