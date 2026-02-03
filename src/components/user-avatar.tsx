import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { cva, VariantProps } from "class-variance-authority";

const avatarVariants = cva("", {
  variants: {
    size: {
      default: "h-9 w-9",
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-9 w-9",
      xl: "h-[160px] w-[160px]",
    },
    defaultVariants: {
      size: "default",
    },
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
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
  onClick,
}: UserAvatarProps) => {
  return (
    <div>
      <Avatar className={cn(avatarVariants({ className, size }))}>
        <AvatarImage src={imageUrl} onClick={onClick} alt={name} />
      </Avatar>
    </div>
  );
};
