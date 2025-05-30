import React from 'react'
import SignupView from '@/modules/auth/ui/SignupView'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
async function SignUp() {

  const session = await auth.api.getSession({
      headers: await headers() 
  })

  if (session) {
    // If the user is already signed up, redirect them to the home page
    redirect("/");
  }

  return (
    <div>
      <SignupView />
    </div>
  )
}

export default SignUp

// here we are rendering the main view of the signup page as a server component and in that wee are rendering the SignupView component which is a client component