import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UserInfoVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      default: "[&_p]:text-sm [&_svg]:size-4",
      lg: "[&_p]:text-base [&_svg]:size-5 [&_p]:font-medium [&_p]:text-black",
      sm: "[&_p]:text-sm [&_svg]:size-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserInfoProps extends VariantProps<typeof UserInfoVariants> {
  name: string;
  className?: string;
}
export const UserInfo = ({ name, className, size }: UserInfoProps) => {
  return (
    <div className={cn(UserInfoVariants({ size, className }))}>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-gray-500 hover:text-gray-800 line-clamp-1">
            {name}
          </p>
        </TooltipTrigger>
        <TooltipContent align="center" className="bg-black/70">
          <p className="text-gray-500 hover:text-gray-800 line-clamp-1">
            {name}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
