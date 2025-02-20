// /app/models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    alternateMobile: { type: String },
    deliveryAddress: { type: String },
    nearestLandmark: { type: String },
    email: { type: String },
    paymentInstructions: { type: String },
    paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
    changeRequest: { type: String },
    items: [
      {
        id: { type: Number },
        name: { type: String },
        price: { type: Number },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, required: true },
    total: { type: Number, required: true },
    promoCode: { type: String },
    isGift: { type: Boolean, default: false },
    giftMessage: { type: String },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
