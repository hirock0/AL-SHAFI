"use server";

import dbConnect from "@/lib/dbConnect/dbConnect";
import { FreeShippingAmount } from "@/models/Products/FreeShippingAmount";
export async function saveFreeShippingAmount(payload) {
  try {
    await dbConnect();
    const { key, value } = payload;
    const findAmount = await FreeShippingAmount.findOne({ key: key });
    if (!findAmount) {
      await FreeShippingAmount.create({
        key,
        value,
      });
    } else {
      await FreeShippingAmount.findOneAndUpdate(
        { key: key },
        { value: value },
        { upsert: true, new: true }
      );
    }

    return { success: true, message: "Update successfully" };
  } catch (error) {
    return { success: false, message: error?.message };
  }
}
