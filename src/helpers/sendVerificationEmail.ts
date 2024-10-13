import { resend } from "@/lib/resend";
import  EmailTemplate  from "@/components/Backend/email-template";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: number
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Mystery Message <onboarding@resend.dev>',
            to: [email],
            subject: 'Mystery Message | Verification code',
            react: EmailTemplate({username, verifyCode}),
          });
          return {
            success: true, message:"Verification email send successfully"
          }
        
    } catch (error) {
        console.log("erron in sending otp mail", error);
        return {success:false, message:"Failed to send otp mail"}
    }
}
