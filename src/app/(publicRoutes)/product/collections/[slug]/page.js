export const dynamic = "force-dynamic";
import { CategoryWiseProducts } from "@/actions/actions";
import FilterProducts from "@/components/AdminDashboard/Products/FilterProducts/FilterProducts";
import ProductCard from "@/components/Products/ProductCard/ProductCard";
const Collections = async (params) => {
  const { grids } = await params?.searchParams;
  const { slug } = await params?.params;
  const products = await CategoryWiseProducts(slug);
  if (!products || products.length === 0) {
    return (
      <div className=" h-[50vh] flex items-center justify-center text-xl ">
        No products found in this category.
      </div>
    );
  }
  return (
    <div className="">
      <h1 className="text-2xl max-lg:hidden font-bold mb-6 uppercase font-montserrat">
        {slug} Products
      </h1>
      <div className=" ">
        <FilterProducts slug={slug} />
      </div>
      <div
        className={`
          ${
            grids
              ? `grid grid-cols-${grids}`
              : "grid grid-cols-3 max-md:grid-cols-2"
          } gap-6
        `}
      >
        {products.map((prod) => (
          <ProductCard key={prod._id} product={JSON.stringify(prod)} />
        ))}
      </div>
    </div>
  );
};

export default Collections;
