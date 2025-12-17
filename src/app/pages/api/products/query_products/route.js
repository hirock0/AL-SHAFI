import dbConnect from "@/lib/dbConnect/dbConnect";
import Product from "@/models/Products/Product/Product";
import { NextResponse } from "next/server";
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    if (!query || query.trim() === "") {
      return NextResponse.json({
        success: true,
        products: [],
      });
    }

    const products = await Product.find({
      $or: [
        { productName: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
        { seoTitle: { $regex: query, $options: "i" } },
      ],
      status: "onSale",
    })
      .select("productName thumbnail offerPrice regularPrice slug category")
      .limit(10)
      .lean()
      .exec();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}
