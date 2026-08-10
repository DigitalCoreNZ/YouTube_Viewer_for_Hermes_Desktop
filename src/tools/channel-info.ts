import { z } from 'zod';
import { getChannelInfo } from '../lib/innertube.js';

export const channelInfoInputSchema = {
  channelUrl: z.string().describe('Channel URL, @handle, or channel ID'),
};

export async function handleChannelInfo(args: { channelUrl: string }) {
  const info = await getChannelInfo(args.channelUrl);
  const serialized = JSON.stringify(info, null, 2);

  return {
    resultType: 'complete' as const,
    content: [{
      type: 'text' as const,
      text: serialized,
    }],
    structuredContent: info as unknown as Record<string, unknown>,
  };
}
