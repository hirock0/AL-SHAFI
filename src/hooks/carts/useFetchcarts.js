"use client";
import axios from "axios";
import { useState, useEffect } from "react";
export const useFetchCarts = (carts = []) => {
  const [fetchCarts, setFetchCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!carts || carts.length === 0) {
      setFetchCarts([]);
      return;
    }
    const handler = async () => {
      try {
        setLoading(true);
        const slugs = carts.map((item) => item.slug);
        const { data } = await axios.get(
          `/pages/api/products/by_slugs`,

          {
            params: { slugs: slugs.join(",") },
          }
        );

        if (data?.success) {
          setFetchCarts(data.products);
        } else {
          setFetchCarts([]);
        }
      } catch (error) {
        console.error(error?.message);
      } finally {
        setLoading(false);
      }
    };

    handler();
  }, [carts]);

  return { fetchCarts, loading };
};
