"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { DatePickerWithPresets } from "@/components/ui/datepicker";
import { Supplier } from "@/packages/api/lab";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Archive,
  ArchiveRestore,
  Check,
  ChevronsUpDown,
  PlusCircle,
} from "lucide-react";
import AddSupplier from "@/components/molecules/supplier";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

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
    labName: string;
    description: string;
    itemName: string;
    itemCode: string;
    category: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

const LabPurchaseOrder = () => {
  const [openSupplier, setOpenSupplier] = React.useState(false);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const userRole = localStorage.getItem("userRole");
  const currentUserId = localStorage.getItem("authToken");
  const [hideDialogOpen, setHideDialogOpen] = useState(false);
  const [users, setUsers] = useState<
    { userId: number; fullName: string; email: string; phoneNumber: number }[]
  >([]);

  const [selectedSupplierId, setSelectedSupplierId] = React.useState<
    number | null
  >(null);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(
    null
  );
  const [suppliers, setSuppliers] = useState<
    {
      supplierId: number;
      companyName: string;
      email: string;
      address: string;
      phoneNumber: string;
      contactPerson: string;
    }[]
  >([]);
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
          labName: "",
          description: "",
          itemName: "",
          itemCode: "",
          category: "",
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
      labName: "";
      itemName: "";
      itemCode: "";
      category: "";
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[]
  >([
    {
      purchaseOrderNumber: "",
      labName: "",
      description: "",
      itemName: "",
      itemCode: "",
      category: "",
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
        labName: "",
        description: "",
        itemName: "",
        itemCode: "",
        category: "",
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
          labName: "",
          description: "",
          itemName: "",
          itemCode: "",
          category: "",
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
  const addFilteredSupplier = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user first.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}filtered-suppliers/${selectedUserId}`
      );

      let filteredSuppliers: number[] = [];

      if (response.ok) {
        const data = await response.text();
        filteredSuppliers = data
          ? data
              .split(",")
              .filter((id: string) => id.trim() !== "")
              .map((id: string) => parseInt(id, 10))
          : [];
      }

      if (selectedSupplierId) {
        if (!filteredSuppliers.includes(selectedSupplierId)) {
          filteredSuppliers.push(selectedSupplierId);

          const updateResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}update-user/${selectedUserId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                filteredSuppliers: filteredSuppliers.join(","),
              }),
            }
          );

          if (updateResponse.ok) {
            toast.success("Supplier successfully hidden!");
          } else {
            const errorData = await updateResponse.json();
            toast.error(errorData.message || "Archiving supplier failed!");
          }
        } else {
          toast.info("Supplier is already in the filtered list.");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
    setSelectedSupplierId(1);
  };

  const clearFilter = useCallback(async () => {
    try {
      const userId = selectedUserId ?? currentUserId;
      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}update-user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filteredSuppliers: "",
          }),
        }
      );

      if (updateResponse.ok) {
        toast.success("Hidden supplier successfully unarchived!");
      } else {
        const errorData = await updateResponse.json();
        toast.error(errorData.message || "Unarchiving supplier failed!");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }, [selectedUserId, currentUserId]);

  useEffect(() => {
    if (!openSupplier) {
      const fetchSuppliers = async () => {
        try {
          const userId = selectedUserId ?? currentUserId;

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}supplier/unfiltered/${userId}`
          );
          if (!response.ok) throw new Error("Failed to fetch suppliers");

          const data: Supplier[] = await response.json();
          const mappedSuppliers = data.map((supplier) => ({
            supplierId: supplier.supplierId ?? 0,
            companyName: supplier.companyName,
            contactPerson: supplier.contactPerson,
            email: supplier.email,
            address: supplier.address,
            phoneNumber: supplier.phoneNumber,
          }));

          setSuppliers(mappedSuppliers);
        } catch (error) {
          console.error("Error fetching suppliers:", error);
        }
      };

      fetchSuppliers();
    }
  }, [openSupplier, selectedUserId, currentUserId, clearFilter]);

  return (
    <div className="flex justify-center items-center bg-gray-100 overflow-hidden">
      <Card className="p-8 w-full max-w-[1000px] max-h-[700px] shadow-lg">
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
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? option : null);
                              }}
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
                <div>
                  <h4 className="text-s font-bold py-1">
                    Supplier Information
                  </h4>
                </div>

                <div>
                  <h4 className="text-s font-bold py-1">Buyer Information</h4>
                </div>

                <FormField
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <FormControl>
                        <Popover
                          open={openSupplier}
                          onOpenChange={setOpenSupplier}
                        >
                          <PopoverTrigger
                            asChild
                            className={cn(
                              selectedSupplierId === null
                                ? "text-gray-500"
                                : "text-black"
                            )}
                          >
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {selectedSupplierId
                                ? suppliers.find(
                                    (supplier) =>
                                      supplier.supplierId === selectedSupplierId
                                  )?.companyName
                                : "Select supplier..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="flex p-0">
                            <Command>
                              <CommandInput placeholder="Search supplier..." />
                              <CommandList>
                                <CommandEmpty>No supplier found.</CommandEmpty>
                                <CommandGroup>
                                  <div className="max-h-36 overflow-y-auto">
                                    {suppliers.map((supplier) => (
                                      <CommandItem
                                        className="group"
                                        key={supplier.companyName}
                                        value={supplier.companyName}
                                        onSelect={() => {
                                          setSelectedSupplierId(
                                            selectedSupplierId ===
                                              supplier.supplierId
                                              ? null
                                              : supplier.supplierId
                                          );
                                          field.onChange(supplier.supplierId);
                                          setOpenSupplier(false);
                                        }}
                                      >
                                        <Check
                                          className={
                                            selectedSupplierId ===
                                            supplier.supplierId
                                              ? "mr-2 h-4 w-4 opacity-100"
                                              : "mr-2 h-4 w-4 opacity-0"
                                          }
                                        />

                                        <div className="flex right-0 justify-between w-full">
                                          {supplier.companyName}
                                          <Button
                                            variant="ghost"
                                            onClick={() => {
                                              setSelectedSupplierId(
                                                supplier.supplierId
                                              );
                                              setHideDialogOpen(true);
                                            }}
                                            className="h-6 p-0 hidden group-hover:block hover:bg-red-200"
                                          >
                                            <Archive className="h-6 w-6 text-red-600" />
                                          </Button>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </div>
                                  <CommandItem
                                    value="AddSupplier"
                                    onSelect={() => {
                                      setOpenSupplier(false);
                                    }}
                                    className="px-0 pb-1"
                                  >
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="rounded-lg bg-red-600 hover:bg-red-900 text-white w-full text-left justify-start"
                                      onClick={() => {
                                        clearFilter();
                                      }}
                                    >
                                      <ArchiveRestore />
                                      Remove filters
                                    </Button>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="rounded-lg bg-teal-600 hover:bg-teal-900 text-white w-full text-left justify-start"
                                      onClick={() => {
                                        setSupplierDialogOpen(true);
                                      }}
                                    >
                                      <PlusCircle className="" />
                                      Add Supplier
                                    </Button>
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                          value={
                            selectedSupplierId
                              ? suppliers.find(
                                  (supplier) =>
                                    supplier.supplierId === selectedSupplierId
                                )?.address || ""
                              : ""
                          }
                          readOnly
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
                          value={
                            selectedSupplierId
                              ? suppliers.find(
                                  (supplier) =>
                                    supplier.supplierId === selectedSupplierId
                                )?.phoneNumber || ""
                              : ""
                          }
                          readOnly
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
                          value={
                            selectedSupplierId
                              ? suppliers.find(
                                  (supplier) =>
                                    supplier.supplierId === selectedSupplierId
                                )?.email || ""
                              : ""
                          }
                          readOnly
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
                          value={
                            selectedSupplierId
                              ? suppliers.find(
                                  (supplier) =>
                                    supplier.supplierId === selectedSupplierId
                                )?.contactPerson || ""
                              : ""
                          }
                          readOnly
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
                      <th className="text-sm px-2 py-1 border">Laboratory</th>
                      <th className="text-sm px-2 py-1 border">Item Code</th>
                      <th className="text-sm px-2 py-1 border">Item Name</th>
                      <th className="text-sm px-2 py-1 border">Category</th>
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
                            value={item.labName}
                            onChange={(e) =>
                              handleChange(index, "labName", e.target.value)
                            }
                            placeholder="Laboratory"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Input
                            value={item.itemCode}
                            onChange={(e) =>
                              handleChange(index, "itemCode", e.target.value)
                            }
                            placeholder="Item Code"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Input
                            value={item.itemName}
                            onChange={(e) =>
                              handleChange(index, "itemName", e.target.value)
                            }
                            placeholder="Item Name"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Input
                            value={item.category}
                            onChange={(e) =>
                              handleChange(index, "category", e.target.value)
                            }
                            placeholder="Category"
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
                      <td colSpan={9}>
                        <div className="flex justify-center">
                          <Button
                            onClick={handleAddRow}
                            className="bg-amber-50 text-black hover:bg-amber-100 w-full"
                          >
                            Add New Row
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="border px-4 py-2"></td>
                      <td colSpan={2} className="border px-4 py-2 text-sm">
                        Subtotal:{" "}
                      </td>
                      <td colSpan={2} className="border px-4 py-2"></td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="border px-4 py-2"></td>
                      <td colSpan={2} className="border px-4 py-2 text-sm">
                        Tax :{" "}
                      </td>
                      <td colSpan={2} className="border px-4 py-2">
                        <Input type="number" />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="border px-4 py-2"></td>
                      <td colSpan={2} className="border px-4 py-2 text-sm">
                        Shipping Cost:{" "}
                      </td>
                      <td colSpan={2} className="border px-4 py-2"></td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="border px-4 py-2"></td>
                      <td colSpan={2} className="border px-4 py-2 text-sm">
                        Grand Total:{" "}
                      </td>
                      <td colSpan={2} className="border px-4 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-5">
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
      <Dialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen}>
        <DialogContent className="bg-white w-96">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight pb-2">
              <PlusCircle className="text-teal-500 size-5 -mt-0.5" />
              Add Supplier
            </DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new supplier.
            </DialogDescription>
          </DialogHeader>
          <AddSupplier closeDialog={() => setSupplierDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabPurchaseOrder;
