import React from 'react'
import { auth } from "@/lib/auth";  //server instance of auth
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from '@/modules/auth/ui/ForgetPasswordForm';


async function ForgotPassword() {
  const session = await auth.api.getSession({
      headers: await headers() 
  })

  if (session) {
    // If the user is already signed in, redirect them to the home page
    redirect("/");
  }

  return (
    <div>
      <ForgotPasswordForm />
    </div>
  )
}

export default ForgotPassword