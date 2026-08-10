import { z } from 'zod';
type TranscriptFormat = 'text' | 'segments' | 'both';
export declare const transcriptInputSchema: {
    videoId: z.ZodString;
    language: z.ZodOptional<z.ZodString>;
    format: z.ZodOptional<z.ZodEnum<["text", "segments", "both"]>>;
    startTime: z.ZodOptional<z.ZodNumber>;
    endTime: z.ZodOptional<z.ZodNumber>;
    maxSegments: z.ZodOptional<z.ZodNumber>;
};
interface TranscriptArgs {
    videoId: string;
    language?: string;
    format?: TranscriptFormat;
    startTime?: number;
    endTime?: number;
    maxSegments?: number;
}
export declare function handleTranscript(args: TranscriptArgs): Promise<{
    resultType: "complete";
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
    structuredContent: Record<string, unknown>;
} | {
    resultType: "complete";
    content: {
        type: "text";
        text: string;
    }[];
    structuredContent: Record<string, unknown>;
    isError?: undefined;
}>;
export {};
//# sourceMappingURL=transcript.d.ts.map