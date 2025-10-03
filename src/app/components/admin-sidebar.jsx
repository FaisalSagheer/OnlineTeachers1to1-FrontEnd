"use client"

import React, { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
    Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter
} from "@/components/ui/sidebar"
import {
    Home, Users, FileText, Calendar, Settings, LogOut, User, GraduationCap, BookOpen
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import Cookies from "js-cookie"
import Logo from "../image/Online Teachers 1 to 1 transparent.png"

// API Helper
const fetcher = async (url) => {
    const token = Cookies.get("accessToken")
    if (!token) throw new Error("Not authorized.")
    
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) {
        const error = new Error("An error occurred while fetching the data.")
        error.info = await res.json()
        error.status = res.status
        throw error
    }
    return res.json()
}

// Menu Items Array
const adminMenuItems = [
    { title: "Dashboard", url: "/admin", icon: Home },
    { title: "Application Manager", url: "/admin/application-manager-create", icon: Users },
    { title: "Application Management", url: "/admin/application-manager-manage", icon: Users },
    { title: "User Management", url: "/admin/users", icon: Users },
    { title: "Parent Management", url: "/admin/parents", icon: Users },
    { title: "Student Management", url: "/admin/students", icon: GraduationCap },
    { title: "Subject Management", url: "/admin/subjects", icon: BookOpen },
    { title: "Grade Management", url: "/admin/course-grade", icon: BookOpen },
    { title: "Skills Management", url: "/admin/skills-level", icon: BookOpen },
    { title: "Curriculum Management", url: "/admin/curriculum-type", icon: BookOpen },
    { title: "Department Management", url: "/admin/department", icon: BookOpen },
    { title: "Designation Management", url: "/admin/designation", icon: BookOpen },
    { title: "Learning Type Management", url: "/admin/learning-type", icon: BookOpen },
    { title: "Course Management", url: "/admin/courses", icon: BookOpen },
  { title: "Course Assignment", url: "/admin/course-assignment", icon: BookOpen },
    { title: "Teacher Management", url: "/admin/teachers", icon: User },
    { title: "Fee Management", url: "/admin/fees", icon: Calendar },
    { title: "Content Management", url: "/admin/content", icon: FileText },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const { data: userData, error, isLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-info/`,
        fetcher,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    )

    useEffect(() => {
        if (isLoading) return
        if (error || (userData && userData.user?.role?.toLowerCase() !== "admin")) {
            Cookies.remove("accessToken")
            router.replace("/login")
        }
    }, [userData, error, isLoading]) // Correct dependency array

    const handleLogout = () => {
        Cookies.remove("accessToken")
        router.push("/login")
    }

    const isActive = (path) => pathname === path

    if (isLoading) {
        return (
            <Sidebar side="left" variant="sidebar" collapsible="icon">
                <div className="flex justify-center items-center h-full">
                    {/* Using a different icon for loading to avoid conflicts */}
                    <Users className="h-8 w-8 animate-spin" />
                </div>
            </Sidebar>
        )
    }

    if (!userData?.user || userData.user.role?.toLowerCase() !== "admin") {
        return null
    }

    return (
        <Sidebar side="left" variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <Link href="/">
                    <Image src={Logo || "/placeholder.svg"} alt="logo" className="logo-main" width={250} height={100} style={{padding: '1rem'}}/>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                                        <Link href={item.url}>
                                            {/* ✅ THIS IS THE FIX: Using standard JSX tag syntax */}
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                         <div className="flex items-center gap-3 p-3">
                             <div><User size={18} /></div>
                             <div className="flex flex-col gap-1">
                                 <span className="font-semibold text-sm">{userData?.user?.username || "Admin"}</span>
                                 <span className="text-xs text-gray-500">{userData?.user?.email || "admin@example.com"}</span>
                             </div>
                         </div>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="cursor-pointer" tooltip="Logout" onClick={handleLogout}>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}