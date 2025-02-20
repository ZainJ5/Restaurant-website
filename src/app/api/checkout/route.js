import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoose";
import Order from "@/app/models/Order";

export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()
    const newOrder = await Order.create(data)

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 })
  }
}