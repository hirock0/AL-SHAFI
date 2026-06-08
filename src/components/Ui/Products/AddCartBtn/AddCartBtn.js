"use client";
import { useCart } from "@/hooks/carts/useCart";
import {
  addActiveFlag,
  addCartFlag,
  addCommonData,
  addCommonFlag,
} from "@/utils/redux/slices/slice";
import { useDispatch, useSelector } from "react-redux";
const AddCartBtn = ({ product, styles, children }) => {
  const dispatch = useDispatch();
  const { activeFlag, cartFlag } = useSelector((state) => state?.slice);
  const parseProduct = JSON.parse(product);
  const { addToCart } = useCart();
  const addCartHandler = () => {
    if (frbFlag === "cart_frb") {
      addToCart(parseProduct), dispatch(addActiveFlag(!activeFlag));
      dispatch(addCartFlag(true));
      dispatch(addCommonData(parseProduct?.slug));
      dispatch(addCommonFlag("add_slug"));
    } else {
      addToCart(parseProduct), dispatch(addActiveFlag(!activeFlag));
      dispatch(addCartFlag(!cartFlag));
      dispatch(addCommonData(parseProduct?.slug));
      dispatch(addCommonFlag("add_slug"));
    }
  };
  return (
    <button onClick={() => addCartHandler()} className={styles}>
      {children}
    </button>
  );
};

export default AddCartBtn;
