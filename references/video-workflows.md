# YouTube Video Workflows — v0.5.1

Reference guide for common research workflows using the YouTube Viewer tools.

## Single Video Research

1. `youtube_get_video_info(videoId: "...")` — get metadata (title, channel, duration, chapters)
2. `youtube_get_transcript(videoId: "...")` — get the transcript
3. Read through the transcript, extract key points, summarize for the user

## Multi-Video Comparison

1. `youtube_search(query: "topic", limit: 10)` — find relevant videos
2. For each promising result, call `youtube_get_video_info(videoId: "...")` — get quick metadata
3. Select top 3-5, call `youtube_get_transcript(videoId: "...")` for each
4. Compare and synthesize findings

## Channel Deep Dive

1. `youtube_get_channel_info(channelUrl: "@handle")` — get channel overview
2. `youtube_get_channel_videos(channelUrl: "@handle", sort: "popular", limit: 20)` — find best videos
3. For the most popular/interesting videos, fetch transcripts and analyze

## Download + Clip

1. `youtube_get_video_info(videoId: "...")` — check duration
2. `youtube_download(videoId: "...")` — download at 720p
3. `youtube_get_transcript(videoId: "...")` — identify key moments
4. `youtube_clip(videoId: "...", clips: [{startTime, endTime, label}])` — extract clips
5. `youtube_highlight_reel(clips: ["path1.mp4", "path2.mp4"])` — combine into reel

## Playlist Research

1. `youtube_get_playlist(playlistId: "PL...", limit: 50)` — list all videos
2. For each video, fetch transcript and analyze
3. Present a summarized view of the entire playlist's content
