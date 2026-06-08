// models/Category.js
import mongoose from "mongoose";
import slugify from "slugify";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    image: {
      secure_url: { type: String, default: null },
      public_id: { type: String, default: null },
      alt: { type: String, default: null },
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

CategorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
});

const Category =
  mongoose.models.categories || mongoose.model("categories", CategorySchema);

export default Category;
