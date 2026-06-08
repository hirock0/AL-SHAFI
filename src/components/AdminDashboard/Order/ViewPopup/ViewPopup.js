"use client";

import { addCommonFlag } from "@/utils/redux/slices/slice";
import { useDispatch, useSelector } from "react-redux";

const ViewPopup = () => {
  const dispatch = useDispatch();
  const { commonData, commonFlag } = useSelector((state) => state?.slice);

  if (commonFlag !== "view_order") return null;

  const order = commonData || {};

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "in_review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-gray-300 text-sm mt-1">
                  Invoice: #{order.invoice || "N/A"}
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(addCommonFlag(null))}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              <div className="w-2 h-2 rounded-full bg-current opacity-70"></div>
              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
            </span>
            <span className="text-gray-300 text-sm">
              {order.createdAt ? formatDate(order.createdAt) : "N/A"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer Information Card */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500 font-medium">
                    Full Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {order.fullName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">
                    Email
                  </label>
                  <p className="text-gray-900">{order.email || "N/A"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500 font-medium">
                    Phone Number
                  </label>
                  <p className="text-gray-900 font-medium">
                    {order.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">
                    Customer Note
                  </label>
                  <p className="text-gray-900">{order.note || "No notes"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Order Summary
            </h3>

            <div className="space-y-4">
              {/* Items List */}
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.name || item.slug}
                    </p>
                    {item.note && (
                      <p className="text-xs text-gray-500 mt-1">
                        Note: {item.note}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      ৳{item.price}
                    </div>
                    <div className="text-sm text-gray-500">Qty: {item.qty}</div>
                    <div className="text-sm font-medium text-gray-700 mt-1">
                      ৳{(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses Card */}
          {order.addresses?.length > 0 && (
            <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Delivery Address{order.addresses.length > 1 ? "es" : ""}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.addresses.map((addr, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="space-y-2">
                      {Object.entries(addr).map(([key, value]) => (
                        <div key={key} className="flex items-start">
                          <span className="text-xs font-medium text-gray-500 capitalize min-w-[100px]">
                            {key.replace(/_/g, " ")}:
                          </span>
                          <span className="text-sm text-gray-900 ml-2">
                            {value || "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Summary Card */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Payment Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ৳{order?.totals?.subtotal || "0.00"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  ৳{order?.totals?.shippingTotal || "0.00"}
                </span>
              </div>

              {order?.totals?.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">
                    -৳{order?.totals?.discount || "0.00"}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ৳{order?.totals?.grandTotal || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => dispatch(addCommonFlag(null))}
              className="px-6 py-3 bg-red-500  font-medium  hover:bg-red-600 transition-colors w-full text-background"
            >
              Close
            </button>
            {/* <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Print Invoice
              </button>
              <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                Update Status
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this CSS for fade-in animation
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
`;

// Add to your component or global styles
<style jsx>{styles}</style>;

export default ViewPopup;
