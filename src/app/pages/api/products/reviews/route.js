import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import Review from "@/models/Products/Review/Review";

export async function POST(req) {
  try {
    await dbConnect();
    const { slug, name, email, rating, comment } = await req.json();
    const preSave = await new Review({
      slug,
      name,
      email,
      rating: Number(rating),
      comment,
    });

    const savedReview = await preSave.save();

    return NextResponse.json({
      message: "Review uploaded",
      success: true,
      review: savedReview,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message,
      success: false,
    });
  }
}
