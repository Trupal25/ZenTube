"use client"
import { trpc } from "@/trpc/server"

export const PageClient = ()=> {
    const [data] = trpc.hello.useSuspenseQuery({
        text:"Antonio"
    })

return <div>
    Page Cilent says: { data.greeting}
    </div>
}