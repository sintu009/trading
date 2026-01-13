import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import Notification from '@/models/Notification'

const MIN_PASSWORD_LENGTH = 8

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return ''
  return input.trim().replace(/[\x00-\x1F\x7F]/g, '') // remove control characters
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const sEmail = sanitizeInput(email)
    const sPassword = sanitizeInput(password)
    const sName = sanitizeInput(name)

    if (!sEmail || !sPassword || !sName) {
      return NextResponse.json({ error: 'Fields cannot be empty' }, { status: 400 })
    }

    if (!validateEmail(sEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (sPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({ email: sEmail }).lean()
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const salt = await bcrypt.genSalt(12)           // ← increased
    const hashedPassword = await bcrypt.hash(sPassword, salt)

    const newUser = await User.create({
      email: sEmail,
      password: hashedPassword,
      name: sName,
      wallet: {
        balance: 0,
        totalAdded: 0,
        totalUsed: 0,
        transactions: []
      }
    })

    // Fire-and-forget notification (don't block response)
    Notification.create({
      message: `New user: ${sName} (${sEmail})`,
      type: 'info'
    }).catch(err => console.error('Notification failed:', err))

    // Minimal safe response
    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name
        // NO wallet here
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)

    // Never leak internal error details in production
    const isDev = process.env.NODE_ENV !== 'production'
    const errorMessage = isDev
      ? `Server error: ${error.message}`
      : 'Something went wrong. Please try again later.'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}