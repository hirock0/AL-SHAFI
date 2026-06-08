"use client";
import { useState, useEffect } from "react";
import axios from "axios";
const useQueryProducts = (query) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queryProducts, setQueryProducts] = useState(null);


  useEffect(() => {
    const fetchQuerybProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/pages/api/products/query_products/?query=${query}`);
        if (data?.success && data?.products) {
          setQueryProducts(data.products);
        } else {
          setQueryProducts(null);
        }
      } catch (err) {
        setError(err);
        setQueryProducts(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuerybProducts();
  }, [query]);

  return { queryProducts, loading, error };
};

export default useQueryProducts;
