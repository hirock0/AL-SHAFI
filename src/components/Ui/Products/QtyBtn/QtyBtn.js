"use client";
import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addActiveFlag } from "@/utils/redux/slices/slice";
import RemoveCart from "@/components/UI/Products/RemoveCart/RemoveCart";

const QtyBtn = ({ prod }) => {
  const product = JSON.parse(prod);
  const slug = product.slug;
  const maxQty = product.stock || 10;
  const productPrice = product.offerPrice || product.price;
  const dispatch = useDispatch();
  const { activeFlag } = useSelector((state) => state.slice);
  const [quantity, setQuantity] = useState(product.qty || 1);

  useEffect(() => {
    const handler = () => {
      const stored = JSON.parse(localStorage.getItem("carts")) || [];
      const found = stored.find((item) => item.slug === slug);
      if (found) setQuantity(found.qty);
    };
    handler();
  }, [slug]);

  const updateLocalStorage = (newQty) => {
    const stored = JSON.parse(localStorage.getItem("carts")) || [];
    const updated = stored.map((item) =>
      item.slug === slug ? { ...item, qty: newQty } : item
    );
    localStorage.setItem("carts", JSON.stringify(updated));
  };

  const handleIncrease = () => {
    if (quantity < maxQty) {
      const newQty = quantity + 1;
      updateLocalStorage(newQty);
      setQuantity(newQty);
      dispatch(addActiveFlag(!activeFlag));
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      updateLocalStorage(newQty);
      setQuantity(newQty);
      dispatch(addActiveFlag(!activeFlag));
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const clamped = Math.min(Math.max(value, 1), maxQty);
    updateLocalStorage(clamped);
    setQuantity(clamped);
    dispatch(addActiveFlag(!activeFlag));
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 w-full">
      {/* Price */}
      <p className="font-bold text-text text-sm md:text-base lg:text-lg whitespace-nowrap">
        ৳{(productPrice * quantity).toLocaleString()}
      </p>

      {/* Qty Controls & Remove Button */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Quantity Controller */}
        <div className="flex items-center rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
          {/* Decrease */}
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="px-3 py-2 flex items-center justify-center
        text-muted-foreground hover:text-primary
        hover:bg-primary/10
        active:scale-95
        transition-all
        disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {/* Quantity Input */}
          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            min="1"
            max={maxQty}
            aria-label="Quantity"
            className="w-10 md:w-12 text-center text-sm font-semibold
        bg-transparent text-foreground
        border-x border-border
        focus:outline-none focus:bg-primary/5
        focus:ring-2 focus:ring-primary/30"
          />

          {/* Increase */}
          <button
            onClick={handleIncrease}
            disabled={quantity >= maxQty}
            aria-label="Increase quantity"
            className="px-3 py-2 flex items-center justify-center
        text-muted-foreground hover:text-primary
        hover:bg-primary/10
        active:scale-95
        transition-all
        disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Remove from Cart */}
        <RemoveCart prod={prod} />
      </div>
    </div>
  );
};

export default QtyBtn;
