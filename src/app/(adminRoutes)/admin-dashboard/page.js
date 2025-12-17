'use client'
import dynamic from "next/dynamic";
const SalesChart = dynamic(() => import("../../../components/SalesChart/SalesChart"), {
  ssr: false,
});
import {
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
// import {
//   CartesianGrid,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

const DashboardHome = () => {
  // Sample data - replace with your actual data
  const stats = [
    {
      title: "Total Sales",
      value: "$12,426",
      change: "+12.5%",
      isPositive: true,
      icon: <DollarSign size={24} />,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Orders",
      value: "156",
      change: "+8.2%",
      isPositive: true,
      icon: <ShoppingCart size={24} />,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Products",
      value: "342",
      change: "+3.1%",
      isPositive: true,
      icon: <Package size={24} />,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Customers",
      value: "1,234",
      change: "-2.4%",
      isPositive: false,
      icon: <Users size={24} />,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const recentOrders = [
    {
      id: "#12345",
      customer: "John Doe",
      amount: "$120.00",
      status: "Completed",
    },
    {
      id: "#12346",
      customer: "Jane Smith",
      amount: "$85.50",
      status: "Pending",
    },
    {
      id: "#12347",
      customer: "Mike Johnson",
      amount: "$200.00",
      status: "Processing",
    },
    {
      id: "#12348",
      customer: "Sarah Williams",
      amount: "$150.75",
      status: "Completed",
    },
  ];

  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 5500 },
    { month: "Jul", sales: 7000 },
    { month: "Aug", sales: 6500 },
    { month: "Sep", sales: 8000 },
    { month: "Oct", sales: 7500 },
    { month: "Nov", sales: 9000 },
    { month: "Dec", sales: 8500 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here's your store overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  {stat.isPositive ? (
                    <TrendingUp size={16} className="text-green-600" />
                  ) : (
                    <TrendingDown size={16} className="text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <span className={stat.iconColor}>{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Sales Overview
        </h2>
        <SalesChart data={salesData} />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Order ID
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Customer
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    {order.customer}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    {order.amount}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
