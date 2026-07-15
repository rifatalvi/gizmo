"use client"

import { Calendar, Home, Inbox, Search, Settings, Plus, List } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Admin Dashboard",
    url: "/dashboard/admin",
    icon: Home,
  },
  {
    title: "User Dashboard",
    url: "/dashboard/user",
    icon: Inbox,
  },
  {
    title: "Add Items",
    url: "/items/add",
    icon: Plus,
  },
  {
    title: "Manage Items",
    url: "/items/manage",
    icon: List,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gizmo Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />}>
                      <item.icon />
                      <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
