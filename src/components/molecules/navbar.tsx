"use client";
import {
  Search,
  UserRound,
  ShoppingCart,
  Microscope,
  Syringe,
  Dna,
  Package,
} from "lucide-react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "../ui/navigation-menu";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="w-full max-w-full bg-teal-50 shadow-lg p-2 flex items-center justify-between sticky top-0 z-50 overflow-x-hidden">
      <div className="flex items-center space-x-1">
        <Image
          src="/images/logo.png"
          alt="Logo"
          className="transition duration-500 hover:scale-110"
          height={40}
          width={40}
        />
        <span className="text-base text-teal-900">ALIMS</span>
      </div>

      <NavigationMenu className="hidden md:flex text-teal-950 space-x-2 text-sm">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Microscope className="size-5 pr-1" />
              Pathology
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-full md:relative right-0 md:w-48 bg-white shadow-lg rounded-xl">
              <ul className="gap-3 p-2">
                <li>
                  <a
                    onClick={() => router.push("/microbiology/forms")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    View Forms
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/microbiology/inventory")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Inventory
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/microbiology/purchase-order")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Purchase Order
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/microbiology/stock-level")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Stock Level
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/microbiology/disposition")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Disposition
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Syringe className="size-5 pr-1" />
              Immunology
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-full md:relative md:w-48 bg-white shadow-lg rounded-xl">
              <ul className="gap-3 p-2">
                <li>
                  <a
                    onClick={() => router.push("/immunology/forms")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    View Forms
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/immunology/inventory")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Inventory
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/immunology/purchase-order")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Purchase Order
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/immunology/stock-level")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Stock Level
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/immunology/disposition")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Disposition
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Dna className="size-5 pr-1" />
              Microbiology
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-full md:relative md:w-48 bg-white shadow-lg rounded-xl">
              <ul className="gap-3 p-2">
                <li>
                  <a
                    onClick={() => router.push("/microbiology/forms")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    View Forms
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/microbiology/inventory")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Inventory
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/microbiology/purchase-order")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Purchase Order
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/microbiology/stock-level")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Stock Level
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => router.push("/microbiology/disposition")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    Disposition
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="pr-5 flex hover:text-teal-800">
              <ShoppingCart className="size-5 pr-1" />
              Purchase Order
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="hover:text-teal-800 flex">
              <Package className="size-5 pr-1" />
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
              onClick={() => router.push("/logout")}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
            >
              Logout
            </a>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
