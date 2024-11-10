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

interface ReagentDispenseFormValues {
  date: string;
  totalContainers: number;
  lotNo: string;
  quantityDispensed: number;
  remainingQuantity: number;
  remarks: string;
  analyst: string;
}

const ReagentDispenseForm = () => {
  const form = useForm<ReagentDispenseFormValues>({
    defaultValues: {
      date: "",
      totalContainers: undefined,
      lotNo: "",
      quantityDispensed: undefined,
      remainingQuantity: undefined,
      remarks: "",
      analyst: "",
    },
  });

  const handleSubmit = async (values: ReagentDispenseFormValues) => {
    // Automatically calculate remaining quantity
    const updatedValues = {
      ...values,
      remainingQuantity: values.totalContainers - values.quantityDispensed,
    };

    try {
      console.log("Submitted Values:", updatedValues);
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
          <h1 className="text-xl font-bold py-1">Reagent Dispense Form</h1>
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
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">

                <FormField
                  name="totalContainers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total No. of Containers</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Total Containers"
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
                  name="lotNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lot No.</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Lot Number"
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
                  name="quantityDispensed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity Dispensed</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quantity Dispensed"
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
                  name="remainingQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remaining Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Calculated automatically"
                          value={form.watch("totalContainers") - form.watch("quantityDispensed")}
                          disabled
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
                name="analyst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Analyst</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name of Analyst"
                        {...field}
                        required
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

export default ReagentDispenseForm;
