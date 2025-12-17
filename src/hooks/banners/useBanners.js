"use client";
import axios from "axios";
import { useState, useEffect } from "react";
export const useBanners = () => {
  const [fetchBanners, setFetchBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handler = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/pages/api/banner`);
        setFetchBanners(data?.success ? data.banners : []);
      } catch (error) {
        setFetchBanners([]);
      } finally {
        setLoading(false);
      }
    };

    handler();
  }, []);

  return { fetchBanners, loading };
};
