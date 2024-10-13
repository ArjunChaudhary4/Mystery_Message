// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import UserModel from "@/model/User";
import { MongoClient, ServerApiVersion } from "mongodb";
import bcrypt from "bcryptjs";
// import { useRouter } from "next/navigation";
import { Document } from 'mongoose';
import { redirect } from 'next/navigation';



import dbConnect from "./dbconnect";
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default client;



export interface User extends Document {
  name: string;
  secretCode: String;
}


export async function getUserFromDb(email: string, password: string) : Promise< User | null> {

  await dbConnect();

  try {
    // Fetch the user from the database by email
    const user = await UserModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      redirect('/sign-up')
    }

    if (!user.password) {
     throw new Error('Already signed in with Github')
    }

    // Compare the provided password with the stored password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('Wrong Password')
    }
      return user;
    
  } catch (error) {
    console.log("getUserFromDb error : ", error);
    return null; // Return the error message
  }
}
