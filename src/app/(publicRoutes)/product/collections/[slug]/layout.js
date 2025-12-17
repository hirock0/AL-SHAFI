export const dynamic = "force-dynamic";
import Container from "@/components/Container/Container";
import SideBar from "@/components/Products/Collections/SideBar/SideBar";
import ProductSeenHistories from "@/components/Products/ProductSeenHistories/ProductSeenHistories";
import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";

const Layout = async ({ children, params }) => {
  const { slug } = await params;

  const formatSlugName = (slug) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  return (
    <div className="bg-background">
      <div className="bg-linear-to-r from-primary via-primary-dark to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <Container>
          <div className="relative py-6 md:py-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/product/collections/all-products" className="hover:text-white transition-colors">
                Collections
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{formatSlugName(slug)}</span>
            </div>

            {/* Title */}
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <Package className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight">
                  {formatSlugName(slug)}
                </h1>
                <p className="text-white/80 text-sm md:text-base mt-1">
                  Browse our collection of natural products
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 py-8 md:py-12">
          {/* Sidebar */}
          <aside className="w-full max-lg:hidden lg:w-64 xl:w-72">
            <div className="lg:sticky lg:top-24">
              {/* Mobile: Collapsible, Desktop: Always visible */}
              <div className="">
                <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  Filter Products
                </h2>
                <SideBar slug={slug} />
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Product Content */}
            <div className="mb-12">
              {children}
            </div>

            {/* Recently Viewed Section */}
            <div className="mt-12">
              <ProductSeenHistories />
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
};

export default Layout;