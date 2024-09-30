"use client";

import React from "react";
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
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface RegisterFormValues {
  email: string;
  userName: string;
  lastName: string;
  firstName: string;
  middleInitial: string;
  laboratory: string | null;
  designation: string | null;
  password: string;
  rePassword: string;
}

const RegisterPage = () => {
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      userName: "",
      lastName: "",
      firstName: "",
      middleInitial: "",
      laboratory: null,
      designation: null,
      password: "",
      rePassword: "",
    },
  });

  const handleRegister = (values: RegisterFormValues) => {
    if (values.password !== values.rePassword) {
      toast.error("Passwords do not match!");
      return;
    }
    // Handle registration logic
    toast.success("Registration successful!");
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gray-100">
      <Card className="p-8 w-full max-w-[600px] shadow-lg">
        <div className="flex justify-center mb-4">
          <h1 className="text-xl font-bold py-4">Register your account</h1>
        </div>

        <Toaster />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegister)} className="mb-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-5 gap-2 mb-4">
              <FormField
                name="lastName"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="firstName"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="middleInitial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>M.I.</FormLabel>
                    <FormControl>
                      <Input placeholder="M.I." {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <FormField
                name="laboratory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Laboratory</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full flex justify-between items-center">
                          <span>{field.value || "Options"}</span>
                          <span className="ml-auto">▼</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Laboratories</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {["Pathology", "Immunology", "Microbiology"].map((option) => (
                          <DropdownMenuCheckboxItem
                            key={option}
                            checked={field.value === option}
                            onCheckedChange={(checked) => field.onChange(checked ? option : null)}
                          >
                            {option}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Designation</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full flex justify-between items-center">
                          <span>{field.value || "Options"}</span>
                          <span className="ml-auto">▼</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Designations</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {["Medical Technologist", "Researcher", "Lab Manager", "Student", "Technician"].map(
                          (option) => (
                            <DropdownMenuCheckboxItem
                              key={option}
                              checked={field.value === option}
                              onCheckedChange={(checked) => field.onChange(checked ? option : null)}
                            >
                              {option}
                            </DropdownMenuCheckboxItem>
                          )
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="rePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Re-enter Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Re-enter Password" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
