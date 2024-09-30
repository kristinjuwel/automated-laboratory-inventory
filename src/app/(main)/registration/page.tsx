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
  const [userName, setUserName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [laboratory, setLaboratory] = useState<string | null>(null);
  const [designation, setDesignation] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registration successful!");
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gray-100">
      <Card className="p-8 w-full max-w-[600px] shadow-lg"> 
        <div className="flex justify-center mb-4">
          <h1 className="text-xl font-bold py-4">Register your account</h1>
        </div>

        <Toaster />

        <form onSubmit={handleRegister} className="mb-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block mb-1">Email Address</label>
              <Input
                className="mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Username</label>
              <Input
                className="mb-3"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-4">
            <div className="col-span-2"> 
              <label className="block mb-1">Last Name</label>
              <Input
                className="mb-3"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1">First Name</label>
              <Input
                className="mb-3"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="col-span-1"> 
              <label className="block mb-1">M.I.</label>
              <Input
                className="mb-3"
                value={middleInitial}
                onChange={(e) => setMiddleInitial(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4"> 
            <div>
              <label className="block mb-1">Select Laboratory</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center mb-3"> 
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
                  <Button variant="outline" className="w-full mb-3">
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

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block mb-1">Password</label>
              <Input
                className="mb-3"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Re-enter Password</label>
              <Input
                className="mb-3"
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-sky-500 text-white">
            Register
          </Button>
          <p className="mt-4 text-center">
            Already registered?{" "}
            <a href="#" className="text-sky-500">
              Click here to sign in.
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
