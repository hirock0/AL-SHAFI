import mongoose from "mongoose";

const freeShippingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const FreeShippingAmount =
  mongoose.models.free_shipping_amount ||
  mongoose.model("free_shipping_amount", freeShippingSchema);
