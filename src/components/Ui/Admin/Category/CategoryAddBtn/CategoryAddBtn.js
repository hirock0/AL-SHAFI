"use client";
import CatAddForm from "@/components/AdminDashboard/Products/Category/CatAddForm/CatAddForm";
import { useState } from "react";
const CategoryAddBtn = () => {
  const [addFalg, setAddFlag] = useState(false);
  return (
    <div>
      <button onClick={() => setAddFlag(true)}>Add+</button>
      <div
        className={`${
          !addFalg && "hidden"
        }  absolute top-0 left-0 right-0 bottom-0 flex items-center bg-slate-900/50 justify-center`}
      >
        <CatAddForm setAddFlag={setAddFlag} />
      </div>
    </div>
  );
};

export default CategoryAddBtn;
