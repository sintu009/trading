import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import WalletLink from "@/models/WalletLink";

export async function PUT(req, context) {
  try {
    const { id } = await context.params; // ✅ FIX
    await connectDB();

    const body = await req.json();

    const updated = await WalletLink.findByIdAndUpdate(
      id,
      {
        link: body.link,
        isActive: body.isActive,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req, context) {
  try {
    const { id } = await context.params; // ✅ FIX
    await connectDB();

    await WalletLink.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    return NextResponse.json({
      success: true,
      message: "Wallet link deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

