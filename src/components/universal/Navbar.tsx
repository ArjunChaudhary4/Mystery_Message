"use client"
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import JwtDisplay from "@/helpers/jwtToken";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useSession } from 'next-auth/react';
import ProfileImage from "../components/profileImage";

function Navbar() {

  const { data: session } = useSession()

  const { userData } = JwtDisplay();
  const router = useRouter();
  const { toast } = useToast();

const handleLogout = async () => {

  try {
    Cookies.remove('loginToken');
    Cookies.remove('authjs.session-token');
    router.push('/sign-in');
    toast({ title: "Logged out successfully!" });
  } catch (error) {
    console.log(error);
    
  }
}

const { name } = userData || session?.user || {};

  return (
    <nav className="bg-gray-900 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white hover:text-gray-400">
          Mystery Message
        </Link>
        <div className="flex items-center space-x-4">
          {name || session?.user ? (
            <>
            <p>{session?.user.secretCode}</p>
              <h2 className="text-white">Welcome {name}</h2>
              <ProfileImage />
              <Button className="bg-red-600 hover:bg-red-500 transition-colors" onClick={handleLogout} >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-blue-600 hover:bg-blue-500 transition-colors">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
