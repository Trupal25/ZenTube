import { VideoGetOneOutput } from "../../types";
import { AlertTriangleIcon } from "lucide-react";


interface VideoBannerProps {
    status: VideoGetOneOutput["muxStatus"];
}

export const VideoBanner = ({ status }: VideoBannerProps) => {

    if(status === "ready") return null;
    
    return (
        <div className="flex bg-yellow-400 px-3 py-4 rounded-b-xl items-center gap-2">
            <AlertTriangleIcon className="text-black shrink-0 size-4" />
            <p>Video is still being processed.</p>
        </div>
    )
}
