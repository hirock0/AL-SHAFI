"use client";

import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsSendCheckFill } from "react-icons/bs";
const BulkSendToSteadFastBtn = () => {
  const router = useRouter();
  const { orderSteadFastBulkOrders } = useSelector((state) => state?.slice);
  const [loading, setLoading] = useState(false);

  const bulkdeleteHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `/pages/api/stead_fast/bulk-create`,
        JSON.stringify(orderSteadFastBulkOrders)
      );

      if (data?.success) {
        toast.success(data?.message);
        router.refresh();
      } else {
        toast.warning(data?.message);
        router.refresh();
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {orderSteadFastBulkOrders?.length === 0 ? (
        "Send/steadFast"
      ) : (
        <button
          onClick={bulkdeleteHandler}
          disabled={loading}
          className="flex items-center justify-center p-2 rounded disabled:opacity-50"
        >
          {loading ? (
            <AiOutlineLoading3Quarters className={" animate-spin"} />
          ) : (
            <BsSendCheckFill className="h-5 w-5 text-red-600" />
          )}
        </button>
      )}
    </div>
  );
};

export default BulkSendToSteadFastBtn;
