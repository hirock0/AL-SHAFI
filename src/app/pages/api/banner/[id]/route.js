import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import Banner from "@/models/Banner.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/utils/cloudinary/cloudinary";
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { alt, type, image } = await req.json();
    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json({ message: "Banner not found", success: false });
    }
    let payload = {};
    if (alt) payload.alt = alt;
    if (type === "upload" && image) {
      if (banner.public_id && banner.public_id !== "null") {
        await deleteFromCloudinary(banner.public_id);
      }
      const uploaded = await uploadToCloudinary({
        img: image,
        path: "/Al-Safi/banners",
      });
      payload.secure_url = uploaded.secure_url;
      payload.public_id = uploaded.public_id;
    }
    if (type === "url" && image) {
      if (banner.public_id && banner.public_id !== "null") {
        await deleteFromCloudinary(banner.public_id);
      }
      payload.secure_url = image;
      payload.public_id = "null";
    }
    await Banner.findByIdAndUpdate(id, payload, { new: true });
    return NextResponse.json({
      message: "Banner updated successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message,
      success: false,
    });
  }
}

export async function DELETE(_req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const banner = await Banner.findById(id).lean().exec();
    if (!banner) {
      return NextResponse.json({ message: "Banner not found", success: false });
    }

    if (banner.public_id && banner.public_id !== "null") {
      await deleteFromCloudinary(banner.public_id);
    }

    await Banner.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Banner deleted successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
}
