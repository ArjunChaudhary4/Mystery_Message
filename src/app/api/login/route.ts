import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";

interface loginType {
  password: string;
  email: string;
}

export async function POST(request: NextRequest) {
  await dbConnect();

  // Ensure the request body is parsed correctly
  const { email, password }: loginType = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      {
        message: "All fields are Required",
      },
      { status: 400 }
    ); // Set a status code for bad requests
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          message: "User Not Found",
        },
        { status: 401 }
      );
    }

    // Use the instance method directly
    if (!(await user.comparePassword(password))) {
      return NextResponse.json(
        {
          message: "Password does not match", // Improved wording
        },
        { status: 401 }
      );
    }

    const secretKey = process.env.JSONWEBTOKEN_SECRETKEY;
    if (!secretKey) {
      console.log("Secret key is not defined");
      return NextResponse.json(
        { message: "Secret key is not defined" },
        { status: 500 }
      ); // Set a status for server errors
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        secretCode: user.secretCode,
      },
      secretKey,
      { expiresIn: "1d" } // Use lowercase 'd' for consistency
    );

    const response = NextResponse.json({
      message: "User successfully logged in", // More precise messaging
      token,
      user,
    });

    response.cookies.set("loginToken", token, {
      expires: new Date(Date.now() + 36000000), // 10 hours in milliseconds
    });

    return response;
  } catch (error) {
    console.log("Login Error: ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    ); // Handle errors gracefully
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const secretCode = searchParams.get("secretCode");
  console.log("Received Secret Code:", secretCode); // Log the received secret code
    try {
      const userData = await UserModel.findOne({ secretCode });
      if (!userData) {
        return NextResponse.json({
          userExist:false,
          message:"No user found"
        });
      }
      return NextResponse.json({
        userExist:true,
        userData
      })
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        message:"Error in fetching userdata or login api"
      });
    }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({
      message: "Successfully log out",
    });
    response.cookies.set("loginToken", "", {
      expires: new Date(0),
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Logout fails",
    });
  }
}
