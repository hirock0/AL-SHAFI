"use client";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  addSteadFastBulkOrders,
  removeSteadFastBulkOrders,
} from "@/utils/redux/slices/slice";
const OrderSelectSteadFastBtn = ({ ord, flag }) => {
  const order = JSON.parse(ord);
  const dispatch = useDispatch();
  const router = useRouter();
  const deleteHandler = async () => {
    try {
      const { data } = await axios.delete(
        `/pages/api/orders/order/${order?._id}`
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
    }
  };

  const handleCheckbox = (e) => {
    if (e.target.checked) {
      const cleanOrder = {
        ...order,
        createdAt: order?.createdAt ? String(order.createdAt) : null,
        updatedAt: order?.updatedAt ? String(order.updatedAt) : null,
      };
      dispatch(addSteadFastBulkOrders(cleanOrder));
    } else {
      dispatch(removeSteadFastBulkOrders(order?._id));
    }
  };

  return (
    <>
      {flag === "bulk" ? (
        <input type="checkbox" onChange={handleCheckbox} />
      ) : (
        <button
          onClick={deleteHandler}
          className="flex items-center gap-1 text-red-600 hover:text-red-800"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default OrderSelectSteadFastBtn;
