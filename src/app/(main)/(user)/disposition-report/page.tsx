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

interface DispositionReportValues {
  description: string;
  quantity: number;
  reason: string;
  method: string;
  date: string;
  dispositionedBy: string;
  comments: string;
}

const DispositionReportForm = () => {
    const form = useForm<DispositionReportValues>({
      defaultValues: {
        description: "",
        quantity: undefined,
        reason: "",
        method: "",
        date: "",
        dispositionedBy: "",
        comments: "",
      },
    });
  
    const handleSubmit = async (values: DispositionReportValues) => {
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
            <h1 className="text-xl font-bold py-1">Disposition Report Form</h1>
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
                        <FormLabel>Disposition Date</FormLabel>
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=" Description of Item"
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
                </div>
  
                <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Disposition</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Why it was disposed..."
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
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disposition Method</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="How it was disposed?"
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
                  name="dispositionedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />       
                <FormField
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commments</FormLabel>
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
  
  export default DispositionReportForm;

/////////////OLD CODE/////////

/*
"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Toaster } from "sonner";

// Placeholder data structure to be replaced by database query
const dispositionData = [
  {
    itemNo: "0001",
    description: "Ethanol, 95%, 500 mL",
    quantity: "2 bottles",
    reason: "Expired",
    method: "Hazardous Waste Disposal",
    date: "09/01/2024",
    dispositionedBy: "Name",
    comments: "Properly labeled, disposed via approved vendor",
  },
  {
    itemNo: "0002",
    description: "Centrifuge, Model ABC",
    quantity: "1 unit",
    reason: "Malfunctioned, Unrepairable",
    method: "Decommission and Recycle",
    date: "08/30/2024",
    dispositionedBy: "Name",
    comments: "Decommissioned, parts recycled",
  },
  {
    itemNo: "0003",
    description: "Safety Goggles, Anti-Fog",
    quantity: "5 pairs",
    reason: "Damaged",
    method: "General Waste Disposal",
    date: "08/28/2024",
    dispositionedBy: "Name",
    comments: "Disposed of according to lab protocol",
  },
];

const DispositionReport = () => {
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
          <h1 className="text-xl font-bold py-1">Disposition Report</h1>
          <hr className="w-full border-t-1 border-gray-300 my-1" />
        </div>

        <Toaster />

        <div className="overflow-y-auto max-h-[430px] mb-1">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Item No.</th>
                <th className="border p-2">Item Description</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Reason for Disposition</th>
                <th className="border p-2">Disposition Method</th>
                <th className="border p-2">Date of Disposition</th>
                <th className="border p-2">Dispositioned by</th>
                <th className="border p-2">Comments</th>
              </tr>
            </thead>
            <tbody>
              {dispositionData.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.itemNo}</td>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2">{item.reason}</td>
                  <td className="border p-2">{item.method}</td>
                  <td className="border p-2 text-center">{item.date}</td>
                  <td className="border p-2">{item.dispositionedBy}</td>
                  <td className="border p-2">{item.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DispositionReport;

*/