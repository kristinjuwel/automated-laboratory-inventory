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
import { Textarea } from "@/components/ui/textarea";

interface CalibrationLogValues {
  material: string;
  calibrationDate: string;
  nextCal: string;
  notes: string;
  document: string;
  personnel: number;
}

const CalibrationLogForms = () => {
  const form = useForm<CalibrationLogValues>({
    defaultValues: {
      material: "",
      calibrationDate: "",
      nextCal: "",
      notes: "",
      document: "",
      personnel: undefined,
    },
  });

  const handleSubmit = async (values: CalibrationLogValues) => {
    const parsedValues = {
      ...values,
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
    <div className="flex justify-center bg-gray-100">
      <Card className="md:my-3 pt-8 px-8 pb-4 lg:w-3/5 md:w-4/5 w-full h-full md:h-[610px] md:shadow-lg md:rounded-lg rounded-none">
        <div className="flex flex-col items-center mb-4">
          <div className="flex space-x-4 mb-4">
            <div className="w-24 h-24 relative">
              <Image
                src="/images/mrl-logo.png"
                alt="Logo 1"
                fill
                style={{ objectFit: "contain" }}
                priority
                sizes="(max-width: 768px) 100vw, 24px"
              />
            </div>
            <div className="w-24 h-24 relative">
              <Image
                src="/images/pgh-logo.png"
                alt="Logo 2"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 100vw, 24px"
              />
            </div>
          </div>
          <h1 className="text-xl font-bold py-1">Calibration Log Report</h1>
          <hr className="w-full border-t-1 border-gray-300 my-1" />
        </div>

        <Toaster />

        <div className="md:overflow-y-auto md:max-h-[400px] mb-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  name="calibrationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calibration Date</FormLabel>
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
                  name="nextCalibration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next Calibration</FormLabel>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  name="personnel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personnel</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Personnel ID"
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
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Material"
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
              <div className="grid grid-cols-1 gap-4 mb-4">
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
                          id="multiple_files"
                          type="file"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any relevant information..."
                          {...field}
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

export default CalibrationLogForms;
