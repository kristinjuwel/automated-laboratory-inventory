"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { DatePickerWithPresets } from "@/components/ui/datepicker";

interface IncidentFormValues {
  date: string;
  time: string;
  incident: string;
  quantity: number;
  materials: string;
  brand: string;
  remarks: string;
  individuals: string;
  document: string;
}

const IncidentForm = () => {
  const form = useForm<IncidentFormValues>({
    defaultValues: {
      date: "",
      time: "",
      incident: "",
      quantity: undefined,
      materials: "",
      brand: "",
      remarks: undefined,
      individuals: "",
      document: "",
    }
  });

  const handleSubmit = async (values: IncidentFormValues) => {
    const parsedValues = {
      ...values,
      quantity: Number(values.quantity),
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
          <div className="flex space-x-4 mb-4">
            <div className="w-24 h-24 relative">
              <Image
                src="/images/mrl-logo.png"
                alt="Logo 1"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="w-24 h-24 relative">
              <Image
                src="/images/pgh-logo.png"
                alt="Logo 2"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <h1 className="text-xl font-bold py-1">Incident Form</h1>
          <hr className="w-full border-t-1 border-gray-300 my-1" />
        </div>

        <Toaster />

        <div className="overflow-y-auto max-h-[430px] mb-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mb-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <FormField
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <DatePickerWithPresets
                          date={field.value}
                          setDate={(newDate) => field.onChange(newDate)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="time"
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
                  
                <FormField
                  name="incident"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nature of Incident</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nature of Incident"
                          {...field}
                          required
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

            <div className="overflow-y-auto max-h-[430px] mb-1">
              <div className="grid grid-cols-2 gap-4 mb-4">

                <FormField
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quantity"
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
                  name="materials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materials Involved</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Materials"
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
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brand name"
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

                <FormField
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Remarks"
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
                  name="individuals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Involved Individuals</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="individuals"
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
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attached Documentations</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter document here"
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

              <div className="flex justify-center mt-8">
                <Button
                  type="submit"
                  onClick={form.handleSubmit(handleSubmit)}
                  className="bg-sky-500 text-white w-full hover:bg-sky-700 transition-colors duration-300 ease-in-out"
                >
                  Submit Form
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default IncidentForm;
