"use client";
import { useForm } from "react-hook-form";
import { ImagePlus, Link2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
const BannerForm = () => {
  const router = useRouter();
  const { commonData } = useSelector((state) => state?.slice);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [mode, setMode] = useState("upload");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageFile = watch("image");
  const imageUrl = watch("imageUrl");

  useEffect(() => {
    if (commonData) {
      setValue("alt", commonData.alt || "");
      if (commonData.public_id && commonData.public_id !== "null") {
        setMode("url");
        setValue("imageUrl", commonData.secure_url);
      }
    }
  }, [commonData, setValue]);


  useEffect(() => {
    if (mode === "upload" && imageFile?.[0]) {
      const fileUrl = URL.createObjectURL(imageFile[0]);
      setPreview(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    }

    if (mode === "url" && imageUrl) {
      setPreview(imageUrl);
    }
  }, [imageFile, imageUrl, mode]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        alt: data.alt,
        type: mode,
        image:
          mode === "upload" ? await toBase64(data.image[0]) : data.imageUrl,
      };

      if (commonData) {
        const { data: res } = await axios.patch(
          `/pages/api/banner/${commonData._id}`,
          payload
        );
        if (res.success) {
          toast.success("Banner updated successfully!");
          router.refresh();
        } else {
          toast.error(res.message || "Failed to update banner");
        }
      } else {
        const { data: res } = await axios.post("/pages/api/banner", payload);
        if (res.success) {
          toast.success("Banner created successfully!");
          router.refresh();
          reset();
          setPreview(null);
        } else {
          toast.error(res.message || "Failed to create banner");
        }
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">
        {commonData ? "Update Banner" : "Create Banner"}
      </h2>

      <div className="flex gap-2 mb-5">
        <button
          type="button"
          onClick={() => {
            setMode("upload");
            setPreview(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
            mode === "upload" ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          <Upload size={16} /> Upload Image
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("url");
            setPreview(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
            mode === "url" ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          <Link2 size={16} /> Image URL
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mode === "upload" && (
          <div>
            <label className="block text-sm mb-1">Banner Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("image", {
                required: !commonData && "Image is required",
              })}
              className="w-full border rounded-lg p-2"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>
        )}

        {mode === "url" && (
          <div>
            <label className="block text-sm mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/banner.jpg"
              {...register("imageUrl", {
                required: !commonData && "Image URL is required",
              })}
              className="w-full border rounded-lg p-2"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Alt Text</label>
          <input
            type="text"
            placeholder="Banner description"
            {...register("alt", { required: "Alt text is required" })}
            className="w-full border rounded-lg p-2"
          />
          {errors.alt && (
            <p className="text-red-500 text-sm">{errors.alt.message}</p>
          )}
        </div>

        {preview && (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={800}
              height={400}
              className="w-full h-40 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <ImagePlus size={18} />{" "}
              {commonData ? "Update Banner" : "Save Banner"}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BannerForm;
