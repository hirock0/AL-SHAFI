"use client";

import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
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
          className=" lg:hidden flex items-center gap-3"
        >
          Filter
          <ChevronDown />
        </button>

        <details className="relative cursor-pointer">
          <summary>Select</summary>
          <div className="absolute z-50 bg-white p-2 shadow">
            <Link href="">asdasd</Link>
          </div>
        </details>
      </div>

      {/* Grid selector */}
      <div className=" flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default FilterSection;
