"use client";

import { addCommonData, addCommonFlag } from "@/utils/redux/slices/slice";
import { useDispatch, useSelector } from "react-redux";

const ConsignBtn = ({order}) => {
    const parseOrder = JSON.parse(order)
    const dispatch = useDispatch()
    const printHandler = ()=>{
        try {
            dispatch(addCommonFlag("order_print"))
            dispatch(addCommonData(parseOrder))
        } catch (error) {
            throw new Error(error?.message)
        }
    }
  return (
    <div>
      <button onClick={printHandler} >Print</button>
    </div>
  );
};

export default ConsignBtn;
