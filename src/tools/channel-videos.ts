import { z } from 'zod';
import { getChannelVideos } from '../lib/innertube.js';
import { getConfig } from '../lib/user-config.js';
import { DEFAULTS } from '../config.js';

export const channelVideosInputSchema = {
  channelUrl: z.string().describe('Channel URL, @handle, or channel ID'),
  limit: z.number().min(1).max(DEFAULTS.channel.maxVideoLimit).optional()
    .describe(`Number of videos to return (default: ${DEFAULTS.channel.defaultVideoLimit}, max: ${DEFAULTS.channel.maxVideoLimit})`),
  sort: z.enum(['newest', 'popular', 'oldest']).optional()
    .describe(`Sort order (default: ${DEFAULTS.channel.defaultSort})`),
};

interface ChannelVideosArgs {
  channelUrl: string;
  limit?: number;
  sort?: string;
}

export async function handleChannelVideos(args: ChannelVideosArgs) {
  const config = getConfig();
  const limit = args.limit ?? config.channel.defaultVideoLimit;
  const sort = args.sort ?? config.channel.defaultSort;

  const result = await getChannelVideos(args.channelUrl, limit, sort);

  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify(result, null, 2),
    }],
  };
}
