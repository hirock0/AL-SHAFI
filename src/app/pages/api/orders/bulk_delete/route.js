import dbConnect from "@/lib/dbConnect/dbConnect";
import { NextResponse } from "next/server";
import UserOrder from "@/models/Order/UserOrder";
export async function POST(req) {
  try {
    await dbConnect();
    const ids = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No IDs provided",
      });
    }
    const deleteResponse = await UserOrder.deleteMany({
      _id: { $in: ids },
    });

    return NextResponse.json({
      message: "Deleted successfully",
      success: true,
      deletedCount: deleteResponse.deletedCount,
    });

  } catch (error) {
    return NextResponse.json({
      message: error.message,
      success: false,
    });
  }
}
