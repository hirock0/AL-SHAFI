import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import Product from "@/models/Products/Product.js";
export async function GET(_req, { params }) {
  try {
    const { slugs } = await params;
    const parseSlugs = JSON.parse(slugs);
    await dbConnect();
    const finddAllProducts = await Product.find({
      slug: { $in: parseSlugs },
    })
      .lean()
      .exec();

    const allSlugs = [
      ...new Set(
        finddAllProducts?.flatMap((p) => p?.frequentlyBoughtTogether || [])
      ),
    ];

    const finddAllProductsBySlugs = await Product.find({
      slug: { $in: allSlugs },
    })
      .lean()
      .exec();

    return NextResponse.json({
      message: "Products found!",
      success: true,
      products: finddAllProductsBySlugs,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || "Something went wrong",
      success: false,
    });
  }
}
