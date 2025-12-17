"use client";

import AddCartBtn from "@/components/UI/Products/AddCartBtn/AddCartBtn";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const QueryProducts = () => {
  const { query } = useSelector((state) => state.slice);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!query || query.trim() === "") {
      setProducts([]);
      return;
    }
    const handler = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/pages/api/products/query_products", {
          params: { query },
        });

        if (data?.success) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    handler();
  }, [query]);

  if (!query) return null;

  return (
    <div className="mt-2 overflow-hidden">
      <div className="overflow-y-auto custom-scrollbar">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
            <p className="text-sm text-gray-600 font-medium">
              Searching products...
            </p>
          </div>
        )}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center mb-6 px-4">
            <svg
              className="w-10 h-10 text-gray-300 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search query
            </p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div
            className={`space-y-3 sm:space-y-0 grid ${
              products.length === 1
                ? "sm:grid-cols-1 max-w-md mx-auto"
                : "md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            } gap-4 md:gap-6`}
          >
            {products.map((product) => (
              <div
                key={product._id}
                className={`transition-all duration-200 ${
                  products.length === 1 ? "sm:w-full" : ""
                }`}
              >
                {/* Mobile View - Single Row List */}
                <div className="flex items-center sm:hidden hover:bg-surface transition-colors duration-200">
                  <Link
                    href={`/product/product-details/${product.slug}`}
                    className="flex items-center gap-3 p-3 flex-1 group"
                  >
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 relative rounded overflow-hidden">
                        <Image
                          src={
                            product.thumbnail?.secure_url || "/placeholder.png"
                          }
                          alt={product.productName}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      {product.regularPrice > product.offerPrice && (
                        <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                          {Math.round(
                            ((product.regularPrice - product.offerPrice) /
                              product.regularPrice) *
                              100
                          )}
                          %
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold line-clamp-1 mb-1">
                        {product.productName}
                      </h3>
                      {/* <p className="text-xs text-gray-500 font-medium mb-1">
                        {product.category}
                      </p> */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold">
                          ৳{product.offerPrice.toLocaleString()}
                        </span>
                        {product.regularPrice > product.offerPrice && (
                          <span className="text-xs line-through text-gray-400">
                            ৳{product.regularPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="pr-3">
                    <AddCartBtn
                      product={JSON.stringify(product)}
                      styles="px-3 py-2 text-nowrap bg-primary text-white rounded hover:bg-primary-dark transition-colors font-medium text-xs shadow-sm"
                    />

                    <ShoppingCart
                      className="w-4 h-4 group-hover/btn:scale-110 transition-transform"
                      strokeWidth={2}
                    />
                    <span className="hidden lg:block">Add to Cart</span>
                  </div>
                </div>

                {/* Desktop View - Card Grid */}
                <div className="hidden sm:flex flex-col h-full p-4">
                  {/* Thumbnail */}
                  <Link
                    href={`/product/product-details/${product.slug}`}
                    className="group mb-3 flex flex-col items-center text-center"
                  >
                    <div className="relative w-full max-w-[200px] mx-auto mb-4">
                      <div className="relative aspect-square w-full  overflow-hidden  transition-all duration-300">
                        <Image
                          src={
                            product.thumbnail?.secure_url || "/placeholder.png"
                          }
                          alt={product.productName}
                          fill
                          sizes="(max-width: 768px) 160px, (max-width: 1024px) 180px, 200px"
                          className="object-cover"
                        />
                        {product.regularPrice > product.offerPrice && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {Math.round(
                              ((product.regularPrice - product.offerPrice) /
                                product.regularPrice) *
                                100
                            )}
                            %
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2 w-full">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.productName}
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          ৳{product.offerPrice.toLocaleString()}
                        </span>
                        {product.regularPrice > product.offerPrice && (
                          <span className="text-sm line-through text-gray-400">
                            ৳{product.regularPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryProducts;
