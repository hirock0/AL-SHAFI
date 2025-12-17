"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
export const useInvoices = () => {
  const { activeFlag } = useSelector((state) => state?.slice);
  const [invoices, setInvoices] = useState([]);
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem("invoices");
      setInvoices(stored ? JSON.parse(stored) : []);
    };
    handler();
  }, [activeFlag]);

  return { invoices };
};
