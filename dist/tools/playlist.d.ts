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
    content: {
        type: "text";
        text: string;
    }[];
}>;
export {};
//# sourceMappingURL=playlist.d.ts.map