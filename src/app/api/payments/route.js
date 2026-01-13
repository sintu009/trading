import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import Payment from '@/models/Payment'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    let query = {}
    if (userId) {
      query.userId = userId
    }
    
    const payments = await Payment.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Payments GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const { userId, amount, type, description } = await request.json()
    
    const user = await User.findById(userId)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const payment = await Payment.create({
      userId: userId,
      userEmail: user.email,
      userName: user.name,
      amount: parseFloat(amount),
      type: type || 'manual',
      status: 'completed',
      description: description || 'Payment transaction'
    })
    
    return NextResponse.json({ 
      message: 'Payment recorded successfully',
      paymentId: payment._id
    })
  } catch (error) {
    console.error('Payments POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
