import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "" },
    consignment: {},
    consignmentId: { type: Number, default: null },
    items: [],
    amouts: {},
    note: { type: String, default: "" },
    deliveryVia: { type: String, default: "" },
    payment: { type: String, default: "" },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);
const Order = mongoose.models.orders || mongoose.model("orders", OrderSchema);
export default Order;