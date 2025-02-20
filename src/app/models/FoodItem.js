import mongoose from "mongoose";

const FoodItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.FoodItem ||
  mongoose.model("FoodItem", FoodItemSchema);
