import mongoose from "mongoose";

const WalletLinkSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false, // soft delete flag
    },
  },
  { timestamps: true }
);

export default mongoose.models.WalletLink ||
  mongoose.model("WalletLink", WalletLinkSchema);
