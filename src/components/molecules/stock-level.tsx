"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Search, TriangleAlert, Trash, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface StockLevelValues {
  itemNo: string;
  description: string;
  onHand: number;
  minLevel: number;
  maxLevel: number;
  status: string;
  action: string;
}

const StockLevel = () => {
  const [stockLevels, setStockLevels] = useState<StockLevelValues[]>([]);
  const [filteredStockLevels, setFilteredStockLevels] = useState<StockLevelValues[]>([]);
  const [search, setSearch] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockLevelValues | null>(null);

  useEffect(() => {
    const fetchData = [
      {
        itemNo: "001",
        description: "Test Tube",
        onHand: 150,
        minLevel: 50,
        maxLevel: 200,
        status: "Sufficient",
        action: "Monitor",
      },
      {
        itemNo: "002",
        description: "Petri Dish",
        onHand: 30,
        minLevel: 50,
        maxLevel: 200,
        status: "Low",
        action: "Reorder",
      },
      {
        itemNo: "003",
        description: "Microscope Slide",
        onHand: 120,
        minLevel: 60,
        maxLevel: 180,
        status: "Sufficient",
        action: "Monitor",
      },
    ];
    setStockLevels(fetchData);
    setFilteredStockLevels(fetchData);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);

    setFilteredStockLevels(
      stockLevels.filter((stock) =>
        `${stock.itemNo} ${stock.description}`.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">Stock Level Reports</h1>
      <div className="flex text-right justify-left items-center mb-4">
        <div className="flex items-center">
          <Input
            placeholder="Search for an item"
            value={search}
            onChange={handleSearch}
            className="w-80 pr-8"
          />
          <span className="relative -ml-8">
            <Search className="size-5 text-gray-500" />
          </span>

          <Button
            className={cn(
              `bg-teal-500 text-white w-40 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out mx-6`
            )}
            onClick={() => {
              setIsCreateDialogOpen(true);
            }}
          >
             <Printer className="w-4 h-4 -mr-1" />
            Print Report
          </Button>
        </div>
      </div>

      <Toaster />

      <Table className="items-center justify-center">
        <TableHeader className="text-center justify-center">
          <TableRow>
            <TableHead>Item No</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>On Hand</TableHead>
            <TableHead>Min Level</TableHead>
            <TableHead>Max Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStockLevels.length > 0 ? (
            filteredStockLevels.map((stock) => (
              <TableRow key={stock.itemNo}>
                <TableCell>{stock.itemNo}</TableCell>
                <TableCell>{stock.description}</TableCell>
                <TableCell>{stock.onHand}</TableCell>
                <TableCell>{stock.minLevel}</TableCell>
                <TableCell>{stock.maxLevel}</TableCell>
                <TableCell>{stock.status}</TableCell>
                <TableCell>{stock.action}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md text-cyan-600 hover:text-cyan-900 hover:bg-cyan-50"
                    onClick={() => {
                      setSelectedStock(stock);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 -mr-0.5" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md text-red-600 hover:text-red-900 hover:bg-red-50"
                    onClick={() => {
                      setSelectedStock(stock);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="w-4 h-4 -mr-1" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500">
                No stock levels found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white h-[530px] overflow-y-auto mb-8">
          <DialogHeader>
            <DialogTitle>Edit Stock Item</DialogTitle>
          </DialogHeader>
          <div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Input
                id="description"
                value={selectedStock?.description}
                placeholder="Description"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="onHand" className="block text-sm font-medium text-gray-700 mb-1">
                On Hand
              </label>
              <Input
                id="onHand"
                value={selectedStock?.onHand.toString()}
                placeholder="On Hand"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="minLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Min Level
              </label>
              <Input
                id="minLevel"
                value={selectedStock?.minLevel.toString()}
                placeholder="Min Level"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="maxLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Max Level
              </label>
              <Input
                id="maxLevel"
                value={selectedStock?.maxLevel.toString()}
                placeholder="Max Level"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Input
                id="status"
                value={selectedStock?.status}
                placeholder="Status"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
                Action
              </label>
              <Input
                id="action"
                value={selectedStock?.action}
                placeholder="Action"
              />
            </div>
            <div className="relative mb-8">
              <Button
                className="absolute right-0 mr-4 "
                onClick={() => setIsEditDialogOpen(false)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <TriangleAlert className="text-red-500 size-5 -mt-0.5" />
              Delete Stock Item
            </DialogTitle>
          </DialogHeader>
          <p className="text-left pt-2 text-sm">
            Are you sure you want to delete this stock item?
          </p>
          <p className="text-left bg-red-300 -mt-2 relative py-2 text-sm">
            <span className="pl-4">
              By deleting this item, it will be removed indefinitely.
            </span>
            <span className="absolute left-0 top-0 h-full w-2 bg-red-600"></span>
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              Print Stock Level Report
            </DialogTitle>
          </DialogHeader>
          <p className="text-left pt-2 text-sm">
            Are you sure you want to print this report?
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockLevel;