export const dynamic = "force-dynamic";
import { AllCategories } from "@/actions/actions";
import Link from "next/link";
const SideBar = async ({ slug }) => {
  const categories = await AllCategories();
  return (
    <div>
      <h2 className="text-xl font-semibold text-text mb-4 pb-2">
        Collection
      </h2>
      <div className="flex flex-col space-y-2">
        <Link
          href="/product/collections/all-products"
          className={` ${
            slug !== "all-products" && "hover:bg-white"} ${
            slug === "all-products" && "bg-primary text-white"
          } transition-colors duration-200 px-3 py-2 rounded-md`} >
          All Products
        </Link>
        {categories?.map((cat) => (
          <Link
            key={cat._id}
            href={`/product/collections/${cat.slug}`}
            className={` ${
              cat?.slug !== slug && "hover:bg-white"
            }  ${
              cat?.slug === slug && "bg-primary text-white"
            }   transition-colors duration-200 px-3 py-2 rounded-md`}>
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
