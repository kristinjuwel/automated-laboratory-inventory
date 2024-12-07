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
import { Edit, Search, FilePlus, Printer, History, Filter, ChevronsUpDown } from "lucide-react";
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
import CustomPagination from "../ui/pagination-custom";
import { DialogDescription } from "@radix-ui/react-dialog";
import EditDisposal from "../dialogs/disposal-edit";
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
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedDisposition, setSelectedDisposition] =
    useState<DispositionValues | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof DispositionValues | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Set<string>>(new Set());
  const [isDisposedByOpen, setIsDisposedByOpen] = useState(false);
  const [selectedDisposedBy, setSelectedDisposedBy] = useState<Set<string>>(new Set());

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

  const sortMaterials = (
    materials: DispositionValues[],
    key: keyof DispositionValues,
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

  const handleSort = (column: keyof DispositionValues) => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";

    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = sortMaterials(filteredDisps, column, newDirection);
    setFilteredDisps(sorted);
  };

  useEffect(() => {
    const applyFilters = () => {
      const filtered = dispositions.filter((disposition) => {
        const matchesDisposedBy =
          selectedDisposedBy.size === 0 || selectedDisposedBy.has(disposition.disposedBy);
        const matchesMaterial = 
          selectedMaterial.size === 0 || selectedMaterial.has(disposition.material);
        return matchesDisposedBy && matchesMaterial;
      });

      setFilteredDisps(filtered);
      setCurrentPage(1);
    };
    applyFilters();
  }, [selectedDisposedBy, selectedMaterial, dispositions]);
  
  const handleDisposedByChange = (disposedBy: string) => {
    setSelectedDisposedBy((prev) => {
      const updated = new Set(prev);
      if (updated.has(disposedBy)) {
        updated.delete(disposedBy);
      } else {
        updated.add(disposedBy);
      }
      return updated;
    });
  };

  const handleMaterialChange = (status: string) => {
    setSelectedMaterial((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  };

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
            className="bg-black text-white w-36 justify-center rounded-lg hover:bg-gray-700 transition-colors duration-300 ease-in-out ml-2"
            onClick={() => {
              setIsPrintDialogOpen(true);
            }}
          >
            <Printer className="w-4 h-4" strokeWidth={1.5} />
            Print Forms
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
              <Collapsible open={isDisposedByOpen} onOpenChange={setIsDisposedByOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-48 px-2 justify-start text-black text-sm font-semibold hover:bg-teal-100"
                    >
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="text-black">Disposed By</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 transition-all text-sm">
                      {Array.from(
                          new Set(dispositions.map((m) => m.disposedBy))
                        ).map((disposedBy) => (
                        <label
                          key={disposedBy}
                          className="flex items-center space-x-2 whitespace-nowrap"
                        >
                          <Input
                            type="checkbox"
                            value={disposedBy}
                            className="text-teal-500 accent-teal-200"
                            checked={selectedDisposedBy.has(disposedBy)}
                            onChange={() => handleDisposedByChange(disposedBy)}
                          />
                          <span>{disposedBy}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
              </Collapsible>
              <Collapsible open={isMaterialOpen} onOpenChange={setIsMaterialOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-48 px-2 justify-start text-black text-sm font-semibold hover:bg-teal-100"
                    >
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="text-black">Material</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 transition-all text-sm">
                      {Array.from(
                          new Set(dispositions.map((m) => m.material))
                        ).map((material) => (
                        <label
                          key={material}
                          className="flex items-center space-x-2 whitespace-nowrap"
                        >
                          <Input
                            type="checkbox"
                            value={material}
                            className="text-teal-500 accent-teal-200"
                            checked={selectedMaterial.has(material)}
                            onChange={() => handleMaterialChange(material)}
                          />
                          <span>{material}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Button
                  variant="outline"
                  className="mt-2 w-full sticky bottom-0 bg-white hover:bg-gray-200"
                  onClick={() => {
                    setSelectedDisposedBy(new Set());
                    setSelectedMaterial(new Set());
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

      <TooltipProvider>
        <Table className="overflow-x-auto">
          <TableHeader className="text-center justify-center">
            <TableRow>
              <TableHead onClick={() => handleSort("disposalId")}>
                ID{" "} {sortColumn === "disposalId" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("material")}>
                Material{" "} {sortColumn === "material" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("itemDescription")}>
                Description{" "} {sortColumn === "itemDescription" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("qty")}>
                Quantity{" "} {sortColumn === "qty" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("reasonForDisposal")}>
                Reason for Disposal{" "} {sortColumn === "reasonForDisposal" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("disposalMethod")}>
                Disposal Method{" "} {sortColumn === "disposalMethod" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("dateDisposed")}>
                Date Disposed{" "} {sortColumn === "dateDisposed" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("userId")}>
                Disposed by{" "} {sortColumn === "userId" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("creationDate")}>
                Created At{" "} {sortColumn === "creationDate" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("dateUpdated")}>
                Updated At{" "} {sortColumn === "dateUpdated" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
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
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <Printer className="text-black size-5 -mt-0.5" />
              Print Disposal Form
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
    </div>
  );
};

export default Disposition;
