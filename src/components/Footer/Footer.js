"use client";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  Shield,
  Truck,
  Clock,
  Leaf,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const validPath = pathname.startsWith("/admin-dashboard");

  if (validPath) return null;

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Shop", href: "/shop" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const customerService = [
    { name: "Return Policy", href: "/return-policy" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Track Your Order", href: "/order/histories" },
    { name: "FAQ", href: "/faq" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-[#1877F2]",
    },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-[#E4405F]",
    },
    {
      icon: Twitter,
      href: "#",
      label: "Twitter",
      color: "hover:text-[#1DA1F2]",
    },
    {
      icon: Youtube,
      href: "#",
      label: "Youtube",
      color: "hover:text-[#FF0000]",
    },
  ];

  return (
    <footer className="bg-text text-white/90">
      {/* Trust Badges Section */}
      <div className="border-y border-primary/20">
        <div className="max-w-[1440px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex items-center gap-3 justify-center">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Truck className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">
                  Fast Delivery
                </p>
                <p className="text-xs text-white/70">Across Bangladesh</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Shield className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">
                  Secure Payment
                </p>
                <p className="text-xs text-white/70">100% Protected</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Leaf className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">100% Natural</p>
                <p className="text-xs text-white/70">Authentic Products</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Clock className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">24/7 Support</p>
                <p className="text-xs text-white/70">Always Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand / About - Larger Column */}
          <div className="lg:col-span-4">
            <div className="mb-5">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Al-Shafi Logo"
                  width={140}
                  height={50}
                  priority
                  className="object-contain transition-transform duration-300"
                />
              </Link>
            </div>
            <p className="text-sm leading-7 text-white/80 mb-5">
              আল-শাফি আপনার বিশ্বস্ত অনলাইন স্টোর। প্রিমিয়াম প্রাকৃতিক খাদ্য
              পণ্যের জন্য। দ্রুত ডেলিভারি, নিরাপদ পেমেন্ট এবং 24/7 সাপোর্ট।
            </p>
            <p className="text-sm leading-7 text-white/80">
              Al-Shafi is your trusted online store for premium natural food
              products at affordable prices. Fast delivery, secure payment &
              24/7 support.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${social.color} group`}
                >
                  <social.icon className="w-5 h-5" strokeWidth={2} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h6 className="text-white/70 font-bold text-base md:text-lg mb-4 flex items-center gap-2">
              <ShoppingBag
                className="w-4 h-4 text-white/70"
                strokeWidth={2.5}
              />
              Quick Links
            </h6>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white/90 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-3">
            <h6 className="text-white/70 font-bold text-base md:text-lg mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-white/70" strokeWidth={2.5} />
              Customer Service
            </h6>
            <ul className="space-y-2.5">
              {customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white/90 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h6 className="text-white/70 font-bold text-base md:text-lg mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-white/70" strokeWidth={2.5} />
              Contact Us
            </h6>
            <ul className="space-y-4">
              <li className="group">
                <Link
                  href="mailto:support@alshafi.com"
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white/90 transition-colors duration-200"
                >
                  <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                    <Mail className="w-4 h-4 text-white/70" strokeWidth={2} />
                  </div>
                  <span className="pt-0.5">support@alshafi.com</span>
                </Link>
              </li>

              <li className="group">
                <Link
                  href="tel:+8801718099526"
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white/90 transition-colors duration-200"
                >
                  <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                    <Phone className="w-4 h-4 text-white/70" strokeWidth={2} />
                  </div>
                  <span className="pt-0.5">+880 171 8099 526</span>
                </Link>
              </li>

              <li className="group">
                <div className="flex items-center gap-3 text-sm text-white/70 hover:text-white/90">
                  <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                    <MapPin className="w-4 h-4 text-white/70" strokeWidth={2} />
                  </div>
                  <span className="pt-0.5">Dhaka, Bangladesh</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="mt-12 p-6 md:p-8 bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white font-bold text-lg md:text-xl mb-2">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-white/70 text-sm mb-5">
              নতুন পণ্য এবং অফার সম্পর্কে প্রথম জানুন
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-primary focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-linear-to-r from-primary to-primary-dark text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div> */}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <p>© {new Date().getFullYear()} Al-Shafi — All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link
                href="/privacy-policy"
                className="hover:text-white/90 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white/90 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
