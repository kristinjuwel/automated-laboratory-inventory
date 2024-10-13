"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
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

interface LabPurchaseValues {
  purchaseOrderNo: string;
  date: string;
  status: string;
  supplierName: string;
  supplierAddress: string;
  supplierPhoneNo: string;
  supplierEmail: string;
  supplierContactPerson: string;
  labName: string;
  labAddress: string;
  labPhoneNo: string;
  labEmail: string;
  labContactPerson: string;
  items: {
    purchaseOrderNumber: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

const LabPurchaseOrder = () => {
  const form = useForm<LabPurchaseValues>({
    defaultValues: {
      purchaseOrderNo: "",
      date: "",
      status: "",
      supplierName: "",
      supplierAddress: "",
      supplierPhoneNo: "",
      supplierEmail: "",
      supplierContactPerson: "",
      labName: "",
      labAddress: "",
      labPhoneNo: "",
      labEmail: "",
      labContactPerson: "",
      items: [
        {
          purchaseOrderNumber: "",
          description: "",
          quantity: 0,
          unitPrice: 0,
          totalPrice: 0,
        },
      ], // Default item
    },
  });

  const [items, setItems] = useState<
    {
      purchaseOrderNumber: string;
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[]
  >([
    {
      purchaseOrderNumber: "",
      description: "",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    },
  ]);

  const handleAddRow = () => {
    setItems([
      ...items,
      {
        purchaseOrderNumber: "",
        description: "",
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof (typeof items)[0],
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "unitPrice") {
      const item = newItems[index];
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice || 0;
      item.totalPrice = quantity * unitPrice;
    }

    setItems(newItems);
  };

  const handleSubmit = async (values: LabPurchaseValues) => {
    try {
      const data = { ...values, items };
      console.log("Submitted Values:", data);
      toast.success("Submission successful!");
      form.reset();
      setItems([
        {
          purchaseOrderNumber: "",
          description: "",
          quantity: 0,
          unitPrice: 0,
          totalPrice: 0,
        },
      ]);
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
          <h1 className="text-xl font-bold py-1">
            Laboratory Purchase Order Form
          </h1>
          <hr className="w-full border-t-1 border-gray-300 my-1" />
        </div>

        <Toaster />

        <div className="overflow-y-auto max-h-[430px] mb-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mb-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <FormField
                  name="purchaseOrderNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Order Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Purchase Order Number"
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
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full flex justify-between items-center"
                          >
                            <span>{field.value || "Status"}</span>
                            <span className="ml-auto">▼</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          {[
                            "Submitted",
                            "Procurement Office",
                            "Accounting Office",
                            "Delivered",
                            "Cancelled",
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

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-s font-bold py-1">
                    Supplier Information
                  </h4>
                </div>
                <div>
                  <h4 className="text-s font-bold py-1">Buyer Information</h4>
                </div>

                <FormField
                  name="supplierName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Supplier Name"
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
                  name="labName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Laboratory Name</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full flex justify-between items-center"
                          >
                            <span>{field.value || "Select Laboratory"}</span>
                            <span className="ml-auto">▼</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          {["Pathology", "Immunology", "Microbiology"].map(
                            (option) => (
                              <DropdownMenuCheckboxItem
                                key={option}
                                checked={field.value === option}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked ? option : null)
                                }
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

                <FormField
                  name="supplierAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Supplier Address"
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
                  name="labAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Laboratory Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Laboratory Address"
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
                  name="supplierPhoneNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone Number"
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
                  name="labPhoneNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone Number"
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
                  name="supplierEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email Address"
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
                  name="labEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email Adress"
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
                  name="supplierContactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contact Person"
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
                  name="labContactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contact Person"
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

              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="text-sm px-2 py-1 border">
                        Purchase Order No.
                      </th>
                      <th className="text-sm px-2 py-1 border">Description</th>
                      <th className="text-sm px-2 py-1 border">Quantity</th>
                      <th className="text-sm px-2 py-1 border">
                        Unit Price (Php)
                      </th>
                      <th className="text-sm px-2 py-1 border">
                        Total Price (Php)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">
                          <Input
                            value={item.purchaseOrderNumber}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "purchaseOrderNumber",
                                e.target.value
                              )
                            }
                            placeholder="PO Number"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              handleChange(index, "description", e.target.value)
                            }
                            placeholder="Description"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            placeholder="Quantity"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "unitPrice",
                                Number(e.target.value)
                              )
                            }
                            placeholder="Unit Price"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Input
                            type="number"
                            value={item.totalPrice}
                            readOnly
                            placeholder="Total Price"
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={5}>
                        <div className="flex justify-center">
                          <Button
                            onClick={handleAddRow}
                            className="bg-gray-300 text-black hover:bg-sky-500 hover:text-white w-full"
                          >
                            Add New Row
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="border px-4 py-2"></td>
                      <td className="border px-4 py-2 text-sm">Subtotal: </td>
                      <td className="border px-4 py-2"></td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="border px-4 py-2"></td>
                      <td className="border px-4 py-2 text-sm">Tax (10%): </td>
                      <td className="border px-4 py-2"></td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="border px-4 py-2"></td>
                      <td className="border px-4 py-2 text-sm">
                        Shipping Cost:{" "}
                      </td>
                      <td className="border px-4 py-2"></td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="border px-4 py-2"></td>
                      <td className="border px-4 py-2 text-sm">
                        Grand Total:{" "}
                      </td>
                      <td className="border px-4 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-5">
                <Button
                  type="submit"
                  onClick={form.handleSubmit(handleSubmit)}
                  className="bg-sky-500 text-white w-full"
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

export default LabPurchaseOrder;
