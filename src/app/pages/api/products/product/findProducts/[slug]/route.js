import dbConnect from "@/lib/dbConnect/dbConnect";
import Product from "@/models/Products/Product.js";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
  const { slug } = await params;
  try {
    await dbConnect();
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return NextResponse.json({
        message: "Product not found",
        success: false,
      });
    }
    return NextResponse.json({
      message: "Product found",
      success: true,
      product,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || "Something went wrong",
      success: false,
    });
  }
}
