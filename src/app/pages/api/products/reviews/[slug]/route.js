import dbConnect from "@/lib/dbConnect/dbConnect";
import Review from "@/models/Products/Review.js";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const reviews = await Review.find({ slug, status: true })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    const formattedReviews = reviews.map((review) => ({
      ...review,
      _id: review._id.toString(),
    }));

    return NextResponse.json({
      message: "Reviews",
      success: true,
      reviews: formattedReviews,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message,
      success: false,
    });
  }
}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const { slug } = await params;
    const { status } = await req.json();

    const updatedReview = await Review.findByIdAndUpdate(
      { _id: slug },
      { status: status },
      { new: true }
    ).lean();

    if (!updatedReview) {
      return NextResponse.json({
        message: "Review not found",
        success: false,
      });
    }

    return NextResponse.json({
      message: "Review updated successfully",
      success: true,
      review: {
        ...updatedReview,
        _id: updatedReview._id.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || "Something went wrong",
      success: false,
    });
  }
}

export async function DELETE(_req, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    const deletedReview = await Review.findByIdAndDelete({ _id: slug }).lean();

    if (!deletedReview) {
      return NextResponse.json({
        message: "Review not found",
        success: false,
      });
    }

    return NextResponse.json({
      message: "Review deleted successfully",
      success: true,
      review: { ...deletedReview, _id: deletedReview._id.toString() },
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || "Something went wrong",
      success: false,
    });
  }
}
