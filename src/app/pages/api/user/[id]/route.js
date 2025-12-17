import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import User from "@/models/User/User";
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { role } = await req.json();
    await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          role: role === "user" ? "admin" : "user",
        },
      }
    );

    return NextResponse.json({
      message: "update successfuly",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || "Something went wrong",
      success: false,
    });
  }
}
export async function DELETE(_req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await User.findByIdAndDelete({ _id: id });
    return NextResponse.json({
      message: "delete successfuly",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || "Something went wrong",
      success: false,
    });
  }
}
