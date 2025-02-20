import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoose";
import Order from "@/app/models/Order";

export async function GET(request) {
  try {
    await connectDB();
    const orders = await Order.find({});
    const ordersPlain = orders.map((order) =>
      order.toObject({ getters: true })
    );
    return NextResponse.json(ordersPlain, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
