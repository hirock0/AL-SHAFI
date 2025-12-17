"use client";
import { useInvoices } from "@/hooks/carts/useInvoices";
import { useOrdersByInvoice } from "@/hooks/orders/useOrdersByInvoice";
import {
  Package,
  Phone,
  User,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const Histories = () => {
  const { invoices } = useInvoices();
  const { fetchOrders, loading } = useOrdersByInvoice(invoices);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
    return (
      statusColors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      pending: <Clock className="w-4 h-4" />,
      processing: <Clock className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
    };
    return statusIcons[status?.toLowerCase()] || <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!fetchOrders || fetchOrders.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 md:py-12">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-600">
            You haven't placed any orders. Start shopping to see your orders
            here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your order history
          </p>
        </div>

        <div className="space-y-6">
          {fetchOrders.map((order, index) => (
            <div
              key={`${order.invoice}-${index}`}
              className="bg-white rounded md:rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Invoice:
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {order.invoice}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-semibold capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Customer Name
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Phone Number
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Order Items
                  </h3>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={`${item.slug}-${idx}`}
                        className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm text-gray-900 font-medium">
                            {item.slug}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          <span className="font-semibold">{item.qty}</span> pcs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-600">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {order.totals?.grandTotal}{" "}
                    <span className="text-sm text-gray-600">BDT</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Histories;
