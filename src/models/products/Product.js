import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

// Schema
const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    thumbnail: {
      secure_url: { type: String, default: "" },
      public_id: { type: String, default: "" },
      alt: { type: String, default: "" },
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },
    frequentlyBoughtTogether: [],

    images: [
      {
        secure_url: { type: String, default: "" },
        public_id: { type: String, default: "" },
        alt: { type: String, default: "" },
      },
    ],

    offerPrice: { type: Number, required: true },
    regularPrice: { type: Number, required: true },

    volume: [
      {
        load: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
      },
    ],
    descriptions: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescriptions: {
      type: String,
      required: true,
      trim: true,
    },

    stock: { type: Number, default: 0, min: 0 },
    total_sell: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["regular", "onSale", "new", "hot"],
      default: "regular",
    },

    shipping_fee: {
      type: String,
      enum: ["free", "paid"],
      default: "paid",
    },

    // ⭐ SEO Fields
    seoTitle: {
      type: String,
      default: "",
      trim: true,
    },

    seoDescription: {
      type: String,
      default: "",
      trim: true,
    },

    seoKeywords: {
      type: [String],
      default: [],
    },

    seoImage: {
      type: String,
      default: "",
    },

    reviews: [
      {
        userName: { type: String, default: "" },
        email: { type: String, default: "" },
        review: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre("save", function () {
  if (this.isModified("productName")) {
    this.slug = slugify(this.productName, {
      lower: true,
      strict: true,
      replacement: "-",
      trim: true,
    });
  }

  if (!this.seoTitle || this.seoTitle.trim().length === 0) {
    this.seoTitle = this.productName;
  }
});

const Product =
  mongoose.models.products || mongoose.model("products", productSchema);

export default Product;
