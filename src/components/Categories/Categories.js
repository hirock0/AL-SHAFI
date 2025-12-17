export const dynamic = "force-dynamic";

import { AllCategories } from "@/actions/actions";
import Link from "next/link";
import Container from "../Container/Container";
const Categories = async () => {

  const categories = await AllCategories();
  return (
    <div className="py-6 bg-surface">
      <Container>
        <div className="flex flex-wrap space-x-6">
          {categories?.map((categ) => (
            <Link
              key={categ._id}
              href={`/product/collections/${categ.slug}`}
              className="block  text-center transition transform hover:scale-105 duration-200"
            >
              <p className="text-gray-700 font-medium">{categ?.name}</p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Categories;
