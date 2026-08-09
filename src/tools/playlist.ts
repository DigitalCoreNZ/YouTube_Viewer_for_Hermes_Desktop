import { z } from 'zod';
import { getPlaylist } from '../lib/innertube.js';
import { getConfig } from '../lib/user-config.js';
import { DEFAULTS } from '../config.js';

export const playlistInputSchema = {
  playlistId: z.string().describe('YouTube playlist ID'),
  limit: z.number().min(1).max(DEFAULTS.playlist.maxLimit).optional()
    .describe(`Number of videos to return (default: ${DEFAULTS.playlist.defaultLimit}, max: ${DEFAULTS.playlist.maxLimit})`),
};

interface PlaylistArgs {
  playlistId: string;
  limit?: number;
}

export async function handlePlaylist(args: PlaylistArgs) {
  const config = getConfig();
  const limit = args.limit ?? config.playlist.defaultLimit;

  const info = await getPlaylist(args.playlistId, limit);

  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify(info, null, 2),
    }],
  };
}
