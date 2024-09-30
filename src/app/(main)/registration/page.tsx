"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { Card } from "@/components/ui/card"; 
import { Toaster, toast } from "sonner";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [laboratory, setLaboratory] = useState<string | null>(null);
  const [designation, setDesignation] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleRegister = () => {
    toast.success("Registration successful!");
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gray-100">
      <Card className="p-8 w-full max-w-[600px] shadow-lg"> 
        <div className="flex justify-center mb-4">
          <h1 className="text-xl font-bold">Register your account</h1>
        </div>
        <Toaster />

        <label className="block mb-1">Email Address</label>
        <Input
          className="mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="grid grid-cols-5 gap-2 mb-2">
          <div className="col-span-2"> 
            <label className="block mb-1">Last Name</label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1">First Name</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="col-span-1"> 
            <label className="block mb-1">M.I.</label>
            <Input
              value={middleInitial}
              onChange={(e) => setMiddleInitial(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2"> 
         <div>
          <label className="block mb-1">Select Laboratory</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between items-center"> 
                <span>{laboratory || "Options"}</span>
                <span className="ml-auto">▼</span> 
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Laboratories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                { value: "Pathology", label: "Pathology" },
                { value: "Immunology", label: "Immunology" },
                { value: "Microbiology", label: "Microbiology" }
              ].map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={laboratory === option.value}
                  onCheckedChange={(checked) => {
                    setLaboratory(checked ? option.value : null);
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>


          <div>
            <label className="block mb-1">Select Designation</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  <span>{designation || "Options"}</span>
                  <span className="ml-auto">▼</span> 
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Designations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  { value: "Medical Technologist", label: "Medical Technologist" },
                  { value: "Researcher", label: "Researcher" },
                  { value: "Lab Manager", label: "Lab Manager" },
                  { value: "Student", label: "Student" },
                  { value: "Technician", label: "Technician" },
                ].map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={designation === option.value}
                    onCheckedChange={(checked) => {
                      setDesignation(checked ? option.value : null);
                    }}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Re-enter Password</label>
            <Input
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
            />
          </div>
        </div>

        <p className="mt-4 text-center text-blue-600">
          Already registered?{" "}
          <a href="/login" className="text-blue-600">
            Click here to sign in.
          </a>
        </p>
        <Button className="w-full bg-blue-600 text-white" onClick={handleRegister}>
          Register
        </Button>
      </Card>
    </div>
  );
};

export default RegisterPage;