import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface Message extends Document {
  content: string;
  createdAt: Date;
  _id : string
}

export const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
  image: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  secretCode: String;
}

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default:'',
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },

  secretCode: {
    type: String,
    required:true,
    unique: true
  },

  messages: [MessageSchema],
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
