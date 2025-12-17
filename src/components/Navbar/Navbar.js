"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  ShoppingCart,
  UserRound,
  Search,
  Menu,
  X,
  FolderClock,
} from "lucide-react";
import Container from "../Container/Container";
import QueryProducts from "../Products/QueryProducts/QueryProducts";
import useAuthUser from "@/hooks/user/useAuthUser";
import { useCart } from "@/hooks/carts/useCart";
import {
  addCartFlag,
  addQuery,
  addSidebarFlag,
} from "@/utils/redux/slices/slice";
import useCategories from "@/hooks/products/categories/useCategories";
// import Categories from "@/components/Categories/Categories";

const Navbar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { cartFlag, sidebarFlag } = useSelector((state) => state.slice);
  const { carts } = useCart();
  const { user } = useAuthUser();
  const { categories } = useCategories();
  const [showSearch, setShowSearch] = useState(false);
  const validPath = pathname.startsWith("/admin-dashboard");

  useEffect(() => {
    const handler = () => {
      dispatch(addSidebarFlag(false));
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [sidebarFlag]);

  return (
    <>
      {showSearch && (
        <div
          onClick={() => setShowSearch(false)}
          className="fixed inset-0 bg-black/30 z-10"
        />
      )}

      <nav
        className={`${
          validPath && "hidden"
        } sticky top-0 z-20 bg-background shadow-md`}
      >
        <div
          className={`absolute left-0 top-full w-full bg-background  transition-all duration-300 ease-in-out
          ${
            showSearch
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="py-4 bg-surface px-4">
            <div className="flex items-center mx-auto px-4 py-2 max-w-md border border-border bg-background">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => dispatch(addQuery(e.target.value))}
                className="w-full outline-none text-sm "
              />
            </div>

            {/* Results */}
            <div className="relative mt-2 max-w-[1440px] mx-auto px-4">
              <QueryProducts />
            </div>
          </div>
        </div>

        {/* for big screen  */}
        <Container>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center max-lg:space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(addSidebarFlag(!sidebarFlag));
                }}
                className="text-primary lg:hidden"
              >
                {sidebarFlag ? <X strokeWidth={2} /> : <Menu strokeWidth={2} />}
              </button>

              <Link href="/" className=" max-w-24 lg:max-w-32">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={130}
                  height={50}
                  priority
                />
              </Link>

            </div>

              <div className="space-x-6 max-lg:hidden mr-6 font-semibold ">
                <Link href={"/"} className="hover:text-primary-dark">Home</Link>
                <Link href={"/product/collections/all-products"} className="hover:text-primary-dark">Shop Now</Link>
                <Link href={"/"} className="hover:text-primary-dark">About Us</Link>
                <Link href={"/"} className="hover:text-primary-dark">Contact Us</Link>
              
              </div>


            {/* icons  */}
            <div className="flex items-center justify-end space-x-3">
      


              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className="text-text rounded-full  hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <Search strokeWidth={2} />
              </button>
              <Link
                href={user ? "/account/profile" : "/login"}
                className="text-text rounded-full max-lg:hidden hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                {user ? (
                  <UserRound strokeWidth={2} />
                ) : (
                  <UserRound strokeWidth={2} />
                )}
              </Link>
              <button
                onClick={() => dispatch(addCartFlag(!cartFlag))}
                className="relative text-text hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <ShoppingCart strokeWidth={2} />
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {carts?.length || 0}
                </span>
              </button>
            </div>
          </div>
        </Container>

        <div className="py-3 px-8 md:px-8 hidden ">
          <Container>
            <div className="flex flex-wrap space-x-6 items-center">
              <Link href={"/product/collections/all-products"}>
                {" "}
                All Products
              </Link>
              {categories?.map((categ) => (
                <Link
                  key={categ._id}
                  href={`/product/collections/${categ.slug}`}
                  className="block text-center transition transform hover:scale-105 duration-200 font-normal"
                >
                  <p className="text-gray-700 font-normal font-montserrat">
                    {categ?.name}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

// <div className="grid grid-cols-3 items-center py-3">
//   <div className="flex items-center">
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         dispatch(addSidebarFlag(!sidebarFlag));
//       }}
//       className="text-primary lg:hidden"
//     >
//       {sidebarFlag ? <X strokeWidth={2} /> : <Menu strokeWidth={2} />}
//     </button>

//     <div className="space-x-4 max-lg:hidden">
//       <Link href={'/'}>Home</Link>
//       <Link href={'/'}>About Us</Link>
//       <Link href={'/'}>Shop Now</Link>
//       <Link href={'/'}>Contact Us</Link>
//     </div>

//     {/* <button
//       onClick={() => setShowSearch((prev) => !prev)}
//       className="text-primary rounded-full max-lg:hidden hover:scale-105 transition-transform duration-300 ease-in-out"
//     >
//       <Search strokeWidth={2} />
//     </button> */}
//   </div>
//   <div className="flex justify-center">
//     <Link href="/">
//       <Image
//         src="/logo.png"
//         alt="logo"
//         width={130}
//         height={50}
//         priority
//       />
//     </Link>
//   </div>

//   <div className="flex items-center justify-end gap-3">
//     <button
//       onClick={() => setShowSearch((prev) => !prev)}
//       className="text-primary rounded-full  hover:scale-105 transition-transform duration-300 ease-in-out"
//     >
//       <Search strokeWidth={2} />
//     </button>

//     <Link
//       href={user ? "/account/profile" : "/login"}
//       className="text-primary rounded-full max-lg:hidden hover:scale-105 transition-transform duration-300 ease-in-out"
//     >
//       {user ? (
//         <UserRound strokeWidth={2} />
//       ) : (
//         <UserRound strokeWidth={2} />
//       )}
//     </Link>

//     <button
//       onClick={() => dispatch(addCartFlag(!cartFlag))}
//       className="relative text-primary hover:scale-105 transition-transform duration-300 ease-in-out"
//     >
//       <ShoppingCart strokeWidth={2} />
//       <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
//         {carts?.length || 0}
//       </span>
//     </button>
//   </div>
// </div>
