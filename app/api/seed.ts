import mongoose, { Document, Schema } from 'mongoose';

const MONGODB_URI = "mongodb+srv://saifatom:kBsRAfasYsAGtIY8@bwauditaggregator.yk8gw.mongodb.net/?retryWrites=true&w=majority&appName=BWAuditAggregator";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient: mongoose.Mongoose | null = null;
let cachedDb: mongoose.Connection | null = null;

async function dbConnect() {
  if (cachedClient && cachedDb) {
    console.log('Connected to MongoDB');
    return { client: cachedClient, db: cachedDb };
  }

  const client = await mongoose.connect(MONGODB_URI, {
    // Mongoose automatically uses the latest settings by default
    // No need to specify useNewUrlParser and useUnifiedTopology
  });
  
  cachedClient = client;
  cachedDb = client.connection;

  console.log('Connected to MongoDB');
  return { client: cachedClient, db: cachedDb };
}

// Define the Project schema and model within this script
interface IProject extends Document {
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
});

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

const seedData = async () => {
  try {
    await dbConnect();

    const projects = [
      {
        title: 'Project Alpha',
        url: 'https://example.com/project-alpha',
        imageUrl: 'https://via.placeholder.com/200',
        language: 'JavaScript',
        description: 'A comprehensive security audit for Project Alpha.',
        budget: '$5000',
        worktype: 'Security Audit',
        status: 'Open',
        startDate: new Date('2024-01-15T00:00:00Z'),
        endDate: new Date('2024-02-15T00:00:00Z'),
      },
      {
        title: 'Project Beta',
        url: 'https://example.com/project-beta',
        imageUrl: 'https://via.placeholder.com/200',
        language: 'Python',
        description: 'A detailed security review for Project Beta.',
        budget: '$6000',
        worktype: 'Full Audit',
        status: 'Pending',
        startDate: new Date('2024-03-01T00:00:00Z'),
        endDate: new Date('2024-04-01T00:00:00Z'),
      },
      // Add more projects here as needed
    ];

    await Project.insertMany(projects);
    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Close the database connection
    await mongoose.disconnect();
  }
};

seedData();
