import mongoose from "mongoose";
const UserOrderSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
      unique: true,
      default: function () {
        return `INV-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      },
    },
    consignment_id: { type: Number, default: "" },
    tracking_code: { type: String, default: "" },
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    addresses: [],
    items: [],
    note: { type: String, default: "" },
    totals: {},
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);
const UserOrder =
  mongoose.models.userorders || mongoose.model("userorders", UserOrderSchema);
export default UserOrder;
