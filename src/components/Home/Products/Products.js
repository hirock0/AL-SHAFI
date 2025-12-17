
export const dynamic = "force-dynamic";
import ProductCard from "@/components/Products/ProductCard/ProductCard";
import { HomeProducts } from "@/actions/actions";
import { Leaf, Sparkles } from "lucide-react";

const Products = async () => {
  const products = await HomeProducts();

  return (
    <section className="bg-background pt-6 pb-8 md:pb-16 md:pt-8 ">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-0.5 w-12 md:w-16 bg-linear-to-r from-transparent to-text rounded-full"></div>
            <Leaf className="w-6 h-6 text-text animate-pulse" strokeWidth={2} />
            <div className="h-0.5 w-12 md:w-16 bg-linear-to-l from-transparent to-text rounded-full"></div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-text mb-3 tracking-tight">
            আমাদের সকল পণ্য
          </h2>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3">
            ALL PRODUCTS
          </p>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto">
            প্রাকৃতিক ও খাঁটি খাদ্য পণ্যের বিশাল সংগ্রহ
          </p>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((prod, idx) => (
              <ProductCard
                key={prod._id || idx}
                product={JSON.stringify(prod)}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16 md:py-20">
            <div className="bg-accent-cream rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-text mb-2">
              No Products Available
            </h3>
            <p className="text-text-secondary text-sm md:text-base">
              পণ্য শীঘ্রই আসছে। অনুগ্রহ করে পরে আবার দেখুন।
            </p>
          </div>
        )}

        {/* View More Button (Optional) */}
        {/* {products && products.length > 0 && (
          <div className="text-center mt-10 md:mt-14">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-text text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group">
              <span>আরও পণ্য দেখুন</span>
              <Sparkles className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" strokeWidth={2} />
            </button>
          </div>
        )} */}
      </div>

      {/* Decorative Background Pattern (Optional) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default Products;