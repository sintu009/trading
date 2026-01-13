import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import { SignJWT } from 'jose'          // ← better than jsonwebtoken in 2025+

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

function validateEmail(email) { /* same */ }
function sanitizeInput(input) { /* same, maybe improve */ }

export async function POST(request) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const sEmail = sanitizeInput(email)
    const sPassword = sanitizeInput(password)

    if (!sEmail || !sPassword || !validateEmail(sEmail)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const user = await User.findOne({ email: sEmail }).select('+password').lean()
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(sPassword, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create short-lived JWT
    const token = await new SignJWT({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      // role: user.role,    // ← add if you have roles
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')           // short lived
      .sign(JWT_SECRET)

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
        // NO wallet here
      }
    })

    // Set httpOnly cookie (most secure & common pattern)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60, // 2 hours
      path: '/'
    })

    return response

  } catch (err) {
    console.error('Login failed', err)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}