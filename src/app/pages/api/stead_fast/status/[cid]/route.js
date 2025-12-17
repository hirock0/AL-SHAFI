import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/lib/dbConnect/dbConnect";

export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const { cid } = await params;
    const baseUrl = process.env.STEADFAST_BASE_URL;
    const apiKey = process.env.STEADFAST_API_KEY;
    const apiSecret = process.env.STEADFAST_SECRET_KEY;
    if (!baseUrl || !apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, message: "SteadFast credentials not configured" },
        { status: 500 }
      );
    }
    const { data } = await axios.get(
      `${baseUrl}/status_by_cid/${cid.toString()}`,
      {
        headers: {
          "Api-Key": apiKey,
          "Secret-Key": apiSecret,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error?.message || "Something went wrong",
    });
  }
}
