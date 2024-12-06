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
import { Edit, Search, FilePlus, History } from "lucide-react";
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
import EditInventory from "../dialogs/edit-form";

interface Material {
  materialId: number;
  labId: number;
  categoryId: number;
  supplierId: number;
  laboratory: { labName: string };
  category: { shortName: string; subcategory1: string };
  supplier: { companyName: string };
  itemCode: string;
  itemName: string;
  unit: string;
  location: string;
  expiryDate: string;
  cost: number;
  description?: string;
  notes?: string;
  quantityAvailable: number;
  createdAt: string;
  updatedAt: string;
  reorderThreshold: number;
  maxThreshold: number;
}

interface Logs {
  inventoryLogId: number;
  userId: number;
  user: { lastName: string; firstName: string; middleName?: string };
  materialId: number;
  material: { itemName: string };
  date: string;
  quantity: number;
  source?: string;
  remarks?: string;
}

const ITEMS_PER_PAGE = 4;

const GeneralSupplies = () => {
  const router = useRouter();
  const pathname = usePathname();
  const labSlug = pathname?.split("/")[2];
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLogPage, setCurrentLogPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [logs, setLogs] = useState<Logs[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Material | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  useEffect(() => {
    if (!isEditDialogOpen) {
      const fetchMaterials = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}material/all`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch materials");
          }
          const data = await response.json();
          const generalMaterials = data.filter(
            (material: Material) =>
              material.category.shortName.toLowerCase() === "gensupply" &&
              material.laboratory.labName.toLowerCase() === labSlug
          );
          setMaterials(generalMaterials);
          setFilteredMaterials(generalMaterials);
        } catch (error) {
          console.error("Error fetching materials:", error);
        }
      };

      fetchMaterials();
    }
  }, [labSlug, isEditDialogOpen]);

  const fetchInventoryLogs = async (materialId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}inventory-log/logs/${materialId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch inventory logs");
      }
      const data = await response.json();
      console.log(data);
      setLogs(data);
    } catch (error) {
      console.error("Error fetching inventory logs:", error);
    }
  };
  const sortMaterials = (
    materials: Material[],
    key: keyof Material,
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

  const handleSort = (column: keyof Material) => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";

    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = sortMaterials(filteredMaterials, column, newDirection);
    setFilteredMaterials(sorted);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredMaterials(
      materials.filter((material) => {
        const combinedString = `${material.itemName} ${material.itemCode} ${material.category.subcategory1} ${material.location} ${material.supplier.companyName}`;
        return combinedString.toLowerCase().includes(query);
      })
    );
    setCurrentPage(1);
  };

  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const paginatedLogs = logs.slice(
    (currentLogPage - 1) * ITEMS_PER_PAGE,
    currentLogPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">
        General Supplies Inventory
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
            className="bg-teal-500 text-white w-36 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out mx-6"
            onClick={() => {
              router.push("/gensupplies-inventory-form");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Add Material
          </Button>
        </div>
      </div>

      <Toaster />
      <TooltipProvider>
        <Table className="overflow-x-auto">
          <TableHeader className="text-center justify-center">
          <TableRow>
              <TableHead onClick={() => handleSort("materialId")}>
                ID{" "} {sortColumn === "materialId" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("itemName")}>
                Item Name {" "} {sortColumn === "itemName" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("itemCode")}>
                Item Code{" "} {sortColumn === "itemCode" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("quantityAvailable")}>
                Quantity{" "} {sortColumn === "quantityAvailable" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("unit")}>
                Unit{" "} {sortColumn === "unit" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              <TableHead onClick={() => handleSort("reorderThreshold")}>
                Min{" "} {sortColumn === "reorderThreshold" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              <TableHead onClick={() => handleSort("maxThreshold")}>
                Max{" "} {sortColumn === "maxThreshold" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Excess</TableHead>
              <TableHead onClick={() => handleSort("category")}>
                Category{" "} {sortColumn === "category" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("location")}>
                Location{" "} {sortColumn === "location" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("supplier")}>
                Supplier{" "} {sortColumn === "supplier" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("cost")}>
                Cost{" "} {sortColumn === "cost" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("notes")}>
                Notes{" "} {sortColumn === "notes" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("createdAt")}>
                Created At{" "} {sortColumn === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("updatedAt")}>
                Updated At{" "} {sortColumn === "updatedAt" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMaterials.length > 0 ? (
              paginatedMaterials.map((material) => (
                <TableRow key={material.materialId}>
                  <TableCell>{material.materialId}</TableCell>
                  <TableCell>{material.itemName}</TableCell>
                  <TableCell>{material.itemCode}</TableCell>
                  <TableCell>{material.quantityAvailable}</TableCell>
                  <TableCell>{material.unit}</TableCell>
                  <TableCell>{material.reorderThreshold}</TableCell>
                  <TableCell>{material.maxThreshold}</TableCell>
                  <TableCell>
                    {Math.max(
                      0,
                      material.quantityAvailable - material.maxThreshold
                    )}
                  </TableCell>

                  <TableCell>{material.category.subcategory1}</TableCell>
                  <TableCell>{material.location}</TableCell>
                  <TableCell>{material.supplier.companyName}</TableCell>
                  <TableCell>{material.cost}</TableCell>
                  <TableCell className="relative max-w-8 truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer truncate">
                          {material.notes}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{material.notes}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {new Date(material.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(material.updatedAt).toLocaleString("en-US", {
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
                      className="rounded-md text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50"
                      onClick={() => {
                        setSelectedMaterial(material);
                        fetchInventoryLogs(material.materialId);
                        setIsHistoryDialogOpen(true);
                      }}
                    >
                      <History className="w-4 h-4 -mr-1" /> Logs
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-md text-cyan-600 hover:text-cyan-900 hover:bg-cyan-50"
                      onClick={() => {
                        setSelectedMaterial(material);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 -mr-0.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={16} className="text-center text-gray-500">
                  No materials found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TooltipProvider>
      <CustomPagination
        totalItems={filteredMaterials.length}
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
          {selectedMaterial && (
            <EditInventory
              materialId={selectedMaterial.materialId}
              labId={selectedMaterial.labId}
              category={selectedMaterial.categoryId}
              personnel={0}
              itemName={selectedMaterial.itemName}
              itemCode={selectedMaterial.itemCode}
              quantity={selectedMaterial.quantityAvailable.toString()}
              unit={selectedMaterial.unit}
              reorderThreshold={selectedMaterial.reorderThreshold.toString()}
              maxThreshold={selectedMaterial.maxThreshold.toString()}
              location={selectedMaterial.location}
              expiryDate={selectedMaterial.expiryDate}
              supplier={selectedMaterial.supplierId}
              cost={selectedMaterial.cost.toString()}
              notes={selectedMaterial.notes}
              date={""}
              closeDialog={() => setIsEditDialogOpen(false)}
              shortName="GenSupply"
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="bg-white max-h-4/5 h-auto max-w-1/2 w-2/3">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <History className="text-yellow-600 size-5 -mt-0.5" />
              Inventory Logs
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="p-2">
            <Table className="items-center justify-center w-full overflow-x-auto">
              <TableHeader className="text-center justify-center bg-teal-50">
                <TableRow>
                  <TableHead>Log ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <TableRow className="bg-white" key={log.inventoryLogId}>
                      <TableCell>{log.inventoryLogId}</TableCell>
                      <TableCell>{`${log.user.firstName} ${log.user.lastName}`}</TableCell>
                      <TableCell>
                        {new Date(log.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>{log.quantity}</TableCell>
                      <TableCell>{log.source || "N/A"}</TableCell>
                      <TableCell>{log.remarks || "N/A"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-500"
                    >
                      No logs found for this material.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <CustomPagination
              totalItems={logs.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentLogPage}
              onPageChange={(page) => setCurrentLogPage(page)}
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => {
                setIsHistoryDialogOpen(false);
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GeneralSupplies;
