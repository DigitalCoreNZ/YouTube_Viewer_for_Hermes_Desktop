import { z } from 'zod';
export declare const playlistInputSchema: {
    playlistId: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
};
interface PlaylistArgs {
    playlistId: string;
    limit?: number;
}
export declare function handlePlaylist(args: PlaylistArgs): Promise<{
    resultType: "complete";
    content: {
        type: "text";
        text: string;
    }[];
    structuredContent: Record<string, unknown>;
}>;
export {};
//# sourceMappingURL=playlist.d.ts.map