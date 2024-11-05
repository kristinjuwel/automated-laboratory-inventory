"use client";

import React from "react";
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
import { DatePickerWithPresets } from "@/components/ui/datepicker";

const stockData = [
  {
    itemNo: "001",
    description: "Microscope, Model XYZ",
    stockOnHand: 5,
    minStock: 2,
    maxStock: 10,
  },
  {
    itemNo: "002",
    description: "Glass Beakers, 1000 mL",
    stockOnHand: 50,
    minStock: 5,
    maxStock: 100,
  },
];

const determineStatus = (stock: number, min: number, max: number) => {
  if (stock <= 0) return "Critical Stockout";
  if (stock <= min) return "Below Reorder Level";
  if (stock >= max) return "Sufficient";
  return "Monitor Usage";
};

const determineAction = (status: string) => {
  switch (status) {
    case "Critical Stockout":
      return "Urgent Order Needed";
    case "Below Reorder Level":
      return "Reorder Soon";
    case "Sufficient":
      return "None";
    default:
      return "Monitor Usage";
  }
};

const StockLevelReport = () => {

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
          <h1 className="text-xl font-bold py-1">Stock Level Report</h1>
          <hr className="w-full border-t-1 border-gray-300 my-1" />
        </div>

        <Toaster />

        <div className="overflow-y-auto max-h-[430px] mb-1">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Item No.</th>
              <th className="border p-2">Item Description</th>
              <th className="border p-2">Stock on Hand</th>
              <th className="border p-2">Minimum Stock Level</th>
              <th className="border p-2">Maximum Stock Level</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action Required</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((item) => {
              const status = determineStatus(
                item.stockOnHand,
                item.minStock,
                item.maxStock
              );
              const action = determineAction(status);

              return (
                <tr key={item.itemNo}>
                  <td className="border p-2">{item.itemNo}</td>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2 text-center">{item.stockOnHand}</td>
                  <td className="border p-2 text-center">{item.minStock}</td>
                  <td className="border p-2 text-center">{item.maxStock}</td>
                  <td className={`border p-2 text-center ${status === "Critical Stockout" ? "text-red-500" : ""}`}>
                    {status}
                  </td>
                  <td className="border p-2 text-center">{action}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
};

export default StockLevelReport;
