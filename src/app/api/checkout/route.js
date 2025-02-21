import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoose";
import Order from "@/app/models/Order";

function getId(idField) {
  if (typeof idField === "object" && idField !== null) {
    if (idField.$oid) return idField.$oid;
    if (idField._id) return getId(idField._id);
  }
  return idField;
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    console.log("Incoming order data:", data);

    if (data.items && Array.isArray(data.items)) {
      data.items = data.items.map((item, index) => {
        const menuId =
          item.id ||
          (item._id ? getId(item._id) : (item.cartItemId ? item.cartItemId.split('-')[0] : null));
        
        if (!menuId) {
          console.error(`Item at index ${index} is missing a menu id:`, item);
        }
        
        const idValue = menuId ? Number(menuId) : 0;
        if (!idValue) {
          console.error(
            `Converted menu id is falsy for item at index ${index}. Original menuId:`,
            menuId
          );
        }
        
        return {
          id: idValue,
          name: item.name || item.title || "",
          price: Number(item.price) || 0,
          type: item.type || ""
        };
      });
    }

    console.log("Transformed items:", data.items);

    const newOrder = await Order.create(data);
    const populatedOrder = await newOrder.populate("branch");
    console.log("Created Order:", populatedOrder);
    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}
