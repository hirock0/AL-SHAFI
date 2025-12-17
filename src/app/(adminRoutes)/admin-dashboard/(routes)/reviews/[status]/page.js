export const dynamic = "force-dynamic";
import { ReviewsByStatus } from "@/actions/actions";
import ReviewTable from "@/components/AdminDashboard/Reviews/ReviewTable/ReviewTable";
import Link from "next/link";
import { CheckCircle, Clock, Filter } from "lucide-react";

const Reviews = async ({ params }) => {
  const { status } = await params;
  const statusValue = JSON.parse(status);
  const reviews = await ReviewsByStatus({ st: statusValue });

  const statusConfig = {
    true: {
      label: "Approved",
      count: reviews?.length || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    false: {
      label: "Pending Approval",
      count: reviews?.length || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  };

  const currentStatus = statusConfig[statusValue];
  const CurrentIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reviews Management
          </h1>
          <p className="text-gray-600">
            Manage and moderate customer product reviews
          </p>
        </div>

        {/* Status Filter & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Filter Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-linear-to-r from-primary to-primary-dark p-4">
                <div className="flex items-center gap-2 text-white">
                  <Filter className="w-5 h-5" />
                  <h3 className="font-semibold">Filter Reviews</h3>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <Link
                  href="/admin-dashboard/reviews/false"
                  className={`group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                    statusValue === false
                      ? "bg-orange-50 border-2 border-orange-200 shadow-sm"
                      : "bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        statusValue === false
                          ? "bg-orange-100"
                          : "bg-gray-100 group-hover:bg-orange-50"
                      }`}
                    >
                      <Clock
                        className={`w-4 h-4 ${
                          statusValue === false
                            ? "text-orange-600"
                            : "text-gray-600 group-hover:text-orange-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-medium text-sm ${
                          statusValue === false
                            ? "text-orange-900"
                            : "text-gray-700 group-hover:text-orange-900"
                        }`}
                      >
                        Pending
                      </p>
                      <p className="text-xs text-gray-500">
                        Awaiting approval
                      </p>
                    </div>
                  </div>
                  {statusValue === false && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  )}
                </Link>

                <Link
                  href="/admin-dashboard/reviews/true"
                  className={`group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                    statusValue === true
                      ? "bg-green-50 border-2 border-green-200 shadow-sm"
                      : "bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        statusValue === true
                          ? "bg-green-100"
                          : "bg-gray-100 group-hover:bg-green-50"
                      }`}
                    >
                      <CheckCircle
                        className={`w-4 h-4 ${
                          statusValue === true
                            ? "text-green-600"
                            : "text-gray-600 group-hover:text-green-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-medium text-sm ${
                          statusValue === true
                            ? "text-green-900"
                            : "text-gray-700 group-hover:text-green-900"
                        }`}
                      >
                        Approved
                      </p>
                      <p className="text-xs text-gray-500">
                        Published reviews
                      </p>
                    </div>
                  </div>
                  {statusValue === true && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Quick Stats
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Reviews</span>
                  <span className="text-sm font-bold text-gray-900">
                    {reviews?.length || 0}
                  </span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Current Filter</span>
                  <span
                    className={`text-xs font-semibold ${currentStatus.color}`}
                  >
                    {currentStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Status Banner */}
            <div
              className={`${currentStatus.bgColor} ${currentStatus.borderColor} border-2 rounded-xl p-5 mb-6 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 bg-white rounded-xl shadow-sm ${currentStatus.borderColor} border`}
                  >
                    <CurrentIcon
                      className={`w-6 h-6 ${currentStatus.color}`}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {currentStatus.label} Reviews
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentStatus.count}{" "}
                      {currentStatus.count === 1 ? "review" : "reviews"} in
                      this category
                    </p>
                  </div>
                </div>

                {statusValue === false && currentStatus.count > 0 && (
                  <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-orange-200 shadow-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-orange-700">
                      Action Required
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {reviews?.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <CurrentIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No {currentStatus.label} Reviews
                  </h3>
                  <p className="text-sm text-gray-500">
                    There are currently no reviews in this category
                  </p>
                </div>
              ) : (
                <ReviewTable reviews={JSON.stringify(reviews)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;