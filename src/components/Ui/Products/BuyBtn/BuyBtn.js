"use client";
import { useCart } from "@/hooks/carts/useCart";
import { addActiveFlag } from "@/utils/redux/slices/slice";
import { useDispatch, useSelector } from "react-redux";
const BuyBtn = ({ product, styles }) => {
  const dispatch = useDispatch()
  const {activeFlag} = useSelector((state)=>state?.slice)
  const parseProduct = JSON.parse(product);
  const { addToCart } = useCart();
  return (
    <button className={styles}>
      Buy
    </button>
  );
};

export default BuyBtn;
