import UserModel from "@/model/User";
import dbConnect from "@/lib/dbconnect";
import { Message } from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {

  await dbConnect();
  
  const { secretCode , content } = await request.json();
  try {
    const user = await UserModel.findOne({ secretCode  });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    // is user accepting the messages
    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "user is not accepting the messsages",
        },
        { status: 200 }
      );
    }
    const newMessage = { content , createdAt: new Date() };
    user.messages.push(newMessage as Message);
    
    await user.updateOne({ messages: user.messages });

    return NextResponse.json(
      {
        success: true,
        message: "message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "error in send-message api",
      },
      { status: 500 }
    );
  }
}
