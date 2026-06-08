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
  Printer,
  MapPin,
  Calendar,
  Truck,
  DollarSign,
  Package as PackageIcon,
  ShoppingBag,
  CreditCard,
  Mail,
  Home,
  Building,
  Navigation,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const Histories = () => {
  const { invoices } = useInvoices();
  const { fetchOrders, loading } = useOrdersByInvoice(invoices);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      delivered: <Truck className="w-4 h-4" />,
    };
    return statusIcons[status?.toLowerCase()] || <Clock className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = (order) => {
    setSelectedOrder(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!fetchOrders || fetchOrders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md mx-auto">
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
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      {/* Print Modal */}
      {selectedOrder && (
        <div className="print-content fixed inset-0 z-9999 bg-white p-6 hidden print:block">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Order Invoice
                  </h1>
                  <p className="text-gray-600">Order Details</p>
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <Image
                      src="/logo.png"
                      alt="logo"
                      width={130}
                      height={50}
                      priority
                    />
                  </div>
                  <div className="text-sm text-gray-600">Dhaka, Bangladesh</div>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Order Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice No:</span>
                    <span className="font-semibold">
                      {selectedOrder.invoice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold capitalize">
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span>{selectedOrder.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{selectedOrder.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedOrder.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {selectedOrder.addresses && selectedOrder.addresses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>

                <div className="">
                  {selectedOrder.addresses.map((address, idx) => (
                    <div key={idx} className="">
                      {address.address && (
                        <div className="flex items-start">
                          <Home className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                          <span>{address.address}</span>
                        </div>
                      )}
                      {/* {address.district && (
                          <div className="flex items-start">
                            <Building className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                            <span>District: {address.district}</span>
                          </div>
                        )}
                        {address.city && (
                          <div className="flex items-start">
                            <Navigation className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                            <span>City: {address.city}</span>
                          </div>
                        )}
                        {address.division && (
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                            <span>Division: {address.division}</span>
                          </div>
                        )} */}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Product
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Quantity
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.img}
                              alt={item.productName}
                              height={48}
                              width={48}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium">
                                {item.productName}
                              </div>
                              {/* <div className="text-sm text-gray-500">
                                SKU: {item.slug}
                              </div> */}
                              {/* <div className="text-sm text-gray-500">
                                Category: {item.category}
                              </div> */}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{item.price} BDT</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{item.qty}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold">
                            {item.price * item.qty} BDT
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-border pt-6">
              <div className="max-w-md ml-auto">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{selectedOrder.totals?.subtotal} BDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>{selectedOrder.totals?.shippingTotal} BDT</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
                    <span>Grand Total:</span>
                    <span>{selectedOrder.totals?.grandTotal} BDT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
              <p>Thank you for your order!</p>
              <p>For any queries, contact us at: support@alsafi.com</p>
              <p className="mt-2">
                Printed on: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
            <p className="text-gray-600 mt-2">
              Track and manage your order history
            </p>
          </div>

          <div className="space-y-6">
            {fetchOrders.map((order, index) => (
              <div
                key={`${order._id}-${index}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Order Header */}
                <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Invoice:
                        </span>
                        <span className="text-sm font-semibold text-gray-900 ml-2">
                          {order.invoice}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
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
                      <button
                        onClick={() => handlePrint(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Printer className="w-4 h-4" />
                        <span className="text-sm font-medium">Print</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Full Name</p>
                            <p className="font-medium">{order.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium">{order.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-medium">{order.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Shipping Addresses
                      </h3>
                      <div className="space-y-3">
                        {order.addresses?.map((address, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="space-y-2">
                              {address.address && (
                                <div className="flex items-start">
                                  <Home className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                                  <span className="text-sm">
                                    {address.address}
                                  </span>
                                </div>
                              )}
                              {/* {address.district && (
                                <div className="flex items-start">
                                  <Building className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                                  <span className="text-sm">
                                    District: {address.district}
                                  </span>
                                </div>
                              )}
                              {address.city && (
                                <div className="flex items-start">
                                  <Navigation className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                                  <span className="text-sm">
                                    City: {address.city}
                                  </span>
                                </div>
                              )}
                              {address.division && (
                                <div className="flex items-start">
                                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                                  <span className="text-sm">
                                    Division: {address.division}
                                  </span>
                                </div>
                              )} */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Order Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-medium">
                                {order.totals?.subtotal} BDT
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shipping:</span>
                              <span className="font-medium">
                                {order.totals?.shippingTotal} BDT
                              </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                              <span>Total:</span>
                              <span className="text-text">
                                {order.totals?.grandTotal} BDT
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Order Items
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={`${item._id || idx}`}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <Image
                                    src={item.img}
                                    alt={item.productName}
                                    height={40}
                                    width={40}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <div>
                                    <p className="font-medium text-sm">
                                      {item.productName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {item.category}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">
                                    {item.price} BDT
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.qty}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {/* <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <PackageIcon className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Stock Status</p>
                          <p className="font-medium">In Stock</p>
                        </div>
                      </div>
                      {order.note && (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-xs text-yellow-800 font-semibold">
                            Customer Note:
                          </p>
                          <p className="text-sm text-yellow-700 mt-1">
                            {order.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Histories;
