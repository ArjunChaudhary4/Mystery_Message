import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";


export async function GET(request: NextRequest) {
    await dbConnect();
  
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
      try {
        const userData = await UserModel.findOne({ name });
        if (!userData) {
          return NextResponse.json({
            userExist:false,
            message:"No user found"
          } , {status : 402});
        }
        return NextResponse.json({
          secretCode : userData.secretCode,
          userId : userData._id,
        } , {status : 200 } )
      } catch (error) {
        console.log(error);
        return NextResponse.json({
          message:"Error in fetching secretCode"
        } , {status : 402});
      }
  }
  