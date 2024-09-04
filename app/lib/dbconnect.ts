import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient: mongoose.Mongoose | null = null;
let cachedDb: mongoose.Connection | null = null;

async function dbConnect() {
  if (cachedClient && cachedDb) {
    console.log(`Connected to database: ${cachedDb.name}`);
    return { client: cachedClient, db: cachedDb };
  }

  const client = await mongoose.connect(MONGODB_URI, {
  });

  cachedClient = client;
  cachedDb = client.connection;

  console.log(`Connected to database: ${cachedDb.name}`);

  return { client: cachedClient, db: cachedDb };
}

export default dbConnect;
