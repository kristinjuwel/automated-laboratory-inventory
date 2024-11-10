"use client";
import Biological from "@/components/molecules/biological";
import CalibrationLogs from "@/components/molecules/calibration-logs";
import Chemical from "@/components/molecules/chemical";
import Disposition from "@/components/molecules/disposition";
import GeneralSupplies from "@/components/molecules/general";
import PurchaseOrder from "@/components/molecules/purchase-order";
import Reagent from "@/components/molecules/reagent";
import ReagentDispense from "@/components/molecules/reagent-dispense";
import StockLevel from "@/components/molecules/stock-level";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Package,
  Box,
  ShoppingBag,
  Sliders,
  Thermometer,
  LogOut,
  FlaskConical,
  Syringe,
  Dna,
  Microscope,
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation"; // Import usePathname to get the current path

const DashboardPage = () => {
  const pathname = usePathname();
  const labSlug = pathname?.split("/")[2];

  const [activeInventoryTab, setActiveInventoryTab] = useState("biological");
  const getIconByLab = (labSlug: string) => {
    switch (labSlug) {
      case "pathology":
        return (
          <Microscope
            size={32}
            strokeWidth={3}
            className="text-teal-700 mr-3"
          />
        );
      case "immunology":
        return (
          <Syringe size={32} strokeWidth={3} className="text-teal-700 mr-3" />
        );
      case "microbiology":
        return <Dna size={32} strokeWidth={3} className="text-teal-700 mr-3" />;
      default:
        return (
          <FlaskConical
            size={32}
            strokeWidth={3}
            className="text-teal-700 mr-3"
          />
        );
    }
  };
  return (
    <div className="h-full w-full max-w-screen flex">
      <div className="flex-grow">
        <div className="flex items-center justify-center mb-8 pt-8">
          {getIconByLab(labSlug)}
          <h1 className="text-4xl font-bold text-teal-700 capitalize">
            {cn(labSlug ? `${labSlug} Laboratory` : "Loading...")}
          </h1>
        </div>

        <Tabs
          defaultValue="inventory"
          className="rounded-xl bg-white border-2 border-teal-100 lg:w-[1445px] max-w-[1445px] place-self-center"
        >
          <TabsList className="flex justify-around bg-teal-50 text-black rounded-b-none py-6">
            <TabsTrigger
              value="inventory"
              className="flex items-center space-x-2"
            >
              <Package size={20} />
              <span className="font-medium">Inventory</span>
            </TabsTrigger>
            <TabsTrigger
              value="purchaseOrder"
              className="flex items-center space-x-2"
            >
              <ShoppingBag size={20} />
              <span className="font-medium">Purchase Order</span>
            </TabsTrigger>
            <TabsTrigger
              value="stockLevel"
              className="flex items-center space-x-2"
            >
              <Box size={20} />
              <span className="font-medium">Stock Level</span>
            </TabsTrigger>
            <TabsTrigger
              value="disposition"
              className="flex items-center space-x-2"
            >
              <LogOut size={20} />
              <span className="font-medium">Disposition</span>
            </TabsTrigger>
            <TabsTrigger
              value="calibrationLogs"
              className="flex items-center space-x-2"
            >
              <Sliders size={20} />
              <span className="font-medium">Calibration Logs</span>
            </TabsTrigger>
            <TabsTrigger
              value="reagentsDispense"
              className="flex items-center space-x-2"
            >
              <Thermometer size={20} />
              <span className="font-medium">Reagents Dispense</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <div className="flex gap-2">
              <div className="w-1/12 border-teal-100 border-r-2 px-4">
                <ul className="space-y-2 py-4">
                  <li
                    className={cn(
                      `cursor-pointer p-2 rounded-md ${
                        activeInventoryTab === "biological"
                          ? "bg-teal-100 text-black"
                          : "hover:bg-teal-50"
                      }`
                    )}
                    onClick={() => setActiveInventoryTab("biological")}
                  >
                    Biological
                  </li>
                  <li
                    className={cn(
                      `cursor-pointer p-2 rounded-md ${
                        activeInventoryTab === "chemical"
                          ? "bg-teal-100 text-black"
                          : "hover:bg-teal-50"
                      }`
                    )}
                    onClick={() => setActiveInventoryTab("chemical")}
                  >
                    Chemical
                  </li>
                  <li
                    className={cn(
                      `cursor-pointer p-2 rounded-md ${
                        activeInventoryTab === "general"
                          ? "bg-teal-100 text-black"
                          : "hover:bg-teal-50"
                      }`
                    )}
                    onClick={() => setActiveInventoryTab("general")}
                  >
                    General
                  </li>
                  <li
                    className={cn(
                      `cursor-pointer p-2 rounded-md ${
                        activeInventoryTab === "reagent"
                          ? "bg-teal-100 text-black"
                          : "hover:bg-teal-50"
                      }`
                    )}
                    onClick={() => setActiveInventoryTab("reagent")}
                  >
                    Reagent
                  </li>
                </ul>
              </div>
              <div className="w-11/12">
                {activeInventoryTab === "biological" && <Biological />}
                {activeInventoryTab === "chemical" && <Chemical />}
                {activeInventoryTab === "general" && <GeneralSupplies />}
                {activeInventoryTab === "reagent" && <Reagent />}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="purchaseOrder" className="h-full">
            <PurchaseOrder />
          </TabsContent>
          <TabsContent value="stockLevel">
            <StockLevel />
          </TabsContent>
          <TabsContent value="disposition">
            <Disposition />
          </TabsContent>
          <TabsContent value="calibrationLogs">
            <CalibrationLogs />
          </TabsContent>
          <TabsContent value="reagentsDispense">
            <ReagentDispense />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;