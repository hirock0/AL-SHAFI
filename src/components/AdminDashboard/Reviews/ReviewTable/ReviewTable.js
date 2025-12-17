export const dynamic = "force-dynamic";
import ApprovedBtn from "@/components/UI/Admin/Reviews/ApprovedBtn/ApprovedBtn";
import ReviewDeleteBtn from "@/components/UI/Admin/Reviews/ReviewDeleteBtn/ReviewDeleteBtn";
import {
  Star,
  CheckCircle,
  Clock,
  Mail,
  User,
  MessageSquare,
  Calendar,
} from "lucide-react";

const ReviewTable = ({ reviews }) => {
  const parseReviews = JSON.parse(reviews);

  if (!parseReviews || parseReviews.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <MessageSquare className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Reviews Found
        </h3>
        <p className="text-sm text-gray-500">
          There are no reviews to display at this time
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-y-scroll h-[60vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-linear-to-r from-gray-50 to-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Rating
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Review
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">Actions</div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {parseReviews.map((review, index) => (
              <tr
                key={review._id}
                className="hover:bg-gray-50 transition-colors duration-150"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Customer Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 bg-linear-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-sm">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {review.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="w-3 h-3" />
                        {review.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Rating */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {review.rating}.0
                    </span>
                  </div>
                </td>

                {/* Comment */}
                <td className="px-6 py-4 max-w-md">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {review.comment}
                  </p>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {review.status ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                      <Clock className="w-3.5 h-3.5" />
                      Pending
                    </span>
                  )}
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>
                <td className="px-6 py-4  flex items-center gap-2 whitespace-nowrap">
                  <ApprovedBtn id={JSON.stringify(review?._id)} />
                  <ReviewDeleteBtn id={JSON.stringify(review?._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {parseReviews.map((review, index) => (
          <div
            key={review._id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-base">
                    {review.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {review.email}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              {review.status ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  <CheckCircle className="w-3 h-3" />
                  Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                  <Clock className="w-3 h-3" />
                  Pending
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">
                {review.rating}.0
              </span>
            </div>

            {/* Comment */}
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              at{" "}
              {new Date(review.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewTable;
