"use client";
import QtyBtn from "@/components/UI/Products/QtyBtn/QtyBtn";
import { useCart } from "@/hooks/carts/useCart";
import { useFetchCarts } from "@/hooks/carts/useFetchcarts";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
const CartProducts = () => {
  const { carts } = useCart();
  const { fetchCarts: products, loading } = useFetchCarts(carts);
  const qtyMap = useMemo(() => {
    const map = {};
    carts.forEach((item) => {
      map[item.slug] = item.qty;
    });
    return map;
  }, [carts]);

  const totalPrice = products.reduce((sum, p) => {
    const qty = qtyMap[p.slug] || 1;
    return sum + p.offerPrice * qty;
  }, 0);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
  //         <p className="mt-4 text-gray-600 font-medium">Loading your cart...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (products.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
  //       <div className="text-center">
  //         <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
  //           <svg
  //             className="w-12 h-12 text-gray-400"
  //             fill="none"
  //             stroke="currentColor"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth={2}
  //               d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
  //             />
  //           </svg>
  //         </div>
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">
  //           Your cart is empty
  //         </h2>
  //         <p className="text-gray-600 mb-6">
  //           Start shopping to add items to your cart
  //         </p>
  //         <button className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all">
  //           Continue Shopping
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="py-8 sm:py-12">
      {products.length === 0 ? (
        <div className="flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/5 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to add items to your cart
            </p>
            <Link href={'/product/collections/all-products'} className="px-6 lg:px-8 py-2 md:py-3 bg-primary text-white font-semibold rounded md:rounded-md hover:bg-primary-dark transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold ">Shopping Cart</h1>
            <p className="mt-2 text-gray-600">
              {products.length} {products.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Products List */}
            <div className="flex-1 lg:w-2/3">
              <div className="bg-white rounded-md md:rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="shrink-0 mx-auto sm:mx-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-md md:rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                          <Image
                            src={product.thumbnail.secure_url}
                            alt={product.productName}
                            width={112}
                            height={112}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold line-clamp-2  transition-colors">
                              {product.productName}
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-3 text-sm">
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                  />
                                </svg>
                                {product.category}
                              </span>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${
                                  product.stock > 0
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {product.stock > 0 ? (
                                  <>
                                    <svg
                                      className="w-4 h-4 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {product.stock} in stock
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      className="w-4 h-4 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Out of stock
                                  </>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="">
                            <QtyBtn prod={JSON.stringify(product)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary - Sticky on Desktop */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:sticky lg:top-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    className="w-7 h-7 mr-2 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-base sm:text-lg py-3 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      Subtotal ({products.length}{" "}
                      {products.length === 1 ? "item" : "items"})
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-base sm:text-lg py-3 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                      Shipping
                    </span>
                    <span className="text-sm text-gray-500 italic">
                      At checkout
                    </span>
                  </div>

                  <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold text-red-600">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={"/product/checkout"}
                  className="w-full py-4 bg-linear-to-br from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center group"
                >
                  <span>Proceed to Checkout</span>
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Secure checkout
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Free returns within 30 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartProducts;
