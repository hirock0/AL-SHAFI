"use client";
import useCategories from "@/hooks/products/categories/useCategories";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const Sidebar = () => {
  const { sidebarFlag } = useSelector((state) => state?.slice);
  const { categories } = useCategories();
  const [scrollValue, setScrollValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      const currentScroll = window.scrollY;
      setScrollValue(currentScroll);
      if (currentScroll > 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [scrollValue]);


  return (
    <>
      {/* Overlay */}

      <div
        onClick={(e) => e.stopPropagation()}
        className={`  lg:hidden fixed  z-50 h-full  bg-background
        transition-transform duration-100 ease-in-out
        ${
          !visible
            ? "top-30.5 max-md:top-35.5 max-sm:top-34  "
            : "top-17 max-sm:top-15 "
        }
        ${!sidebarFlag ? " -translate-x-full" : " translate-x-0"}
      `}
      >
        {/* <div
        className={`fixed inset-0 bg-black/40 z-0  lg:hidden transition-opacity duration-300 ${
          sidebarFlag ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div> */}

        <div className="p-4 w-64">
          <div className=" flex flex-col space-y-3">
            <Link
              href="/product/collections/all-products"
              className={`block  bg-text/5 p-2 transition transform hover:scale-105 duration-200 rounded-md hover:bg-text/10`}
            >
              All Products
            </Link>
            {categories?.map((categ) => (
              <Link
                key={categ._id}
                href={`/product/collections/${categ.slug}`}
                className="block  bg-text/5 p-2 transition transform hover:scale-105 duration-200 rounded-md hover:bg-text/10"
              >
                <p className="text-gray-700 font-medium">{categ?.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
