"use client";

import { addCommonFlag } from "@/utils/redux/slices/slice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { useEffect } from "react";

const FilterSidebar = ({ cats }) => {
  const dispatch = useDispatch();
  const { commonFlag } = useSelector((state) => state?.slice);
  const categories = JSON.parse(cats);
  useEffect(() => {
    const handler = () => {
      dispatch(addCommonFlag("filter_sidebar_close"));
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [commonFlag]);

  return (
    <div
      className={`${
        !commonFlag || commonFlag !== "filter_sidebar_open"
          ? " -translate-x-full"
          : "translate-x-0"
      } lg:hidden transition-all fixed z-50 left-0 right-0 bottom-0 top-0 bg-black/50 `}
    >
      <div className=" w-full h-full">
        <div
          onClick={(e) => e.stopPropagation()}
          className=" bg-white w-2/4 h-full p-5"
        >
          <div className=" flex items-center justify-between">
            <span className=" text-3xl font-semibold">Filter</span>
            <button
              onClick={() => dispatch(addCommonFlag("filter_sidebar_close"))}
            >
              <X />
            </button>
          </div>
          <div className=" mt-5 space-y-3 text-xl">
            <Link
              onClick={() => dispatch(addCommonFlag("filter_sidebar_close"))}
              href={"/product/collections/all-products"}
              className=" mb-3 block"
            >
              All Products
            </Link>
            {categories?.map((cat, index) => (
              <div className="" key={index}>
                <Link
                  onClick={() =>
                    dispatch(addCommonFlag("filter_sidebar_close"))
                  }
                  href={`/product/collections/${cat?.slug}`}
                  className=" hover:underline hover:underline-offset-4"
                >
                  {cat?.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
