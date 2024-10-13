"use client"
import React from 'react';
import JwtDisplay from "@/helpers/jwtToken";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
const Home: React.FC = () => {

  const { userData } = JwtDisplay();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Mystery Message
        </h1>
        <p className="text-lg mb-10 text-center px-4 max-w-2xl">
          Uncover hidden secrets and decode intriguing messages. Join us in
          a world of mystery and exploration!
        </p>
        {userData ? (
            <>
                <Link href={'/dashboard'} >
                <Button className="bg-green-600 transition-colors">Go to Dashboard</Button>
                </Link>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-blue-600 hover:bg-blue-500 transition-colors">
                Login
              </Button>
            </Link>
          )}
      </div>
    </>
  );
};

export default Home;
