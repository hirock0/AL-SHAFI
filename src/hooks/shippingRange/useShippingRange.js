"use client";

import { FreeShippingRange } from "@/actions/actions";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useShippingRange = () => {
  const [loading, setLoading] = useState(true);
  const [shippingRangeNumber, setShippingRangeNumber] = useState(0);
  const { activeFlag } = useSelector((state) => state.slice);

  useEffect(() => {
    const shippingRangeHandler = async () => {
      setLoading(true);
      try {
        const range = await FreeShippingRange();

        if (range?.value !== undefined) {
          setShippingRangeNumber(range.value);
        } else {
          setShippingRangeNumber(0);
        }
      } catch (error) {
        console.error(error);
        setShippingRangeNumber(0);
      } finally {
        setLoading(false);
      }
    };

    shippingRangeHandler();
  }, [activeFlag]);

  return { shippingRangeNumber, loading };
};

export default useShippingRange;
