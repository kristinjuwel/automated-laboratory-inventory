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
import { Edit, Search, FilePlus, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { DispositionSchema } from "@/packages/api/inventory";
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
import { DialogDescription } from "@radix-ui/react-dialog";
import EditDisposal from "../dialogs/disposal-edit";
import PdfGenerator from "../templates/pdf-generator";
import PdfForm from "../templates/pdf-form";

interface DispositionValues {
  disposalId: number;
  userId: number;
  materialId: number;
  material: string;
  laboratory: string;
  itemDescription: string;
  qty: number;
  reasonForDisposal: string;
  disposalMethod: string;
  dateDisposed: string;
  disposedBy: string;
  comments: string;
  creationDate: string;
  dateUpdated: string;
}

const ITEMS_PER_PAGE = 4;

const Disposition = () => {
  const router = useRouter();
  const pathname = usePathname();
  const labSlug = pathname?.split("/")[2];
  const [dispositions, setDispositions] = useState<DispositionValues[]>([]);
  const [filteredDisps, setFilteredDisps] = useState<DispositionValues[]>([]);
  const [search, setSearch] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDisposition, setSelectedDisposition] =
    useState<DispositionValues | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isPrintAllOpen, setIsPrintAllOpen] = useState(false);
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState<
      "portrait" | "landscape" | undefined
    >(undefined);

  useEffect(() => {
    if (!isEditDialogOpen) {
      const fetchMaterials = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}disposal`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch disposal forms");
          }
          const data = await response.json();

          const mappedDisposal = data.map((disposal: DispositionSchema) => ({
            ...disposal,
            laboratory: `${disposal.material.laboratory.labName}`,
            material: disposal.material.itemName,
            disposalMethod: disposal.disposalMethod,
          }));
          const disposedMaterials = mappedDisposal.filter(
            (disposal: DispositionValues) =>
              disposal.laboratory.toLowerCase() === labSlug
          );
          setDispositions(disposedMaterials);
          setFilteredDisps(disposedMaterials);
        } catch (error) {
          console.error("Error fetching forms:", error);
        }
      };

      fetchMaterials();
    }
  }, [labSlug, isEditDialogOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredDisps(
      dispositions.filter((disposal) => {
        const combinedString = `${disposal.material} ${disposal.dateDisposed} ${disposal.disposedBy}`;
        return combinedString.toLowerCase().includes(query);
      })
    );
    setCurrentPage(1);
  };

  const paginatedMaterials = filteredDisps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const tableHeaders = [
    "ID",
    "Material",
    "Description",
    "Quantity",
    "Reason for Disposal",
    "Disposal Method",
    "Date Disposed",
    "Disposed by",
    "Date Created",
    "Date Updated"
  ];
  const tableData = dispositions.map((disposition) => [
    disposition.disposalId,
    disposition.material,
    disposition.itemDescription,
    disposition.qty,
    disposition.reasonForDisposal,
    disposition.disposalMethod,
    new Date(disposition.dateDisposed).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    disposition.disposedBy,
    new Date(disposition.creationDate).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    new Date(disposition.dateUpdated).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  ]);

  const singleTableData = selectedDisposition
    ? [
        [
          selectedDisposition.disposalId,
          selectedDisposition.material,
          selectedDisposition.itemDescription,
          selectedDisposition.qty,
          selectedDisposition.reasonForDisposal,
          selectedDisposition.disposalMethod,
          new Date(selectedDisposition.dateDisposed).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          selectedDisposition.disposedBy,
          new Date(selectedDisposition.creationDate).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          new Date(selectedDisposition.dateUpdated).toLocaleString("en-US", {
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
    <div className=" p-8">
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">
        Disposition Forms
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
            className="bg-teal-500 text-white w-36 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out ml-6"
            onClick={() => {
              router.push("/disposition-report");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Dispose Items
          </Button>
          <Button
            className="bg-black text-white w-36 justify-center rounded-lg hover:bg-gray-700 transition-colors duration-300 ease-in-out mx-2"
            onClick={() => {
              setIsPrintAllOpen(true);
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
              <TableHead>Material</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reason for Disposal</TableHead>
              <TableHead>Disposal Method</TableHead>
              <TableHead>Date Disposed</TableHead>
              <TableHead>Disposed by</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMaterials.length > 0 ? (
              paginatedMaterials.map((disposition) => (
                <TableRow key={disposition.disposalId}>
                  <TableCell>{disposition.disposalId}</TableCell>
                  <TableCell>{disposition.material}</TableCell>
                  <TableCell className="relative max-w-8 truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer truncate">
                          {disposition.itemDescription}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{disposition.itemDescription}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{disposition.qty}</TableCell>
                  <TableCell className="relative max-w-8 truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer truncate">
                          {disposition.reasonForDisposal}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{disposition.reasonForDisposal}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="relative max-w-8 truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer truncate">
                          {disposition.disposalMethod}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{disposition.disposalMethod}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {new Date(disposition.dateDisposed).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </TableCell>
                  <TableCell>{disposition.disposedBy}</TableCell>
                  <TableCell>
                    {new Date(disposition.creationDate).toLocaleString(
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
                    {new Date(disposition.dateUpdated).toLocaleString("en-US", {
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
                      className="rounded-md text-cyan-600 hover:text-cyan-900 hover:bg-cyan-50"
                      onClick={() => {
                        setSelectedDisposition(disposition);
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
                        setSelectedDisposition(disposition);
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
                <TableCell colSpan={11} className="text-center text-gray-500">
                  No materials found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TooltipProvider>
      <CustomPagination
        totalItems={filteredDisps.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-h-4/5 sm:h-4/5 h-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <Edit className="text-teal-500 size-5 -mt-0.5" />
              Edit Disposal Form
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {selectedDisposition && (
            <EditDisposal
              closeDialog={() => setIsEditDialogOpen(false)}
              disposalId={selectedDisposition.disposalId}
              userId={selectedDisposition.userId}
              materialId={selectedDisposition.materialId}
              itemDescription={selectedDisposition.itemDescription}
              qty={selectedDisposition.qty}
              reasonForDisposal={selectedDisposition.reasonForDisposal}
              disposalMethod={selectedDisposition.disposalMethod}
              dateDisposed={selectedDisposition.dateDisposed}
              disposedBy={selectedDisposition.disposedBy}
              comments={selectedDisposition.comments}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPrintAllOpen} onOpenChange={setIsPrintAllOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              Print Disposition Report
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
              pdfTitle="Disposition Forms Report"
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
              Print Disposition Form
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
            {selectedDisposition && (
              <PdfForm
                pdfTitle="Disposition Form"
                pageSize={pageSize}
                orientation={orientation}
                tableHeaders={tableHeaders}
                tableData={singleTableData}
                materialName={selectedDisposition.material}
                closeDialog={() => setIsPrintDialogOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Disposition;
