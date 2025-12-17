"use client";
import Image from "next/image";
import {
  X,
  ShoppingBag,
  ArrowRight,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addCartFlag } from "@/utils/redux/slices/slice";
import { useCart } from "@/hooks/carts/useCart";
import QtyBtn from "@/components/UI/Products/QtyBtn/QtyBtn";
import Link from "next/link";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { cartFlag } = useSelector((state) => state.slice);
  const { carts } = useCart();

  const isOpen = cartFlag;
  const closeCart = () => dispatch(addCartFlag(false));

  // Subtotal
  const subtotal = carts.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeCart}
        />
      )}

      {/* Sidebar - 70% width on mobile, max 480px on desktop */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-[70%] sm:w-[60%] md:max-w-md lg:max-w-lg bg-surface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-linear-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-primary/5 p-1.5 md:p-2 rounded md:rounded-md">
                <ShoppingCart
                  className="w-4 h-4 md:w-5 md:h-5 text-primary"
                  strokeWidth={2}
                />
              </div>
              <div>
                <h2 className="text-base md:text-xl lg:text-2xl font-bold text-text uppercase">
                  Shopping Cart
                </h2>
                <p className="text-[10px] md:text-xs text-text-secondary">
                  {carts.length} {carts.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 md:p-2.5 rounded md:rounded-md hover:bg-error/10 text-text hover:text-error transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Close cart"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 bg-background">
            {/* Empty Cart */}
            {carts.length === 0 && (
              <div className="text-center py-12 md:py-20">
                <div className="bg-primary/5 rounded-full w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 flex items-center justify-center">
                  <ShoppingBag
                    className="w-8 h-8 md:w-12 md:h-12 text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-text mb-2">
                  Your cart is empty
                </h3>
                <p className="text-xs md:text-sm text-text-secondary mb-4 md:mb-6 px-4">
                  আপনার কার্ট খালি। পণ্য যোগ করুন!
                </p>
                <Link
                  onClick={closeCart}
                  href="product/collections/all-products"
                  className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-primary text-white rounded md:rounded-md hover:bg-primary-dark transition-all duration-200 font-medium text-sm md:text-base"
                >
                  <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Start Shopping
                </Link>
              </div>
            )}

            {/* Cart List */}
            {carts.length > 0 &&
              carts.map((cart, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 md:gap-4 bg-surface p-3 md:p-4 rounded-lg md:rounded-xl border border-border hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
                >
                  {/* Image */}
                  <div className="shrink-0">
                    {cart?.img ? (
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden bg-background border border-border group-hover:border-primary/30 transition-colors">
                        <Image
                          src={cart.img}
                          alt={cart?.productName || "Product image"}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl bg-background border-2 border-dashed border-border flex items-center justify-center">
                        <Package
                          className="w-6 h-6 md:w-8 md:h-8 text-text-muted"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/product-details/${cart.slug}`}
                      onClick={closeCart}
                      className="block"
                    >
                      <h3 className="font-semibold text-text line-clamp-2 transition-colors text-xs md:text-sm lg:text-base mb-1">
                        {cart.productName}
                      </h3>
                    </Link>

                    <p className="text-[10px] md:text-xs text-text-secondary capitalize mb-2">
                      {cart.category}
                    </p>

                    <div className="w-full">
                      {/* Qty Button */}
                      <QtyBtn prod={JSON.stringify(cart)} />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Footer */}
          {carts.length > 0 && (
            <div className="border-t border-border p-4 md:p-6 bg-surface">
              {/* Subtotal */}
              <div className="bg-linear-to-br from-primary/5 to-accent/5 rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4 border border-primary/20">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm md:text-base lg:text-lg font-semibold text-text">
                    Subtotal
                  </span>
                  <span className="text-lg md:text-xl lg:text-2xl font-bold text-text">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-text-secondary mt-1 md:mt-2">
                  Shipping & taxes calculated at checkout
                </p>
              </div>

              {/* Checkout Button */}
              <Link
                href="/product/checkout"
                onClick={closeCart}
                className="block w-full bg-primary text-white text-center py-3 md:py-4 rounded md:rounded-md font-semibold hover:bg-primary-dark hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] mb-2 md:mb-3 group text-sm md:text-base"
              >
                <span className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight
                    className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform"
                    strokeWidth={2.5}
                  />
                </span>
              </Link>

              {/* View All Link */}
              <Link
                onClick={closeCart}
                href="/product/carts"
                className="block text-center text-text-secondary hover:text-primary text-xs md:text-sm font-medium transition-colors"
              >
                View Full Cart
              </Link>

              {/* Trust Badge */}
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border flex items-center justify-center gap-2 text-[10px] md:text-xs text-text-secondary">
                <div className="w-1 h-1 rounded-full bg-success"></div>
                <span>Secure checkout guaranteed</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;
