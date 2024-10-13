'use client';
 
import { useSession, SessionProvider } from 'next-auth/react';
 
const ClientComponent = () => {
 
    const { data : session } = useSession();
 
  return (
    <SessionProvider>
      <p>Welcome {session?.user?.name}</p>
    </SessionProvider>
  )
}