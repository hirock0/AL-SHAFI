"use client";
import { addActiveFlag, addCommonFlag } from "@/utils/redux/slices/slice";
import { useDispatch, useSelector } from "react-redux";
const RemoveCart = ({ prod }) => {
  const dispatch = useDispatch();
  const { activeFlag } = useSelector((state) => state?.slice);
  const product = JSON.parse(prod);
  const handleRemove = () => {
    const stored = localStorage.getItem("carts");
    const storedCarts = JSON.parse(stored);
    const updated = storedCarts.filter((item) => item?.slug !== product.slug);
    localStorage.setItem("carts", JSON.stringify(updated));
    dispatch(addActiveFlag(!activeFlag));
    dispatch(addCommonFlag("remove_slug"));
  };
  return (
    <button onClick={() => handleRemove()} className="underline text-xs md:text-sm hover:text-text/70">
      Remove
    </button>
  );
};

export default RemoveCart;
