"use client";
import { addCommonFlag } from "@/utils/redux/slices/slice";
import { useDispatch, useSelector } from "react-redux";
const ConsignmentSlip = () => {
  const dispatch = useDispatch();
  const { commonFlag, commonData } = useSelector((state) => state?.slice);
  if (commonFlag !== "order_print") return null;
  const order = commonData || {};
  const fullAddress = order?.addresses?.[0]?.address || "N/A";
  const district = order?.addresses?.[1]?.district || "N/A";
  const city = order?.addresses?.[1]?.city || "N/A";
  const division = order?.addresses?.[2]?.division || "N/A";

  return (
    <div className=" fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="
          bg-white text-black p-4 rounded-md shadow-lg
          w-[300px]    /* Perfect for POS slip preview */
        "
      >
  
        <div id="print-area" className="text-[12px] leading-tight">
          <h2 className="text-center font-bold text-[14px] mb-2">
            Consignment Slip
          </h2>

          <div className="border-b border-dashed mb-2"></div>

          <p>
            <strong>Name:</strong> {order.fullName}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>

          <p className="mt-1">
            <strong>Address:</strong>
            <br />
            {fullAddress}
          </p>

          <p className="mt-1">
            <strong>City:</strong> {city}
          </p>
          <p>
            <strong>District:</strong> {district}
          </p>
          <p>
            <strong>Division:</strong> {division}
          </p>

          <div className="border-b border-dashed my-2"></div>

          <p>
            <strong>Invoice:</strong> {order.invoice}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>

          <p className="mt-1">
            <strong>Consignment ID:</strong> {order.consignment_id}
          </p>

          <p>
            <strong>Tracking Code:</strong> {order.tracking_code || "N/A"}
          </p>

          <div className="border-b border-dashed my-2"></div>

          <p>
            <strong>Subtotal:</strong> {order?.totals?.subtotal} ৳
          </p>
          <p>
            <strong>Shipping:</strong> {order?.totals?.shippingTotal} ৳
          </p>
          <p className="font-bold">
            <strong>Grand Total:</strong> {order?.totals?.grandTotal} ৳
          </p>

          <div className="border-b border-dashed my-2"></div>

          <p className="text-center text-[10px] mt-2">
            Thank you for your order.
          </p>
        </div>

        {/* BUTTONS */}
        <div className="mt-3 flex justify-between gap-2">
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-3 py-1 rounded w-full"
          >
            Print
          </button>

          <button
            onClick={() => dispatch(addCommonFlag(null))}
            className="bg-red-500 text-white px-3 py-1 rounded w-full"
          >
            Cancel
          </button>
        </div>
      </div>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-area, #print-area * {
              visibility: visible;
            }
            #print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 58mm; /* POS thermal paper width */
              padding: 0;
              margin: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ConsignmentSlip;
