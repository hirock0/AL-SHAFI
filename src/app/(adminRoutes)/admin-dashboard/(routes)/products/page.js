export const dynamic = "force-dynamic";
import ProductTable from "@/components/AdminDashboard/Products/Product/ProductTable/ProductTable.js";
import ProductAddBtn from "@/components/Ui/Admin/Product/ProductAddBtn/ProductAddBtn.js";
import { AllProducts, FreeShippingRange } from "@/actions/actions";
import { Package, Search } from "lucide-react";
import ProductEditForm from "@/components/AdminDashboard/Products/Product/ProductEdiitForm/ProductEditForm";
import FreeShippingAmount from "@/components/Products/FreeShippingAmount/FreeShippingAmount";

const Products = async () => {
  const products = await AllProducts();
  const rangeShippingCharge = await FreeShippingRange();
  const totalProducts = products?.length || 0;

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Products
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {totalProducts} product{totalProducts !== 1 ? "s" : ""} in inventory
          </p>
        </div>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative max-w-md w-full  pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search products..." className="" />
        </div>

        <FreeShippingAmount amount={JSON.stringify(rangeShippingCharge?.value)} />
      </div>
      <div className="">
        {products?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-500 mb-6">
              Add your first product to get started
            </p>
            <ProductAddBtn products={JSON.stringify(products)} />
          </div>
        ) : (
          <>
            {/* <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Product List
                </span>
                <span className="text-sm text-gray-500">
                  {totalProducts} items
                </span>
              </div>
            </div> */}
            <ProductTable product={JSON.stringify(products)} />
          </>
        )}
      </div>
      <ProductEditForm />
    </div>
  );
};

export default Products;
