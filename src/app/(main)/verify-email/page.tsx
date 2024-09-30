"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card"; 
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation"; 

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState("");
  const router = useRouter(); 

  const handleVerify = () => {
    if (otp === "123456") {  //for testing purposes
      toast.success("OTP verified successfully!");
      router.push("/"); 
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gray-100">
      <Card className="p-8 w-full max-w-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4 text-center">OTP Verification</h1>
        
        <Toaster />

        <Input
          className="mb-2"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          placeholder="Enter your OTP"
        />

        <Button className="w-full bg-blue-600 text-white" onClick={handleVerify}>
          Verify OTP
        </Button>
      </Card>
    </div>
  );
};

export default OTPVerificationPage;
