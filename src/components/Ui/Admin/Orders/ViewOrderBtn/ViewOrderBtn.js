"use client";

import { addCommonData, addCommonFlag } from "@/utils/redux/slices/slice";
import { Eye } from "lucide-react";
import { useDispatch } from "react-redux";

const ViewOrderBtn = ({ order }) => {
  const parseOrder = JSON.parse(order);
  const dispatch = useDispatch();
  const viewHandler = () => {
    try {
      dispatch(addCommonFlag("view_order"));
      dispatch(addCommonData(parseOrder));

    } catch (error) {
      throw new Error(error?.message);
    }
  };
  return (
    <div>
      <button onClick={viewHandler}><Eye className="hover:text-primary-dark"/></button>
    </div>
  );
};

export default ViewOrderBtn;
