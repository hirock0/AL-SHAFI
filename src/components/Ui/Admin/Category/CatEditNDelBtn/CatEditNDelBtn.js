"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";

const CatEditNDelBtn = ({ type, cat }) => {
  const router = useRouter();
  const category = typeof cat === "string" ? JSON.parse(cat) : cat;

  const [editFlag, setEditFlag] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Image preview
  const [preview, setPreview] = useState(category?.image?.secure_url || null);

  // 🔹 Upload or URL selection
  const [inputType, setInputType] = useState(
    category?.image?.secure_url ? "url" : "upload"
  );

  // ===============================
  // ⭐ REACT HOOK FORM INITIALIZATION
  // ===============================
  const {
    register, // 👉 uncontrolled fields
    handleSubmit,
    control, // 👉 controlled fields via <Controller/>
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: category?.name || "",
      status:
        typeof category?.status === "boolean" ? category.status : true,
      image: category?.image?.secure_url || "",
      imageAlt: category?.image?.alt || category?.name || "",
      urlInput: category?.image?.secure_url || "",
    },
  });

  const watchImage = watch("image");

  // ===============================
  // ⭐ FILE HANDLER
  // ===============================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setValue("image", result); // controlled via RHF
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // ===============================
  // ⭐ URL HANDLER
  // ===============================
  const handleUrlChange = (e) => {
    const value = e.target.value;
    setValue("urlInput", value);
    setValue("image", value);
    setPreview(value || null);
  };

  // ===============================
  // ⭐ DELETE HANDLER
  // ===============================
  const deleteHandler = async () => {
    if (!category?._id) return;

    if (!window.confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    try {
      const { data } = await axios.delete(
        `/pages/api/products/category/${category._id}`
      );

      if (data?.success) {
        toast.success(data.message);
        router.refresh();
      } else toast.warning(data.message);
    } catch (err) {
      toast.error(err?.message || "Delete failed!");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ⭐ EDIT SUBMIT HANDLER (RHF)
  // ===============================
  const onSubmit = async (formData) => {
    if (!formData.image) {
      toast.warning("Image is required!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        status: formData.status,
        image: formData.image,
        imageAlt: formData.imageAlt,
      };

      const { data } = await axios.patch(
        `/pages/api/products/category/${category._id}`,
        payload
      );

      if (data?.success) {
        toast.success(data.message);
        setEditFlag(false);
        router.refresh();
      } else toast.warning(data.message);
    } catch (err) {
      toast.error(err?.message || "Update failed!");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // BUTTON STYLES
  // ===============================
  const base =
    "px-4 py-1 text-sm font-medium rounded-md shadow-sm transition-all duration-200";
  const styles =
    type === "Delete"
      ? `${base} bg-red-600 text-white hover:bg-red-700`
      : `${base} bg-green-600 text-white hover:bg-green-700`;

  return (
    <div>
      <button
        onClick={type === "Delete" ? deleteHandler : () => setEditFlag(true)}
        className={styles}
        disabled={loading}
      >
        {loading ? "Processing..." : type}
      </button>

      {/* =============================== */}
      {/* EDIT MODAL */}
      {/* =============================== */}
      {type === "Edit" && editFlag && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg p-6 w-full max-w-md relative"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Category</h3>

            {/* UNCONTROLLED — Name */}
            <input
              {...register("name")}
              className="w-full border p-2 rounded mb-4"
              placeholder="Category Name"
            />

            {/* Controlled — Status (checkbox) */}
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 mb-4">
                  <input type="checkbox" {...field} checked={field.value} />
                  Active
                </label>
              )}
            />

            {/* Image Type Options */}
            <div className="flex gap-4 mb-3">
              <label>
                <input
                  type="radio"
                  checked={inputType === "upload"}
                  onChange={() => {
                    setInputType("upload");
                    setValue("image", "");
                    setPreview(null);
                  }}
                />{" "}
                Upload
              </label>

              <label>
                <input
                  type="radio"
                  checked={inputType === "url"}
                  onChange={() => {
                    setInputType("url");
                    setValue("image", "");
                    setPreview(null);
                  }}
                />{" "}
                URL
              </label>
            </div>

            {/* UPLOAD */}
            {inputType === "upload" && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm mb-3"
              />
            )}

            {/* UNCONTROLLED — URL */}
            {inputType === "url" && (
              <input
                {...register("urlInput")}
                className="w-full border p-2 rounded mb-4"
                placeholder="Image URL"
                onChange={handleUrlChange}
              />
            )}

            {/* UNCONTROLLED — Alt Field */}
            <input
              {...register("imageAlt")}
              className="w-full border p-2 rounded mb-4"
              placeholder="Image Alt Text"
            />

            {/* Preview */}
            {preview && (
              <Image
                src={preview}
                alt="Preview"
                width={120}
                height={120}
                className="rounded border mb-4"
              />
            )}

            {/* Save + Cancel */}
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditFlag(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-3 right-3"
              onClick={() => setEditFlag(false)}
              type="button"
            >
              ✕
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CatEditNDelBtn;
