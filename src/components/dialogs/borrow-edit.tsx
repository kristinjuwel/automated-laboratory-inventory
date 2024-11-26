"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { MaterialSchema } from "@/packages/api/inventory";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { UserSchema } from "@/packages/api/user";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BorrowFormValues {
  dateBorrowed: string;
  materialId: number;
  detailsOfBorrowed: string;
  qty: number;
  unit: string;
  userId: number;
  borrowerDetail: string;
  department: string;
  timeBorrowed: string;
  dateReturned: string;
  timeReturned: string;
  remarks: string;
  damageMaterials: string;
  status: string;
}
type EditBorrowProps = {
  closeDialog: () => void;
  borrowId: number;
} & BorrowFormValues;

const EditBorrow = ({
  borrowId,
  dateBorrowed,
  materialId,
  detailsOfBorrowed,
  qty,
  unit,
  userId,
  borrowerDetail,
  department,
  timeBorrowed,
  dateReturned,
  timeReturned,
  remarks,
  damageMaterials,
  status,
  closeDialog,
}: EditBorrowProps) => {
  const [open, setOpen] = useState(false);
  const [openMaterial, setOpenMaterial] = useState(false);
  const userRole = localStorage.getItem("userRole");
  const currentUserId = userId;
  const [quantity, setQuantity] = useState<number>(qty);

  const [users, setUsers] = useState<
    { userId: number; fullName: string; laboratory: string }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(
    currentUserId ? Number(currentUserId) : null
  );
  const [selectedMaterialId, setSelectedMaterialId] = React.useState<
    number | null
  >(materialId);
  const [materials, setMaterials] = useState<
    {
      materialId: number;
      itemName: string;
      quantityAvailable: number;
      unit: string;
    }[]
  >([]);
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}material/all`
        );
        if (!response.ok) throw new Error("Failed to fetch materials");

        const data: MaterialSchema[] = await response.json();
        const mappedMaterials = data.map((material) => ({
          materialId: material.materialId ?? 0,
          itemName: material.itemName,
          quantityAvailable: material.quantityAvailable ?? 0,
          unit: material.unit,
        }));

        setMaterials(mappedMaterials);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMaterials();
  }, []);
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}all-users`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: UserSchema[] = await response.json();
        const filteredData = (() => {
          if (userRole === "admin") {
            return data.filter(
              (user) =>
                user.designation !== "admin" &&
                user.designation !== "superadmin"
            );
          } else if (userRole === "superadmin") {
            return data;
          } else {
            return data.filter((user) => user.userId === currentUserId);
          }
        })();

        const mappedUsers = filteredData.map((user) => ({
          userId: user.userId,
          fullName: `${user.firstName} ${
            user.middleName ? user.middleName + " " : ""
          }${user.lastName}`,
          laboratory: user.laboratory.labName,
        }));

        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, [currentUserId, userRole]);

  const defaultValues: BorrowFormValues = {
    dateBorrowed: dateBorrowed,
    materialId: selectedMaterialId ?? 1,
    detailsOfBorrowed: detailsOfBorrowed,
    qty: qty,
    unit: unit,
    userId: selectedUserId ?? Number(currentUserId),
    borrowerDetail: borrowerDetail,
    department: department,
    timeBorrowed: timeBorrowed,
    dateReturned: dateReturned,
    timeReturned: timeReturned,
    remarks: remarks,
    damageMaterials: damageMaterials,
    status: status,
  };

  const form = useForm<BorrowFormValues>({
    defaultValues,
  });
  const getMaxQuantity = (): number => {
    if (!selectedMaterialId) return 0;
    const material = materials.find(
      (material) => material.materialId === selectedMaterialId
    );
    return material ? material.quantityAvailable : 0;
  };

  const maxQuantity = getMaxQuantity();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxQuantity);
    setQuantity(value);
  };
  const handleSubmit = async (values: BorrowFormValues) => {
    const parsedValues = {
      ...values,
      qty: quantity,
      equipment: selectedMaterialId
        ? materials.find(
            (material) => material.materialId === selectedMaterialId
          )?.itemName || ""
        : "",
      dateBorrowed: format(new Date(values.dateBorrowed), "yyyy-MM-dd"),
      dateReturned: format(new Date(values.dateReturned), "yyyy-MM-dd"),
      unit: selectedMaterialId
        ? materials.find(
            (material) => material.materialId === selectedMaterialId
          )?.unit || ""
        : "",
      department: selectedUserId
        ? users.find((user) => user.userId === selectedUserId)?.laboratory || ""
        : "",
    };
    try {
      const borrowResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}borrow/${borrowId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedValues),
        }
      );

      if (!borrowResponse.ok) {
        throw new Error("Failed to edit borrow form");
      }

      toast.success("Borrow form edited successfully!");
      closeDialog();
    } catch (error) {
      toast.error("Edit failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center">
      <Toaster />

      <div className="overflow-y-auto max-h-[400px] mb-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
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
                    <FormLabel>Date of Return</FormLabel>
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
                    <FormLabel>Time of Return</FormLabel>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <FormField
                name="materialId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment</FormLabel>
                    <FormControl>
                      <Popover
                        open={openMaterial}
                        onOpenChange={setOpenMaterial}
                      >
                        <PopoverTrigger
                          asChild
                          className={cn(
                            selectedMaterialId === null
                              ? "text-gray-500"
                              : "text-black"
                          )}
                        >
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {selectedMaterialId
                              ? materials.find(
                                  (material) =>
                                    material.materialId === selectedMaterialId
                                )?.itemName
                              : "Select equipment..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="flex p-0">
                          <Command>
                            <CommandInput placeholder="Search equipment..." />
                            <CommandList>
                              <CommandEmpty>No equipment found.</CommandEmpty>
                              <CommandGroup>
                                <div className="max-h-36 overflow-y-auto">
                                  {materials.map((material) => (
                                    <CommandItem
                                      key={material.materialId}
                                      value={material.itemName}
                                      onSelect={() => {
                                        setSelectedMaterialId(
                                          selectedMaterialId ===
                                            material.materialId
                                            ? null
                                            : material.materialId
                                        );
                                        field.onChange(material.materialId);
                                      }}
                                    >
                                      <Check
                                        className={
                                          selectedMaterialId ===
                                          material.materialId
                                            ? "mr-2 h-4 w-4 opacity-100"
                                            : "mr-2 h-4 w-4 opacity-0"
                                        }
                                      />
                                      {material.itemName}
                                    </CommandItem>
                                  ))}
                                </div>
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Borrowed">Borrowed</SelectItem>
                          <SelectItem value="Returned">Returned</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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
                        value={quantity}
                        required
                        className="w-full"
                        max={maxQuantity}
                        min={0}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="unit"
                render={({}) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input
                        type="string"
                        value={
                          selectedMaterialId
                            ? materials.find(
                                (material) =>
                                  material.materialId === selectedMaterialId
                              )?.unit || ""
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <FormField
                name="detailsOfBorrowed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details of Borrowed Equipment</FormLabel>
                    <FormControl>
                      <Textarea
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
              <FormField
                name="damageMaterials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Damage Materials</FormLabel>
                    <FormControl>
                      <Textarea
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <FormField
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Borrower</FormLabel>
                    <FormControl>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger
                          asChild
                          className={cn(
                            selectedUserId === null
                              ? "text-gray-500"
                              : "text-black"
                          )}
                        >
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {selectedUserId
                              ? users.find(
                                  (user) => user.userId === selectedUserId
                                )?.fullName
                              : "Select personnel..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search personnel..." />
                            <CommandList>
                              <CommandEmpty>No personnel found.</CommandEmpty>
                              <CommandGroup>
                                {users.map((user) => (
                                  <CommandItem
                                    key={user.fullName}
                                    value={user.fullName.toString()}
                                    onSelect={() => {
                                      setSelectedUserId(
                                        selectedUserId === user.userId
                                          ? null
                                          : user.userId
                                      );
                                      field.onChange(user.userId);
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={
                                        selectedUserId === user.userId
                                          ? "mr-2 h-4 w-4 opacity-100"
                                          : "mr-2 h-4 w-4 opacity-0"
                                      }
                                    />
                                    {user.fullName}
                                  </CommandItem>
                                ))}
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
                name="department"
                render={({}) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input
                        value={
                          selectedMaterialId
                            ? users.find(
                                (user) => user.userId === selectedUserId
                              )?.laboratory || ""
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
            </div>

            <div className="grid grid-cols-1 gap-3 mb-4">
              <FormField
                name="borrowerDetail"
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
            </div>

            <div className="grid grid-cols-1 gap-3 mb-6">
              <FormField
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
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
            </div>

            <div className="flex justify-end gap-2 pt-6">
              <Button
                type="button"
                variant="ghost"
                className="bg-gray-100"
                onClick={closeDialog}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-teal-500 text-white hover:bg-teal-700 transition-colors duration-300 ease-in-out"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditBorrow;
