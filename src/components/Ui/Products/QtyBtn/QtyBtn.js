"use client";
import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addActiveFlag } from "@/utils/redux/slices/slice";
import RemoveCart from "@/components/Ui/Products/RemoveCart/RemoveCart";

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
    <div className="flex flex-row items-center  justify-between gap-2 w-full">
      {/* Price */}
      <p className=" text-text text-sm md:text-base lg:text-lg whitespace-nowrap">
        TK {(productPrice * quantity).toLocaleString()}
      </p>

      {/* Qty Controls & Remove Button */}
      <div className="flex items-center gap-2 w-full justify-end">
        {/* Quantity Controller */}
        <div className="flex items-center divide-x divide-gray-200 rounded border border-gray-300 shadow-sm">
          {/* Decrease */}
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className=" px-1 md:px-1.5 py-0.5 flex items-center justify-center
        text-gray-500 hover:text-red-600 hover:bg-red-50
        transition-colors duration-150 rounded-l-md
        disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" strokeWidth={2.5} />
          </button>

          {/* Quantity Display */}
          <div className="px-1 md:px-1.5 py-0.5 min-w-8 md:min-w-9">
            <input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              min="1"
              max={maxQty}
              aria-label="Quantity"
              className="w-full text-center text-xs md:text-sm font-semibold text-gray-900
          bg-transparent focus:outline-none focus:text-primary
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
          [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Increase */}
          <button
            onClick={handleIncrease}
            disabled={quantity >= maxQty}
            aria-label="Increase quantity"
            className="px-1 md:px-1.5 py-0.5 flex items-center justify-center
        text-gray-500 hover:text-green-600 hover:bg-green-50
        transition-colors duration-150 rounded-r-md
        disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Remove from Cart */}
        <RemoveCart prod={prod} />
      </div>
    </div>
  );
};

export default QtyBtn;
