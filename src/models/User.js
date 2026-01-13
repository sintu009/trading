import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  link: { type: String, default: null } 
})

const WalletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  totalAdded: { type: Number, default: 0 },
  totalUsed: { type: Number, default: 0 },
  transactions: [TransactionSchema]
})

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  wallet: { type: WalletSchema, default: () => ({}) },
  role: { type: String, default: 'user' },
  status: { type: String, default: 'active' }
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model('User', UserSchema)