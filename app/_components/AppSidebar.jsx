"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Moon, Sun, User2 } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { SignInButton, useUser } from "@clerk/nextjs"

export function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const {user} = useUser();

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-3">
        <div className=" flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="logo"
              width={60}
              height={60}
              className="w-10 h-10"
            />
            <h2 className="font-bold text-xl">AI Fusion</h2>
          </div>

          {/* ✅ Render only after mount to avoid hydration mismatch */}
          <div>
            {mounted && (
              theme === "light" ? (
                <Button variant="ghost" onClick={() => setTheme("dark")}>
                  <Sun />
                </Button>
              ) : (
                <Button onClick={() => setTheme("light")}>
                  <Moon />
                </Button>
              )
            )}
          </div>
        </div>
        <Button className='mt-7 w-full' size="lg">+ New Chat</Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup >
          <div className={'p-3'}>
          <h2 className="font-bold text-lg">Chat</h2>
          <p className="text-sm text-gray-400">Sign in to start chating with multiple AI Model </p>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
<div className="p-3 mb-10">
 { !user?  <SignInButton mode="model">
  <Button className={'w-full'} size={'lg'}>Sign In/Sign up</Button></SignInButton> : 
  <Button className="flex w-full" variant={'ghost'}>
    <User2 /> <h2>Settings</h2> 
  </Button>
    }
</div>
      </SidebarFooter>
    </Sidebar>
  )
}
