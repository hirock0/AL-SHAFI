export const dynamic = "force-dynamic";
import CategoryTable from "@/components/AdminDashboard/Products/Category/CategoryTable/CategoryTable";
import CategoryAddBtn from "@/components/UI/Admin/Category/CategoryAddBtn/CategoryAddBtn.js";
import { AllCategories } from "@/actions/actions";

const Categories = async () => {
  const categories = await AllCategories();
  return (
    <div className="p-6 relative h-screen">
      <div className=" flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">Product Categories</h1>
        <CategoryAddBtn />
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
          <CategoryTable categories={JSON.stringify(categories)} />
        </div>
      )}
    </div>
  );
};

export default Categories;
