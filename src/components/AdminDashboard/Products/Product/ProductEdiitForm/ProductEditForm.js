"use client";
import ConverterToHtml from "@/components/ConverterToHtml/ConverterToHtml";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import useProducts from "@/hooks/products/allProducts/useProducts";
import useCategories from "@/hooks/products/categories/useCategories";
import useFrequentlyBoughtProducts from "@/hooks/products/frequentlyBoughtProducts/useFrequentlyBoughtProducts";
import { addCommonFlag } from "@/utils/redux/slices/slice";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductEditForm = () => {
  const dispatch = useDispatch();
  const { commonData, commonFlag } = useSelector((state) => state?.slice);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { frbProducts } = useFrequentlyBoughtProducts();
  const [frProducts, setFrProducts] = useState([]);
  const [productSlugs, setProductSlugs] = useState([]);
  const [frBhtTogether, setFrBhtTogether] = useState(false);
  const [moreProducts, setMoreProducts] = useState(false);
  const prod = commonData ? commonData : [];
  const [loading, setLoading] = useState(false);
  const { categories } = useCategories();
  const [descriptions, setDescriptions] = useState(prod?.descriptions || "");
  const [shortDescriptions, setShortDescriptions] = useState(
    prod?.shortDescriptions || ""
  );
  const [thumbnailType, setThumbnailType] = useState(
    prod?.thumbnail?.secure_url ? "url" : "upload"
  );
  const [thumbnailPreview, setThumbnailPreview] = useState(
    prod?.thumbnail?.secure_url || ""
  );
  const { products } = useProducts(query);

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
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: prod?.productName || "",
      category: prod?.category || "",
      thumbnail: prod?.thumbnail?.secure_url || "",
      images: (prod?.images?.length > 0 &&
        prod.images.map((img) => ({
          type: "url",
          value: img.secure_url || "",
          preview: img.secure_url || "",
          alt: img.alt || "",
        }))) || [{ type: "upload", value: "", preview: "", alt: "" }],
      offerPrice: prod?.offerPrice ?? "",
      regularPrice: prod?.regularPrice ?? "",
      volume:
        prod?.volume?.length > 0 &&
        prod.volume.map((vol) => ({
          load: vol.load,
          price: vol.price,
        })),
      stock: prod?.stock ?? 0,
      status: prod?.status || "regular",
      shipping_fee: prod?.shipping_fee || "free",
      frequentlyBoughtTogether: [],
      seoTitle: prod?.seoTitle || "",
      seoDescription: prod?.seoDescription || "",
      seoKeywords: prod?.seoKeywords?.join(", ") || "",
      seoImage: prod?.seoImage || "",
    },
  });

  const {
    fields: imageFields,
    append,
    remove,
    update,
  } = useFieldArray({
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

  const watchedImages = watch("images");
  const watchedThumbnail = watch("thumbnail");

  // ------------------- Helpers -------------------
  const canCelSlug = (slug) => {
    const filterSlugs = productSlugs?.filter((s) => s !== slug);
    setProductSlugs(filterSlugs);
    const filterProducts = frProducts?.filter((sl) => sl.slug !== slug);
    setFrProducts(filterProducts);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleThumbnailUpload = async (file) => {
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      setValue("thumbnail", b64);
      setThumbnailPreview(b64);
    } catch (err) {
      toast.error("Failed to read thumbnail file");
    }
  };

  const handleThumbnailUrl = (url) => {
    const val = url || "";
    setValue("thumbnail", val);
    setThumbnailPreview(val || "");
  };

  const handleImageChange = async (index, type, fileOrUrl) => {
    try {
      if (type === "upload") {
        if (!fileOrUrl) return;
        const b64 = await fileToBase64(fileOrUrl);
        update(index, {
          ...imageFields[index],
          type: "upload",
          value: b64,
          preview: b64,
        });
      } else {
        update(index, {
          ...imageFields[index],
          type: "url",
          value: fileOrUrl || "",
          preview: fileOrUrl || "",
        });
      }
    } catch (err) {
      toast.error("Failed to read image file");
    }
  };

  const addImageField = () =>
    append({ type: "upload", value: "", preview: "", alt: "" });
  const removeImageField = (index) => {
    remove(index);
  };

  useEffect(() => {
    const handlerP = () => {
      try {
        setFrProducts(frbProducts);
        const slugs = frbProducts?.map((p) => p.slug);
        setProductSlugs(slugs);
      } catch (error) {
        throw new Error(error?.message);
      }
    };
    handlerP();
  }, [frbProducts]);

  useEffect(() => {
    reset({
      productName: prod?.productName || "",
      category: prod?.category || "",
      thumbnail: prod?.thumbnail?.secure_url || "",
      images: (prod?.images?.length > 0 &&
        prod.images.map((img) => ({
          type: "url",
          value: img.secure_url || "",
          preview: img.secure_url || "",
          alt: img.alt || "",
        }))) || [{ type: "upload", value: "", preview: "", alt: "" }],
      volume:
        prod?.volume?.length > 0 &&
        prod.volume.map((vol) => ({
          load: vol.load,
          price: vol.price,
        })),
      offerPrice: prod?.offerPrice ?? "",
      regularPrice: prod?.regularPrice ?? "",
      stock: prod?.stock ?? 0,
      status: prod?.status || "regular",
      shipping_fee: prod?.shipping_fee || "free",
      seoTitle: prod?.seoTitle || "",
      seoDescription: prod?.seoDescription || "",
      seoKeywords: prod?.seoKeywords?.join(", ") || "",
      seoImage: prod?.seoImage || "",
    });
    setDescriptions(prod?.descriptions || "");
    setShortDescriptions(prod?.shortDescriptions || "");
    setThumbnailPreview(prod?.thumbnail?.secure_url || "");
    setThumbnailType(prod?.thumbnail?.secure_url ? "url" : "upload");
  }, [commonFlag, reset]);

  const onSubmit = async (formValues) => {
    if (!descriptions || descriptions.trim() === "") {
      toast.warning("Description is required!");
      return;
    }
    if (!formValues.productName || !formValues.productName.trim()) {
      toast.warning("Product name is required!");
      return;
    }
    if (!formValues.thumbnail || formValues.thumbnail === "") {
      toast.warning("Thumbnail is required!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        productName: formValues.productName,
        category: formValues.category,
        thumbnail: formValues.thumbnail,
        images: (formValues.images || []).map((f) => f.value).filter(Boolean),
        volume: (formValues.volume || []).map((f) => ({
          load: f.load,
          price: f.price,
        })),
        offerPrice: formValues.offerPrice,
        regularPrice: formValues.regularPrice,
        descriptions,
        shortDescriptions,
        stock: Number(formValues.stock || 0),
        status: formValues.status,
        shipping_fee: formValues.shipping_fee,
        frequentlyBoughtTogether: productSlugs,
        seoTitle: formValues.seoTitle,
        seoDescription: formValues.seoDescription,
        seoKeywords:
          (formValues.seoKeywords || "")
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0) || [],
        seoImage: formValues.seoImage,
      };
      const { data } = await axios.patch(
        `/pages/api/products/product/${prod._id}`,
        payload
      );

      if (data?.success) {
        toast.success(data.message || "Product updated");
        dispatch(addCommonFlag("p-edit-form-close"));
        router.refresh();
      } else {
        toast.warning(data.message || "Update failed");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {commonFlag === "p-edit-form-open" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl relative space-y-6 overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-800">
                Edit Product
              </h3>
              <button
                type="button"
                onClick={() => dispatch(addCommonFlag("p-edit-form-close"))}
                className="text-gray-500 hover:text-gray-700 text-xl"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                {...register("productName")}
                placeholder="Enter product name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.productName && (
                <p className="text-red-500 text-xs mt-1">
                  Product name is required
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail
              </label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={thumbnailType === "upload"}
                    onChange={() => {
                      setThumbnailType("upload");
                      setValue("thumbnail", "");
                      setThumbnailPreview("");
                    }}
                    className="h-4 w-4 text-blue-600"
                  />
                  Upload
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={thumbnailType === "url"}
                    onChange={() => {
                      setThumbnailType("url");
                      setValue("thumbnail", "");
                      setThumbnailPreview("");
                    }}
                    className="h-4 w-4 text-blue-600"
                  />
                  URL
                </label>
              </div>

              {thumbnailType === "upload" ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleThumbnailUpload(e.target.files?.[0])}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              ) : (
                <input
                  type="text"
                  placeholder="Enter thumbnail URL"
                  defaultValue={watchedThumbnail}
                  onChange={(e) => handleThumbnailUrl(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}

              {thumbnailPreview && (
                <div className="mt-3">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    width={200}
                    height={200}
                    className="rounded-lg border object-cover"
                  />
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Images
              </label>
              {imageFields?.map((img, i) => (
                <div
                  key={img.id}
                  className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={
                            (watchedImages?.[i]?.type || img.type) === "upload"
                          }
                          onChange={() =>
                            update(i, {
                              ...img,
                              type: "upload",
                              value: "",
                              preview: "",
                            })
                          }
                          className="h-4 w-4 text-blue-600"
                        />
                        Upload
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={
                            (watchedImages?.[i]?.type || img.type) === "url"
                          }
                          onChange={() =>
                            update(i, {
                              ...img,
                              type: "url",
                              value: "",
                              preview: "",
                            })
                          }
                          className="h-4 w-4 text-blue-600"
                        />
                        URL
                      </label>
                    </div>
                    <span className="text-xs text-gray-500">Image {i + 1}</span>
                  </div>

                  {(watchedImages?.[i]?.type || img.type) === "upload" ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(i, "upload", e.target.files?.[0])
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter image URL"
                      defaultValue={watchedImages?.[i]?.value || img.value || ""}
                      onChange={(e) => handleImageChange(i, "url", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}

                  <input
                    type="text"
                    placeholder="Image Alt Text"
                    defaultValue={watchedImages?.[i]?.alt || img.alt || ""}
                    onChange={(e) =>
                      update(i, { ...imageFields[i], alt: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  {watchedImages?.[i]?.preview || img.preview ? (
                    <div className="mt-3">
                      <Image
                        src={watchedImages?.[i]?.preview || img.preview}
                        alt={watchedImages?.[i]?.alt || img.alt || `image-${i}`}
                        width={80}
                        height={80}
                        className="rounded-lg border object-cover"
                      />
                    </div>
                  ) : null}

                  {imageFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(i)}
                      className="text-red-600 text-sm mt-2 hover:underline"
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Add Image
              </button>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Price
                </label>
                <input
                  type="number"
                  {...register("offerPrice")}
                  placeholder="Enter offer price"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular Price
                </label>
                <input
                  type="number"
                  {...register("regularPrice")}
                  placeholder="Enter regular price"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="flex gap-4 items-center bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Load
                      </label>
                      <input
                        {...register(`volume.${i}.load`, { required: true })}
                        type="text"
                        placeholder="e.g. 1kg, 500ml"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        {...register(`volume.${i}.price`, { required: true })}
                        type="number"
                        placeholder="Price"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {volumeFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVolume(i)}
                        className="text-red-600 font-medium hover:text-red-800"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendVolume({ load: "", price: "" })}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Add Volume
                </button>
              </div>
            </div>

            {/* Rich Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Description
              </label>
              <RichTextEditor
                value={descriptions}
                onChange={setDescriptions}
                placeholder="Type full product description…"
              />
              <div className="mt-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <ConverterToHtml
                  html={descriptions}
                  className="prose max-w-none text-sm"
                />
              </div>
            </div>

            {/* Rich Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Short Description
              </label>
              <RichTextEditor
                value={shortDescriptions}
                onChange={setShortDescriptions}
                placeholder="Type short product description…"
              />
              <div className="mt-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <ConverterToHtml
                  html={shortDescriptions}
                  className="prose max-w-none text-sm"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                {...register("stock")}
                placeholder="Enter stock quantity"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="regular">Regular</option>
                <option value="onSale">On Sale</option>
                <option value="new">New</option>
                <option value="hot">Hot</option>
              </select>
            </div>

            {/* Shipping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping
              </label>
              <select
                {...register("shipping_fee")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* Frequently Bought Together */}
            <div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFrBhtTogether(!frBhtTogether)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  {frBhtTogether
                    ? "Close Frequently Bought Together"
                    : "Add Frequently Bought Together"}
                </button>
                {frBhtTogether && (
                  <input
                    type="text"
                    placeholder="Search Products..."
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
              {frBhtTogether && (
                <div className="mt-4 max-h-80 overflow-y-auto border border-gray-200 rounded-lg bg-white p-4">
                  {frProducts?.length === 0 ? (
                    <div className="text-center text-gray-500">
                      No products found
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {frProducts?.map((product, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 p-3 border border-gray-200 rounded-lg"
                        >
                          <Image
                            src={product?.thumbnail?.secure_url}
                            alt={product?.slug}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <span className="flex-1 text-sm text-gray-700">
                            {product?.productName}
                          </span>
                          <button
                            type="button"
                            onClick={() => canCelSlug(product?.slug)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setMoreProducts(!moreProducts)}
                      className="text-blue-600 hover:underline"
                    >
                      {moreProducts ? "Close More Products" : "Add More Products"}
                    </button>
                    {moreProducts && (
                      <div className="mt-3 space-y-3">
                        {filterProducts?.map((product, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3 p-3 border border-gray-200 rounded-lg"
                          >
                            <Image
                              src={product?.thumbnail?.secure_url}
                              alt={product?.slug}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <span className="flex-1 text-sm text-gray-700">
                              {product?.productName}
                            </span>
                            <input
                              type="checkbox"
                              onClick={() => {
                                setProductSlugs([
                                  product?.slug,
                                  ...productSlugs,
                                ]);
                              }}
                              className="h-4 w-4 text-blue-600"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SEO Settings */}
            <div className="border-t pt-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                SEO Settings
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    {...register("seoTitle")}
                    placeholder="Enter SEO title"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Description
                  </label>
                  <textarea
                    {...register("seoDescription")}
                    placeholder="Enter SEO description"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    {...register("seoKeywords")}
                    placeholder="Enter SEO keywords (comma separated)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Image URL
                  </label>
                  <input
                    type="text"
                    {...register("seoImage")}
                    placeholder="Enter SEO image URL"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => dispatch(addCommonFlag("p-edit-form-close"))}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ProductEditForm;