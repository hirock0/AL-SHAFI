import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import { cookies } from "next/headers";
export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    return NextResponse.json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || "Something went wrong",
      success: false,
    });
  }
}
