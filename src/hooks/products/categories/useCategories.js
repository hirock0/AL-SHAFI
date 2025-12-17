"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const useCategories = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategoies] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/pages/api/products/category");
        if (data?.success && data?.categories) {
          setCategoies(data.categories);
        } else {
          setCategoies(null);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError(err);
        setCategoies(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useCategories;
