import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crypgo'
let client
let db

export async function connectDB() {
  try {
    if (!client) {
      client = new MongoClient(uri)
      await client.connect()
      console.log('Connected to MongoDB Atlas')
    }
    if (!db) {
      db = client.db('crypgo')
    }
    return db
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}