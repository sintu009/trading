import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(request) {
  try {
    await connectDB()
    const { userId, amount, link, description } = await request.json()

    if (!userId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const deductAmount = parseFloat(amount)

    if (user.wallet.balance < deductAmount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    user.wallet.balance -= deductAmount
    user.wallet.totalUsed += deductAmount

    user.wallet.transactions.push({
      type: 'used',
      amount: deductAmount,
      description: description || 'Deduction',
      link: link || null
    })

    await user.save()

    return NextResponse.json({
      message: 'Amount deducted and transaction saved',
      wallet: user.wallet
    })

  } catch (error) {
    console.error('Deduction API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
