"use client";
import AddProduct from "@/components/AdminDashboard/Products/Product/AddProduct/AddProduct";
import { useState } from "react";
const ProductAddBtn = ({products}) => {
  const [addFalg, setAddFlag] = useState(false);

  
  return (
    <div>
      <button onClick={() => setAddFlag(true)} className="bg-primary border border-primary px-4 py-2 rounded-md text-background font-medium">Add + </button>
      <div
        className={`${
          !addFalg && "hidden"
        }  fixed top-0 left-0 right-0 bottom-0 flex items-center bg-slate-900/50 justify-center`}
      >
        <div className=" flex items-center justify-center min-h-screen">
          <AddProduct setAddFlag={setAddFlag} products={products} />
        </div>
      </div>
    </div>
  );
};

export default ProductAddBtn;
