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
import { Edit, Search, TriangleAlert, FilePlus, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Material {
  materialId: number;
  labId: number;
  categoryId: number;
  supplierId: number;
  laboratory: { labName: string };
  category: { shortName: string };
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
  reorderThreshold: number;
  maxThreshold: number;
  createdAt?: string;
  updatedAt?: string;
}

const Chemical = () => {
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}material/all`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch materials");
        }
        const data = await response.json();
        const biologicalMaterials = data.filter(
          (material: Material) =>
            material.category.shortName.toLowerCase() === "chemical"
        );
        setMaterials(biologicalMaterials);
        setFilteredMaterials(biologicalMaterials);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMaterials();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);

    setFilteredMaterials(
      materials.filter((material) =>
        `${material.itemName} ${material.itemCode}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">
        Chemical Inventory
      </h1>
      <div className="flex text-right justify-left items-center mb-4">
        <div className="flex items-center">
          <Input
            placeholder="Search for a material"
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
              router.push("/biological-inventory-form");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Create Material
          </Button>
        </div>
      </div>

      <Toaster />

      <Table className="items-center justify-center w-max-full w-58 overflow-x-auto">
        <TableHeader className="text-center justify-center">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Laboratory</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Item Code</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Quantity Available</TableHead>
            <TableHead>Reorder Threshold</TableHead>
            <TableHead>Max Threshold</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <TableRow key={material.materialId}>
                <TableCell>{material.materialId}</TableCell>
                <TableCell>{material.laboratory.labName}</TableCell>
                <TableCell>{material.category.shortName}</TableCell>
                <TableCell>{material.supplier.companyName}</TableCell>
                <TableCell>{material.itemCode}</TableCell>
                <TableCell>{material.itemName}</TableCell>
                <TableCell>{material.unit}</TableCell>
                <TableCell>{material.location}</TableCell>
                <TableCell>{material.expiryDate}</TableCell>
                <TableCell>{material.cost}</TableCell>
                <TableCell>{material.quantityAvailable}</TableCell>
                <TableCell>{material.reorderThreshold}</TableCell>
                <TableCell>{material.maxThreshold}</TableCell>
                <TableCell className="text-center">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md text-red-600 hover:text-red-900 hover:bg-red-50"
                    onClick={() => {
                      setSelectedMaterial(material);
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
                No materials found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-h-4/5 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          <div>
            {selectedMaterial &&
              Object.entries(selectedMaterial).map(([key, value]) => (
                <Input
                  key={key}
                  value={
                    typeof value === "object"
                      ? JSON.stringify(value)
                      : (value as string)
                  }
                  placeholder={key}
                  className="mb-4"
                />
              ))}
            <div className="relative">
              <Button
                className="absolute right-0 mr-4"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <TriangleAlert className="text-red-500 size-5 -mt-0.5" />
              Delete Material
            </DialogTitle>
          </DialogHeader>
          <p className="text-left pt-2 text-sm">
            Are you sure you want to delete this material?
          </p>
          <p className="text-left bg-red-300 -mt-2 relative py-2 text-sm">
            <span className="pl-4">
              By deleting this material, it will be removed indefinitely.
            </span>
            <span className="absolute left-0 top-0 h-full w-2 bg-red-600"></span>
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
              variant="destructive"
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

export default Chemical;
