'use client'
import { addSidebarOpen } from "@/utils/redux/slices/slice";
import { Bell, Menu, User } from "lucide-react";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left Section - Menu Button */}
        <button
          onClick={() => dispatch(addSidebarOpen(true))}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Empty div for spacing on larger screens */}
        <div className="hidden lg:block"></div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-linear-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
