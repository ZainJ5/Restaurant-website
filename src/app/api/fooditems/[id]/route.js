import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoose";
import FoodItem from "@/app/models/FoodItem";

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const foodItem = await FoodItem.findById(id);
    if (!foodItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }
    await FoodItem.findByIdAndDelete(id);
    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ message: "Failed to delete item" }, { status: 500 });
  }
}
