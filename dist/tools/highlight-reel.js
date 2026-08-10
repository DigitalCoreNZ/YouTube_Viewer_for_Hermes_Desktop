import { z } from 'zod';
import { concatClips, formatFileSize, getVideoDuration, formatSeconds } from '../lib/download.js';
import { statSync } from 'fs';
export const highlightReelInputSchema = {
    clips: z.array(z.string()).min(2).describe('Array of file paths to clips, in playback order (minimum 2)'),
    outputDir: z.string().optional()
        .describe('Output directory for the highlight reel (defaults to current directory)'),
    label: z.string().optional()
        .describe('Label for the output filename (default: "highlight-reel")'),
};
export async function handleHighlightReel(args) {
    const outputDir = args.outputDir ?? '.';
    const label = args.label ?? 'highlight-reel';
    const outputPath = `${outputDir}/${label}.mp4`;
    await concatClips(args.clips, outputPath, { reencode: true });
    const fileSize = formatFileSize(statSync(outputPath).size);
    const duration = await getVideoDuration(outputPath);
    const payload = {
        filePath: outputPath,
        duration: formatSeconds(duration),
        durationSeconds: duration,
        fileSize,
        clipCount: args.clips.length,
    };
    const serialized = JSON.stringify(payload, null, 2);
    return {
        resultType: 'complete',
        content: [{
                type: 'text',
                text: serialized,
            }],
        structuredContent: payload,
    };
}
//# sourceMappingURL=highlight-reel.js.map