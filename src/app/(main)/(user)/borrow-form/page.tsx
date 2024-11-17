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

const InputField = ({
  label,
  placeholder,
  name,
  type = "text",
  required = false,
  field,
}: {
  label: string;
  placeholder: string;
  name: string;
  type?: string;
  required?: boolean;
  field: any;
}) => (
  <FormField
    name={name}
    render={() => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            required={required}
            className="w-full"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

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
    <div className="flex w-screen h-screen justify-center items-center bg-gray-100">
      <Card className="p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-[935px] max-h-[700px] shadow-lg">
        <div className="flex flex-col items-center mb-4">
          <div className="flex space-x-4 mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
              <Image
                src="/images/mrl-logo.png"
                alt="Logo 1"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
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

        <div className="overflow-y-auto max-h-[430px] mb-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Date Borrowed */}
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

                {/* Time Borrowed */}
                <FormField
                  name="timeBorrowed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Borrowed</FormLabel>
                      <FormControl>
                        <TimePicker
                          date={field.value}
                          setDate={(newTime) => field.onChange(newTime)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date Returned */}
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

                {/* Time Returned */}
                <FormField
                  name="timeReturned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Returned</FormLabel>
                      <FormControl>
                        <TimePicker
                          date={field.value}
                          setDate={(newTime) => field.onChange(newTime)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Details of Borrowed */}
              <div className="mb-6">
                <InputField
                  label="Details of Borrowed Equipment"
                  placeholder="Enter details"
                  name="detailsOfBorrowed"
                  required
                  field={form.register("detailsOfBorrowed")}
                />
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Quantity"
                  placeholder="Quantity"
                  name="qty"
                  type="number"
                  required
                  field={form.register("qty", { valueAsNumber: true, min: 1 })}
                />
                <InputField
                  label="Unit"
                  placeholder="Unit (e.g., liters, grams)"
                  name="unit"
                  required
                  field={form.register("unit")}
                />
              </div>

              {/* Borrower Details */}
              <div className="mb-6">
                <InputField
                  label="Borrower Details"
                  placeholder="Details of Borrower"
                  name="borrowerDetail"
                  required
                  field={form.register("borrowerDetail")}
                />
              </div>

              {/* Department */}
              <div className="mb-6">
                <InputField
                  label="Department"
                  placeholder="Department"
                  name="department"
                  required
                  field={form.register("department")}
                />
              </div>

              {/* Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Remarks"
                  placeholder="Remarks"
                  name="remarks"
                  field={form.register("remarks")}
                />
                <InputField
                  label="Damage Materials"
                  placeholder="Damage Materials"
                  name="damageMaterials"
                  field={form.register("damageMaterials")}
                />
              </div>

              {/* Submit Button */}
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
