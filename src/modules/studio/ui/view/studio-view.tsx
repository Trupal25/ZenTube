import { VideosSection } from "../section/video-section"


export const StudioView = () => {

    return (
        <div className="flex flex-col gap-y-6 pt-2.5">
            <div >
                <div className="px-4">
                    <h1 className="text-2xl font-bold">
                        Your content
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Manage you channel content here
                    </p>
                </div>
            </div>
            <VideosSection />
        </div>
    )
}