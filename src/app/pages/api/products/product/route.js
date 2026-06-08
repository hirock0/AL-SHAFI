import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import Product from "@/models/Products/Product";

import { uploadToCloudinary } from "@/utils/cloudinary/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      productName,
      thumbnail,
      thumbnailAlt,
      category,
      images = [],
      imagesAlt = [],
      offerPrice,
      regularPrice,
      volume = [],
      descriptions,
      shortDescriptions,
      stock,
      status,
      shipping_fee,
      frequentlyBoughtTogether,
      seoTitle,
      seoDescription,
      seoKeywords = [],
      seoImage,
    } = body;

    await dbConnect();

    // -----------------------------
    // Normalize SEO Keywords
    // -----------------------------
    let normalizedSeoKeywords = [];

    if (Array.isArray(seoKeywords)) {
      normalizedSeoKeywords = seoKeywords
        .filter((k) => typeof k === "string")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
    } else if (typeof seoKeywords === "string") {
      normalizedSeoKeywords = seoKeywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
    }

    // -----------------------------
    // THUMBNAIL
    // -----------------------------
    const isThumbnailUrl =
      typeof thumbnail === "string" &&
      (thumbnail.startsWith("http://") || thumbnail.startsWith("https://"));

    const thumbAltText = thumbnailAlt || productName || "Product thumbnail";

    let finalThumbnail = {
      secure_url: "",
      public_id: "",
      alt: thumbAltText,
    };

    if (!isThumbnailUrl && thumbnail) {
      const uploaded = await uploadToCloudinary({
        img: thumbnail,
        path: "Al-Safi/products/thumbnails",
      });

      finalThumbnail = {
        secure_url: uploaded.secure_url,
        public_id: uploaded.public_id,
        alt: thumbAltText,
      };
    } else if (isThumbnailUrl && thumbnail) {
      finalThumbnail = {
        secure_url: thumbnail,
        public_id: "null",
        alt: thumbAltText,
      };
    }

    // -----------------------------
    // IMAGES
    // -----------------------------
    const finalImages = await Promise.all(
      images.map(async (img, index) => {
        if (!img) return null;

        const isUrl = img.startsWith("http://") || img.startsWith("https://");

        const altText =
          (imagesAlt && imagesAlt[index]) ||
          productName ||
          `Product image ${index + 1}`;

        if (!isUrl) {
          const uploaded = await uploadToCloudinary({
            img,
            path: "Al-Safi/products/images",
          });

          return {
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id,
            alt: altText,
          };
        } else {
          return {
            secure_url: img,
            public_id: "null",
            alt: altText,
          };
        }
      })
    );

    const filteredImages = finalImages.filter(Boolean);

    // -----------------------------
    // CREATE PRODUCT
    // -----------------------------
    const newProduct = new Product({
      productName,
      thumbnail: finalThumbnail,
      category,
      images: filteredImages,
      offerPrice,
      regularPrice,
      volume,
      descriptions,
      shortDescriptions,
      stock,
      status,
      shipping_fee,
      frequentlyBoughtTogether,
      // SEO
      seoTitle,
      seoDescription,
      seoKeywords: normalizedSeoKeywords,
      seoImage,
    });

    const savedProduct = await newProduct.save();
    return NextResponse.json({
      message: savedProduct
        ? "Product uploaded successfully"
        : "Product not uploaded!",
      success: !!savedProduct,
      product: savedProduct || null,
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
    const finddAllProducts = await Product.find().lean().exec();
    return NextResponse.json({
      message: "Products found!",
      success: true,
      products: finddAllProducts,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || "Something went wrong",
      success: false,
    });
  }
}
