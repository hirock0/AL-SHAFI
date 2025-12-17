import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import Category from "@/models/Products/Category/Category";
import { uploadToCloudinary } from "@/utils/cloudinary/cloudinary";

export async function POST(req) {
  try {
    const { name, image, status, imageAlt } = await req.json();

    await dbConnect();

    // ALT text fallback
    const altText = imageAlt || name || "Category image";

    let finalImage = {
      secure_url: "",
      public_id: "",
      alt: altText,
    };

    const isUrl = image?.startsWith("http://") || image?.startsWith("https://");

    // If base64 upload
    if (!isUrl && image) {
      const uploaded = await uploadToCloudinary({
        img: image,
        path: "Al-Safi/categories",
      });

      finalImage = {
        secure_url: uploaded.secure_url,
        public_id: uploaded.public_id,
        alt: altText,
      };
    }

    // If external URL
    if (isUrl && image) {
      finalImage = {
        secure_url: image,
        public_id: "external",
        alt: altText,
      };
    }

    // Create category
    const newCategory = new Category({
      name,
      image: finalImage,
      status,
    });

    const savedCategory = await newCategory.save();

    if (savedCategory) {
      return NextResponse.json({
        message: "Category uploaded successfully",
        success: true,
        category: savedCategory,
      });
    }

    return NextResponse.json({
      message: "Category not uploaded!",
      success: false,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const allCategories = await Category.find().lean().exec();

    return NextResponse.json({
      message: "Categories fetched successfully!",
      success: true,
      categories: allCategories,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message,
      success: false,
    });
  }
}
