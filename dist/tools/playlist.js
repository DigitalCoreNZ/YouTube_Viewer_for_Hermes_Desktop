import { z } from 'zod';
import { getPlaylist } from '../lib/innertube.js';
import { getConfig } from '../lib/user-config.js';
import { DEFAULTS } from '../config.js';
export const playlistInputSchema = {
    playlistId: z.string().describe('YouTube playlist ID'),
    limit: z.number().min(1).max(DEFAULTS.playlist.maxLimit).optional()
        .describe(`Number of videos to return (default: ${DEFAULTS.playlist.defaultLimit}, max: ${DEFAULTS.playlist.maxLimit})`),
};
export async function handlePlaylist(args) {
    const config = getConfig();
    const limit = args.limit ?? config.playlist.defaultLimit;
    const info = await getPlaylist(args.playlistId, limit);
    const serialized = JSON.stringify(info, null, 2);
    return {
        resultType: 'complete',
        content: [{
                type: 'text',
                text: serialized,
            }],
        structuredContent: info,
    };
}
//# sourceMappingURL=playlist.js.map