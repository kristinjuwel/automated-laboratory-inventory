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
import TimePicker from "@/components/ui/timepicker";

interface BorrowFormValues {
  dateBorrowed: string;
  detailsOfBorrowed: string;
  equipment: string;
  qty: number;
  unit: string;
  borrowerDetail: string;
  department: string;
  timeBorrowed: string;
  dateReturned: string;
  timeReturned: string;
  remarks: string;
  damageMaterials: string;
}

const BorrowForm = () => {
  const form = useForm<BorrowFormValues>({
    defaultValues: {
      dateBorrowed: "",
      detailsOfBorrowed: "",
      equipment: "",
      qty: 0,
      unit: "",
      borrowerDetail: "",
      department: "",
      timeBorrowed: "",
      dateReturned: "",
      timeReturned: "",
      remarks: "",
      damageMaterials: "",
    },
  });

  const handleSubmit = async (values: BorrowFormValues) => {
    try {
      console.log("Submitted Values:", values);
      toast.success("Submission successful!");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center bg-gray-100">
      <Card className="md:my-3 pt-8 px-8 pb-4 lg:w-3/5 md:w-4/5 w-full h-full md:h-[610px] md:shadow-lg md:rounded-lg rounded-none">
        <div className="flex flex-col items-center mb-4">
          <div className="flex space-x-4 mb-4">
            <div className="size-16 md:w-24 md:h-24 relative">
              <Image
                src="/images/mrl-logo.png"
                alt="Logo 1"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="size-16 md:w-24 md:h-24 relative">
              <Image
                src="/images/pgh-logo.png"
                alt="Logo 2"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <h1 className="text-lg sm:text-xl font-bold py-1 text-center">
            Lab Materials Borrow Form
          </h1>
          <hr className="w-full border-t-1 border-gray-300 my-1" />
        </div>

        <Toaster />

        <div className="overflow-y-auto max-h-[400px] mb-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <FormField
                  name="dateBorrowed"
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
                  name="timeBorrowed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Borrowed</FormLabel>
                      <FormControl>
                        <TimePicker
                          date={field.value}
                          setDate={(newTime: string) => field.onChange(newTime)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="dateReturned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Returned</FormLabel>
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
                  name="timeReturned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Returned</FormLabel>
                      <FormControl>
                        <TimePicker
                          date={field.value}
                          setDate={(newDate) => field.onChange(newDate)}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-6">
                <FormField
                  name="detailsOfBorrowed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details of Borrowed Equipment</FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          placeholder="Details of Borrowed Equipment"
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
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <FormField
                  name="qty"
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
                  name="Unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input
                          type="string"
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
              </div>

              <div className="mb-6">
              <FormField
                  name="borrowerDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Borrower Details</FormLabel>
                      <FormControl>
                        <Input
                          type="string"
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
              </div>

              <div className="mb-6">
              <FormField
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input
                          type="string"
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <FormField
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Input
                          type="string"
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
                  name="damageMaterials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Damage Materials</FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          placeholder="Damage Materials"
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
                  className="bg-teal-500 text-white w-full hover:bg-teal-700 transition-colors duration-300 ease-in-out"
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

export default BorrowForm;
