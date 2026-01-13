import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, default: 'manual' },
  status: { type: String, default: 'completed' },
  description: { type: String, default: 'Payment transaction' }
}, {
  timestamps: true
})

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema)
