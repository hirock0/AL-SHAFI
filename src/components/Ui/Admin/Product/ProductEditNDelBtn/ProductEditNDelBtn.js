"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useForm, useFieldArray } from "react-hook-form";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import ConverterToHtml from "@/components/ConverterToHtml/ConverterToHtml";

/**
 * ProductEditNDelBtn
 *
 * - Uses react-hook-form for form state
 * - Uses useFieldArray for dynamic image fields
 * - Supports thumbnail upload (base64) OR URL
 * - Supports additional images (each can be upload or url)
 * - Integrates RichTextEditor (keeps descriptions in component state and syncs to form)
 * - Delete and Edit handlers using axios
 *
 * Notes:
 * - File inputs are intentionally uncontrolled (no `value` prop).
 * - Images are stored as base64 strings when uploaded (same behaviour as your original).
 */

const ProductEditNDelBtn = ({ type, product }) => {
  const router = useRouter();
  const prod = typeof product === "string" ? JSON.parse(product) : product;

  // local UI state
  const [editFlag, setEditFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  // description handled outside RHF because RichTextEditor gives string/html
  const [descriptions, setDescriptions] = useState(prod?.descriptions || "");

  // Thumbnail UI (upload vs url) and preview
  const [thumbnailType, setThumbnailType] = useState(
    prod?.thumbnail?.secure_url ? "url" : "upload"
  );
  const [thumbnailPreview, setThumbnailPreview] = useState(
    prod?.thumbnail?.secure_url || ""
  );

  // ------------------- React Hook Form -------------------
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
      thumbnail: prod?.thumbnail?.secure_url || "", // may be url or base64
      // images is array of objects { type: "url"|"upload", value: string, preview?: string, alt?: string }
      images:
        (prod?.images?.length > 0 &&
          prod.images.map((img) => ({
            type: "url",
            value: img.secure_url || "",
            preview: img.secure_url || "",
            alt: img.alt || "",
          }))) ||
        [{ type: "upload", value: "", preview: "", alt: "" }],
      offerPrice: prod?.offerPrice ?? "",
      regularPrice: prod?.regularPrice ?? "",
      stock: prod?.stock ?? 0,
      status: prod?.status || "regular",
      shipping_fee: prod?.shipping_fee || "free",
      seoTitle: prod?.seoTitle || "",
      seoDescription: prod?.seoDescription || "",
      seoKeywords: prod?.seoKeywords?.join(", ") || "",
      seoImage: prod?.seoImage || "",
    },
  });

  // field array for images
  const { fields: imageFields, append, remove, update } = useFieldArray({
    control,
    name: "images",
  });

  // watch necessary values
  const watchedImages = watch("images");
  const watchedThumbnail = watch("thumbnail");
  const watchedProductName = watch("productName");

  // ------------------- Helpers -------------------

  // convert file -> base64 and return Promise
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  // set thumbnail from file
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

  // set thumbnail from url input
  const handleThumbnailUrl = (url) => {
    const val = url || "";
    setValue("thumbnail", val);
    setThumbnailPreview(val || "");
  };

  // image field change: either file upload or url
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
        // url type
        update(index, {
          ...imageFields[index],
          type: "url",
          value: fileOrUrl || "",
          preview: fileOrUrl || "",
        });
      }

      // ensure form value for images is consistent
    } catch (err) {
      toast.error("Failed to read image file");
    }
  };

  // add new image field (default to upload)
  const addImageField = () =>
    append({ type: "upload", value: "", preview: "", alt: "" });

  // remove image field at index
  const removeImageField = (index) => {
    remove(index);
  };

  // ------------------- API handlers -------------------

  // delete product
  const deleteHandler = async () => {
    if (!prod?._id) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    try {
      const { data } = await axios.delete(`/pages/api/products/product/${prod._id}`);
      if (data?.success) {
        toast.success(data.message || "Deleted");
        router.refresh();
      } else {
        toast.warning(data.message || "Failed to delete");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // submit edited product
  const onSubmit = async (formValues) => {
    // ensure descriptions exist
    if (!descriptions || descriptions.trim() === "") {
      toast.warning("Description is required!");
      return;
    }

    // ensure productName
    if (!formValues.productName || !formValues.productName.trim()) {
      toast.warning("Product name is required!");
      return;
    }

    // ensure thumbnail
    if (!formValues.thumbnail || formValues.thumbnail === "") {
      toast.warning("Thumbnail is required!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        productName: formValues.productName,
        category: formValues.category,
        thumbnail: formValues.thumbnail, // base64 or url
        images: (formValues.images || [])
          .map((f) => f.value)
          .filter(Boolean),
        offerPrice: formValues.offerPrice,
        regularPrice: formValues.regularPrice,
        descriptions, // from rich editor state
        stock: Number(formValues.stock || 0),
        status: formValues.status,
        shipping_fee: formValues.shipping_fee,
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
        setEditFlag(false);
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

  // ------------------- Fetch categories -------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/pages/api/products/category", {
          headers: { "x-request-source": "12Hirock@" },
        });
        if (data?.success) setCategories(data.categories.filter((c) => c.status));
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // if `product` prop changes, reset form/defaults
  useEffect(() => {
    reset({
      productName: prod?.productName || "",
      category: prod?.category || "",
      thumbnail: prod?.thumbnail?.secure_url || "",
      images:
        (prod?.images?.length > 0 &&
          prod.images.map((img) => ({
            type: "url",
            value: img.secure_url || "",
            preview: img.secure_url || "",
            alt: img.alt || "",
          }))) ||
        [{ type: "upload", value: "", preview: "", alt: "" }],
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
    // sync descriptions and thumbnail preview
    setDescriptions(prod?.descriptions || "");
    setThumbnailPreview(prod?.thumbnail?.secure_url || "");
    setThumbnailType(prod?.thumbnail?.secure_url ? "url" : "upload");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, reset]);

  const baseBtn = "px-4 py-1 text-sm font-medium rounded-md shadow-sm transition-all";
  const styles =
    type === "Delete"
      ? `${baseBtn} bg-red-600 text-white hover:bg-red-700`
      : `${baseBtn} bg-green-600 text-white hover:bg-green-700`;

  // ------------------- Render -------------------
  return (
    <div>
      <button
        onClick={type === "Delete" ? deleteHandler : () => setEditFlag(true)}
        className={styles}
        disabled={loading}
      >
        {loading && type === "Delete" ? "Processing..." : type}
      </button>

      {type === "Edit" && editFlag && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative space-y-4 overflow-y-auto max-h-screen"
          >
            <h3 className="text-lg font-semibold">Edit Product</h3>

            {/* Product Name */}
            <input
              type="text"
              {...register("productName")}
              placeholder="Product Name"
              className="w-full p-2 border rounded"
              required
            />

            {/* Category */}
            <select {...register("category")} className="w-full p-2 border rounded">
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Thumbnail */}
            <div>
              <label className="font-medium">Thumbnail</label>
              <div className="flex gap-3 mt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={thumbnailType === "upload"}
                    onChange={() => {
                      setThumbnailType("upload");
                      // reset thumbnail in form to empty string (no controlled file value)
                      setValue("thumbnail", "");
                      setThumbnailPreview("");
                    }}
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
                  />
                  URL
                </label>
              </div>

              {thumbnailType === "upload" ? (
                // note: no value prop on file input
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleThumbnailUpload(e.target.files?.[0])}
                  className="w-full mt-2"
                />
              ) : (
                <input
                  type="text"
                  placeholder="Thumbnail URL"
                  defaultValue={watchedThumbnail}
                  onChange={(e) => handleThumbnailUrl(e.target.value)}
                  className="w-full p-2 border rounded mt-2"
                />
              )}

              {/* preview */}
              {thumbnailPreview ? (
                <div className="mt-2">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    width={200}
                    height={200}
                    className="rounded border object-cover"
                  />
                </div>
              ) : null}
            </div>

            {/* Additional Images */}
            <div>
              <label className="font-medium">Additional Images</label>

              {imageFields.map((img, i) => (
                <div key={img.id} className="mt-2 p-2 border rounded">
                  <div className="flex gap-3 items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={(watchedImages?.[i]?.type || img.type) === "upload"}
                        onChange={() =>
                          update(i, { ...img, type: "upload", value: "", preview: "" })
                        }
                      />
                      Upload
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={(watchedImages?.[i]?.type || img.type) === "url"}
                        onChange={() =>
                          update(i, { ...img, type: "url", value: "", preview: "" })
                        }
                      />
                      URL
                    </label>

                    <div className="ml-auto text-xs text-gray-500">
                      {i + 1}
                    </div>
                  </div>

                  {/* either file input or url input */}
                  {((watchedImages?.[i]?.type) || img.type) === "upload" ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(i, "upload", e.target.files?.[0])}
                      className="w-full mt-2"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Image URL"
                      defaultValue={watchedImages?.[i]?.value || img.value || ""}
                      onChange={(e) => handleImageChange(i, "url", e.target.value)}
                      className="w-full p-2 border rounded mt-2"
                    />
                  )}

                  {/* alt text */}
                  <input
                    type="text"
                    placeholder="Image Alt"
                    defaultValue={watchedImages?.[i]?.alt || img.alt || ""}
                    onChange={(e) =>
                      update(i, { ...imageFields[i], alt: e.target.value })
                    }
                    className="w-full p-2 border rounded mt-2"
                  />

                  {/* preview */}
                  {((watchedImages?.[i]?.preview) || img.preview) ? (
                    <div className="mt-2">
                      <Image
                        src={watchedImages?.[i]?.preview || img.preview}
                        alt={watchedImages?.[i]?.alt || img.alt || `image-${i}`}
                        width={80}
                        height={80}
                        className="rounded border object-cover"
                      />
                    </div>
                  ) : null}

                  {imageFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(i)}
                      className="text-red-600 text-xs mt-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addImageField}
                className="bg-green-600 text-white py-1 px-3 rounded mt-3"
              >
                Add Image
              </button>
            </div>

            {/* Prices */}
            <div className="flex gap-2">
              <input
                type="number"
                {...register("offerPrice")}
                placeholder="Offer Price"
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="number"
                {...register("regularPrice")}
                placeholder="Regular Price"
                className="w-1/2 p-2 border rounded"
              />
            </div>

            {/* Rich Description */}
            <div>
              <label className="font-medium">Product Description</label>
              <RichTextEditor
                value={descriptions}
                onChange={setDescriptions}
                placeholder="Type full product description…"
              />

              <div className="mt-2 border rounded p-2 bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <ConverterToHtml html={descriptions} className="prose max-w-none text-sm" />
              </div>
            </div>

            {/* Stock */}
            <input
              type="number"
              {...register("stock")}
              placeholder="Stock"
              className="w-full p-2 border rounded"
            />

            {/* Status */}
            <select {...register("status")} className="w-full p-2 border rounded">
              <option value="regular">Regular</option>
              <option value="onSale">On Sale</option>
              <option value="new">New</option>
              <option value="hot">Hot</option>
            </select>

            {/* Shipping */}
            <select {...register("shipping_fee")} className="w-full p-2 border rounded">
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>

            {/* SEO */}
            <div className="border-t pt-3 space-y-2">
              <h4 className="font-semibold text-gray-800 mb-2">SEO Settings</h4>

              <input
                type="text"
                {...register("seoTitle")}
                placeholder="SEO Title"
                className="w-full p-2 border rounded mb-2"
              />

              <textarea
                {...register("seoDescription")}
                placeholder="SEO Description"
                className="w-full p-2 border rounded mb-2"
                rows={3}
              />

              <input
                type="text"
                {...register("seoKeywords")}
                placeholder="SEO Keywords (comma separated)"
                className="w-full p-2 border rounded mb-2"
              />

              <input
                type="text"
                {...register("seoImage")}
                placeholder="SEO Image URL"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600"}`}
              >
                {loading ? "Saving…" : "Save"}
              </button>

              <button
                type="button"
                onClick={() => setEditFlag(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>

            <button
              type="button"
              onClick={() => setEditFlag(false)}
              className="absolute top-3 right-3 text-gray-500 text-xl"
              aria-label="close"
            >
              ✕
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductEditNDelBtn;
