"use client";

import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";



const BulkDeleteBtn = () => {
  const router = useRouter();
  const { orderBulkIds } = useSelector((state) => state?.slice);
  const [loading, setLoading] = useState(false);

  const bulkdeleteHandler = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `/pages/api/orders/bulk_delete`,
        orderBulkIds
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
      {orderBulkIds?.length === 0 ? (
        "Mark/Delete"
      ) : (
        <button
          onClick={bulkdeleteHandler}
          disabled={loading}
          className="flex items-center justify-center p-2 rounded disabled:opacity-50"
        >
          {loading ? (
            <AiOutlineLoading3Quarters className={" animate-spin"} />
          ) : (
            <FaTrashAlt className="h-5 w-5 text-red-600" />
          )}
        </button>
      )}
    </div>
  );
};

export default BulkDeleteBtn;
