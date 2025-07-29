"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle session
  const {data:session} = authClient.useSession();
  console.log("Session:", session);

  if(session) {
   return  <p>Welcome back, {session.user.name}!</p>
  }


  return (
    <Card className="w-full max-w-md mx-auto p-6 mt-1.5">
    <form  onSubmit={(e) => {
      e.preventDefault();
      authClient.signUp.email({
        name,
        email,
        password,
      },{
        onError: (error) => {
          window.alert(`Error: ${error}`);
        },
        onSuccess: () => {
          window.alert("Sign up successful!");
        },
        onRequest: () => {
          console.log("Requesting sign up...");
        }
      });
      // Handle form submission logic here
      console.log("Form submitted with:", { name, email, password });
    }}
    className="flex flex-col space-y-4"
    >
     <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
     <Input placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
     <Input placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button className="mt-4" type="submit" >
        Submit
      </Button>
    </form>
    </Card>
  );
}
