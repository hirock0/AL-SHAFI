import dbConnect from "@/lib/dbConnect/dbConnect";
import { NextResponse } from "next/server";
import * as jose from "jose";
import User from "@/models/User.js";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth_token");
    if (!tokenCookie) {
      return NextResponse.json(
        { message: "Auth token not found", success: false },
      );
    }
    const token = tokenCookie.value;
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const user = await User.findById(payload?.id)
      .select("-password")
      .lean()
      .exec();

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },

      );
    }
    return NextResponse.json({
      message: "Token decoded successfully",
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Token verification failed", success: false },
    );
  }
}
