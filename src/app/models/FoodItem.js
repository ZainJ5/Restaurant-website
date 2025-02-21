// models/FoodItem.js
import mongoose from "mongoose";

const VariationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const FoodItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: false }, // Marked as optional
    imageUrl: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    variations: [VariationSchema],
  },
  { timestamps: true }
);

if (mongoose.models.FoodItem) {
  delete mongoose.models.FoodItem;
}

export default mongoose.model("FoodItem", FoodItemSchema);
