import { z } from 'zod';
import { getChannelInfo } from '../lib/innertube.js';
export const channelInfoInputSchema = {
    channelUrl: z.string().describe('Channel URL, @handle, or channel ID'),
};
export async function handleChannelInfo(args) {
    const info = await getChannelInfo(args.channelUrl);
    return {
        content: [{
                type: 'text',
                text: JSON.stringify(info, null, 2),
            }],
    };
}
//# sourceMappingURL=channel-info.js.map