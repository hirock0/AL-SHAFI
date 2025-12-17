import ProductEditNDelBtn from "@/components/UI/Admin/Product/ProductEditNDelBtn/ProductEditNDelBtn";
import Image from "next/image";
import React from "react";
import { CheckCircle, XCircle, Package, TrendingUp } from "lucide-react";

const ProductTable = ({ product }) => {
  const formattedProducts = JSON.parse(product);
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
            <XCircle className="w-3 h-3" />
            Inactive
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getStockStatus = (stock) => {
    if (stock > 20) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
          In Stock ({stock})
        </span>
      );
    } else if (stock > 0) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
          Low ({stock})
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
          Out of Stock
        </span>
      );
    }
  };

  const getDiscountBadge = (offerPrice, regularPrice) => {
    if (regularPrice > offerPrice) {
      const discount = ((regularPrice - offerPrice) / regularPrice) * 100;
      if (discount > 0) {
        return (
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600 font-medium">
              {discount.toFixed(0)}% off
            </span>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shipping
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {formattedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No Products Found
                    </h4>
                    <p className="text-gray-500">
                      Add your first product to get started
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              formattedProducts.map((prod, index) => (
                <tr 
                  key={prod._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {prod.thumbnail?.secure_url ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={prod.thumbnail.secure_url}
                              alt={prod.productName}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {prod.productName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          #{index + 1}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {prod.category}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          ${prod.offerPrice}
                        </span>
                        {prod.regularPrice > prod.offerPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            ${prod.regularPrice}
                          </span>
                        )}
                      </div>
                      {getDiscountBadge(prod.offerPrice, prod.regularPrice)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {getStockStatus(prod.stock)}
                  </td>
                  
                  <td className="px-6 py-4">
                    {getStatusBadge(prod.status)}
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 uppercase">
                      {prod.shipping_fee}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {new Date(prod.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ProductEditNDelBtn
                        type={"Edit"}
                        product={JSON.stringify(prod)}
                        className="hover:bg-blue-50 text-blue-600"
                      />
                      <ProductEditNDelBtn
                        type={"Delete"}
                        product={JSON.stringify(prod)}
                        className="hover:bg-red-50 text-red-600"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
