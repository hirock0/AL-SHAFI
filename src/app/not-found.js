import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className=" flex items-center justify-center px-4 py-8 md:py-12">
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <span className="text-2xl">404</span>
        </div>

        {/* Text */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Nothing here
          </h2>
          <p className="text-gray-500">
            This page doesn't exist or was removed.
          </p>
        </div>

        {/* Button */}
        {/* <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to safety
          </Link>
        </div> */}
      </div>
    </div>
  );
}
