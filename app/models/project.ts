import mongoose, { Document, Schema } from 'mongoose';

interface IProject extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  url: string;
  imageUrl: string;
  language?: 'JavaScript' | 'Python' | 'Java' | 'C#' | 'Rust' | 'Go' | 'TypeScript' | 'Solidity' | 'Move';
  description: string;
  budget: string;
  worktype: 'Security Audit' | 'Contract Audit' | 'Full Audit' | 'Invariant Testing';
  status: 'Pending' | 'Open' | 'Closed' | 'On Hold';
  startDate: Date;
  endDate?: Date | null;
  createdAt: Date;
  owner: mongoose.Schema.Types.ObjectId; // Reference to ProjectOwner
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  imageUrl: { type: String, required: true },
  language: { type: String, enum: ['JavaScript', 'Python', 'Java', 'C#', 'Rust', 'Go', 'TypeScript', 'Solidity', 'Move'], required: false },
  description: { type: String, required: true },
  budget: { type: String, required: true },
  worktype: { type: String, enum: ['Security Audit', 'Contract Audit', 'Full Audit', 'Invariant Testing'], required: true },
  status: { type: String, enum: ['Pending', 'Open', 'Closed', 'On Hold'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectOwner', required: true } // Reference field
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
