"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

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
  const router = useRouter();

  const handleRegister: SubmitHandler<RegisterFormValues> = async (values) => {
    if (values.password !== values.rePassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.userName,
            email: values.email,
            password: values.password,
            firstName: values.firstName,
            middleName: values.middleInitial,
            lastName: values.lastName,
            designation: values.designation || undefined,
            labId: values.laboratory ? parseInt(values.laboratory) : undefined,
          }),
        }
      );
      if (response.ok) {
        localStorage.setItem("userEmail", values.email);
        toast.success("Registration successful!");
        router.push("/verify-email");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed!");
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
    }
  };

  const form = useForm<RegisterFormValues>();

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
                        <Button
                          variant="outline"
                          className="w-full flex justify-between items-center"
                        >
                          <span>
                            {field.value === 1
                              ? "Pathology"
                              : field.value === 2
                              ? "Immunology"
                              : field.value === 3
                              ? "Microbiology"
                              : "Options"}
                          </span>
                          <span className="ml-auto">▼</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Laboratories</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {[
                          { label: "Pathology", value: 1 },
                          { label: "Immunology", value: 2 },
                          { label: "Microbiology", value: 3 },
                        ].map((option) => (
                          <DropdownMenuCheckboxItem
                            key={option.value}
                            checked={field.value === option.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? option.value : null)
                            }
                          >
                            {option.label}
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
                        <Button
                          variant="outline"
                          className="w-full flex justify-between items-center"
                        >
                          <span>{field.value || "Options"}</span>
                          <span className="ml-auto">▼</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Designations</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {[
                          "Medical Technologist",
                          "Researcher",
                          "Lab Manager",
                          "Student",
                          "Technician",
                        ].map((option) => (
                          <DropdownMenuCheckboxItem
                            key={option}
                            checked={field.value === option}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? option : null)
                            }
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
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        required
                      />
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
                      <Input
                        type="password"
                        placeholder="Re-enter Password"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="bg-sky-500 text-white w-full hover:bg-sky-700 transition-colors duration-300 ease-in-out"
            >
              Register
            </Button>
            <p className="mt-4 text-center">
              Already registered?{" "}
              <a
                onClick={() => router.push("/login")}
                className="text-sky-500 hover:text-sky-700 transition-colors duration-300 ease-in-out"
              >
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
