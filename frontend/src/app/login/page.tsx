"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { loginUser } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Login() {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  async function handleLogin(formData: FormData) {
    setIsPending(true);
    const result = await loginUser(formData);
    
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: result.error,
      });
      setIsPending(false);
    } else if (result?.success) {
      window.location.href = "/admin";
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 pt-32">
      <Card className="w-full max-w-md rounded-3xl border-none shadow-xl bg-white">
        <CardHeader className="text-center space-y-4 pb-8 border-b border-border/50">
          <div className="mx-auto relative w-20 h-20 bg-white rounded-full p-2 flex items-center justify-center shadow-sm border border-border/50">
            <Image 
              src="/logo.png" 
              alt="EVHS Logo" 
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="space-y-1">
            <CardTitle className="font-serif text-2xl text-evhs-dark">Secure Access</CardTitle>
            <CardDescription>Log in to the EVHS & Shampooch Portal</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form action={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email Address</label>
              <Input required type="email" name="email" placeholder="hello@example.com" className="rounded-xl h-12 bg-ivory" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <a href="#" className="text-xs text-muted-foreground hover:text-evhs">Forgot password?</a>
              </div>
              <Input required type="password" name="password" placeholder="••••••••" className="rounded-xl h-12 bg-ivory" />
            </div>
            <Button type="submit" disabled={isPending} className="w-full rounded-full h-12 text-lg bg-evhs hover:bg-evhs-light text-white mt-2 shadow-md">
              {isPending ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account? <a href="#" className="text-evhs font-semibold hover:underline">Request access</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
