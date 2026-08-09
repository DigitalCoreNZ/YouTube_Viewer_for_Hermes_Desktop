import { z } from 'zod';
export declare const channelVideosInputSchema: {
    channelUrl: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodEnum<["newest", "popular", "oldest"]>>;
};
interface ChannelVideosArgs {
    channelUrl: string;
    limit?: number;
    sort?: string;
}
export declare function handleChannelVideos(args: ChannelVideosArgs): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export {};
//# sourceMappingURL=channel-videos.d.ts.map