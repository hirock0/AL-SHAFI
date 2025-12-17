export const dynamic = "force-dynamic";
import { CategoryWiseProducts } from "@/actions/actions";
import ProductCard from "../ProductCard/ProductCard";
const RelatedProducts = async ({ slug }) => {
const products = await CategoryWiseProducts(slug)
  if (!products || products.length === 0) {
    return (
      <div className="min-h-[150px] flex items-center justify-center text-gray-500">
        No related products found.
      </div>
    );
  }

  return (
    <section className="my-10">
      <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2 ">
        Related Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          <ProductCard key={prod._id} product={JSON.stringify(prod)} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
