"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Edit, Search, FilePlus, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  purchaseOrderNumber: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const PurchaseOrder = () => {
  const router = useRouter();
  const [purchases, setPurchases] = useState<LabPurchaseValues[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<LabPurchaseValues[]>([]);
  const [search, setSearch] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<LabPurchaseValues | null>(null);

  useEffect(() => {
    const fetchData: LabPurchaseValues[] = [
      {
        purchaseOrderNo: "ABC12345",
        date: "2024-02-14",
        status: "Pending",
        supplierName: "Williams-Mcdonald",
        supplierAddress: "847 Ellis Islands Suite 041\nShawtown, HI 22316",
        supplierPhoneNo: "674.525.3775x51071",
        supplierEmail: "shannon16@roberts-aguilar.net",
        supplierContactPerson: "Jeffrey Perez",
        labName: "Pham-Peterson",
        labAddress: "52425 Nicole Stream Apt. 845\nCassandratown, OH 56715",
        labPhoneNo: "+1-027-008-4874",
        labEmail: "chavezrobert@mitchell.com",
        labContactPerson: "Gary Hays",
        purchaseOrderNumber: "ABC12345-1",
        description: "Robust multi-tasking software",
        quantity: 67,
        unitPrice: 285.89,
        totalPrice: 19154.63,
      },
      {
        purchaseOrderNo: "ABC12345",
        date: "2024-02-14",
        status: "Pending",
        supplierName: "John-Mcdonald",
        supplierAddress: "847 Ellis Islands Suite 041\nShawtown, HI 22316",
        supplierPhoneNo: "674.525.3775x51071",
        supplierEmail: "johncena@roberts-aguilar.net",
        supplierContactPerson: "Jeffrey Perez",
        labName: "Pham-Peterson",
        labAddress: "52425 Nicole Stream Apt. 845\nCassandratown, OH 56715",
        labPhoneNo: "+1-027-008-4874",
        labEmail: "chavezrobert@mitchell.com",
        labContactPerson: "Gary Hays",
        purchaseOrderNumber: "DEF12345-2",
        description: "ERP",
        quantity: 6,
        unitPrice: 2135.89,
        totalPrice: 19183184.63,
      },
      {
        purchaseOrderNo: "ABC12345",
        date: "2024-02-14",
        status: "Pending",
        supplierName: "Williams-Mcdonald",
        supplierAddress: "847 Ellis Islands Suite 041\nShawtown, HI 22316",
        supplierPhoneNo: "674.525.3775x51071",
        supplierEmail: "shannon16@roberts-aguilar.net",
        supplierContactPerson: "Jeffrey Perez",
        labName: "Pham-Peterson",
        labAddress: "52425 Nicole Stream Apt. 845\nCassandratown, OH 56715",
        labPhoneNo: "+1-027-008-4874",
        labEmail: "chavezrobert@mitchell.com",
        labContactPerson: "Gary Hays",
        purchaseOrderNumber: "ABC12345-1",
        description: "Robust multi-tasking software",
        quantity: 67,
        unitPrice: 285.89,
        totalPrice: 19154.63,
      },
    ];
    setPurchases(fetchData);
    setFilteredPurchases(fetchData);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);

    setFilteredPurchases(
      purchases.filter((purchase) =>
        `${purchase.supplierName} ${purchase.labName} ${purchase.description}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">
        Purchase Order Forms
      </h1>
      <div className="flex text-right justify-left items-center mb-4">
        <div className="flex items-center">
          <Input
            placeholder="Search for an entry"
            value={search}
            onChange={handleSearch}
            className="w-80 pr-8"
          />
          <span className="relative -ml-8">
            <Search className="size-5 text-gray-500" />
          </span>

          <Button
            className={cn(
              `bg-teal-500 text-white w-36 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out mx-6`
            )}
            onClick={() => {
              setSelectedPurchase(null);
              router.push("/laboratory-purchase-order")
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Create Form
          </Button>
        </div>
      </div>

      <Toaster />

      <Table className="items-center justify-center">
      <TableHeader className="text-center justify-center">
          <TableRow>
            <TableHead>Purchase Order No</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Laboratory</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPurchases.length > 0 ? (
            filteredPurchases.map((purchase) => (
              <TableRow key={purchase.purchaseOrderNo} >
                <TableCell 
                onClick={() => {
                setSelectedPurchase(purchase);
                setIsViewDialogOpen(true);
                }}> {purchase.purchaseOrderNo}</TableCell>
                <TableCell onClick={() => {
                setSelectedPurchase(purchase);
                setIsViewDialogOpen(true);
                }}>{purchase.date}</TableCell>
                <TableCell onClick={() => {
                setSelectedPurchase(purchase);
                setIsViewDialogOpen(true);
                }}>{purchase.status}</TableCell>
                <TableCell onClick={() => {
                setSelectedPurchase(purchase);
                setIsViewDialogOpen(true);
                }}>{purchase.supplierName}</TableCell>
                <TableCell onClick={() => {
                setSelectedPurchase(purchase);
                setIsViewDialogOpen(true);
                }}>{purchase.labName}</TableCell>
                <TableCell className="text-center" 
                onClick={() => {
                  setSelectedPurchase(purchase);
                  setIsViewDialogOpen(true);
                }}>{purchase.quantity}</TableCell>
                <TableCell className="text-center"
                onClick={() => {
                  setSelectedPurchase(purchase);
                  setIsViewDialogOpen(true);
                }}>{purchase.unitPrice.toFixed(2)}</TableCell>
                <TableCell className="text-center"
                onClick={() => {
                  setSelectedPurchase(purchase);
                  setIsViewDialogOpen(true);
                }}>{purchase.totalPrice.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md text-cyan-600 hover:text-cyan-900 hover:bg-cyan-50"
                    onClick={() => {
                      setSelectedPurchase(purchase);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 -mr-0.5" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md text-black-600 hover:text-black-900 hover:bg-black-50"
                    onClick={() => {
                      setSelectedPurchase(purchase);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Printer className="w-4 h-4 -mr-1" /> Print
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={17} className="text-center text-gray-500">
                No purchase orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-w-[1000px] max-h-[700px] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Edit Purchase Order</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">

            {/* Supplier Information Section */}
            <div className="col-span-2 font-semibold text-gray-800">Supplier Information</div>
            <div className="mb-4">
              <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
              <Input
                id="supplierName"
                value={selectedPurchase?.supplierName}
                placeholder="Supplier Name"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, supplierName: e.target.value } : null)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="supplierAddress" className="block text-sm font-medium text-gray-700 mb-1">Supplier Address</label>
              <Input
                id="supplierAddress"
                value={selectedPurchase?.supplierAddress}
                placeholder="Supplier Address"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, supplierAddress: e.target.value } : null)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="supplierPhoneNo" className="block text-sm font-medium text-gray-700 mb-1">Supplier Phone No</label>
              <Input
                id="supplierPhoneNo"
                value={selectedPurchase?.supplierPhoneNo}
                placeholder="Supplier Phone No"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, supplierPhoneNo: e.target.value } : null)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="supplierEmail" className="block text-sm font-medium text-gray-700 mb-1">Supplier Email</label>
              <Input
                id="supplierEmail"
                value={selectedPurchase?.supplierEmail}
                placeholder="Supplier Email"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, supplierEmail: e.target.value } : null)}
              />
            </div>
            <div className="mb-4 col-span-2">
              <label htmlFor="supplierContactPerson" className="block text-sm font-medium text-gray-700 mb-1">Supplier Contact Person</label>
              <Input
                id="supplierContactPerson"
                value={selectedPurchase?.supplierContactPerson}
                placeholder="Supplier Contact Person"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, supplierContactPerson: e.target.value } : null)}
              />
            </div>

            {/* Lab Information Section */}
            <div className="col-span-2 font-semibold text-gray-800 mt-4">Lab Information</div>
            <div className="mb-4">
              <label htmlFor="labName" className="block text-sm font-medium text-gray-700 mb-1">Lab Name</label>
              <Input
                id="labName"
                value={selectedPurchase?.labName}
                placeholder="Lab Name"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, labName: e.target.value } : null)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="labAddress" className="block text-sm font-medium text-gray-700 mb-1">Lab Address</label>
              <Input
                id="labAddress"
                value={selectedPurchase?.labAddress}
                placeholder="Lab Address"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, labAddress: e.target.value } : null)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="labPhoneNo" className="block text-sm font-medium text-gray-700 mb-1">Lab Phone No</label>
              <Input
                id="labPhoneNo"
                value={selectedPurchase?.labPhoneNo}
                placeholder="Lab Phone No"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, labPhoneNo: e.target.value } : null)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="labEmail" className="block text-sm font-medium text-gray-700 mb-1">Lab Email</label>
              <Input
                id="labEmail"
                value={selectedPurchase?.labEmail}
                placeholder="Lab Email"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, labEmail: e.target.value } : null)}
              />
            </div>
            <div className="mb-4 col-span-2">
              <label htmlFor="labContactPerson" className="block text-sm font-medium text-gray-700 mb-1">Lab Contact Person</label>
              <Input
                id="labContactPerson"
                value={selectedPurchase?.labContactPerson}
                placeholder="Lab Contact Person"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, labContactPerson: e.target.value } : null)}
              />
            </div>

            {/* Order Details Section */}
            <div className="col-span-2 font-semibold text-gray-800 mt-4">Order Details</div>
            <div className="mb-4 col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Input
                id="description"
                value={selectedPurchase?.description}
                placeholder="Description"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, description: e.target.value } : null)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <Input
                id="quantity"
                type="number"
                value={selectedPurchase?.quantity}
                placeholder="Quantity"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, quantity: Number(e.target.value) } : null)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
              <Input
                id="unitPrice"
                type="number"
                value={selectedPurchase?.unitPrice}
                placeholder="Unit Price"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, unitPrice: Number(e.target.value) } : null)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
              <Input
                id="totalPrice"
                type="number"
                value={selectedPurchase?.totalPrice}
                placeholder="Total Price"
                onChange={(e) => setSelectedPurchase((prev) => prev ? { ...prev, totalPrice: Number(e.target.value) } : null)}
              />
            </div>

            {/* Save Button */}
            <div className="col-span-2 flex justify-end">
              <Button
                className="mt-4"
                onClick={() => {
                  if (selectedPurchase) {
                    setPurchases((prev) =>
                      prev.map((purchase) =>
                        purchase.purchaseOrderNo === selectedPurchase.purchaseOrderNo
                          ? selectedPurchase
                          : purchase
                      )
                    );
                    setIsEditDialogOpen(false);
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="bg-white max-w-[1000px] max-h-[700px] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>View Purchase Order</DialogTitle>
        </DialogHeader>

    <div className="grid grid-cols-2 gap-4">
      <div className="mb-4">
        <label htmlFor="purchaseOrderNo" className="block text-sm font-medium text-gray-700 mb-1">Purchase Order Number</label>
        <Input
          id="purchaseOrderNo"
          value={selectedPurchase?.purchaseOrderNo}
          placeholder="Purchase Order Number"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
        <Input
          id="date"
          value={selectedPurchase?.date}
          placeholder="Purchase Date"
          readOnly
        />
      </div>
      <div className="mb-4 col-span-2">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Purchase Status</label>
        <Input
          id="status"
          value={selectedPurchase?.status}
          placeholder="Purchase Status"
          readOnly
        />
      </div>

      {/* Supplier Information Section */}
      <div className="col-span-2 font-semibold text-gray-800">Supplier Information</div>
      <div className="mb-4">
        <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
        <Input
          id="supplierName"
          value={selectedPurchase?.supplierName}
          placeholder="Supplier Name"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label htmlFor="supplierAddress" className="block text-sm font-medium text-gray-700 mb-1">Supplier Address</label>
        <Input
          id="supplierAddress"
          value={selectedPurchase?.supplierAddress}
          placeholder="Supplier Address"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label htmlFor="supplierPhoneNo" className="block text-sm font-medium text-gray-700 mb-1">Supplier Phone No</label>
        <Input
          id="supplierPhoneNo"
          value={selectedPurchase?.supplierPhoneNo}
          placeholder="Supplier Phone No"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label htmlFor="supplierEmail" className="block text-sm font-medium text-gray-700 mb-1">Supplier Email</label>
        <Input
          id="supplierEmail"
          value={selectedPurchase?.supplierEmail}
          placeholder="Supplier Email"
          readOnly
        />
      </div>
      <div className="mb-4 col-span-2">
        <label htmlFor="supplierContactPerson" className="block text-sm font-medium text-gray-700 mb-1">Supplier Contact Person</label>
        <Input
          id="supplierContactPerson"
          value={selectedPurchase?.supplierContactPerson}
          placeholder="Supplier Contact Person"
          readOnly
        />
      </div>

      {/* Lab Information Section */}
      <div className="col-span-2 font-semibold text-gray-800 mt-4">Lab Information</div>
      <div className="mb-4">
        <label htmlFor="labName" className="block text-sm font-medium text-gray-700 mb-1">Lab Name</label>
        <Input
          id="labName"
          value={selectedPurchase?.labName}
          placeholder="Lab Name"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label htmlFor="labAddress" className="block text-sm font-medium text-gray-700 mb-1">Lab Address</label>
        <Input
          id="labAddress"
          value={selectedPurchase?.labAddress}
          placeholder="Lab Address"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label htmlFor="labPhoneNo" className="block text-sm font-medium text-gray-700 mb-1">Lab Phone No</label>
        <Input
          id="labPhoneNo"
          value={selectedPurchase?.labPhoneNo}
          placeholder="Lab Phone No"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label htmlFor="labEmail" className="block text-sm font-medium text-gray-700 mb-1">Lab Email</label>
        <Input
          id="labEmail"
          value={selectedPurchase?.labEmail}
          placeholder="Lab Email"
          readOnly
        />
      </div>
      <div className="mb-4 col-span-2">
        <label htmlFor="labContactPerson" className="block text-sm font-medium text-gray-700 mb-1">Lab Contact Person</label>
        <Input
          id="labContactPerson"
          value={selectedPurchase?.labContactPerson}
          placeholder="Lab Contact Person"
          readOnly
        />
      </div>

      {/* Order Details Section */}
      <div className="col-span-2 font-semibold text-gray-800 mt-4">Order Details</div>
      <div className="mb-4 col-span-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <Input
          id="description"
          value={selectedPurchase?.description}
          placeholder="Description"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <Input
          id="quantity"
          type="number"
          value={selectedPurchase?.quantity}
          placeholder="Quantity"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
        <Input
          id="unitPrice"
          type="number"
          value={selectedPurchase?.unitPrice}
          placeholder="Unit Price"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
        <Input
          id="totalPrice"
          type="number"
          value={selectedPurchase?.totalPrice}
          placeholder="Total Price"
          readOnly
        />
      </div>

    </div>
  </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              Print Purchase Order Form
            </DialogTitle>
          </DialogHeader>
          <p className="text-left pt-2 text-sm">
            Are you sure you want to print this form?
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

export default PurchaseOrder;