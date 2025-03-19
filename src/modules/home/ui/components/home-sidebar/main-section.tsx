"use client"
import Link from "next/link"
import { SidebarGroup,SidebarGroupContent, SidebarMenu , SidebarMenuItem , SidebarMenuButton } from "@/components/ui/sidebar"
import { FlameIcon, HomeIcon, PlaySquareIcon,  } from "lucide-react"

const items = [
    {
        title:"Home",
        url:"/",
        icon:HomeIcon
    },
    {
        title:"Suscriptions",
        url:"/feed/subscription",
        icon:PlaySquareIcon,
        auth:true
    },
    {
        title:"Trending",
        url:"/feed/trending",
        icon:FlameIcon
    }
]

export const MainSection = ()=>{

    return <SidebarGroup>
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