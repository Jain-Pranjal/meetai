import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import  HomePage  from '@/modules/home/ui/views/HomePage'
import React from 'react'
import { redirect } from "next/navigation";

const page = async() => {

  // using the server side session as this page is a server component
const session = await auth.api.getSession({
    headers: await headers() 
})

if(!session) {
  redirect("/sign-in");
}

  return (
    <>
    <HomePage />
    </>
  )
}

export default page
