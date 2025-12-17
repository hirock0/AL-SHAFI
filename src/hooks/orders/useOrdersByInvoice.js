"use client";
import axios from "axios";
import { useState, useEffect } from "react";
export const useOrdersByInvoice = (invoices = []) => {
  const [fetchOrders, setFetchOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!invoices || invoices.length === 0) {
      setFetchOrders([]);
      return;
    }
    const handler = async () => {
      try {
        setLoading(true);
        const invoicesStr = invoices.join(",");
        const { data } = await axios.get(`/pages/api/orders/by_invoice`, {
          params: { invoices: invoicesStr },
        });

        setFetchOrders(data?.success ? data.orders : []);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
        setFetchOrders([]);
      } finally {
        setLoading(false);
      }
    };

    handler();
  }, [invoices]);

  return { fetchOrders, loading };
};
