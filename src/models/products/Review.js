import mongoose from "mongoose";
const ReviewSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: false,
      index: true,
    },

    name: {
      type: String,
      required: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      default: "",
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    comment: {
      type: String,
      required: true,
      default: "",
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Review =
  mongoose.models.reviews || mongoose.model("reviews", ReviewSchema);

export default Review;
