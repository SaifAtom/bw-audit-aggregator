import mongoose, { Schema, Document, Model } from 'mongoose';

interface WardenDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId; 
  username: string;
  email: string;
  telegramId: string;
  password: string;
  role: 'warden'
}
// Define Warden model
const WardenSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telegramId: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'warden' }
}, { timestamps: true });

export const Warden: Model<WardenDocument> =
  mongoose.models.Warden || mongoose.model('Warden', WardenSchema);