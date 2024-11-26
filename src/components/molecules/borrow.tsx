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
import { Edit, Search, FilePlus, History, Printer } from "lucide-react";
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
  damageMaterials?: string;
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">
        Borrow Forms
      </h1>
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
            className={cn(
              `bg-teal-500 text-white w-36 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out ml-6`
            )}
            onClick={() => {
              router.push("/borrow-form");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Borrow Material
          </Button>
          <Button
            className={cn(
              `bg-black text-white w-36 justify-center rounded-lg hover:bg-gray-700 transition-colors duration-300 ease-in-out mx-2`
            )}
            onClick={() => {
              router.push("/borrow-form");
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
                  <TableCell>{borrow.borrowerDetail}</TableCell>
                  <TableCell>{borrow.department}</TableCell>
                  <TableCell>{borrow.timeBorrowed}</TableCell>
                  <TableCell>
                    {new Date(borrow.dateBorrowed).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(borrow.dateReturned).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{borrow.timeReturned}</TableCell>
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
                  <TableCell>{borrow.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-md text-cyan-600 hover:text-cyan-900 hover:bg-cyan-50"
                      onClick={() => {
                        setSelectedBorrow(borrow);
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
                <TableCell colSpan={12} className="text-center text-gray-500">
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
              Edit Material
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <Printer className="text-black size-5 -mt-0.5" />
              Print Borrow Form
            </DialogTitle>
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
    </div>
  );
};

export default Borrow;
