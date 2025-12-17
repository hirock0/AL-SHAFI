"use client";

import { addActiveFlag } from "@/utils/redux/slices/slice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
const LogoutBtn = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { activeFlag } = useSelector((state) => state?.slice);
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get("/pages/api/user/logout");
      if (data.success) {
        toast.success(data?.message);
        dispatch(addActiveFlag(!activeFlag));
        router.push("/");
      } else {
        toast.warning(data?.message);
      }
    } catch (error) {
      throw new Error(error?.message);
    }
  };
  return (
    <button
      onClick={logoutHandler}
      className="bg-red-500 hover:bg-red-600 text-surface font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
    >
      Logout
    </button>
  );
};

export default LogoutBtn;
