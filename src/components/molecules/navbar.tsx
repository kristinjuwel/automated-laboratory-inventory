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
  X
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
import { useState } from "react";
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

const Navbar = () => {
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const userRole = localStorage.getItem("userRole");

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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

      <NavigationMenu className="ml-36 hidden md:flex text-teal-950 justify-center space-x-2 text-sm">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className="p-2.5 flex hover:text-teal-800 hover:bg-teal-200 hover:rounded-xl"
              onClick={() => router.push("/lab/pathology")}
            >
              <Microscope className="size-5 pr-1" />
              Pathology
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className="p-2.5 flex hover:text-teal-800 hover:bg-teal-200 hover:rounded-xl"
              onClick={() => router.push("/lab/immunology")}
            >
              <Syringe className="size-5 pr-1" />
              Immunology
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className="p-2.5 flex hover:text-teal-800 hover:bg-teal-200 hover:rounded-xl"
              onClick={() => router.push("/lab/microbiology")}
            >
              <Dna className="size-5 pr-1" />
              Microbiology
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="p-2.5 flex hover:text-teal-800">
              <ShoppingCart className="size-5 pr-1" />
              Purchase Order
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="hover:text-teal-800 flex">
              <Box className="size-5 pr-1" />
              Stock Level
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      

      <div className="flex mr-1">
        <div className="relative hidden md:flex items-center max-w-xs">
          <Input
            type="text"
            placeholder="Search..."
            className="w-full pl-5 pr-4 bg-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            className="absolute right-2 bg-teal-500 text-white p-1 rounded-full hover:bg-teal-600 transition"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        <Popover>
          <PopoverTrigger className="md:hidden p-2 text-teal-900 rounded-full transition">
            <Menu className="w-6 h-6" />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="right"
            sideOffset={10}
            className="bg-white shadow-lg rounded-md p-4"
          >
            <div className="relative p-4">
              <Input
                type="text"
                placeholder="Search..."
                className="w-full pl-5 pr-10 bg-white rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              <button
                className="absolute top-1/2 transform -translate-y-1/2 right-5 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col space-y-2 border-t border-teal-500">
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
      </div>
    </div>
  );
};

export default Navbar;
