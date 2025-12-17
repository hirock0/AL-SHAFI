"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

const CatAddForm = ({ setAddFlag }) => {
  const router = useRouter();

  // ===============================
  // REACT-HOOK-FORM SETUP
  // ===============================
  const {
    register, // uncontrolled
    handleSubmit,
    control, // controlled
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      status: true,
      image: "",
      imageAlt: "",
      inputType: "upload", // "upload" or "url"
      urlInput: "",
    },
  });

  // local UI state
  const [preview, setPreview] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // reset file input

  const inputType = watch("inputType");
  const imageValue = watch("image");
  const urlInput = watch("urlInput");
  const imageAlt = watch("imageAlt");

  // ===============================
  // FILE HANDLER (controlled)
  // ===============================
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      setValue("image", b64, { shouldValidate: true });
      setPreview(b64);
    } catch (err) {
      toast.error("Failed to read image file");
    }
  };

  // URL input change (uncontrolled)
  const handleUrlChange = (e) => {
    const val = e.target.value || "";
    setValue("urlInput", val);
    setValue("image", val, { shouldValidate: true });
    setPreview(val || null);
  };

  // ===============================
  // INPUT TYPE SWITCH
  // ===============================
  useEffect(() => {
    if (inputType === "upload") {
      setValue("urlInput", "");
      setValue("image", "");
      setPreview(null);
      setFileInputKey(Date.now());
    } else {
      setValue("image", "");
      setValue("imageAlt", "");
      setPreview(null);
      setFileInputKey(Date.now());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputType]);

  // ===============================
  // SUBMIT HANDLER
  // ===============================
  const onSubmit = async (values) => {
    if (!values.name.trim()) {
      toast.warning("Category name is required!");
      return;
    }

    if (!values.image) {
      toast.warning("Category image is required!");
      return;
    }

    const payload = {
      name: values.name.trim(),
      status: !!values.status,
      image: values.image,
      imageAlt: values.imageAlt?.trim() || values.name.trim(),
    };

    try {
      const { data } = await axios.post("/pages/api/products/category", payload);

      if (data?.success) {
        toast.success(data.message || "Category added");

        // reset form & local state
        reset({
          name: "",
          status: true,
          image: "",
          imageAlt: "",
          inputType: "upload",
          urlInput: "",
        });
        setPreview(null);
        setFileInputKey(Date.now());

        router.refresh();
        setAddFlag(false);
      } else toast.warning(data?.message || "Failed to add category");
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    }
  };

  return (
    <div className="relative max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <button
        onClick={() => setAddFlag(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        aria-label="close"
      >
        ✕
      </button>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add New Category
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Category Name (uncontrolled) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="Enter category name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">Category name is required</p>}
        </div>

        {/* Upload vs URL */}
        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="upload"
              {...register("inputType")}
              checked={inputType === "upload"}
              onChange={() => setValue("inputType", "upload")}
            />
            Upload
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="url"
              {...register("inputType")}
              checked={inputType === "url"}
              onChange={() => setValue("inputType", "url")}
            />
            URL
          </label>
        </div>

        {/* Image Input */}
        {inputType === "upload" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            <input
              key={fileInputKey}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm border border-gray-300 rounded-lg p-2"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="text"
              {...register("urlInput")}
              value={urlInput}
              onChange={handleUrlChange}
              placeholder="Enter image URL"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Preview + Alt */}
        {preview && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preview
            </label>
            <div className="w-32 h-32 relative border rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt={imageAlt || watch("name") || "Category preview"}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Alt Text
              </label>
              <input
                type="text"
                {...register("imageAlt")}
                placeholder="Describe this image (SEO & accessibility)"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Status (controlled) */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                {...field}
                checked={field.value}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Active</span>
            </div>
          )}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition ${
            isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Saving..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default CatAddForm;
