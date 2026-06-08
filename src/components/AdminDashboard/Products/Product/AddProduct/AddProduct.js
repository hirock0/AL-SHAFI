"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import useProducts from "@/hooks/products/allProducts/useProducts";
const AddProduct = () => {
  const { products } = useProducts();
  const router = useRouter();
  const [frBhtTogether, setFrBhtTogether] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailType, setThumbnailType] = useState("upload");
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [productSlugs, setProductSlugs] = useState([]);
  const [loader, setLoader] = useState(false);

  const filterProducts = products?.filter((pr) => {
    const searchProducts =
      pr.productName.toLowerCase().includes(query.toLowerCase()) ||
      pr.slug.toLowerCase().includes(query.toLowerCase());
    if (searchProducts) {
      return pr;
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      thumbnail: "",
      thumbnailAlt: "",
      category: "",
      images: [{ value: "", alt: "", type: "upload", preview: null }],
      offerPrice: "",
      regularPrice: "",
      volume: [{ load: 0, price: 0 }],
      descriptions: "",
      shortDescriptions: "",
      stock: "",
      status: "regular",
      shipping_fee: "free",
      frequentlyBoughtTogether: [],
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      seoImage: "",
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "images",
  });
  const {
    fields: volumeFields,
    append: appendVolume,
    remove: removeVolume,
  } = useFieldArray({
    control,
    name: "volume",
  });

  const descriptions = watch("descriptions");
  const shortDescriptions = watch("shortDescriptions");

  // -------------------------------
  // Load Categories
  // -------------------------------
  useEffect(() => {
    axios
      .get("/pages/api/products/category")
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.categories.filter((c) => c.status));
        }
      })
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // -------------------------------
  // Thumbnail Upload
  // -------------------------------
  const handleThumbnailUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("thumbnail", reader.result);
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // -------------------------------
  // Handle image field change
  // -------------------------------
  const handleImageChange = (i, type, fileOrUrl) => {
    const reader = new FileReader();

    if (type === "upload") {
      if (!fileOrUrl) return;
      reader.onloadend = () => {
        update(i, {
          ...fields[i],
          type: "upload",
          value: reader.result,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(fileOrUrl);
    } else {
      update(i, {
        ...fields[i],
        type: "url",
        value: fileOrUrl,
        preview: fileOrUrl || null,
      });
    }
  };

  // -------------------------------
  // Submit
  // -------------------------------
  const onSubmit = async (data) => {
    setLoader(true);
    if (!data.descriptions.trim() || !data.shortDescriptions.trim()) {
      toast.error("Description is required");
      return;
    }

    const payload = {
      ...data,
      images: data.images.map((img) => img.value).filter(Boolean),
      imagesAlt: data.images.map((img) => img.alt || data.productName),
      seoKeywords: data.seoKeywords
        ?.split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
      frequentlyBoughtTogether: productSlugs,
    };
    try {
      const res = await axios.post("/pages/api/products/product", payload);
      if (res.data.success) {
        toast.success("Product Added Successfully!");
        router.refresh();
        reset();
        setThumbnailPreview(null);
        setLoader(false);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const handler = () => {
      if (productSlug !== "") {
        setProductSlugs([productSlug, ...productSlugs]);
      } else {
        return setProductSlugs([]);
      }
    };
    handler();
  }, [productSlug]);

  return (
    <div className="relative max-w-7xl mx-auto p-8 bg-white rounded-md shadow-xl border border-gray-100">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Add New Product
        </h2>
        <p className="text-gray-600">
          Fill in the details to add a new product to your store
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8  overflow-y-scroll">
          {/* Basic Information Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  {...register("productName", { required: true })}
                  placeholder="Enter product name"
                  className="input-field"
                />
                {errors.productName && (
                  <p className="mt-2 text-sm text-red-600">
                    Product Name is required
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register("category", { required: true })}
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Thumbnail Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              Product Thumbnail
            </h3>

            {/* Thumbnail Type Selector */}
            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="thumbnailType"
                    checked={thumbnailType === "upload"}
                    onChange={() => {
                      setThumbnailType("upload");
                      setValue("thumbnail", "");
                      setThumbnailPreview(null);
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      thumbnailType === "upload"
                        ? "border-blue-600"
                        : "border-gray-200"
                    } flex items-center justify-center`}
                  >
                    {thumbnailType === "upload" && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
                <span className="text-gray-700 font-medium">Upload Image</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="thumbnailType"
                    checked={thumbnailType === "url"}
                    onChange={() => {
                      setThumbnailType("url");
                      setValue("thumbnail", "");
                      setThumbnailPreview(null);
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      thumbnailType === "url"
                        ? "border-blue-600"
                        : "border-gray-200"
                    } flex items-center justify-center`}
                  >
                    {thumbnailType === "url" && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
                <span className="text-gray-700 font-medium">Use URL</span>
              </label>
            </div>

            {/* Thumbnail Input */}
            <div className="space-y-4">
              {thumbnailType === "upload" ? (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleThumbnailUpload(e.target.files[0])}
                    className="w-full"
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    Click or drag to upload
                  </p>
                </div>
              ) : (
                <input
                  {...register("thumbnail")}
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => setThumbnailPreview(e.target.value)}
                  className="input-field"
                />
              )}

              {/* Thumbnail Alt Text */}
              <input
                {...register("thumbnailAlt")}
                placeholder="Thumbnail alt text (for SEO)"
                className="input-field"
              />

              {/* Preview */}
              {thumbnailPreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </p>
                  <div className="w-40 h-40 relative border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={thumbnailPreview}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              Gallery Images
            </h3>

            <div className="space-y-4">
              {fields.map((img, i) => (
                <div
                  key={img.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 space-y-4"
                >
                  {/* Image Type Selector */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <input
                          type="radio"
                          checked={img.type === "upload"}
                          onChange={() =>
                            update(i, {
                              ...img,
                              type: "upload",
                              value: "",
                              preview: "",
                            })
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            img.type === "upload"
                              ? "border-blue-600"
                              : "border-gray-200"
                          } flex items-center justify-center`}
                        >
                          {img.type === "upload" && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-700 text-sm">Upload</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <input
                          type="radio"
                          checked={img.type === "url"}
                          onChange={() =>
                            update(i, {
                              ...img,
                              type: "url",
                              value: "",
                              preview: "",
                            })
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            img.type === "url"
                              ? "border-blue-600"
                              : "border-gray-200"
                          } flex items-center justify-center`}
                        >
                          {img.type === "url" && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-700 text-sm">URL</span>
                    </label>
                  </div>

                  {/* Input Field */}
                  {img.type === "upload" ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(i, "upload", e.target.files[0])
                        }
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <input
                      value={img.value}
                      placeholder="Image URL"
                      onChange={(e) =>
                        handleImageChange(i, "url", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  )}

                  {/* Alt Text */}
                  <input
                    {...register(`images.${i}.alt`)}
                    placeholder="Image alt text"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />

                  {/* Preview and Actions */}
                  <div className="flex items-center justify-between">
                    {img.preview && (
                      <div className="w-16 h-16 relative border border-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={img.preview}
                          alt="preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Image Button */}
              <button
                type="button"
                onClick={() =>
                  append({ value: "", alt: "", type: "upload", preview: null })
                }
                className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all hover:bg-gray-50"
              >
                + Add Another Image
              </button>
            </div>
          </div>

          {/* Pricing & Inventory Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Offer Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Price *
                </label>
                <div className="relative">
                  {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span> */}
                  <input
                    {...register("offerPrice", { required: true })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Regular Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Price *
                </label>
                <div className="relative">
                  {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span> */}
                  <input
                    {...register("regularPrice", { required: true })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  {...register("stock", { required: true })}
                  type="number"
                  placeholder="0"
                  className="input-field"
                />
              </div>
            </div>
    

            {/* Volume Pricing */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Volume Pricing
              </h3>

              <div className="space-y-4">
                {volumeFields.map((field, i) => (
                  <div
                    key={field.id}
                    className="flex gap-4 items-center bg-white "
                  >
                    {/* Load */}
                    <div className="">
                      <h3>Load</h3>

                      <input
                        {...register(`volume.${i}.load`, { required: true })}
                        type="text"
                        placeholder="Load (e.g. 1kg, 500ml)"
                        className=" pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Price */}
                    <div className="">
                      <h3>Price</h3>

                      <input
                        {...register(`volume.${i}.price`, { required: true })}
                        type="number"
                        placeholder="Price"
                        className=" pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    {/* Remove */}
                    {volumeFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVolume(i)}
                        className="text-red-600 font-medium"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Volume */}
                <button
                  type="button"
                  onClick={() => appendVolume({ load: "", price: "" })}
                  className=""
                >
                  + Add Volume
                </button>
              </div>
            </div>












            
          </div>

          {/* Description Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Product Description
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <RichTextEditor
                value={descriptions}
                onChange={(v) => setValue("descriptions", v)}
              />
            </div>
          </div>
          {/* short descriptions*/}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Short Description
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <RichTextEditor
                value={shortDescriptions}
                onChange={(v) => setValue("shortDescriptions", v)}
                placeholder={"Write your short descriptions.."}
              />
            </div>
          </div>

          {/* Product Settings Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              Product Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Status
                </label>
                <select {...register("status")} className="input-field">
                  <option value="regular">Regular</option>
                  <option value="onSale">On Sale</option>
                  <option value="new">New</option>
                  <option value="hot">Hot</option>
                </select>
              </div>

              {/* Shipping */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping
                </label>
                <select {...register("shipping_fee")} className="input-field">
                  <option value="free">Free Shipping</option>
                  <option value="paid">Paid Shipping</option>
                </select>
              </div>
            </div>
            <div className=" mt-5 relative">
              <div className=" flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFrBhtTogether(!frBhtTogether)}
                  className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white p-2 rounded-md"
                >
                  Add Frequently Bought Together
                </button>
                {frBhtTogether && (
                  <input
                    type="text"
                    placeholder="Search Products..."
                    onChange={(e) => setQuery(e.target.value)}
                    className=" border border-slate-300 px-2 py-2 rounded-md outline-0"
                  />
                )}
              </div>
              <div className=" ">
                <div
                  className={`${
                    !frBhtTogether ? "hidden" : "block"
                  }  space-y-2 absolute right-0 left-0 bg-white h-[50vh] overflow-y-auto py-5`}
                >
                  {filterProducts?.length === 0 ? (
                    <div className=" text-center">There are no products!</div>
                  ) : (
                    filterProducts?.map((product, idx) => (
                      <div
                        key={idx}
                        className=" flex items-center justify-between gap-3 border border-slate-300 shadow py-2 px-5 rounded-md"
                      >
                        <Image
                          src={product?.thumbnail?.secure_url}
                          alt={product?.slug}
                          width={500}
                          height={500}
                          className="h-20 w-20"
                        />
                        {product?.productName}
                        <input
                          type="checkbox"
                          onClick={() => setProductSlug(product?.slug)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Settings Card */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              SEO Settings
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  {...register("seoTitle")}
                  placeholder="Optimized title for search engines"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  {...register("seoDescription")}
                  rows={3}
                  placeholder="Brief description for search results"
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Keywords
                </label>
                <input
                  {...register("seoKeywords")}
                  placeholder="keyword1, keyword2, keyword3"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Image URL
                </label>
                <input
                  {...register("seoImage")}
                  placeholder="https://example.com/seo-image.jpg"
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-4 bg-primary  text-background font-semibold  hover:bg-primary-dark  transition-all shadow-lg"
          >
            {!loader ? " Add Product" : " Adding..."}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
