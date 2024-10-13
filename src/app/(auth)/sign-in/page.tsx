"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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
import { signIn } from "next-auth/react"

interface LoginType {
  email: string;
  password: string;
}

function Page() {
  const { toast } = useToast();
  const router = useRouter();


  const form = useForm<LoginType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const onSubmit = async (data: LoginType) => {
  //   try {
  //     const response = await signIn("credentials", {
  //       redirect:false,
  //       email: data.email,
  //       password: data.password
  //     });
  //     console.log(response);
  //       toast({ title: "Success", description: "Logged in successfully!" });
  //       router.push("/dashboard");
      
  //   } catch (error) {
  //     console.error("Login failed", error);
  //     toast({ title: "Error", description: "Login failed. Please try again.", variant: "destructive" });
  //   }
  // };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Sign In</h2>
        <Form {...form}>
          <form 
          // onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 mb-1">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                       autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 mb-1">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Sign In
            </Button>
            <div className="text-center mt-4">
              <p className="text-gray-600">
                New to Mystery Message?{" "}
                <Link href="/sign-up" className="text-blue-600 hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </Form>
        <Button
              className="mt-6 w-full black-600 text-white font-semibold py-2 rounded-md hover:black-700 transition duration-200"
            onClick={()=>{signIn("github")}}
            >
              Sign In With Github
            </Button>
      </div>
    </div>
  );
}

export default Page;
