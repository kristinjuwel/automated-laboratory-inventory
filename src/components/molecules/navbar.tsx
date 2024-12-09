"use client";
import {
  Search,
  UserRound,
  ShoppingCart,
  Microscope,
  Syringe,
  Dna,
  Box,
  LogOut,
  RotateCw,
  UserPen,
  UserCog,
  Menu,
  Printer,
} from "lucide-react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "../ui/navigation-menu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import ChangePassword from "../dialogs/change-password";
import EditAccount from "../dialogs/edit-user";
import PdfGenerator from "../templates/pdf-generator";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface StockLevelValues {
  itemNo: string;
  description: string;
  onHand: number;
  minLevel: number;
  maxLevel: number;
  status: string;
  action: string;
}

const Navbar = () => {
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const userRole = localStorage.getItem("userRole");
  const [stockLevels, setStockLevels] = useState<StockLevelValues[]>([]);
  const [orientation, setOrientation] = useState<
    "portrait" | "landscape" | undefined
  >(undefined);
  const [isPrintDialogOpen, setisPrintDialogOpen] = useState(false);
  const [pageSize, setPageSize] = useState("a4");
  const [query, setQuery] = useState("");
  const [filteredForms, setFilteredForms] = useState<FormData[]>([]);
  const [allForms, setAllForms] = useState<FormData[]>([]);

  interface FormData {
    id: string;
    name: string;
    path: string;
  }

  useEffect(() => {
    fetchStockLevels();
  }, []);

  useEffect(() => {
    const fetchForms = async () => {
      const data: FormData[] = [
        {
          id: "1",
          name: "Biological Inventory Form",
          path: "/biological-inventory-form",
        },
        {
          id: "2",
          name: "Chemical Inventory Form",
          path: "/chemical-inventory-form",
        },
        {
          id: "3",
          name: "General Supplier Inventory Form",
          path: "/gensupplies-inventory-form",
        },
        {
          id: "4",
          name: "Reagents Inventory Form",
          path: "/reagents-inventory-form",
        },
        {
          id: "5",
          name: "Purchase Order Form",
          path: "/laboratory-purchase-order",
        },
        { id: "6", name: "Borrow Form", path: "/borrow-form" },
        { id: "7", name: "Incident Form", path: "/incident-form" },
        { id: "8", name: "Disposition Form", path: "/disposition-report" },
        {
          id: "9",
          name: "Calibration Log Form",
          path: "/calibration-log-form",
        },
        {
          id: "10",
          name: "Reagents Dispense Form",
          path: "/reagents-dispense-form",
        },
      ];
      setAllForms(data);
    };
    fetchForms();
  }, []);

  useEffect(() => {
    if (query === "") {
      setFilteredForms([]);
    } else {
      setFilteredForms(
        allForms.filter((form) =>
          form.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, allForms]);

  const fetchStockLevels = () => {
    const fetchData = [
      {
        itemNo: "001",
        description: "Test Tube",
        onHand: 150,
        minLevel: 50,
        maxLevel: 200,
        status: "Sufficient",
        action: "Monitor",
      },
      {
        itemNo: "002",
        description: "Petri Dish",
        onHand: 30,
        minLevel: 50,
        maxLevel: 200,
        status: "Low",
        action: "Reorder",
      },
      {
        itemNo: "003",
        description: "Microscope Slide",
        onHand: 120,
        minLevel: 60,
        maxLevel: 180,
        status: "Sufficient",
        action: "Monitor",
      },
    ];
    setStockLevels(fetchData);
  };

  const logoutUser = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("User is not logged in.");
      return;
    }

    const userId = token;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}logout?userId=${userId}`, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("authToken");
          toast.success("Logged out successfully.");
          router.push("/login");
        } else {
          throw new Error("Failed to log out.");
        }
      })
      .catch((error) => {
        toast.error("Error logging out. Please try again.");
        console.error("Logout error:", error);
      });
  };
  const tableHeaders = [
    "Item No",
    "Description",
    "On Hand",
    "Min Level",
    "Max Level",
    "Status",
  ];
  const tableData = stockLevels.map((stock) => [
    stock.itemNo,
    stock.description,
    stock.onHand,
    stock.minLevel,
    stock.maxLevel,
    stock.status,
  ]);
  return (
    <div className="w-full max-w-full bg-teal-50 shadow-lg p-2 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center px-2 space-x-2">
        <Image
          src="/images/logo.png"
          alt="Logo"
          className="transition duration-500 hover:scale-110"
          height={40}
          width={40}
        />
        <span className="text-base text-teal-900">ALIMS</span>
      </div>

      <NavigationMenu className="ml-36 hidden lg:flex text-teal-950 justify-center space-x-2 text-sm">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className="p-2.5 flex hover:text-teal-800 hover:bg-teal-200 hover:rounded-xl cursor-pointer"
              onClick={() => router.push("/lab/pathology")}
            >
              <Microscope className="size-5 pr-1" />
              Pathology
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className="p-2.5 flex hover:text-teal-800 hover:bg-teal-200 hover:rounded-xl  cursor-pointer"
              onClick={() => router.push("/lab/immunology")}
            >
              <Syringe className="size-5 pr-1" />
              Immunology
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className="p-2.5 flex hover:text-teal-800 hover:bg-teal-200 hover:rounded-xl  cursor-pointer"
              onClick={() => router.push("/lab/microbiology")}
            >
              <Dna className="size-5 pr-1" />
              Microbiology
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="p-2.5 flex hover:text-teal-800  cursor-pointer">
              <ShoppingCart className="size-5 pr-1" />
              Purchase Order
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              onClick={() => {
                fetchStockLevels();
                setisPrintDialogOpen(true);
              }}
              className="p-2.5 flex hover:text-teal-800 hover:bg-teal-200 hover:rounded-xl cursor-pointer"
            >
              <Box className="size-5 pr-1" />
              Stock Level
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex mr-1">
        <div className="relative hidden md:flex flex-col items-center max-w-xs">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-5 pr-4 bg-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <button
              className="absolute right-2 top-2 bg-teal-500 text-white p-1 rounded-full hover:bg-teal-600 transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {query && (
            <div className="absolute top-full mt-2 z-10 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-200">
              {filteredForms.length > 0 ? (
                filteredForms.map((form) => (
                  <div
                    key={form.id}
                    className="p-2 cursor-pointer hover:bg-teal-100 transition"
                    onClick={() => router.push(form.path)}
                  >
                    {form.name}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No results found</div>
              )}
            </div>
          )}
        </div>

        <Popover>
          <PopoverTrigger className="lg:hidden p-2 text-teal-900 rounded-full transition">
            <Menu className="w-6 h-6" />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="right"
            sideOffset={10}
            className="bg-white shadow-lg rounded-md p-4 lg:hidden"
          >
            <div className="relative p-4 md:hidden flex">
              <Input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-5 pr-10 bg-white rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              {query && (
                <div className="absolute top-full z-10 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                  {filteredForms.length > 0 ? (
                    filteredForms.map((form) => (
                      <div
                        key={form.id}
                        className="p-2 cursor-pointer hover:bg-teal-100 transition"
                        onClick={() => router.push(form.path)}
                      >
                        {form.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No results found</div>
                  )}
                </div>
              )}
              <button
                className="absolute top-1/2 transform -translate-y-1/2 right-5 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col space-y-2 xs:border-t xs:border-teal-500">
              <a
                className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
                onClick={() => router.push("/lab/pathology")}
              >
                <Microscope className="w-5 h-5" />
                Pathology
              </a>
              <a
                className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
                onClick={() => router.push("/lab/immunology")}
              >
                <Syringe className="w-5 h-5" />
                Immunology
              </a>
              <a
                className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
                onClick={() => router.push("/lab/microbiology")}
              >
                <Dna className="w-5 h-5" />
                Microbiology
              </a>
              <a
                className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
                onClick={() => router.push("/lab/pathology")}
              >
                <ShoppingCart className="w-5 h-5" />
                Purchase Order
              </a>
              <a
                className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
                onClick={() => router.push("/lab/pathology")}
              >
                <Box className="w-5 h-5" />
                Stock Level
              </a>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className="flex items-center text-white p-0.5 transition">
            <UserRound className="w-6 h-6 text-teal-900 transition hover:scale-110" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-2 shadow-lg">
            <a
              onClick={() => {
                setShowEditDialog(true);
              }}
              className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
            >
              <UserPen className="size-5 -mt-0.5" />
              Edit Profile
            </a>
            <a
              onClick={() => {
                setShowResetDialog(true);
              }}
              className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
            >
              <RotateCw className="size-5 -mt-0.5" />
              Reset Password
            </a>
            {(userRole === "admin" || userRole === "superadmin") && (
              <a
                onClick={() => router.push("/admin-dashboard")}
                className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
              >
                <UserCog className="size-5 -mt-0.5" />
                Manage Users
              </a>
            )}
            <a
              onClick={() => setIsLogoutDialogOpen(true)}
              className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
            >
              <LogOut className="size-5 -mt-0.5" />
              Logout
            </a>
          </PopoverContent>
        </Popover>

        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 tracking-tight text-teal-900 mt-2">
                <RotateCw className="text-teal-900 size-5 -mt-0.5" />
                Reset Password
              </DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <ChangePassword closeDialog={() => setShowResetDialog(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 tracking-tight text-teal-900 mt-2">
                <UserPen className="text-teal-900 size-5 -mt-0.5" />
                Edit Profile
              </DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <EditAccount closeDialog={() => setShowEditDialog(false)} />
          </DialogContent>
        </Dialog>
        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 tracking-tight">
                <LogOut className="text-red-500 size-5 -mt-0.5" />
                Confirm Logout
              </DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <p className="text-left pt-2 text-sm">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                className="bg-gray-100"
                onClick={() => setIsLogoutDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsLogoutDialogOpen(false);
                  logoutUser();
                }}
              >
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isPrintDialogOpen} onOpenChange={setisPrintDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 tracking-tight">
                <Printer className="text-teal-500 size-5 -mt-0.5" />
                Print Stock Level Report
              </DialogTitle>
            </DialogHeader>
            <DialogDescription />
            <p className="text-left pt-2 text-m">
              Select page size for the report:
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
                    {
                      label: "Short (Letter, 215.9 x 279.4 mm)",
                      value: "short",
                    },
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
              Select orientation for the report:
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
                        setOrientation(checked ? option.value : undefined)
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
                onClick={() => setisPrintDialogOpen(false)}
              >
                Cancel
              </Button>
              <PdfGenerator
                pdfTitle="Stock Level Report"
                pageSize={pageSize}
                orientation={orientation}
                tableHeaders={tableHeaders}
                tableData={tableData}
                closeDialog={() => setisPrintDialogOpen(false)}
              ></PdfGenerator>
            </div>
          </DialogContent>
        </Dialog>
        <Toaster />
      </div>
    </div>
  );
};

export default Navbar;
