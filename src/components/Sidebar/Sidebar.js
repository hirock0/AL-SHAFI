"use client";
import useCategories from "@/hooks/products/categories/useCategories";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const Sidebar = () => {
  const pathname = usePathname();
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

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Shop Now ", href: "/product/collections/all-products" },
  ];

  // console.log(pathname);

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`  lg:hidden fixed  z-50  bg-background
        transition-transform duration-100 ease-in-out flex flex-col justify-between
        ${
          !visible
            ? "top-27 max-md:top-32.5 max-sm:top-32.5 min-h-[calc(100vh-130px)] md:min-h-[calc(100vh-108px)]"
            : "top-14  min-h-[calc(100vh-56px)]"
        }
        ${!sidebarFlag ? " -translate-x-full" : " translate-x-0"}
      `}
      >
        <div className="p-4 w-64 ">
          <div className="flex flex-col space-y-2">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block p-2  transition-all duration-200
                ${
                  isActive(link.href)
                    ? "bg-text text-white font-semibold"
                    : "hover:bg-text/10"
                }
              `}
              >
                {link.name}
              </Link>
            ))}
            {categories?.map((categ) => {
              const href = `/product/collections/${categ.slug}`;
              const active = pathname === href;

              return (
                <Link
                  key={categ._id}
                  href={href}
                  className={`block p-2 transition-all duration-200
                  ${
                    active
                      ? "bg-text text-white font-semibold"
                      : "hover:bg-text/10"
                  }
                `}
                >
                  {categ.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="w-full py-2">
          <Link
            href={"/account/profile"}
            className="bg-text w-full py-3 text-background block text-center font-semibold"
          >
            Account
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
