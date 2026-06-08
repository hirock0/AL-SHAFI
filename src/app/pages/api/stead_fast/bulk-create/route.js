import UserOrder from "@/models/UserOrder.js";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const orders = await req.json();
    if (!orders || orders.length === 0) {
      return NextResponse.json({
        message: "No orders provided",
        success: false,
      });
    }
    const data = orders.map((order) => ({
      invoice: order.invoice,
      recipient_name: order.fullName || "N/A",
      recipient_address: order.addresses?.[0]?.address || "N/A",
      recipient_phone: order.phone || "",
      cod_amount: order.totals?.grandTotal || 0,
      note: order.note || "",
    }));

    const payload = { data: JSON.stringify(data) };
    const response = await fetch(
      `${process.env.STEADFAST_BASE_URL}/create_order/bulk-order`,
      {
        method: "POST",
        headers: {
          "Api-Key": process.env.STEADFAST_API_KEY,
          "Secret-Key": process.env.STEADFAST_SECRET_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const result = await response.json();
    const resultMap = {};
    (result?.data || []).forEach((item) => {
      const inv =
        item?.invoice || item?.Invoice || item?.invoice_id || item?.Invoice_id;
      if (inv) resultMap[inv] = item;
    });
    for (const order of orders) {
      const returned = resultMap[order.invoice];
      if (!returned) {
        continue;
      }

      const updateData = {
        status: "in_review",
      };
      updateData.consignment_id =
        returned.consignment_id || returned.consignmentId || null;
      updateData.tracking_code =
        returned.tracking_code || returned.trackingCode || null;
      await UserOrder.findByIdAndUpdate(order._id, { $set: updateData });
    }
    return NextResponse.json({
      message: "Orders updated successfully",
      success: true,
      orders: result,
    });
  } catch (error) {
    return NextResponse.json({ message: error?.message, success: false });
  }
}
