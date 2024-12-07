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
import { Edit, Search, FilePlus, Printer, Filter, ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


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
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPurchases, setFilteredPurchases] = useState<
    LabPurchaseValues[]
  >([]);
  const [search, setSearch] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] =
    useState<LabPurchaseValues | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof LabPurchaseValues | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Set<string>>(new Set());
  const [isLaboratoryOpen, setIsLaboratoryOpen] = useState(false);
  const [selectedLaboratory, setSelectedLaboratory] = useState<Set<string>>(new Set());

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
  const sortMaterials = (
    materials: LabPurchaseValues[],
    key: keyof LabPurchaseValues,
    order: "asc" | "desc"
  ) => {
    return [...materials].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });
  };

  const handleSort = (column: keyof LabPurchaseValues) => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";

    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = sortMaterials(filteredPurchases, column, newDirection);
    setFilteredPurchases(sorted);
  };

  useEffect(() => {
    const applyFilters = () => {
      const filtered = purchases.filter((purchase) => {
        const matchesSupplier =
          selectedSupplier.size === 0 || selectedSupplier.has(purchase.supplierName);
        const matchesLaboratory = 
          selectedLaboratory.size === 0 || selectedLaboratory.has(purchase.labName);
        return matchesSupplier && matchesLaboratory;
      });

      setFilteredPurchases(filtered);
      setCurrentPage(1);
    };
    applyFilters();
  }, [selectedLaboratory, selectedSupplier, purchases]);
  
  const handleLaboratoryChange = (labName: string) => {
    setSelectedLaboratory((prev) => {
      const updated = new Set(prev);
      if (updated.has(labName)) {
        updated.delete(labName);
      } else {
        updated.add(labName);
      }
      return updated;
    });
  };
  
  const handleSupplierChange = (supplierName: string) => {
    setSelectedSupplier((prev) => {
      const updated = new Set(prev);
      if (updated.has(supplierName)) {
        updated.delete(supplierName);
      } else {
        updated.add(supplierName);
      }
      return updated;
    });
  };
  
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
              `bg-teal-500 text-white w-36 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out ml-6`
            )}
            onClick={() => {
              setSelectedPurchase(null);
              router.push("/laboratory-purchase-order");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Create Form
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  `bg-teal-500 text-white w-auto justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out ml-2 flex items-center`
                )}
              >
                <Filter /> <span className="lg:flex hidden">Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-2 w-auto max-w-sm sm:max-w-lg  max-h-96 overflow-y-auto overflow-x-hidden">
              <div className="flex flex-col items-start">
              <Collapsible open={isSupplierOpen} onOpenChange={setIsSupplierOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-48 px-2 justify-start text-black text-sm font-semibold hover:bg-teal-100"
                    >
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="text-black">Supplier</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 transition-all text-sm">
                      {Array.from(
                          new Set(purchases.map((m) => m.supplierName))
                        ).map((supplierName) => (
                        <label
                          key={supplierName}
                          className="flex items-center space-x-2 whitespace-nowrap"
                        >
                          <Input
                            type="checkbox"
                            value={supplierName}
                            className="text-teal-500 accent-teal-200"
                            checked={selectedSupplier.has(supplierName)}
                            onChange={() => handleSupplierChange(supplierName)}
                          />
                          <span>{supplierName}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
              </Collapsible>
              <Collapsible open={isLaboratoryOpen} onOpenChange={setIsLaboratoryOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-48 px-2 justify-start text-black text-sm font-semibold hover:bg-teal-100"
                    >
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="text-black">Laboratory</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 transition-all text-sm">
                      {[
                        "Pathology",
                        "Immunology",
                        "Microbiology",
                      ].map((labName) => (
                        <label
                          key={labName}
                          className="flex items-center space-x-2 whitespace-nowrap"
                        >
                          <Input
                            type="checkbox"
                            value={labName}
                            className="text-teal-500 accent-teal-200"
                            checked={selectedLaboratory.has(labName)}
                            onChange={() => handleLaboratoryChange(labName)}
                          />
                          <span>{labName}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Button
                  variant="outline"
                  className="mt-2 w-full sticky bottom-0 bg-white hover:bg-gray-200"
                  onClick={() => {
                    setSelectedLaboratory(new Set());
                    setSelectedSupplier(new Set());
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Toaster />

      <Table className="items-center justify-center">
        <TableHeader className="text-center justify-center">
          <TableRow>
            <TableHead onClick={() => handleSort("purchaseOrderNo")}>
              Purchase Order No{" "} {sortColumn === "purchaseOrderNo" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("date")}>
              Date{" "} {sortColumn === "date" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("status")}>
              Status{" "} {sortColumn === "status" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("supplierName")}>
              Supplier{" "} {sortColumn === "supplierName" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("labName")}>
              Laboratory{" "} {sortColumn === "labName" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("quantity")}>
              Quantity{" "} {sortColumn === "quantity" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("unitPrice")}>
              Unit Price{" "} {sortColumn === "unitPrice" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("totalPrice")}>
              Total Price{" "} {sortColumn === "totalPrice" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPurchases.length > 0 ? (
            filteredPurchases.map((purchase) => (
              <TableRow key={purchase.purchaseOrderNo}>
                <TableCell
                  onClick={() => {
                    setSelectedPurchase(purchase);
                    setIsViewDialogOpen(true);
                  }}
                >
                  {" "}
                  {purchase.purchaseOrderNo}
                </TableCell>
                <TableCell
                  onClick={() => {
                    setSelectedPurchase(purchase);
                    setIsViewDialogOpen(true);
                  }}
                >
                  {purchase.date}
                </TableCell>
                <TableCell
                  onClick={() => {
                    setSelectedPurchase(purchase);
                    setIsViewDialogOpen(true);
                  }}
                >
                  {purchase.status}
                </TableCell>
                <TableCell
                  onClick={() => {
                    setSelectedPurchase(purchase);
                    setIsViewDialogOpen(true);
                  }}
                >
                  {purchase.supplierName}
                </TableCell>
                <TableCell
                  onClick={() => {
                    setSelectedPurchase(purchase);
                    setIsViewDialogOpen(true);
                  }}
                >
                  {purchase.labName}
                </TableCell>
                <TableCell
                  className="text-center"
                  onClick={() => {
                    setSelectedPurchase(purchase);
                    setIsViewDialogOpen(true);
                  }}
                >
                  {purchase.quantity}
                </TableCell>
                <TableCell
                  className="text-center"
                  onClick={() => {
                    setSelectedPurchase(purchase);
                    setIsViewDialogOpen(true);
                  }}
                >
                  {purchase.unitPrice.toFixed(2)}
                </TableCell>
                <TableCell
                  className="text-center"
                  onClick={() => {
                    setSelectedPurchase(purchase);
                    setIsViewDialogOpen(true);
                  }}
                >
                  {purchase.totalPrice.toFixed(2)}
                </TableCell>
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
            <DialogDescription />
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 font-semibold text-gray-800">
              Supplier Information
            </div>
            <div className="mb-4">
              <label
                htmlFor="supplierName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Name
              </label>
              <Input
                id="supplierName"
                value={selectedPurchase?.supplierName}
                placeholder="Supplier Name"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, supplierName: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="supplierAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Address
              </label>
              <Input
                id="supplierAddress"
                value={selectedPurchase?.supplierAddress}
                placeholder="Supplier Address"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, supplierAddress: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="supplierPhoneNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Phone No
              </label>
              <Input
                id="supplierPhoneNo"
                value={selectedPurchase?.supplierPhoneNo}
                placeholder="Supplier Phone No"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, supplierPhoneNo: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="supplierEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Email
              </label>
              <Input
                id="supplierEmail"
                value={selectedPurchase?.supplierEmail}
                placeholder="Supplier Email"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, supplierEmail: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="mb-4 col-span-2">
              <label
                htmlFor="supplierContactPerson"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Contact Person
              </label>
              <Input
                id="supplierContactPerson"
                value={selectedPurchase?.supplierContactPerson}
                placeholder="Supplier Contact Person"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev
                      ? { ...prev, supplierContactPerson: e.target.value }
                      : null
                  )
                }
              />
            </div>

            {/* Lab Information Section */}
            <div className="col-span-2 font-semibold text-gray-800 mt-4">
              Lab Information
            </div>
            <div className="mb-4">
              <label
                htmlFor="labName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lab Name
              </label>
              <Input
                id="labName"
                value={selectedPurchase?.labName}
                placeholder="Lab Name"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, labName: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="labAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lab Address
              </label>
              <Input
                id="labAddress"
                value={selectedPurchase?.labAddress}
                placeholder="Lab Address"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, labAddress: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="labPhoneNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lab Phone No
              </label>
              <Input
                id="labPhoneNo"
                value={selectedPurchase?.labPhoneNo}
                placeholder="Lab Phone No"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, labPhoneNo: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="labEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lab Email
              </label>
              <Input
                id="labEmail"
                value={selectedPurchase?.labEmail}
                placeholder="Lab Email"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, labEmail: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="mb-4 col-span-2">
              <label
                htmlFor="labContactPerson"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lab Contact Person
              </label>
              <Input
                id="labContactPerson"
                value={selectedPurchase?.labContactPerson}
                placeholder="Lab Contact Person"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, labContactPerson: e.target.value } : null
                  )
                }
              />
            </div>

            {/* Order Details Section */}
            <div className="col-span-2 font-semibold text-gray-800 mt-4">
              Order Details
            </div>
            <div className="mb-4 col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <Input
                id="description"
                value={selectedPurchase?.description}
                placeholder="Description"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                value={selectedPurchase?.quantity}
                placeholder="Quantity"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, quantity: Number(e.target.value) } : null
                  )
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="unitPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit Price
              </label>
              <Input
                id="unitPrice"
                type="number"
                value={selectedPurchase?.unitPrice}
                placeholder="Unit Price"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev ? { ...prev, unitPrice: Number(e.target.value) } : null
                  )
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="totalPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Total Price
              </label>
              <Input
                id="totalPrice"
                type="number"
                value={selectedPurchase?.totalPrice}
                placeholder="Total Price"
                onChange={(e) =>
                  setSelectedPurchase((prev) =>
                    prev
                      ? { ...prev, totalPrice: Number(e.target.value) }
                      : null
                  )
                }
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
                        purchase.purchaseOrderNo ===
                        selectedPurchase.purchaseOrderNo
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
              <label
                htmlFor="purchaseOrderNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Purchase Order Number
              </label>
              <Input
                id="purchaseOrderNo"
                value={selectedPurchase?.purchaseOrderNo}
                placeholder="Purchase Order Number"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Purchase Date
              </label>
              <Input
                id="date"
                value={selectedPurchase?.date}
                placeholder="Purchase Date"
                readOnly
              />
            </div>
            <div className="mb-4 col-span-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Purchase Status
              </label>
              <Input
                id="status"
                value={selectedPurchase?.status}
                placeholder="Purchase Status"
                readOnly
              />
            </div>

            {/* Supplier Information Section */}
            <div className="col-span-2 font-semibold text-gray-800">
              Supplier Information
            </div>
            <div className="mb-4">
              <label
                htmlFor="supplierName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Name
              </label>
              <Input
                id="supplierName"
                value={selectedPurchase?.supplierName}
                placeholder="Supplier Name"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="supplierAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Address
              </label>
              <Input
                id="supplierAddress"
                value={selectedPurchase?.supplierAddress}
                placeholder="Supplier Address"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="supplierPhoneNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Phone No
              </label>
              <Input
                id="supplierPhoneNo"
                value={selectedPurchase?.supplierPhoneNo}
                placeholder="Supplier Phone No"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="supplierEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Email
              </label>
              <Input
                id="supplierEmail"
                value={selectedPurchase?.supplierEmail}
                placeholder="Supplier Email"
                readOnly
              />
            </div>
            <div className="mb-4 col-span-2">
              <label
                htmlFor="supplierContactPerson"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Contact Person
              </label>
              <Input
                id="supplierContactPerson"
                value={selectedPurchase?.supplierContactPerson}
                placeholder="Supplier Contact Person"
                readOnly
              />
            </div>

            {/* Lab Information Section */}
            <div className="col-span-2 font-semibold text-gray-800 mt-4">
              Lab Information
            </div>
            <div className="mb-4">
              <label
                htmlFor="labName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lab Name
              </label>
              <Input
                id="labName"
                value={selectedPurchase?.labName}
                placeholder="Lab Name"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="labAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lab Address
              </label>
              <Input
                id="labAddress"
                value={selectedPurchase?.labAddress}
                placeholder="Lab Address"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="labPhoneNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lab Phone No
              </label>
              <Input
                id="labPhoneNo"
                value={selectedPurchase?.labPhoneNo}
                placeholder="Lab Phone No"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="labEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lab Email
              </label>
              <Input
                id="labEmail"
                value={selectedPurchase?.labEmail}
                placeholder="Lab Email"
                readOnly
              />
            </div>
            <div className="mb-4 col-span-2">
              <label
                htmlFor="labContactPerson"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lab Contact Person
              </label>
              <Input
                id="labContactPerson"
                value={selectedPurchase?.labContactPerson}
                placeholder="Lab Contact Person"
                readOnly
              />
            </div>

            {/* Order Details Section */}
            <div className="col-span-2 font-semibold text-gray-800 mt-4">
              Order Details
            </div>
            <div className="mb-4 col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <Input
                id="description"
                value={selectedPurchase?.description}
                placeholder="Description"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                value={selectedPurchase?.quantity}
                placeholder="Quantity"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="unitPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit Price
              </label>
              <Input
                id="unitPrice"
                type="number"
                value={selectedPurchase?.unitPrice}
                placeholder="Unit Price"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="totalPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Total Price
              </label>
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
            <Button onClick={() => setIsDeleteDialogOpen(false)}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrder;
