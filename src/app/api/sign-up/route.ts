import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { NextRequest , NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    const { username, email, password } = await request.json();

    // Check if the username is already taken by a verified user
    const existingUserVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already registered",
        },
        { status: 400 }
      );
    }

    // Generate verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000);
    const secretCode = Math.floor(10000000 + Math.random() * 90000000);
    const existingUserByEmail = await UserModel.findOne({ email:email });

    // Check if the email is already registered
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // Update the existing user with a new password and verification code
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode.toString();
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await existingUserByEmail.save();
      }
    } 
    
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour expiry
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        secretCode,
        messages: [],
      });
      await newUser.save();

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    console.log(emailResponse);
    
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    // Successful registration response
    return NextResponse.json(
      {
        success: true,
        message: "Verification email sent successfully.",
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error registering user", error);
    return NextResponse.json({
      success: false,
      message: "Error registering user",
    }, { status: 500 });
  }
}