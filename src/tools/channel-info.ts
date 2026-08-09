import { z } from 'zod';
import { getChannelInfo } from '../lib/innertube.js';

export const channelInfoInputSchema = {
  channelUrl: z.string().describe('Channel URL, @handle, or channel ID'),
};

export async function handleChannelInfo(args: { channelUrl: string }) {
  const info = await getChannelInfo(args.channelUrl);

  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify(info, null, 2),
    }],
  };
}
