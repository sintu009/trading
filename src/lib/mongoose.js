import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in environment variables.')
  // throw new Error('Please define the MONGODB_URI environment variable')
} else {
  console.log('MONGODB_URI found:', MONGODB_URI.substring(0, 15) + '...')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (!MONGODB_URI) {
     throw new Error('Please define the MONGODB_URI environment variable')
  }

  if (cached.conn) {
    console.log('Using cached MongoDB connection')
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    console.log('Connecting to MongoDB...')
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB Connected Successfully')
      return mongoose
    }).catch(err => {
      console.error('MongoDB Connection Error:', err)
      throw err
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB