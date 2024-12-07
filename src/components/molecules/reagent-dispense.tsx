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
import { Edit, Search, FilePlus, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomPagination from "../ui/pagination-custom";
import { ReagentDispenseSchema } from "@/packages/api/inventory";
import EditReagentDispense from "../dialogs/reagent-dispense-edit";
import PdfGenerator from "../templates/pdf-generator";
import PdfForm from "../templates/pdf-form";

interface ReagentDispenseValues {
  dispenseId: number;
  date: string;
  reagentId: number;
  name: string;
  totalNoContainers: number;
  lotNo: string;
  qtyDispensed: number;
  remarks: string;
  userId: number;
  analyst: string;
  laboratory: string;
  remainingQuantity: number;
  creationDate: string;
  dateUpdated: string;
}

const ITEMS_PER_PAGE = 4;

const ReagentDispense = () => {
  const router = useRouter();
  const pathname = usePathname();
  const labSlug = pathname?.split("/")[2];
  const [dispenses, setDispenses] = useState<ReagentDispenseValues[]>([]);
  const [filteredDispenses, setFilteredDispenses] = useState<
    ReagentDispenseValues[]
  >([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDispense, setSelectedDispense] =
    useState<ReagentDispenseValues | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isPrintAllOpen, setIsPrintAllOpen] = useState(false);
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState<
    "portrait" | "landscape" | undefined
  >(undefined);

  useEffect(() => {
    if (!isEditDialogOpen) {
      const fetchDispenses = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}reagents-dispense`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch disposal forms");
          }
          const data = await response.json();

          const mappedDisposal = data.map(
            (disposal: ReagentDispenseSchema) => ({
              ...disposal,
              laboratory: `${disposal.reagent.laboratory.labName}`,
              remainingQuantity: disposal.reagent.quantityAvailable,
            })
          );
          const disposedMaterials = mappedDisposal.filter(
            (disposal: ReagentDispenseValues) =>
              disposal.laboratory.toLowerCase() === labSlug
          );
          setDispenses(disposedMaterials);
          setFilteredDispenses(disposedMaterials);
        } catch (error) {
          console.error("Error fetching forms:", error);
        }
      };

      fetchDispenses();
    }
  }, [labSlug, isEditDialogOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredDispenses(
      dispenses.filter((dispense) => {
        const combinedString = `${dispense.name} ${dispense.analyst} ${dispense.remarks} ${dispense.date}`;
        return combinedString.toLowerCase().includes(query);
      })
    );
    setCurrentPage(1);
  };

  const paginatedMaterials = filteredDispenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const tableHeaders = [
    "ID",
    "Date",
    "Item Name",
    "Total Containers",
    "Lot Number",
    "Quantity Dispensed",
    "Remaining Quantity",
    "Remarks",
    "Analyst",
    "Date Created",
    "Date Updated"
  ];
  const tableData = dispenses.map((dispense) => [
    dispense.dispenseId,
    new Date(dispense.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    dispense.name,
    dispense.totalNoContainers,
    dispense.lotNo,
    dispense.qtyDispensed,
    dispense.remainingQuantity,
    dispense.remarks,
    dispense.analyst,
    new Date(dispense.creationDate).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    new Date(dispense.dateUpdated).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  ]);

  const singleTableData = selectedDispense
    ? [
        [
          selectedDispense.dispenseId,
          new Date(selectedDispense.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          selectedDispense.name,
          selectedDispense.totalNoContainers,
          selectedDispense.lotNo,
          selectedDispense.qtyDispensed,
          selectedDispense.remainingQuantity,
          selectedDispense.remarks,
          selectedDispense.analyst,
          new Date(selectedDispense.creationDate).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          new Date(selectedDispense.dateUpdated).toLocaleString("en-US", {
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
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">
        Reagent Dispense Forms
      </h1>
      <div className="flex text-right justify-left items-center mb-4">
        <div className="flex items-center">
          <Input
            placeholder="Search for a material"
            value={search}
            onChange={handleSearch}
            className="w-80 pr-8 rounded-lg"
          />
          <span className="relative -ml-8">
            <Search className="size-5 text-gray-500" />
          </span>
          <Button
            className="bg-teal-500 text-white w-40 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out ml-6"
            onClick={() => {
              router.push("/reagents-inventory-form");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Dispense Reagent
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
              <TableHead>Date</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Total Containers</TableHead>
              <TableHead>Lot Number</TableHead>
              <TableHead>Quantity Dispensed</TableHead>
              <TableHead>Remaining Quantity</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Analyst</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMaterials.length > 0 ? (
              paginatedMaterials.map((dispense) => (
                <TableRow key={dispense.dispenseId}>
                  <TableCell>{dispense.dispenseId}</TableCell>
                  <TableCell>
                    {new Date(dispense.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{dispense.name}</TableCell>
                  <TableCell>{dispense.totalNoContainers}</TableCell>
                  <TableCell>{dispense.lotNo}</TableCell>
                  <TableCell>{dispense.qtyDispensed}</TableCell>
                  <TableCell>{dispense.remainingQuantity}</TableCell>
                  <TableCell className="relative max-w-8 truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer truncate">
                          {dispense.remarks}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{dispense.remarks}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{dispense.analyst}</TableCell>
                  <TableCell>
                    {new Date(dispense.creationDate).toLocaleDateString(
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
                    {new Date(dispense.dateUpdated).toLocaleDateString(
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-md text-cyan-600 hover:text-cyan-900 hover:bg-cyan-50"
                      onClick={() => {
                        setSelectedDispense(dispense);
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
                        setSelectedDispense(dispense);
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
        totalItems={filteredDispenses.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-h-4/5 sm:h-4/5 h-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <Edit className="text-teal-500 size-5 -mt-0.5" />
              Edit Reagent Dispense
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {selectedDispense && (
            <EditReagentDispense
              closeDialog={() => setIsEditDialogOpen(false)}
              dispenseId={selectedDispense.dispenseId}
              date={selectedDispense.date}
              materialId={selectedDispense.reagentId}
              name={selectedDispense.name}
              totalNoContainers={selectedDispense.totalNoContainers}
              lotNo={selectedDispense.lotNo}
              qtyDispensed={selectedDispense.qtyDispensed}
              remainingQuantity={selectedDispense.remainingQuantity}
              remarks={selectedDispense.remarks}
              userId={selectedDispense.userId}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPrintAllOpen} onOpenChange={setIsPrintAllOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              Print Reagent Dispense Report
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
              pdfTitle="Reagent Dispense Report"
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
              Print Reagent Dispense Form
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
            {selectedDispense && (
              <PdfForm
                pdfTitle="Reagent Dispense Form"
                pageSize={pageSize}
                orientation={orientation}
                tableHeaders={tableHeaders}
                tableData={singleTableData}
                materialName={selectedDispense.name}
                closeDialog={() => setIsPrintDialogOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReagentDispense;
