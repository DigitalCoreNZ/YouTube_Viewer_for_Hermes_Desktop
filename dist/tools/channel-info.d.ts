import { z } from 'zod';
export declare const channelInfoInputSchema: {
    channelUrl: z.ZodString;
};
export declare function handleChannelInfo(args: {
    channelUrl: string;
}): Promise<{
    resultType: "complete";
    content: {
        type: "text";
        text: string;
    }[];
    structuredContent: Record<string, unknown>;
}>;
//# sourceMappingURL=channel-info.d.ts.map