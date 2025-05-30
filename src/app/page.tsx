"use client";
import React from 'react'
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [image, setImage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { data: session } = authClient.useSession()

  // Handle form submission for user registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        image,
        callbackURL: "/dashboard"
      }, {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          window.location.href = "/dashboard";
        },
        onError: (ctx) => {
          setLoading(false);
          console.error("Registration error:", ctx.error);
          alert(ctx.error.message);
        },
      });
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      {session === undefined ? (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
      ) : session ? (
      <div>
        <h1>Welcome, {session.user.name}</h1>
        <p>Email: {session.user.email}</p>
      </div>
      ) : (
      <p>Please log in or register to access the dashboard.</p>
      )}

      {session && (
      <button 
        onClick={() => authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
          router.push("/sign-in"); 
          },
        },
        })}
        className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
        disabled={loading}
      >
        {loading ? "Signing out..." : "Sign Out"}
      </button>
      )}
    </>
  );
}

export default page