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
import { Edit, Search, FilePlus, Printer, SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CustomPagination from "../ui/pagination-custom";
import { BorrowSchema } from "@/packages/api/inventory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import EditBorrow from "../dialogs/borrow-edit";

interface Borrow {
  borrowId: number;
  userId: number;
  user: string;
  materialId: number;
  material: { itemName: string; itemCode: string; quantityAvailable: number };
  dateBorrowed: string;
  detailsOfBorrowed: string;
  equipment: string;
  qty: number;
  unit: string;
  borrowerDetail: string;
  department: string;
  timeBorrowed: string;
  dateReturned: string;
  timeReturned: string;
  remarks: string;
  damageMaterials: string;
  status: string;
}

const ITEMS_PER_PAGE = 4;

const Borrow = () => {
  const router = useRouter();
  const pathname = usePathname();
  const labSlug = pathname?.split("/")[2];
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);
  const [filteredBorrows, setFilteredBorrows] = useState<Borrow[]>([]);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!isEditDialogOpen) {
      const fetchMaterials = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}borrow`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch borrow forms");
          }
          const data = await response.json();
          const borrowedMaterials = data.filter(
            (borrow: Borrow) => borrow.department.toLowerCase() === labSlug
          );

          const mappedBorrows = borrowedMaterials.map(
            (borrow: BorrowSchema) => ({
              ...borrow,
              user: `${borrow.user.firstName} ${
                borrow.user.middleName ? borrow.user.middleName + " " : ""
              }${borrow.user.lastName}`,
            })
          );

          setBorrows(mappedBorrows);
          setFilteredBorrows(mappedBorrows);
        } catch (error) {
          console.error("Error fetching materials:", error);
        }
      };

      fetchMaterials();
    }
  }, [labSlug, isEditDialogOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredBorrows(
      borrows.filter((borrow) => {
        const combinedString = `${borrow.status} ${borrow.material.itemName} ${borrow.user}`;
        return combinedString.toLowerCase().includes(query);
      })
    );
    setCurrentPage(1);
  };

  const paginatedMaterials = filteredBorrows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleReturn = async () => {
    if (selectedBorrow) {
      try {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split("T")[0];
        const timeString = currentDate.toTimeString().split(" ")[0];
        const bodyData = {
          status: status,
          dateReturned:
            status === "Returned" ? dateString : selectedBorrow.dateReturned,
          timeReturned:
            status === "Returned" ? timeString : selectedBorrow.timeReturned,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}borrow/${selectedBorrow.borrowId}`,
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">
        Borrow Forms
      </h1>
      <Toaster />
      <div className="flex text-right justify-left items-center mb-4">
        <div className="flex items-center">
          <Input
            placeholder="Search form"
            value={search}
            onChange={handleSearch}
            className="w-80 pr-8"
          />
          <span className="relative -ml-8">
            <Search className="size-5 text-gray-500" />
          </span>
          <Button
            className="bg-teal-500 text-white w-36 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out ml-6"
            onClick={() => {
              router.push("/borrow-form");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Borrow Material
          </Button>
          <Button
            className="bg-black text-white w-36 justify-center rounded-lg hover:bg-gray-700 transition-colors duration-300 ease-in-out mx-2"
            onClick={() => {
              setIsPrintDialogOpen(true);
            }}
          >
            <Printer className="w-4 h-4" strokeWidth={1.5} />
            Print Forms
          </Button>
        </div>
      </div>

      <Toaster />
      <TooltipProvider>
        <Table className="overflow-x-auto">
          <TableHeader className="text-center justify-center">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Item Code</TableHead>
              <TableHead>Quantity Borrowed</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead>Borrower Details</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date Borrowed</TableHead>
              <TableHead>Time Borrowed</TableHead>
              <TableHead>Date Returned</TableHead>
              <TableHead>Time Returned</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Damage Materials</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMaterials.length > 0 ? (
              paginatedMaterials.map((borrow) => (
                <TableRow key={borrow.borrowId}>
                  <TableCell>{borrow.materialId}</TableCell>
                  <TableCell>{borrow.material.itemName}</TableCell>
                  <TableCell>{borrow.material.itemCode}</TableCell>
                  <TableCell>{borrow.qty}</TableCell>
                  <TableCell>{borrow.user}</TableCell>
                  <TableCell className="relative max-w-8 truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer truncate">
                          {borrow.borrowerDetail}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{borrow.borrowerDetail}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{borrow.department}</TableCell>
                  <TableCell>
                    {new Date(borrow.dateBorrowed).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      `1970-01-01T${borrow.timeBorrowed}`
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(borrow.dateReturned).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      `1970-01-01T${borrow.timeReturned}`
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell className="relative max-w-8 truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer truncate">
                          {borrow.remarks}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{borrow.remarks}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="relative max-w-8 truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer truncate">
                          {borrow.damageMaterials}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{borrow.damageMaterials}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {borrow.status === "Returned" ? (
                      <div className="w-full px-4 py-2 rounded-md bg-green-300 font-semibold text-green-950">
                        Returned
                      </div>
                    ) : (
                      <Select
                        disabled={borrow.status === "Returned"}
                        value={borrow.status}
                        onValueChange={(newStatus) => {
                          setSelectedBorrow(borrow);
                          setStatus(newStatus);
                          setIsReturnDialogOpen(true);
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            borrow.status === "Borrowed"
                              ? "bg-red-300 text-red-950"
                              : "bg-emerald-300 text-emerald-950"
                          )}
                        >
                          <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Borrowed">Borrowed</SelectItem>
                          <SelectItem value="Returned">Returned</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    {borrow.status !== "Returned" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-md text-cyan-600 hover:text-cyan-900 hover:bg-emerald-50"
                        onClick={() => {
                          setSelectedBorrow(borrow);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 -mr-0.5" /> Edit
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-md text-black-600 hover:text-black-900 hover:bg-black-50"
                      onClick={() => {
                        setIsPrintDialogOpen(true);
                      }}
                    >
                      <Printer className="w-4 h-4 -mr-1" /> Print
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={15} className="text-center text-gray-500">
                  No materials found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TooltipProvider>
      <CustomPagination
        totalItems={filteredBorrows.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-h-4/5 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <Edit className="text-teal-500 size-5 -mt-0.5" />
              Edit Borrow Form
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {selectedBorrow && (
            <EditBorrow
              closeDialog={() => setIsEditDialogOpen(false)}
              borrowId={selectedBorrow.borrowId}
              dateBorrowed={selectedBorrow.dateBorrowed}
              materialId={selectedBorrow.materialId}
              detailsOfBorrowed={selectedBorrow.detailsOfBorrowed}
              qty={selectedBorrow.qty}
              unit={selectedBorrow.unit}
              userId={selectedBorrow.userId}
              borrowerDetail={selectedBorrow.borrowerDetail}
              department={selectedBorrow.department}
              timeBorrowed={selectedBorrow.timeBorrowed}
              dateReturned={selectedBorrow.dateReturned}
              timeReturned={selectedBorrow.timeReturned}
              remarks={selectedBorrow.remarks}
              damageMaterials={selectedBorrow.damageMaterials}
              status={selectedBorrow.status}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <Printer className="text-black size-5 -mt-0.5" />
              Print Borrow Form
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <p className="text-left pt-2 text-sm">
            Are you sure you want to print this form?
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setIsPrintDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsPrintDialogOpen(false)}>Confirm</Button>
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
            Are you sure this item has been returned?
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

export default Borrow;