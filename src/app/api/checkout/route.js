import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoose";
import Order from "@/app/models/Order";

export async function POST(request) {
  try {
    // Ensure the MongoDB connection is established
    await connectDB();

    // Parse the JSON body from the request
    const data = await request.json();
    /*
      Expected data shape:
      {
        fullName,
        mobileNumber,
        alternateMobile,
        deliveryAddress,
        nearestLandmark,
        email,
        paymentInstructions,
        paymentMethod,
        changeRequest,
        items: [
          { id, name, price, ... }
        ],
        subtotal,
        tax,
        discount,
        total,
        promoCode
      }
    */

    // Create a new Order document from the data
    const order = new Order(data);

    // Save the order document to the database
    const savedOrder = await order.save();

    // Return a success response with the new order's ID
    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
