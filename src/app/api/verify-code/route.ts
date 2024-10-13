import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    const { username, verifyCode } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedUsername,
    });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not Exist",
        },
        { status: 400 }
      );
    }
    const isValid = user.verifyCode === verifyCode;

    const isnotExpire = new Date(user?.verifyCodeExpiry) > new Date();

    if (isValid && isnotExpire) {
      user.isVerified = true;
      await user.save();

      return NextResponse.json(
        {
          message: "Code Verified",
        },
        { status: 200 }
      );
    } else if (!isnotExpire) {
      return NextResponse.json(
        {
          message: "Code Expired",
        },
        { status: 400 }
      );
    } else {
      console.log(verifyCode);
      console.log(isValid);
      
      return NextResponse.json(
        {
          message: "Wrong Code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(" Error in verifying code ", error);
    return NextResponse.json(
      {
        message: " Error in verifying code",
      },
      { status: 500 }
    );
  }
}
