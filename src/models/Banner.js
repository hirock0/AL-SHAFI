import mongoose from "mongoose";
const BannerSchema = new mongoose.Schema(
  {
    secure_url: { type: String, default: "" },
    public_id: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  { timestamps: true }
);
const Banner =
  mongoose.models.banners || mongoose.model("banners", BannerSchema);
export default Banner;
