import { z } from 'zod';
export declare const highlightReelInputSchema: {
    clips: z.ZodArray<z.ZodString, "many">;
    outputDir: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
};
interface HighlightReelArgs {
    clips: string[];
    outputDir?: string;
    label?: string;
}
export declare function handleHighlightReel(args: HighlightReelArgs): Promise<{
    resultType: "complete";
    content: {
        type: "text";
        text: string;
    }[];
    structuredContent: Record<string, unknown>;
}>;
export {};
//# sourceMappingURL=highlight-reel.d.ts.map