"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const CourierBtn = ({ item,query }) => {
  const router = useRouter();
  const parseItem = JSON.parse(item);
  const [courierFlag, setCourierFlag] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const courierHandler = async () => {
    try {
      const payload = {
        flag: "admin",
        orderId: parseItem?._id,
        order: parseItem?.consignment,
      };
      const { data } = await axios.post("/pages/api/stead_fast", payload);
      if (data?.success) {
        toast.success("Sent to courier successfully");
        router.refresh();
      } else {
        toast.success("Sent to courier not successfully");
      }
    } catch (error) {
      throw new Error(error?.message);
    }
  };
  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`/pages/api/stead_fast/${id}`);
      if (data?.success) {
        toast.success("Delete successfull");
        router.refresh();
      } else {
        toast.success("Delete not successfull");
      }
    } catch (error) {
      throw new Error(error?.message);
    }
  };
  return (
    <div className=" flex flex-col gap-2 items-center ">
      <button
      disabled={query !== "pending"}
        onClick={() => {
          setCourierFlag(true);
        }}
        className={`${query !== "pending"?" bg-green-500/20":"bg-green-500 hover:scale-105 active:bg-green-600 "} w-full text-white p-2 rounded-md  `}
      >
        Send To Courier
      </button>
      <button
        onClick={() => {
          setDeleteFlag(true);
        }}
        className={`bg-red-500 text-white p-2 w-full rounded-md hover:scale-105 active:bg-red-600`}
      >
        Delete
      </button>
      <div className={` ${courierFlag ? "block" : " hidden"}`}>
        <CourierModal
          setCourierFlag={setCourierFlag}
          courierHandler={courierHandler}
        />
      </div>
      <div className={` ${deleteFlag ? "block" : " hidden"}`}>
        <DeleterModal
          setDeleteFlag={setDeleteFlag}
          deleteHandler={deleteHandler}
          item={parseItem}
        />
      </div>
    </div>
  );
};

const CourierModal = ({ courierHandler, setCourierFlag }) => {
  return (
    <div
      className={` rounded-md flex items-center justify-center absolute bg-zinc-500/90 left-0 top-0 bottom-0 right-0 z-50`}
    >
      <div className=" flex gap-5 max-lg:gap-2">
        <button
          onClick={courierHandler}
          className=" bg-green-600 text-white p-2 rounded-md w-32"
        >
          Send
        </button>
        <button
          onClick={() => {
            setCourierFlag(false);
          }}
          className=" bg-red-600 text-white p-2 rounded-md w-32"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
const DeleterModal = ({ item, deleteHandler, setDeleteFlag }) => {
  return (
    <div
      className={` rounded-md flex items-center justify-center absolute bg-zinc-500/90 left-0 top-0 bottom-0 right-0 z-50`}
    >
      <div className=" flex gap-5 max-lg:gap-2">
        <button
          onClick={() => deleteHandler(item?._id)}
          className=" bg-green-600 text-white p-2 rounded-md w-32"
        >
          Delete
        </button>
        <button
          onClick={() => {
            setDeleteFlag(false);
          }}
          className=" bg-red-600 text-white p-2 rounded-md w-32"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CourierBtn;