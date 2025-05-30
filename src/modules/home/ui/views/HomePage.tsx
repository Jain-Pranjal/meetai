"use client";
import React from 'react'
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from 'next/navigation';


const page = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession()


  return (
    <>
      {session ? (
      <div>
        <h1>Welcome, {session.user.name}</h1>
        <p>Email: {session.user.email}</p>
        <button 
        onClick={() => authClient.signOut({
          fetchOptions: {
          onSuccess: () => router.push("/sign-in")
          }
        })}
        className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
        >
        Sign Out
        </button>
      </div>
      ) : (
      <p>Please log in or register to access the dashboard.</p>
      )}
    </>
  );
}

export default page
