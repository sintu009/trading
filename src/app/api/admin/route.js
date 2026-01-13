import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import Notification from '@/models/Notification'

const ADMIN_CREDENTIALS = {
  email: 'admin@crypgo.com',
  password: 'admin123'
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    console.log('Admin POST request body:', body)
    const { action, ...data } = body

    if (action === 'login') {
      const { email, password } = data
      console.log('Login attempt:', { email, password })
      console.log('Expected:', ADMIN_CREDENTIALS)
      
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        console.log('Login successful')
        return NextResponse.json({ 
          message: 'Admin login successful',
          admin: { email: ADMIN_CREDENTIALS.email }
        })
      }
      console.log('Login failed - credentials mismatch')
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
    }

    if (action === 'addMoney') {
      const { userId, amount } = data
      
      // Handle cases where userId might be undefined or invalid format if needed
      // But findById usually handles strings.
      
      const user = await User.findById(userId)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      
      const addAmount = parseFloat(amount)
      
      // Update wallet
      user.wallet.balance += addAmount
      user.wallet.totalAdded = (user.wallet.totalAdded || 0) + addAmount
      
      user.wallet.transactions.push({
        date: new Date(),
        type: 'added',
        amount: addAmount,
        description: 'Money added by admin'
      })
      
      await user.save()
      
      return NextResponse.json({ 
        message: 'Money added successfully'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const users = await User.find({}).sort({ createdAt: -1 })
    const notifications = await Notification.find({}).sort({ createdAt: -1 })
    
    return NextResponse.json({ 
      users: users.map(u => ({ 
        id: u._id, 
        name: u.name, 
        email: u.email, 
        wallet: u.wallet,
        createdAt: u.createdAt 
      })),
      notifications
    })
  } catch (error) {
    console.error('Admin GET error:', error)
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 })
  }
}
