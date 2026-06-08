export const dynamic = "force-dynamic";
import SideBar from "@/components/AdminDashboard/SideBar/SideBar.js";
import React from "react";
import Navbar from "@/components/AdminDashboard/Navbar/Navbar.js";
import SidebarOverlay from "@/components/SidebarOverlay/SidebarOverlay";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <SideBar />
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 w-full">
          {/* Navbar */}
          <Navbar />
          {/* Page Content */}
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
      {/* Overlay for mobile */}
      <SidebarOverlay />
    </div>
  );
};

export default Layout;
