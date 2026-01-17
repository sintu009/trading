import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import WalletLink from "@/models/WalletLink";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const walletLink = await WalletLink.create({
      link: body.link,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json(
      { success: true, data: walletLink },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await connectDB();

    const links = await WalletLink.find({ isDeleted: false })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
