import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import User from "@/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
const COOKIE_NAME = "auth_token";
export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: "Invalid email or password",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const res = NextResponse.json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    res.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    return NextResponse.json({
      message: error?.message || "Something went wrong",
      success: false,
    });
  }
}
