//Overlay for mobile
"use client";

import { addSidebarOpen } from "@/utils/redux/slices/slice";
import { useDispatch, useSelector } from "react-redux";

const SidebarOverlay = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.slice);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => dispatch(addSidebarOpen(false))}
        />
      )}
    </>
  );
};

export default SidebarOverlay;
