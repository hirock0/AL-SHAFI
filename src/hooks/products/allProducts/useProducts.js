"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const useProducts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/pages/api/products/product");
        if (data?.success && data?.products) {
          setProducts(data.products);
        } else {
          setProducts(null);
        }
      } catch (err) {
        setError(err);
        setProducts(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export default useProducts;
