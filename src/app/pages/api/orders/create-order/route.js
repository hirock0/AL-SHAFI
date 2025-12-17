import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/dbConnect";
import UserOrder from "@/models/Order/UserOrder";
export async function POST(req) {
  try {
    await dbConnect();
    const {
      fullName,
      email,
      phone,
      address,
      district,
      city,
      note,
      items,
      fixedAddress,
      totals,
    } = await req.json();
    const address1 = { address };
    const address2 = { district: district, city: city };
    const addreess3 = {
      division: fixedAddress?.divisionName,
      district: fixedAddress?.districtName,
      city: fixedAddress?.upazilaName,
    };
    const payload = {
      fullName: fullName,
      email: email,
      phone: phone,
      addresses: [address1, address2, addreess3],
      items: items,
      note: note,
      totals: totals,
    };
    const preSaved = await new UserOrder(payload);
    const savedSaved = await preSaved.save();
    return NextResponse.json({
      message: "Order cteated successfully",
      success: true,
      orders: savedSaved,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message,
      success: false,
    });
  }
}
