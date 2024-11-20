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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

const Navbar = () => {
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

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
      <div className="flex items-center px-2 space-x-1">
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
        <div className="relative flex items-center max-w-xs mr-4">
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
          <PopoverTrigger className="flex items-center text-white p-0.5 transition">
            <UserRound className="w-6 h-6 text-teal-900 transition hover:scale-110" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-2 shadow-lg">
            <a
              onClick={() => router.push("/profile")}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
            >
              Profile
            </a>
            <a
              onClick={() => router.push("/settings")}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
            >
              Settings
            </a>
            <a
              onClick={() => setIsLogoutDialogOpen(true)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
            >
              Logout
            </a>
          </PopoverContent>
        </Popover>

        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 tracking-tight">
                <LogOut className="text-red-500 size-5 -mt-0.5" />
                Confirm Logout
              </DialogTitle>
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

        <Toaster />
      </div>
    </div>
  );
};

export default Navbar;
