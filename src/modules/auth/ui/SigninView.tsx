// this is the component for the signin view CLIENT COMPONENT
"use client"
import React from 'react'
import {set, z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const formSchema = z.object({
  email: z.string().email({message:  "Please enter a valid email address"}),
  password: z.string().min(1, {message: "Please enter a password"}),
})


const SigninView = () => {

  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)



  // defining the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  }) 


  // this is taken from better-auth library
  const onSubmit = (data: z.infer<typeof formSchema>) => {
  setError(null); 

  authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/",
    },
    {
      onRequest: () => {
        // this req is handling the whole loading state so add any component in this that u want to show when it is loading
        setPending(true);
        toast.loading("Signing in...", {
          id: "signin",
          duration: Infinity,
        });
      },
      onSuccess: () => {
        setPending(false);
        toast.success("Signed in successfully", {
          id: "signin",
          duration: 5000,
        });
        router.push("/");
      },
      onError: ({ error }) => {
        setPending(false);
        const errorMessage = error?.message || error?.error?.message || "An error occurred during sign-in";
        setError(errorMessage);
        toast.error(errorMessage, {
          id: "signin",
          duration: 5000,
        });
      },
    }
  );
};

const onSocial = (provider: "github" | "google") => {
  setError(null);

  authClient.signIn.social({
      provider: provider,
      callbackURL: "/",
    },
    {
      onRequest: () => {
        setPending(true);
        toast.loading("Signing in...", {
          id: "signin",
          duration: Infinity,
        });
      },
      onSuccess: () => {
        setPending(false);
        toast.success("Signed in successfully", {
          id: "signin",
          duration: 5000,
        });
      },
      onError: ({ error }) => {
        setPending(false);
        const errorMessage = error?.message || error?.error?.message || "An error occurred during sign-in";
        setError(errorMessage);
        toast.error(errorMessage, {
          id: "signin",
          duration: 5000,
        });
      },
    }
  );
};



  return (
   <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <Button type="submit" className="w-full sm:w-40" disabled={pending}>Sign In</Button>
        </div>


     

        <div className="flex flex-col space-y-4 mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
          Or continue with
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-center">
            <Button 
              type="button" 
              disabled={pending}
              variant="outline" 
              className="w-full sm:w-40 flex items-center justify-center gap-2"
              onClick={() => onSocial("google")}
            >
              <FcGoogle className="h-4 w-4" />
              Google
            </Button>
            <Button 
              disabled={pending}
              type="button" 
              variant="outline" 
              className="w-full sm:w-40 flex items-center justify-center gap-2"
              onClick={() => onSocial("github")}
            >
              <FaGithub className="h-4 w-4" />GitHub
            </Button>
            </div>
          </div>
        </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-primary hover:underline">
                Sign up here
              </Link>
            </p>
          </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-muted-foreground hover:underline">
              Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-muted-foreground hover:underline">
              Privacy Policy
              </Link>
            </p>
            </div>


     </Form>
  )
}

export default SigninView

