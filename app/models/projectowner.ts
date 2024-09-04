import mongoose, { Schema, Document, Model } from 'mongoose';

interface ProjectOwnerDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId; 
  username: string;
  email: string;
  telegramId: string;
  password: string;
  role: 'projectowner'
}

// Define Project Owner schema
const ProjectOwnerSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telegramId: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'projectowner' }
}, { timestamps: true });

// Define Project Owner model
const ProjectOwner: Model<ProjectOwnerDocument> = 
  mongoose.models.ProjectOwner || mongoose.model<ProjectOwnerDocument>('ProjectOwner', ProjectOwnerSchema);

export { ProjectOwner };
