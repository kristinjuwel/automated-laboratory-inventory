"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const url = `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }login?identifier=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Login successful!");
        router.push("/admin-dashboard");
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
      <Card className="lg:w-3/5 md:w-4/5 md:flex-row flex max-w-screen-2xl h-auto md:h-2/3 shadow-lg rounded-3xl">
        <div className="hidden w-1/2 p-8 bg-teal-100 h-full rounded-3xl rounded-r-none md:flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            className="transition duration-500 hover:scale-105 mt-3"
            height={300}
            width={300}
          />
          <h1 className="text-lg px-5 pt-2 text-center font-bold antialiased tracking-tight text-teal-900 transition duration-500 hover:scale-105">
            Automated Laboratory Inventory Management System
          </h1>
        </div>
        <div className="sm:w-full md:w-1/2 flex flex-col h-full p-12 rounded-3xl rounded-l-none overflow-auto	">
          <div className="flex flex-col md:hidden items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Logo"
              className="transition duration-500 hover:scale-105"
              height={45}
              width={45}
            />
            <h1 className="text-base md:text-xl text-center font-bold antialiased tracking-tight text-teal-900 transition duration-500 hover:scale-105">
              Automated Laboratory Inventory Management System
            </h1>
          </div>
          <h1 className="text-base md:text-xl font-bold text-teal-700 text-center pb-8">
            Login
          </h1>
          <Toaster />

          <label className="pb-2 text-base text-gray-500">Email Address</label>
          <Input
            className="mb-4 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="pb-2 text-base text-gray-500">Password</label>
          <div className="relative">
            <input
              className="rounded-xl w-full p-3 pr-10 border border-gray-300"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          <a
            onClick={() => router.push("/registration")}
            className="text-teal-500  hover:text-teal-700 transition-colors duration-300 ease-in-out text-right text-sm pb-6 mt-1"
          >
            Forgot password?
          </a>

          <Button
            className="bg-teal-500 text-white w-full rounded-xl hover:bg-teal-700 transition-colors duration-300 ease-in-out"
            onClick={handleLogin}
          >
            LOGIN
          </Button>
          <p className="text-center text-gray-400 text-sm mt-1">
            Not yet registered? Click
            <a
              onClick={() => router.push("/registration")}
              className="text-teal-500 hover:text-teal-700 transition-colors duration-300 ease-in-out"
            >
              <b> here </b>
            </a>
            to create an account.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
