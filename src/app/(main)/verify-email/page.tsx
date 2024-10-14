"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const OTPVerificationPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleOTPChange = (value: string) => {
    setOtp(value);
  };

  const handleIdentifierChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(event.target.value);
  };

  const handleVerify = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }verify?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(
          otp
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      const result = await response.text();
      toast.success(result);
      router.push("/login");
    } catch (error) {
      toast.error("An error occurred during verification.");
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gray-100">
      <Card className="p-8 w-full max-w-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4 text-center">OTP Verification</h1>

        <Toaster />
        <div className="mb-4 flex justify-center">
          <Input
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={handleIdentifierChange}
            required
            className="w-60"
          />
        </div>

        <div className="flex justify-center mb-4">
          <InputOTP maxLength={6} onChange={handleOTPChange}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          className="w-half bg-sky-500 hover:bg-sky-700 transition-colors duration-300 ease-in-out text-white mt-4 mx-auto block"
          onClick={handleVerify}
        >
          Verify OTP
        </Button>
      </Card>
    </div>
  );
};

export default OTPVerificationPage;
