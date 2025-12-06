import { Avatar ,AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

import { cva, VariantProps } from "class-variance-authority"

const avatarVariants = cva("", {
    variants: {
        size:{
            default:"h-9 w-9",
            xs :"h-4 w-4",
            sm: "h-6 w-6",
            md: "h-9 w-9",
            lg: "h-[160px] w-[160px]"
        },
        defaultVariants:{
            size: "default"
        }

    }
})

interface UserAvatarProps extends VariantProps<typeof avatarVariants>{
    imageUrl: string;
    name: string;
    className?: string;
    onClick?: () => void;
}

export const UserAvatar = ({
    imageUrl,
    name,
    size,
    className,
    onClick
}:UserAvatarProps) => {

    return <div>
        <Avatar className={cn(avatarVariants({className,size}))} >
            <AvatarImage src={imageUrl} onClick={onClick} alt={name}/>
        </Avatar>
    </div>
}