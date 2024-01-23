import { MongoClient, Db, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://Dezina:dzi123**@cluster0-sosgh.mongodb.net/next?retryWrites=true&w=majority';

const options = {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
};

let cachedDb: Db | null = null;

export const connectToDatabase = async (): Promise<Db> => {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri, options);

  try {
    await client.connect();
    cachedDb = client.db();
    return cachedDb;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export interface Message {
  _id?: ObjectId;
  userId: ObjectId;
  receiverId: ObjectId; // New field for the receiver's user ID
  username: string;
  message: string;
  timestamp?: Date;
  groupId?: ObjectId;
}

export interface Group {
  _id?: ObjectId;
  groupName: string;
  members: string[];
  createdById: ObjectId;
  timestamp?: Date;
}

export interface GroupMessage {
  _id?: ObjectId;
  userId: ObjectId;
  groupId: string;
  username: string;
  message: string;
  timestamp?: Date;
}
