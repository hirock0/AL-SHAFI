"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  LogOut,
  Home,
  ShoppingCart,
  MessageSquare,
  X,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addSidebarOpen } from "@/utils/redux/slices/slice";

const menuItems = [
  {
    title: "Home",
    href: "/",
    icon: <Home size={20} />,
  },
  {
    title: "Dashboard",
    href: "/admin-dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: "Products",
    href: "/admin-dashboard/products",
    icon: <Package size={20} />,
  },
  {
    title: "Orders",
    href: "/admin-dashboard/orders/pending",
    icon: <ShoppingCart size={20} />,
  },
  {
    title: "Categories",
    href: "/admin-dashboard/categories" ,
    icon: <Layers size={20} />,
  },
  {
    title: "Reviews",
    href: "/admin-dashboard/reviews/false",
    icon: <MessageSquare size={20} />,
  },
  {
    title: "Banner",
    href: "/admin-dashboard/banner-management",
    icon: <MessageSquare size={20} />,
  },
  {
    title: "User management",
    href: "/admin-dashboard/user-management/admin",
    icon: <MessageSquare size={20} />,
  },

];

const SideBar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.slice);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-primary border-r border-background/20 shadow-lg z-40 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 w-64`}
    >
      <div className="flex flex-col h-full">
        {/* Logo & Close Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-background/20">
          <div className="">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Al-Shafi Logo"
                width={110}
                height={50}
                priority
                className="object-contain brightness-0 invert hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>
          <button
            onClick={() => dispatch(addSidebarOpen(false))}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-background hover:text-text" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, i) => {
              const active = pathname === item.href;

              return (
                <li key={i}>
                  <Link
                    href={item.href}
                    onClick={() => dispatch(addSidebarOpen(false))}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                    ${
                      active
                        ? "bg-background text-text shadow-sm"
                        : "text-background hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span
                      className={
                        active
                          ? "text-text"
                          : "text-surface group-hover:text-text"
                      }
                    >
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-background/20">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
