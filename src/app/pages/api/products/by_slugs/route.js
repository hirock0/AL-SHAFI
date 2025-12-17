import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import Product from "@/models/Products/Product/Product";
export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const slugsQuery = url.searchParams.get("slugs");
    if (!slugsQuery) {
      return NextResponse.json({
        message: "No slugs provided",
        success: false,
      });
    }
    const slugs = slugsQuery.split(",");
    
    const products = await Product.find({ slug: { $in: slugs } }).lean();
    if (!products || products.length === 0) {
      return NextResponse.json({
        message: "No products found",
        success: false,
        products: [],
      });
    }
    const formattedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json({
      message: "Products fetched successfully",
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching products by slugs:", error);
    return NextResponse.json(
      { message: error?.message || "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
