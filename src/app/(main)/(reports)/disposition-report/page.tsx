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
