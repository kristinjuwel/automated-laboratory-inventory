import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Search,
  FilePlus,
  Printer,
  SquarePen,
  FolderOpen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import CustomPagination from "../ui/pagination-custom";
import { PurchaseOrderSchema, PurchaseSchema } from "@/packages/api/inventory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { UserSchema } from "@/packages/api/user";
import { Supplier } from "@/packages/api/lab";
import EditPurchaseOrder from "../dialogs/edit-purchase-order";
import PdfGenerator from "../templates/pdf-generator";
import PdfForm from "../templates/pdf-form";

interface PurchaseOrderValues {
  purchaseOrderId: number;
  purchaseOrderNumber: string;
  userId: number;
  userFullName: string;
  user: UserSchema;
  supplierId: number;
  supplierName: string;
  supplier: Supplier;
  date: string;
  shippingCost: number;
  totalPrice: number;
  status: string;
  labId: number;
  laboratory: string;
  tax: number;
  creationDate: string;
  dateUpdated: string;
}

const ITEMS_PER_PAGE = 4;

const PurchaseOrder = () => {
  const router = useRouter();
  const pathname = usePathname();
  const labSlug = pathname?.split("/")[2];
  const [purchases, setPurchases] = useState<PurchaseOrderValues[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseSchema[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPurchasePage, setCurrentPurchasePage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] =
    useState<PurchaseOrderValues | null>(null);
  const [filteredPurchases, setFilteredPurchases] = useState<
    PurchaseOrderValues[]
  >([]);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isPrintAllOpen, setIsPrintAllOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState<
    "portrait" | "landscape" | undefined
  >(undefined);

  useEffect(() => {
    if (!isEditDialogOpen) {
      const fetchMaterials = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}purchase-order`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch purchase orders");
          }
          const data = await response.json();
          const mappedPurchases = data.map((purchase: PurchaseOrderSchema) => ({
            ...purchase,
            userFullName: `${purchase.user.firstName} ${
              purchase.user.middleName ? purchase.user.middleName + " " : ""
            }${purchase.user.lastName}`,
            supplierName: purchase.supplier.companyName ?? "",
            laboratory: purchase.laboratory.labName,
          }));
          const purchases = mappedPurchases.filter(
            (purchase: PurchaseOrderValues) =>
              purchase.laboratory.toLowerCase() === labSlug
          );
          setPurchases(purchases);
          setFilteredPurchases(purchases);
        } catch (error) {
          console.error("Error fetching materials:", error);
        }
      };

      fetchMaterials();
    }
  }, [labSlug, isEditDialogOpen]);

  const fetchPurchasedItems = async (purchaseOrderId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}purchase/order/${purchaseOrderId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch purchase items");
      }
      const data = await response.json();
      const mappedPurchases = data.map((purchase: PurchaseSchema) => ({
        ...purchase,
      }));
      setPurchaseItems(mappedPurchases);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredPurchases(
      purchases.filter((purchase) => {
        const combinedString = `${purchase.status} ${purchase.laboratory} ${purchase.supplier} ${purchase.userFullName} ${purchase.purchaseOrderNumber}`;
        return combinedString.toLowerCase().includes(query);
      })
    );
    setCurrentPage(1);
  };

  const paginatedMaterials = filteredPurchases.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const paginatedPurchase = purchaseItems.slice(
    (currentPurchasePage - 1) * ITEMS_PER_PAGE,
    currentPurchasePage * ITEMS_PER_PAGE
  );

  const handleReturn = async () => {
    if (selectedPurchase) {
      try {
        const bodyData = {
          status: status,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}purchase-order/${selectedPurchase.purchaseOrderId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          }
        );

        if (response.ok) {
          toast.success("Status updated successfully!");
          window.location.reload();
        } else {
          throw new Error("Failed to change status");
        }
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

  const tableHeaders = [
    "PO ID",
    "Purchase Order Number",
    "Personnel",
    "Laboratory",
    "Date",
    "Shipping Cost",
    "Tax",
    "Total Price",
    "Supplier",
    "Status",
    "Created At",
    "Updated At"
  ];
  const tableData = purchases.map((purchase) => [
    purchase.purchaseOrderId,
    purchase.purchaseOrderNumber,
    purchase.userFullName,
    purchase.laboratory,
    new Date(purchase.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      purchase.shippingCost,
      purchase.tax,
      purchase.totalPrice,
      purchase.supplierName,
      purchase.status,
      new Date(purchase.creationDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      new Date(purchase.dateUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
  ]);

  const singleTableData = selectedPurchase
    ? [
        [
          selectedPurchase.purchaseOrderId,
          selectedPurchase.purchaseOrderNumber,
          selectedPurchase.userFullName,
          selectedPurchase.laboratory,
          new Date(selectedPurchase.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            selectedPurchase.shippingCost,
            selectedPurchase.tax,
            selectedPurchase.totalPrice,
            selectedPurchase.supplierName,
            selectedPurchase.status,
            new Date(selectedPurchase.creationDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
            new Date(selectedPurchase.dateUpdated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
        ],
      ]
    : [];

  return (
    <div className="p-8">
      <h1 className="text-3xl sm:text-2xl text-center sm:text-left font-semibold text-teal-700 mb-4">
        Purchase Order Forms
      </h1>
      <Toaster />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-col sm:hidden items-center gap-4 w-full">
          <div className="relative flex-grow w-full">
            <Input
              placeholder="Search for a material"
              value={search}
              onChange={handleSearch}
              className="w-full pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-500" />
            </span>
          </div>

          <Button
            className="flex items-center bg-teal-500 text-white w-full justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out"
            onClick={() => {
              router.push("/laboratory-purchase-order");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Purchase Materials
          </Button>
          <Button
            className="flex items-center bg-teal-500 text-white w-full justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out"
            onClick={() => {
              setIsPrintAllOpen(true);
            }}
          >
            <Printer className="w-4 h-4" strokeWidth={1.5} />
            Print Forms
          </Button>
        </div>

        <div className="hidden sm:flex items-center gap-4">
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
            className="bg-teal-500 text-white w-42 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out ml-6"
            onClick={() => {
              router.push("/laboratory-purchase-order");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Purchase Materials
          </Button>
          <Button
            className="flex items-center bg-teal-500 text-white w-full justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in- ml-2"
            onClick={() => {
              setIsPrintAllOpen(true);
            }}
          >
            <Printer className="w-4 h-4" strokeWidth={1.5} />
            Print Forms
          </Button>
          </div>
        </div>
      </div>

      <Toaster />
      <Table className="overflow-x-auto">
        <TableHeader className="text-center justify-center">
          <TableRow>
            <TableHead>Purchase Order Number</TableHead>
            <TableHead>Personnel</TableHead>
            <TableHead>Laboratory</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Shipping Cost</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-nowrap">Created At</TableHead>
            <TableHead className="text-nowrap">Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedMaterials.length > 0 ? (
            paginatedMaterials.map((purchase) => (
              <TableRow key={purchase.purchaseOrderId}>
                <TableCell>{purchase.purchaseOrderNumber}</TableCell>
                <TableCell>{purchase.userFullName}</TableCell>
                <TableCell>{purchase.laboratory}</TableCell>
                <TableCell>
                  {new Date(purchase.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell>{purchase.shippingCost}</TableCell>
                <TableCell>{purchase.tax}</TableCell>
                <TableCell>{purchase.totalPrice}</TableCell>
                <TableCell>{purchase.supplierName}</TableCell>
                <TableCell>
                  {purchase.status === "Completed" ? (
                    <div className="w-full px-4 py-2 rounded-md bg-green-300 font-semibold text-green-950">
                      Completed
                    </div>
                  ) : (
                    <Select
                      disabled={purchase.status === "Completed"}
                      value={purchase.status}
                      onValueChange={(newStatus) => {
                        setSelectedPurchase(purchase);
                        setStatus(newStatus);
                        setIsReturnDialogOpen(true);
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          purchase.status === "Cancelled"
                            ? "bg-red-300 text-red-950"
                            : purchase.status === "Completed"
                            ? "bg-green-300 text-green-950"
                            : purchase.status === "Submitted"
                            ? "bg-yellow-100 text-yellow-800"
                            : purchase.status === "Procurement Office"
                            ? "bg-blue-300 text-blue-950"
                            : purchase.status === "Accounting Office"
                            ? "bg-purple-300 text-purple-950"
                            : purchase.status === "Delivered"
                            ? "bg-orange-300 text-orange-950"
                            : "bg-emerald-300 text-emerald-950"
                        )}
                      >
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Procurement Office">
                          Procurement Office
                        </SelectItem>
                        <SelectItem value="Accounting Office">
                          Accounting Office
                        </SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(purchase.creationDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(purchase.dateUpdated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md w-full text-emerald-700 hover:text-emerald-900 hover:bg-emerald-200 mb-1 bg-emerald-100"
                    onClick={() => {
                      fetchPurchasedItems(purchase.purchaseOrderId);
                      setSelectedPurchase(purchase);
                      setIsViewOpen(true);
                    }}
                  >
                    <FolderOpen className="w-4 h-4 -mr-1" /> View Items
                  </Button>
                  {purchase.status !== "Completed" &&
                    purchase.status !== "Cancelled" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-md text-cyan-600 hover:text-cyan-900 hover:bg-cyan-50"
                        onClick={() => {
                          setSelectedPurchase(purchase);
                          fetchPurchasedItems(purchase.purchaseOrderId);

                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 -mr-0.5" /> Edit Form
                      </Button>
                    )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      `rounded-md ${
                        purchase.status === "Completed" ||
                        purchase.status === "Cancelled"
                          ? "w-full"
                          : "text-black-600 hover:text-black-900 hover:bg-black-50"
                      }`
                    )}
                    onClick={() => {
                      setSelectedPurchase(purchase);
                      setIsPrintDialogOpen(true);
                    }}
                  >
                    <Printer className="w-4 h-4 -mr-1" /> Print Form
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={17} className="text-center text-gray-500">
                No materials found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CustomPagination
        totalItems={filteredPurchases.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-h-4/5 h-fit max-w-4xl w-full flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-start gap-2 tracking-tight text-teal-900 mt-2">
              <Edit className="text-teal-500 size-5 -mt-0.5" />
              Edit Purchase Order Form
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <EditPurchaseOrder
            purchaseOrderId={selectedPurchase?.purchaseOrderId ?? 0}
            closeDialog={() => setIsEditDialogOpen(false)}
            purchaseOrderNo={selectedPurchase?.purchaseOrderNumber ?? ""}
            date={selectedPurchase?.date ?? ""}
            status={selectedPurchase?.status ?? ""}
            supplierId={selectedPurchase?.supplierId ?? 0}
            supplierName={selectedPurchase?.supplierName ?? ""}
            supplierAddress={selectedPurchase?.supplier.address ?? ""}
            supplierPhoneNo={selectedPurchase?.supplier.phoneNumber ?? ""}
            supplierEmail={selectedPurchase?.supplier.email ?? ""}
            supplierContactPerson={
              selectedPurchase?.supplier.contactPerson ?? ""
            }
            labName={selectedPurchase?.laboratory ?? ""}
            labAddress={selectedPurchase?.user.laboratory.location ?? ""}
            labPhoneNo={selectedPurchase?.user.phoneNumber ?? ""}
            labEmail={selectedPurchase?.user.email ?? ""}
            userId={selectedPurchase?.userId ?? 0}
            itemPurchases={purchaseItems}
            tax={selectedPurchase?.tax ?? 0}
            shippingCost={selectedPurchase?.shippingCost ?? 0}
            totalPrice={selectedPurchase?.totalPrice ?? 0}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="bg-white max-h-4/5 h-fit max-w-2xl flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-start gap-2 tracking-tight text-teal-900 mt-2">
              <FolderOpen className="text-teal-500 size-5 -mt-0.5" />
              View Purchase Items
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {selectedPurchase && (
            <div>
              <Table className="overflow-x-auto">
                <TableHeader className="text-center justify-center">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPurchase.map((purchaseItem) => (
                    <TableRow key={purchaseItem.purchaseId}>
                      <TableCell>{purchaseItem.purchaseId}</TableCell>
                      <TableCell>{purchaseItem.description}</TableCell>
                      <TableCell>{purchaseItem.qty}</TableCell>
                      <TableCell>{purchaseItem.unitPrice}</TableCell>
                      <TableCell>
                        {new Date(purchaseItem.creationDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(purchaseItem.dateUpdated).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <CustomPagination
                totalItems={purchaseItems.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPurchasePage}
                onPageChange={(page) => setCurrentPurchasePage(page)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPrintAllOpen} onOpenChange={setIsPrintAllOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              Print Purchase Order Report
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <p className="text-left pt-2 text-sm">
            Are you sure you want to print this form?
          </p>
          <p className="text-left text-sm italic">
            *This form shall be printed in a long bond paper.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setIsPrintAllOpen(false)}
            >
              Cancel
            </Button>
            <PdfGenerator
              pdfTitle="Purchase Order Report"
              pageSize="long"
              orientation="landscape"
              tableHeaders={tableHeaders}
              tableData={tableData}
              closeDialog={() => setIsPrintAllOpen(false)}
            ></PdfGenerator>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              Print Borrow Form
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <p className="text-left pt-2 text-m">
            Select page size for the form:
          </p>
          <div className="flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  <span className={pageSize ? "text-black" : "text-gray-500"}>
                    {pageSize === "a4"
                      ? "A4 (210 x 297 mm)"
                      : pageSize === "short"
                      ? "Short (Letter, 215.9 x 279.4 mm)"
                      : pageSize === "long"
                      ? "Long (Legal, 215.9 x 355.6 mm)"
                      : "Select Page Size"}
                  </span>
                  <span className="ml-auto">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[
                  { label: "A4 (210 x 297 mm)", value: "a4" },
                  { label: "Short (Letter, 215.9 x 279.4 mm)", value: "short" },
                  { label: "Long (Legal, 215.9 x 355.6 mm)", value: "long" },
                ].map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={pageSize === option.value}
                    onCheckedChange={(checked) =>
                      setPageSize(checked ? option.value : "a4")
                    }
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-left pt-4 text-m">
            Select orientation for the form:
          </p>
          <div className="flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  <span
                    className={orientation ? "text-black" : "text-gray-500"}
                  >
                    {orientation === "portrait"
                      ? "Portrait"
                      : orientation === "landscape"
                      ? "Landscape"
                      : "Select Orientation"}
                  </span>
                  <span className="ml-auto">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[
                  { label: "Portrait", value: "portrait" as const },
                  { label: "Landscape", value: "landscape" as const },
                ].map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={orientation === option.value}
                    onCheckedChange={(checked) =>
                      setOrientation(checked ? option.value : "portrait")
                    }
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setIsPrintDialogOpen(false)}
            >
              Cancel
            </Button>
            {selectedPurchase && (
              <PdfForm
                pdfTitle="Purchase Order Form"
                pageSize={pageSize}
                orientation={orientation}
                tableHeaders={tableHeaders}
                tableData={singleTableData}
                materialName={selectedPurchase.purchaseOrderNumber}
                closeDialog={() => setIsPrintDialogOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <SquarePen className="text-emerald-600 size-5 -mt-0.5" />
              Change Status
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <p className="text-left pt-2 text-sm">
            Are you sure you want to set the status to {status}?
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setIsReturnDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsReturnDialogOpen(false);
                handleReturn();
              }}
              className="bg-emerald-500 hover:bg-emerald-700 text-white justify-center transition-colors duration-300 ease-in-out"
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
