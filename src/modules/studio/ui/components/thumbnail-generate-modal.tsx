import { z } from "zod";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Textarea } from "@/components/ui/textarea";
import { ResponsiveModal } from "@/components/responsive-dialog";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";

interface ThumbnailGenerateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    videoId: string;
}

const formSchema = z.object({
    prompt: z.string().min(10, {
        message: "Prompt must be at least 10 characters long"
    })
})


export const ThumbnailGenerateModal = ({ open, onOpenChange, videoId }: ThumbnailGenerateModalProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })
    const utils = trpc.useUtils();
     const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
        onSuccess: () => {
            toast.success("Background task for thumbnail generation started successfully")
        },
        onError: () => {
            toast.error("Failed to generate thumbnail,Something went wrong")
        }
    })
    const onSubmit = () => {
        utils.studio.getOne.invalidate({ id: videoId });
        utils.studio.getMany.invalidate();
        onOpenChange(false);
    }
    
    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title="Upload a thumbnail"
        >
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="flex flex-col gap-4"
                >
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prompt</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        // disabled={}
                                        placeholder="Describe the Thumbnail"
                                        className="resize-none"
                                        cols={30}
                                        rows={5}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />       
                    <div className="flex justify-end gap-2">
                        <Button 
                        type="submit"
                        >
                            Generate
                        </Button>
                    </div>
                </form>       
            </Form>       
        </ResponsiveModal>
    );
}