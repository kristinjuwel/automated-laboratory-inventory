import {
  ShoppingCart,
  Bandage,
  Syringe,
  Dna,
  Package,
  Stethoscope,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const items = [
  {
    title: "Pathology",
    url: "#",
    icon: Bandage,
  },
  {
    title: "Immunology",
    url: "#",
    icon: Syringe,
  },
  {
    title: "Microbiology",
    url: "#",
    icon: Dna,
  },
  {
    title: "Purchase Order",
    url: "#",
    icon: ShoppingCart,
  },
  {
    title: "Stock Levels",
    url: "#",
    icon: Package,
  },
  {
    title: "Disposition",
    url: "#",
    icon: Stethoscope,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base">
            <div className="-ml-1 w-20 h-20 relative pb-4">
              <Image
                src="/images/placeholder.png"
                alt="Logo 1"
                fill
                style={{ objectFit: "contain" }}
              />
              <Separator />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6">
              {items.map((item) => (
                <Collapsible key={item.title}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuItem className="h-10 text-xl">
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    Yes. Free to use for personal and commercial projects. No
                    attribution required.
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
