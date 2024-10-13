import { redirect } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import signInSchema from "@/schemas/signInSchema";
import Link from "next/link";
import { signIn } from "@/auth"; // Import the signIn function
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default async function Page() {
  const toast = useToast();

  const handleSignIn = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast({ title: "Success", description: "Logged in successfully!" });
      redirect("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      toast({ title: "Error", description: "Login failed. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Sign In</h2>
        <Form onSubmit={handleSignIn} schema={loginSchema}>
          <FormField name="email">
            {({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </FormField>
          <FormField name="password">
            {({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </FormField>
          <Button type="submit">Sign In</Button>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              New to Mystery Message?{" "}
              <Link href="/sign-up" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
