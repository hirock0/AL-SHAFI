export const dynamic = "force-dynamic";
import { Banners } from "@/actions/actions";
import BannerForm from "@/components/AdminDashboard/BannerForm/BannerForm.js";
import DeleteBtn from "@/components/Ui/Admin/Banner/DeleteBtn/DeleteBtn.js";
import UpdateBtn from "@/components/Ui/Admin/Banner/UpdateBtn/UpdateBtn.js";
import Image from "next/image";

const BannerManagement = async () => {
  const banners = await Banners();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Banner Management
          </h1>
          <p className="text-slate-600">
            Create and manage your website banners
          </p>
        </div>

        {/* Banner Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Add New Banner
          </h2>
          <BannerForm />
        </div>

        {/* Banners Grid Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Existing Banners
            </h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {banners?.length || 0} banner{banners?.length !== 1 ? "s" : ""}
            </span>
          </div>

          {banners && banners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner, idx) => (
                <div
                  key={idx}
                  className="group relative bg-slate-50 rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-slate-300"
                >
                  {/* Image Container */}
                  <div className="relative aspect-video bg-slate-200 overflow-hidden">
                    <Image
                      src={banner?.secure_url || "/placeholder.jpg"}
                      alt={banner?.alt || "Banner image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {banner?.alt || "Untitled Banner"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Banner #{idx + 1}
                    </p>
                  </div>

                  {/* Action Buttons Overlay (Optional) */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <UpdateBtn banner={JSON.stringify(banner)} />
                    <DeleteBtn banner={JSON.stringify(banner)} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">
                No banners
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Get started by creating a new banner above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerManagement;
