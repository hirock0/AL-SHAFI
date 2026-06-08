import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import Product from "@/models/Products/Product";

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
