"use client";
import { addCommonData, addCommonFlag } from "@/utils/redux/slices/slice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";


const ProductEditNDelBtn = ({ type, product }) => {
  const router = useRouter();
  const dispatch = useDispatch()
  const prod = typeof product === "string" ? JSON.parse(product) : product;
  const [loading, setLoading] = useState(false);

  const baseBtn = "px-4 py-1 text-sm font-medium rounded-md shadow-sm transition-all";
  const styles =
    type === "Delete"
      ? `${baseBtn} bg-red-600 text-white hover:bg-red-700`
      : `${baseBtn} bg-green-600 text-white hover:bg-green-700`;

  const editHandler = async()=>{
    try {
      dispatch(addCommonData(prod))
      dispatch(addCommonFlag("p-edit-form-open"))
    } catch (error) {
      throw new Error(error?.message)
    }
  }
    const deleteHandler = async () => {
    if (!prod?._id) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      const { data } = await axios.delete(`/pages/api/products/product/${prod._id}`);
      if (data?.success) {
        toast.success(data.message || "Deleted");
        router.refresh();
      } else {
        toast.warning(data.message || "Failed to delete");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <button
        onClick={type === "Delete" ? deleteHandler : editHandler}
        className={styles}
        disabled={loading}
      >
        {loading && type === "Delete" ? "Processing..." : type}
      </button>


    </div>
  );
};

export default ProductEditNDelBtn;
