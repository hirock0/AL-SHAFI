import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import Banner from "@/models/Banner/Banner";
import { uploadToCloudinary } from "@/utils/cloudinary/cloudinary";
export async function POST(req) {
  try {
    await dbConnect();
    const { alt, type, image } = await req.json();
    let payload = {};
    if (type === "upload") {
      const uploadImage = await uploadToCloudinary({
        img: image,
        path: "/Al-Safi/banners",
      });
      payload = {
        secure_url: uploadImage?.secure_url,
        public_id: uploadImage?.public_id,
        alt: alt,
      };
    } else {
      payload = {
        secure_url: image,
        public_id: "null",
        alt: alt,
      };
    }

    const presavedBanner = await new Banner(payload);
    await presavedBanner.save();
    return NextResponse.json({
      message: "Image upload successfull",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message,
      success: false,
    });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const banners = await Banner.find().lean().exec();
    return NextResponse.json({
      message: "Products found!",
      success: true,
      banners: banners,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || "Something went wrong",
      success: false,
    });
  }
}
