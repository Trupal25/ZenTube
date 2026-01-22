import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

export const VideoReactions = () => {
  const videoReaction = "liked";
  return (
    <div className="flex flex-shrink-0">
      <Button variant="outline" className={cn("rounded-full rounded-r-none")}>
        <ThumbsUpIcon />
        {1}
      </Button>
      <Separator orientation="vertical" />
      <Button variant="outline" className={cn("rounded-full rounded-l-none")}>
        <ThumbsDownIcon />
        {1}
      </Button>
    </div>
  );
};
