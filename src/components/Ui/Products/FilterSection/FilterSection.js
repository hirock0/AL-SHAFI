"use client";

import Link from "next/link";
import { ChevronDown, Filter, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { addCommonFlag } from "@/utils/redux/slices/slice";

// react-icons
import { BsGrid3X3Gap, BsGrid, BsGrid1X2, BsGrid3X2Gap } from "react-icons/bs";

const grids = [
  { value: 1, Icon: BsGrid }, // 2 column
  { value: 2, Icon: BsGrid1X2 }, // 3 column
  { value: 3, Icon: BsGrid3X2Gap }, // 4 column
  { value: 4, Icon: BsGrid3X3Gap }, // dense grid
];

const FilterSection = ({ slug }) => {
  const parseSlug = JSON.parse(slug);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-10 ">
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(addCommonFlag("filter_sidebar_open"));
          }}
          className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-md transition-all duration-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
        >
          <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">Filter Products</span>
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div>
        <details className="group relative cursor-pointer">
          <summary className="list-none flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-xs sm:text-sm">
            <div className="flex items-center gap-2">
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
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              <span>Sort by</span>
            </div>
            <svg
              className="w-4 h-4 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
            <div className="py-2">
              <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                Price: High to Low
              </button>
              <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                Price: Low to High
              </button>
              <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                Newest Arrivals
              </button>
              <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                Best Selling
              </button>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default FilterSection;

{
  /* Grid selector */
}
{
  /* <div className=" flex items-center gap-2">
        <div className="grid gap-2 grid-cols-4">
          {grids.map(({ value, Icon }) => (
            <Link
              key={value}
              href={`/product/collections/${parseSlug}?grids=${value}`}
              className="p-2 border rounded hover:bg-gray-100"
            >
              <Icon size={20} />
            </Link>
          ))}
        </div>
        <Link href={`/product/collections/${parseSlug}`} className=" border p-1">
          <X />
        </Link>
      </div> */
}
