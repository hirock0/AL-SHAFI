export const dynamic = "force-dynamic";
import { ordersByStatus } from "@/actions/actions";
import ConsignmentSlip from "@/components/AdminDashboard/Order/ConsignmentSlip/ConsignmentSlip";
import OrdersTable from "@/components/AdminDashboard/Products/Orders/OrdersTable/OrdersTable";
import Link from "next/link";

const OrdersPage = async ({ params }) => {
  const { status } = await params;
  const orders = await ordersByStatus({ status });
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    in_review: "bg-blue-100 text-blue-800 border-blue-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
  };

  const statusLabels = {
    pending: "Pending",
    in_review: "In Review",
    delivered: "Delivered",
  };

  return (
    <div className="">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Order Management
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                    {statusLabels[status] || status}
                  </span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm font-medium text-gray-700">
                    {orders?.length || 0} {orders?.length === 1 ? 'order' : 'orders'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <div className="relative inline-block text-left">
                <details className="group">
                  <summary className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Filter by Status
                    <svg className="w-4 h-4 ml-1 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
                    <div className="py-1">
                      <Link
                        href="/admin-dashboard/orders/pending"
                        className={`flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                          status === 'pending' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Pending Orders
                      </Link>
                      <Link
                        href="/admin-dashboard/orders/in_review"
                        className={`flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                          status === 'in_review' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        In Review Orders
                      </Link>
                      <Link
                        href="/admin-dashboard/orders/delivered"
                        className={`flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                          status === 'delivered' ? 'text-green-600 bg-green-50' : 'text-gray-700'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Delivered Orders
                      </Link>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-linear-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">{orders?.length || 0}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Status</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {statusLabels[status] || status}
                </h3>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <h3 className="text-2xl font-bold text-gray-900">Today</h3>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div> */}

        {/* Orders Table Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Order List</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and process all customer orders
                </p>
              </div>
              {/* <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Export
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Bulk Action
                </button>
              </div> */}
            </div>
          </div>

          {/* Orders Table */}
          <div className="p-6">
            <OrdersTable orders={orders || []} status={status} />
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing 1 to {Math.min(10, orders?.length || 0)} of {orders?.length || 0} orders
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
                  Previous
                </button>
                <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
                  1
                </button>
                {orders?.length > 10 && (
                  <>
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                      2
                    </button>
                    <span className="text-gray-400">...</span>
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                      {Math.ceil(orders?.length / 10)}
                    </button>
                  </>
                )}
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Consignment Slip (Conditional) */}
        {status !== "pending" && (
          <div className="mt-8">
            <ConsignmentSlip />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
