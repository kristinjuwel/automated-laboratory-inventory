"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      if (response.ok) {
        toast.success("Login successful!");
        router.push("/biological-inventory-form");
      } else {
        const errorMessage = await response.text();
        toast.error(errorMessage || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
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

        <p className="mt-4 text-center text-black">
          Not yet registered? Click
          <a
            onClick={() => router.push("/registration")}
            className="text-sky-500 hover:text-sky-700 transition-colors duration-300 ease-in-out"
          >
            <b> here </b>
          </a>
          to create an account.
        </p>
        <Button
          className="bg-sky-500 text-white w-full hover:bg-sky-700 transition-colors duration-300 ease-in-out"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
