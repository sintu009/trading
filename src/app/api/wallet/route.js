import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ wallet: user.wallet })
  } catch (error) {
    console.error('Wallet GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const { userId, amount } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const addAmount = parseFloat(amount)
    
    // Update wallet
    user.wallet.balance += addAmount
    
    // Also updating totalAdded as it seems relevant based on Admin route logic, though original wallet route didn't have it.
    // I'll leave it as balance only to match original behavior, but using Mongoose save.
    
    await user.save()
    
    return NextResponse.json({ 
      message: 'Balance updated',
      wallet: user.wallet
    })
  } catch (error) {
    console.error('Wallet POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
