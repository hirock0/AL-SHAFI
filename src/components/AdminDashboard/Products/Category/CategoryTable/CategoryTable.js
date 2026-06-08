import CatEditNDelBtn from "@/components/Ui/Admin/Category/CatEditNDelBtn";
import Image from "next/image";
const CategoryTable = ({ categories }) => {
  const parseCategories = JSON.parse(categories);
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parseCategories.map((cat, index) => (
            <tr key={cat._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index + 1}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {cat.image?.secure_url ? (
                  <Image
                    src={cat.image.secure_url}
                    alt={cat.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-md text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {cat.name}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cat.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {cat.status ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(cat.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                <CatEditNDelBtn type={"Edit"} cat={JSON.stringify(cat)} />
                <CatEditNDelBtn type={"Delete"} cat={JSON.stringify(cat)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CategoryTable;
