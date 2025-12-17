"use client";
import { useCart } from "@/hooks/carts/useCart";
import { addActiveFlag, addCartFlag } from "@/utils/redux/slices/slice";
import { useDispatch, useSelector } from "react-redux";
const AddCartBtn = ({ product, styles, children }) => {
  const dispatch = useDispatch();
  const { activeFlag, cartFlag } = useSelector((state) => state?.slice);
  const parseProduct = JSON.parse(product);
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => {
        addToCart(parseProduct), dispatch(addActiveFlag(!activeFlag));
        dispatch(addCartFlag(!cartFlag));
      }}
      className={styles}
    >
      {children}
    </button>
  );
};

export default AddCartBtn;
