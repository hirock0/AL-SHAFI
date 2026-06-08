import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import UserOrder from "@/models/UserOrder.js";
export async function POST(req) {
  try {
    await dbConnect();
    const authHeader = req.headers.get("authorization");
    const expectedToken = process.env.STEADFAST_WEBHOOK_TOKEN;
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({
        message: "Unauthorized webhook request.",
        success: false,
      });
    }
    const body = await req.json();
    const { status, consignment_id } = body;
    if (!consignment_id) {
      return NextResponse.json({
        message: "Consignment Id not found",
        success: false,
      });
    }

    const updatedOrder = await UserOrder.findOneAndUpdate(
      { consignment_id: consignment_id },
      {
        $set: {
          status: status,
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({
        message: "Updated not status",
        success: false,
      });
    } else {
      return NextResponse.json({ message: "Updated status", success: true });
    }
  } catch (err) {
    return NextResponse.json({ message: err?.message, success: true });
  }
}
