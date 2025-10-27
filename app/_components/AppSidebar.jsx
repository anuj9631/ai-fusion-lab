import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        
        <Image src={'/logo.svg'} alt="logo" width={60} height={60} 
        className="w-[40px] h-[40px]"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}