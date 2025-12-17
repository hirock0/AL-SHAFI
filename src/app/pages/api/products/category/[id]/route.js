import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import Category from "@/models/Products/Category/Category.js";


import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/utils/cloudinary/cloudinary";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;

    const { name, image, status, imageAlt } = await req.json();

    await dbConnect();

    const existing = await Category.findById(id);
    if (!existing) {
      return NextResponse.json({
        message: "Category not found",
        success: false,
      });
    }

    // Decide final alt
    const nextAlt =
      imageAlt ||
      existing.image?.alt ||
      name ||
      existing.name ||
      "Category image";

    // Start with current image
    let finalImage = {
      secure_url: existing.image?.secure_url || null,
      public_id: existing.image?.public_id || null,
      alt: nextAlt,
    };

    // If image changed, handle upload / external URL
    if (image && image !== existing.image?.secure_url) {
      const isUrl = image.startsWith("http://") || image.startsWith("https://");

      if (!isUrl) {
        // Base64 image: upload new and delete old
        if (existing.image?.public_id) {
          await deleteFromCloudinary(existing.image.public_id);
        }

        const uploaded = await uploadToCloudinary({
          img: image,
          path: "Al-Safi/categories",
        });

        finalImage = {
          secure_url: uploaded.secure_url,
          public_id: uploaded.public_id,
          alt: nextAlt,
        };
      } else {
        // External URL: delete old Cloudinary image if needed
        if (
          existing.image?.public_id &&
          existing.image.public_id !== "external"
        ) {
          await deleteFromCloudinary(existing.image.public_id);
        }

        finalImage = {
          secure_url: image,
          public_id: "external",
          alt: nextAlt,
        };
      }
    }

    // Update document fields
    existing.name = name || existing.name;
    existing.image = finalImage;
    existing.status = typeof status === "boolean" ? status : existing.status;

    const updated = await existing.save();

    return NextResponse.json({
      message: "Category updated successfully",
      success: true,
      category: updated,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;

    await dbConnect();

    const existing = await Category.findById(id);
    if (!existing) {
      return NextResponse.json({
        message: "Category not found",
        success: false,
      });
    }

    if (existing.image?.public_id && existing.image.public_id !== "external") {
      await deleteFromCloudinary(existing.image.public_id);
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Category deleted successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
}
