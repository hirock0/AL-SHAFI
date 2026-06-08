"use client";

import { saveFreeShippingAmount } from "@/actions/crud.action";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const FreeShippingAmount = ({ amount }) => {
  const router = useRouter();
  const range = JSON.parse(amount);
  const [shippingFlag, setShippingFlag] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const payload = {
      key: "shipping_amount",
      value: Number(data.amount),
    };
    const res = await saveFreeShippingAmount(payload);
    if (res?.success) {
      toast.success(res?.message);
      router.refresh();
    } else {
      toast.success(res?.message);
    }
    reset();
    setShippingFlag(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setShippingFlag(!shippingFlag)}
          className="bg-green-600 flex items-center justify-between hover:bg-green-700 active:bg-green-800 text-white rounded-md px-4 py-2"
        >
          <span>Free Shipping Amount</span>
          TK: {range}
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`${
              shippingFlag ? "visible" : "invisible h-0"
            } border rounded-md overflow-hidden border-slate-300 flex items-center h-12 transition-all`}
          >
            <input
              type="number"
              placeholder="Amount"
              className="h-full w-full outline-0 pl-3"
              {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 1,
                  message: "Amount must be greater than 0",
                },
              })}
            />

            <button
              type="submit"
              className="h-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-3"
            >
              Send
            </button>
          </div>

          {/* Error message */}
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FreeShippingAmount;
