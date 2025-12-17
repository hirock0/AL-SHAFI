import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import UserOrder from "@/models/Order/UserOrder";
export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const invoicesQuery = url.searchParams.get("invoices");
    if (!invoicesQuery) {
      return NextResponse.json({
        message: "No slugs provided",
        success: false,
      });
    }
    const invoices = invoicesQuery.split(",");

    const resInvoices = await UserOrder.find({ invoice: { $in: invoices } })
      .lean()
      .exec();
    if (!resInvoices || resInvoices.length === 0) {
      return NextResponse.json({
        message: "No products found",
        success: false,
        products: [],
      });
    }
    const formattedOrders = resInvoices.map((o) => ({
      ...o,
      _id: o._id.toString(),
    }));

    return NextResponse.json({
      message: "Orders fetched successfully",
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || "Something went wrong",
      success: false,
    });
  }
}
