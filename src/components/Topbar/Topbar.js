"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle } from "lucide-react";

const Topbar = () => {
  const pathname = usePathname();
  const validPath = pathname.startsWith("/admin-dashboard");

  return (
    <div
      className={`${
        validPath && "hidden"
      } bg-linear-to-r from-primary-dark via-primary to-primary-dark py-2.5 lg:py-3`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 lg:gap-3">
          {/* Desktop View */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-white/90">
              <Phone className="w-4 h-4 animate-pulse" />
              <span className="text-sm lg:text-base font-medium">
                আমাদের যে কোন পণ্য অর্ডার করতে যোগাযোগ করুন:
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href="tel:+8801718099526"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full transition-all duration-300 ease-in-out group border border-white/20"
              >
                <Phone className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
                <span className="text-white font-semibold text-sm lg:text-base">
                  +880 171 8099 526
                </span>
              </Link>
              
              <Link
                href="https://wa.me/8801718099526"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] px-4 py-1.5 rounded-full transition-all duration-300 ease-in-out group shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                <span className="text-white font-semibold text-sm">
                  WhatsApp
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden flex flex-col items-center gap-2 w-full">
            <p className="text-white/90 text-xs text-center font-medium">
              আমাদের যে কোন পণ্য অর্ডার করতে যোগাযোগ করুন
            </p>
            
            <div className="flex items-center gap-2">
              <Link
                href="tel:+8801718099526"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all duration-300 ease-in-out group border border-white/20"
              >
                <Phone className="w-3 h-3 text-white" />
                <span className="text-white font-semibold text-xs">
                  Call Now
                </span>
              </Link>
              
              <Link
                href="https://wa.me/8801718099526"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] px-3 py-1.5 rounded-full transition-all duration-300 ease-in-out group shadow-md"
              >
                <MessageCircle className="w-3 h-3 text-white" />
                <span className="text-white font-semibold text-xs">
                  WhatsApp
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
