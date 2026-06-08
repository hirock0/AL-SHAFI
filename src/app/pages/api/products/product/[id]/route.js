import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import Product from "@/models/Products/Product.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/utils/cloudinary/cloudinary";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const {
      productName,
      category,
      thumbnail,
      thumbnailAlt,
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
      seoKeywords,
      seoImage,
    } = await req.json();

    await dbConnect();

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({
        message: "Product not found",
        success: false,
      });
    }
    const thumbAltText =
      thumbnailAlt ||
      productName ||
      existing.thumbnail?.alt ||
      "Product thumbnail";

    let finalThumbnail = existing.thumbnail;

    if (thumbnail && thumbnail !== existing.thumbnail?.secure_url) {
      const isUrl =
        thumbnail.startsWith("http://") || thumbnail.startsWith("https://");

      if (!isUrl) {
        if (existing.thumbnail?.public_id) {
          await deleteFromCloudinary(existing.thumbnail.public_id);
        }

        const uploaded = await uploadToCloudinary({
          img: thumbnail,
          path: "Al-Safi/products/thumbnails",
        });

        finalThumbnail = {
          secure_url: uploaded.secure_url,
          public_id: uploaded.public_id,
          alt: thumbAltText,
        };
      } else {
        finalThumbnail = {
          secure_url: thumbnail,
          public_id: "external",
          alt: thumbAltText,
        };
      }
    } else {
      finalThumbnail = {
        secure_url: existing.thumbnail.secure_url,
        public_id: existing.thumbnail.public_id,
        alt: thumbAltText,
      };
    }

    const finalImages = [];
    const existingMap = {};

    existing.images.forEach((img) => {
      existingMap[img.secure_url] = img;
    });

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img) continue;

      const isUrl = img.startsWith("http://") || img.startsWith("https://");

      const providedAlt =
        Array.isArray(imagesAlt) && imagesAlt[i] ? imagesAlt[i] : undefined;

      const altText =
        providedAlt ||
        existingMap[img]?.alt ||
        productName ||
        `Product image ${i + 1}`;

      if (!isUrl) {
        const uploaded = await uploadToCloudinary({
          img,
          path: "Al-Safi/products/images",
        });

        finalImages.push({
          secure_url: uploaded.secure_url,
          public_id: uploaded.public_id,
          alt: altText,
        });
      } else {
        if (existingMap[img]) {
          finalImages.push({
            secure_url: existingMap[img].secure_url,
            public_id: existingMap[img].public_id,
            alt: providedAlt || existingMap[img].alt || altText,
          });
          delete existingMap[img];
        } else {
          finalImages.push({
            secure_url: img,
            public_id: "external",
            alt: altText,
          });
        }
      }
    }

    for (const url in existingMap) {
      const img = existingMap[url];
      if (img.public_id && img.public_id !== "external") {
        await deleteFromCloudinary(img.public_id);
      }
    }

    existing.productName = productName || existing.productName;
    existing.category = category || existing.category;
    existing.thumbnail = finalThumbnail;
    existing.images = finalImages;
    existing.offerPrice = offerPrice ?? existing.offerPrice;
    existing.regularPrice = regularPrice ?? existing.regularPrice;
    existing.descriptions = descriptions || existing.descriptions;
    existing.shortDescriptions =
      shortDescriptions || existing.shortDescriptions;
    existing.stock = typeof stock === "number" ? stock : existing.stock;
    existing.status = status || existing.status;
    existing.shipping_fee = shipping_fee || existing.shipping_fee;
    existing.frequentlyBoughtTogether = frequentlyBoughtTogether || [];
    existing.volume = volume || [];

    if (seoTitle !== undefined) existing.seoTitle = seoTitle;
    if (seoDescription !== undefined) existing.seoDescription = seoDescription;
    if (seoKeywords !== undefined)
      existing.seoKeywords = Array.isArray(seoKeywords) ? seoKeywords : [];
    if (seoImage !== undefined) existing.seoImage = seoImage;

    const updated = await existing.save();

    return NextResponse.json({
      message: "Product updated successfully",
      success: true,
      product: updated,
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

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({
        message: "Product not found",
        success: false,
      });
    }

    // delete thumbnail
    if (
      existing.thumbnail?.public_id &&
      existing.thumbnail.public_id !== "external"
    ) {
      await deleteFromCloudinary(existing.thumbnail.public_id);
    }

    // delete images
    if (existing.images?.length) {
      for (const img of existing.images) {
        if (img.public_id && img.public_id !== "external") {
          await deleteFromCloudinary(img.public_id);
        }
      }
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
}
