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

interface LMBFormValues {
  date: string;
  labName: string;
  personnel: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  location: string;
  expiryDate: string;
  supplier: string;
  cost: number;
  notes: string;
}

const LMBInventoryForm = () => {
  const form = useForm<LMBFormValues>({
    defaultValues: {
      date: "",
      labName: "",
      personnel: "",
      itemName: "",
      itemCode: "",
      quantity: undefined,
      unit: "",
      location: "",
      expiryDate: "",
      supplier: "",
      cost: undefined,
      notes: "",
    },
  });

  const handleSubmit = async (values: LMBFormValues) => {
    const parsedValues = {
      ...values,
      quantity: Number(values.quantity),
      cost: Number(values.cost),
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
          <h1 className="text-xl font-bold py-1">Lab Materials Borrow Form</h1>
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
                      <FormLabel>Date Borrowed</FormLabel>
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
                  name="borrowTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Borrowed</FormLabel>
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
              </div>

              <FormField
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details of Borrowed Equipment</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter details"
                          {...field}
                          required
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Unit (e.g., liters, grams)"
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
                  name="borrowDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Borrower Details</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Details of Borrower"
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
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Department"
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
                  name="borrowDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Borrowed</FormLabel>
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
                  name="returnTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Returned</FormLabel>
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
                name="damage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Damage Materials</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Damage Materials"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>

              <FormField
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any relevant information..."
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

export default LMBInventoryForm;
