"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const useProductsBySlug = (slugs) => {
  const { cartFlag, activeFlag } = useSelector((state) => state.slice);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slugProducts, setSlugProducts] = useState(null);

  useEffect(() => {

    if (slugs?.length === 0) {
      setSlugProducts(null);
    }
    const fetchSlugProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/pages/api/products/by_slugs/${JSON.stringify(slugs)}`
        );
        if (data?.success && data?.products) {
          setSlugProducts(data.products);
        } else {
          setSlugProducts(null);
        }
      } catch (err) {
        setError(err);
        setSlugProducts(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSlugProducts();
  }, [cartFlag, activeFlag]);

  return { slugProducts, loading, error };
};

export default useProductsBySlug;
