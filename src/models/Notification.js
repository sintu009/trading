import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
})

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema)