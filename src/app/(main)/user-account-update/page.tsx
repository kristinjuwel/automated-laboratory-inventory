"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface UserUpdateFormValues {
  lastName: string;
  firstName: string;
  middleName: string;
  designation: string;
  laboratory: string;
  email: string;
  username: string;
  password: string;
  rePassword: string;
}

const UserUpdate = () => {
  const form = useForm<UserUpdateFormValues>({
    defaultValues: {
      lastName: "",
      firstName: "",
      middleName: "",
      designation: "",
      laboratory: "",
      email: "",
      username: "",
      password: "",
      rePassword: ""
    },
  });

  const handleSubmit = async (values: UserUpdateFormValues) => {
    const parsedValues = {
      ...values
    };

    try {
      console.log("Submitted Values:", parsedValues);
      toast.success("Submission successful!");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center bg-gray-100">
      <Card className="p-8 w-full max-w-[935px] max-h-[700px] shadow-lg">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-xl font-bold py-1">Update User Information</h1>
          <hr className="w-full border-t-1 border-gray-300 my-1" />
        </div>

        <Toaster />

        <div className="overflow-y-auto max-h-[430px] mb-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mb-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
              <FormField
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last Name"
                          {...field}
                          required
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          {...field}
                          required
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Middle Name"
                          {...field}
                          required
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
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
            </div>
            <div className="flex justify-center mt-9">
                <Button
                  type="submit"
                  onClick={form.handleSubmit(handleSubmit)}
                  className="bg-sky-500 text-white w-full hover:bg-sky-700 transition-colors duration-300 ease-in-out"
                >
                  Save Update
                </Button>
              </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 mt-8">
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
                name="username"
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
              <div className="flex justify-center mt-9">
                <Button
                  type="submit"
                  onClick={form.handleSubmit(handleSubmit)}
                  className="bg-sky-500 text-white w-full hover:bg-sky-700 transition-colors duration-300 ease-in-out"
                >
                  Save Update
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default UserUpdate;