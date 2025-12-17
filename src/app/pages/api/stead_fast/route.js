import axios from "axios";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import Order from "@/models/Order/Order";
import Product from "@/models/Products/Product/Product";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function randomSuffix(len = 6) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789_-";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

async function generateUniqueInvoice() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  for (let i = 0; i < 5; i++) {
    const candidate = `${datePart}-${randomSuffix(6)}`;
    return candidate;
  }
  return `${datePart}-${randomSuffix(10)}`;
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { items, flag, orderId, order, userId } = body;
    const invoiceId = await generateUniqueInvoice();
    if (flag === "admin") {
      const payload = order;
      const { data } = await axios.post(
        `${process.env.STEADFAST_BASE_URL}//create_order`,
        payload,
        {
          timeout: 15000,
          headers: {
            "Api-Key": process.env.STEADFAST_API_KEY,
            "Secret-Key": process.env.STEADFAST_SECRET_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      if (data?.status === 200) {
        const update = {
          $set: {
            consignmentId: data?.consignment?.consignment_id,
            status: data?.consignment?.status,
          },
        };
        await Order.findByIdAndUpdate({ _id: orderId }, update);
        return NextResponse.json({
          message: "Product created",
          success: true,
          order: data,
        });
      } else {
        return NextResponse.json({
          message: "Product not created",
          success: false,
        });
      }
    } else {
      const payload = {
        invoice: invoiceId,
        recipient_name: `${body?.customer?.firstName}  ${body?.customer?.lastName}`,
        recipient_phone: body?.customer?.phone,
        alternative_phone: null,
        recipient_email: body?.customer?.email,
        recipient_address: body?.customer?.address,
        cod_amount: body?.amounts?.total,
        note: body?.note,
        item_description: "",
        total_lot: body?.items.reduce((sum, i) => sum + i.qty, 0),
        delivery_type: 0,
      };
      const dbPayload = {
        userId: userId,
        consignment: payload,
        consignmentId: null,
        items: items,
        amounts: body?.amounts,
        note: body?.note,
        deliveryVia: body?.deliveryVia,
        payment: body?.payment,
        status: "pending",
      };

      const preSaved = new Order(dbPayload);
      const saved = await preSaved?.save();
      for (const it of body.items) {
        if (!it._id) continue;
        const pid = it._id;
        await Product.updateOne(
          { _id: pid },
          { $inc: { stock: -Math.abs(Number(it.qty || 0)) } }
        );
      }

      return NextResponse.json({
        message: "Product created",
        success: true,
        order: saved,
      });
    }
  } catch (err) {
    return NextResponse.json({
      message: "Product not created",
      success: false,
      error: err?.message,
    });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const response = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      message: "Products found",
      success: true,
      orders: response,
    });
  } catch (err) {
    return NextResponse.json({
      message: err?.message,
      success: false,
    });
  }
}
