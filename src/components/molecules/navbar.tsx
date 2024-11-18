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
  UserPen
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
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

const Navbar = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [accountType, setAccountType] = useState(""); 

  useEffect(() => {
    const token = localStorage.getItem("authToken");
  
    if (token) {
      // Check if the token is in a valid JWT format (3 parts separated by ".")
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        try {
          const decoded = atob(tokenParts[1]);  // Decode the payload
          const user = JSON.parse(decoded);  // Parse the decoded string into an object
          setAccountType(user?.role || "user");  // Set account type (e.g., admin, superadmin, or user)
        } catch (error) {
          console.error("Invalid token format", error);
          // Handle invalid token case (e.g., by logging out the user)
        }
      } else {
        console.error("Token is not a valid JWT");
        // Handle invalid token case (e.g., by logging out the user)
      }
    }
  }, []);
  

  const handlePasswordReset = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }forgot-password?email=${encodeURIComponent(email)}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      toast.success("Password reset email sent successfully.");
      setShowResetDialog(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to reset password. Please try again.");
    }
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
            <NavigationMenuLink className="p-2.5 flex hover:text-teal-800 hover:bg-teal-200 hover:rounded-xl">
              <a className="flex" onClick={() => router.push("/lab/pathology")}>
                <Microscope className="size-5 pr-1" />
                Pathology
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="p-2.5 flex hover:text-teal-800 hover:bg-teal-200 hover:rounded-xl">
              <a
                className="flex"
                onClick={() => router.push("/lab/immunology")}
              >
                <Syringe className="size-5 pr-1" />
                Immunology
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="p-2.5 flex hover:text-teal-800 hover:bg-teal-200 hover:rounded-xl">
              <a
                className="flex"
                onClick={() => router.push("/lab/microbiology")}
              >
                <Dna className="size-5 pr-1" />
                Microbiology
              </a>
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
            <a
              onClick={() => setIsLogoutDialogOpen(true)}
              className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
              >
                <LogOut className="size-5 -mt-0.5" />
              Logout
            </a>

            {(accountType === "admin" || accountType === "superadmin") && (
              <>
                <a
                  onClick={() => router.push("/admin/manage-users")}
                  className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
                >
                  <UserPen className="size-5 -mt-0.5" />
                  Manage Users
                </a>
                <a
                  onClick={() => router.push("/admin/view-users")}
                  className="flex items-center gap-2 tracking-tight text-gray-700 mt-2 px-4 py-2 hover:bg-gray-100 rounded-md transition"
                >
                  <UserPen className="size-5 -mt-0.5" />
                  View Users
                </a>
              </>
            )}
          </PopoverContent>
        </Popover>

        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight text-teal-900 mt-2">
              <RotateCw className="text-teal-900 size-5 -mt-0.5" />
              Reset Password
            </DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <label
              htmlFor="email"
              className="text-xs font-medium text-gray-500"
            >
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <p className="text-left ml-1 -mt-2 relative text-sm mb-3">
            By clicking, a temporary password will be emailed to you.
          </p>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setShowResetDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              className="bg-teal-500 text-white hover:bg-teal-700 hover:text-white transition-colors duration-300 ease-in-out"
              onClick={() => {
                handlePasswordReset();
              }}
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
