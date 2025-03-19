"use client"
import Link from "next/link"
import { SidebarGroup,SidebarGroupContent, SidebarMenu , SidebarMenuItem , SidebarMenuButton ,SidebarGroupLabel } from "@/components/ui/sidebar"
import {  HistoryIcon, ListVideoIcon, ThumbsUpIcon,  } from "lucide-react"

const items = [
    {
        title:"History",
        url:"/playlist/history",
        icon:HistoryIcon,
        auth:true
    },
    {
        title:"Liked Videos",
        url:"/playlist/liked",
        icon:ThumbsUpIcon,
        auth:true
    },
    {
        title:"All Playlist",
        url:"/playlist",
        icon:ListVideoIcon,
        auth:true
    }
]

export const PersonalSection = ()=>{

    return <SidebarGroup>
        
        <SidebarGroupLabel>You</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu>
                {items.map((item)=>(
                    <SidebarMenuItem key={item.title} >
                        <SidebarMenuButton 
                        tooltip={item.title}
                        asChild
                        isActive={false} // TODO: check current pathname 
                        onClick={()=>{}} //TODO: complete onclick handler
                        >
                            <Link href={item.url} className="flex items-center gap-4">
                            <item.icon />
                            <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroupContent>

    </SidebarGroup>
}