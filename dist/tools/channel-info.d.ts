import { z } from 'zod';
export declare const channelInfoInputSchema: {
    channelUrl: z.ZodString;
};
export declare function handleChannelInfo(args: {
    channelUrl: string;
}): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=channel-info.d.ts.map