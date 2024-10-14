"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card } from "@/components/ui/card"; 
import { Toaster, toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    toast.success("Login successful!");
  };

  return (
    
    <div className="flex w-screen h-screen items-center justify-center bg-gray-100">
      <Card className="p-8 w-full max-w-[600px] shadow-lg"> 
        <div className="flex justify-center mb-4">
          <h1 className="text-xl font-bold">Sign in to your account</h1>
        </div>
        <Toaster />

        <label className="block mb-1">Email Address</label>
        <Input
          className="mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
        <label className="block mb-1">Password</label>
        <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        </div>

        <p className="mt-4 text-center text-blue-600">
        Not yet registered?{" "}
          <a href="/registration" className="text-blue-600">
          Click <b>here</b> to create an account.
          </a>
        </p>
        <Button className="w-full bg-blue-600 text-white" onClick={handleLogin}>
          Login
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;