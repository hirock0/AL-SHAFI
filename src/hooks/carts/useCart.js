"use client";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
export const useCart = () => {
  
  const { activeFlag } = useSelector((state) => state?.slice);
  const [carts, setCarts] = useState([]);
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem("carts");
      setCarts(stored ? JSON.parse(stored) : []);
    };
    handler();
  }, [activeFlag]);

  const addToCart = useCallback(
    (product) => {
      if (!product) return;
      if (carts.some((item) => item.slug === product?.slug)) {
        toast.warning("You already added this item!");
        return;
      }
      const payload = {
        slug: product?.slug,
        img: product?.thumbnail.secure_url,
        productName: product?.productName,
        category: product?.category,
        price: product?.offerPrice,
        stock: product?.stock,
        qty: 1,
      };
      const updated = [payload, ...carts];
      setCarts(updated);
      localStorage.setItem("carts", JSON.stringify(updated));
      toast.success("Cart added");
    },

    [carts]
  );

  return { carts, addToCart };
};
