"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const useFrequentlyBoughtProducts = () => {
  const { commonFlag, commonData } = useSelector((state) => state?.slice);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [frbProducts, setFrbProducts] = useState(null);
  const pslugs = commonData?.frequentlyBoughtTogether;

  useEffect(() => {
    const fetchFrbProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/pages/api/products/frb_products/${JSON.stringify(pslugs)}`);
        if (data?.success && data?.products) {
          setFrbProducts(data.products);
        } else {
          setFrbProducts(null);
        }
      } catch (err) {
        setError(err);
        setFrbProducts(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFrbProducts();
  }, [commonFlag]);

  return { frbProducts, loading, error };
};

export default useFrequentlyBoughtProducts;
