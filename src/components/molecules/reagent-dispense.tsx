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
import { Edit, Search, FilePlus, Printer, Filter, ChevronsUpDown } from "lucide-react";
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
import CustomPagination from "../ui/pagination-custom";
import { ReagentDispenseSchema } from "@/packages/api/inventory";
import EditReagentDispense from "../dialogs/reagent-dispense-edit";
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
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDispense, setSelectedDispense] =
    useState<ReagentDispenseValues | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof ReagentDispenseValues | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const [isPersonnelOpen, setIsPersonnelOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Set<string>>(new Set());
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Set<string>>(new Set());

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

  const sortMaterials = (
    materials: ReagentDispenseValues[],
    key: keyof ReagentDispenseValues,
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

  const handleSort = (column: keyof ReagentDispenseValues) => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";

    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = sortMaterials(filteredDispenses, column, newDirection);
    setFilteredDispenses(sorted);
  };

  useEffect(() => {
    const applyFilters = () => {
      const filtered = dispenses.filter((dispense) => {
        const matchesMaterial = 
          selectedMaterial.size === 0 || selectedMaterial.has(dispense.name);
        const matchesPersonnel =
          selectedPersonnel.size === 0 || selectedPersonnel.has(dispense.analyst);
        return matchesPersonnel && matchesMaterial;
      });

      setFilteredDispenses(filtered);
      setCurrentPage(1);
    };
    applyFilters();
  }, [selectedPersonnel, selectedMaterial, dispenses]);
  
  const handlePersonnelChange = (personnel: string) => {
    setSelectedPersonnel((prev) => {
      const updated = new Set(prev);
      if (updated.has(personnel)) {
        updated.delete(personnel);
      } else {
        updated.add(personnel);
      }
      return updated;
    });
  };
  const handleMaterialChange = (material: string) => {
    setSelectedMaterial((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(material)) {
        newSet.delete(material);
      } else {
        newSet.add(material);
      }
      return newSet;
    });
  };

  
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">
        Reagent Dispense Forms
      </h1>
      <div className="flex text-right justify-left items-center mb-4">
        <div className="flex items-center">
          <Input
            placeholder="Search for an entry"
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
              router.push("/reagents-dispense-form");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Dispense Reagent
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
              <Collapsible open={isPersonnelOpen} onOpenChange={setIsPersonnelOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-48 px-2 justify-start text-black text-sm font-semibold hover:bg-teal-100"
                    >
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="text-black">Analyst</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 transition-all text-sm">
                      {Array.from(
                          new Set(dispenses.map((m) => m.analyst))
                        ).map((analyst) => (
                        <label
                          key={analyst}
                          className="flex items-center space-x-2 whitespace-nowrap"
                        >
                          <Input
                            type="checkbox"
                            value={analyst}
                            className="text-teal-500 accent-teal-200"
                            checked={selectedPersonnel.has(analyst)}
                            onChange={() => handlePersonnelChange(analyst)}
                          />
                          <span>{analyst}</span>
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
                          new Set(dispenses.map((m) => m.name))
                        ).map((material_name) => (
                        <label
                          key={material_name}
                          className="flex items-center space-x-2 whitespace-nowrap"
                        >
                          <Input
                            type="checkbox"
                            value={material_name}
                            className="text-teal-500 accent-teal-200"
                            checked={selectedMaterial.has(material_name)}
                            onChange={() => handleMaterialChange(material_name)}
                          />
                          <span>{material_name}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Button
                  variant="outline"
                  className="mt-2 w-full sticky bottom-0 bg-white hover:bg-gray-200"
                  onClick={() => {
                    setSelectedPersonnel(new Set());
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
              <TableHead onClick={() => handleSort("reagentId")}>
                ID{" "} {sortColumn === "reagentId" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("date")}>
                Date{" "} {sortColumn === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              <TableHead onClick={() => handleSort("name")}>
                Item Name{" "} {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              <TableHead onClick={() => handleSort("totalNoContainers")}>
                Total Containers{" "} {sortColumn === "totalNoContainers" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              <TableHead onClick={() => handleSort("lotNo")}>
                Lot Number{" "} {sortColumn === "lotNo" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              <TableHead onClick={() => handleSort("qtyDispensed")}>
                Quantity Dispensed{" "} {sortColumn === "qtyDispensed" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              <TableHead onClick={() => handleSort("remainingQuantity")}>
                Remaining Quantity{" "} {sortColumn === "remainingQuantity" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              <TableHead onClick={() => handleSort("remarks")}>
                Remarks{" "} {sortColumn === "remarks" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              <TableHead onClick={() => handleSort("analyst")}>
                Analyst{" "} {sortColumn === "analyst" && (sortDirection === "asc" ? "↑" : "↓")}
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

export default ReagentDispense;
