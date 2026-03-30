import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;

if (
  !uri &&
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL !== "1"
) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2, // Keep minimum connections alive
  serverSelectionTimeoutMS: 15000, // Increased to 15 seconds
  socketTimeoutMS: 45000,
  connectTimeoutMS: 15000, // Increased connection timeout
  retryWrites: true,
  retryReads: true,
};

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // Return a dummy promise if MongoDB URI is not available (e.g., during build)
  clientPromise = Promise.reject(new Error("MongoDB URI not configured"));
} else if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
