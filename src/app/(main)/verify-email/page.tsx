"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OTPVerificationPage: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();

  const handleOTPChange = (value: string) => {
    setOtp(value);
  };

  const handleVerify = () => {
    if (otp === "123456") {
      toast.success("OTP verified successfully!");
      router.push("/login");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gray-100">
      <Card className="p-8 w-full max-w-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4 text-center">OTP Verification</h1>

        <Toaster />

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
          className="w-half bg-sky-500  hover:text-sky-700 transition-colors duration-300 ease-in-out text-white mt-4 mx-auto block"
          onClick={handleVerify}
        >
          Verify OTP
        </Button>
      </Card>
    </div>
  );
};

export default OTPVerificationPage;
