import dbConnect from "@/lib/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/User";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {

  await dbConnect();

  try {
    
    const { userId } = await request.json();
    const messageId = params.messageId;
    console.log(userId , messageId);
    const updatedResult = await UserModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 } // Changed to 404 for not found
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error); // Changed console.log to console.error for better logging

    return NextResponse.json(
      {
        success: false,
        message: "Error in delete message API",
      },
      { status: 500 }
    );
  }
}
