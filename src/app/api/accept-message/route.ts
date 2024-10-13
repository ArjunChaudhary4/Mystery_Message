import dbConnect from "@/lib/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/User";

export async function PATCH(request: NextRequest) {
  await dbConnect();
  
  try {
    const { secretCode , acceptMessages } = await request.json(); 
    console.log(secretCode);
    console.log(acceptMessages);
    
    const updatedUser = await UserModel.findOneAndUpdate(
      {secretCode},
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Error verifying user",
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to update user status to accept messaes", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 401 }
    );
  }
}

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const secretCode = searchParams.get("secretCode");

  try {

    const foundUser = await UserModel.findOne({ secretCode });
    
    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to update user status to accept messaes", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
