---
title: YouTube Viewer for Hermes Desktop
subtitle: An Agent with Video Watching Abilities
author: Hermes Agent, Brian King
revnumber: v0.5.1
doctype: book
cDay: Monday
cDate: 10
cMonth: 08
cYear: 2026
uDay: Monday
uDate: 10
uMonth: 08
uYear: 2026
toc: true
toclevels: 6
sectnums: true
sectnumlevels: 6
icons: font
keywords: YouTube, MCP, Model Context Protocol, Hermes Desktop, Hermes Agent, video viewer, AI agent, transcript extraction, video download, clip extraction, InnerTube API, cookie authentication, Chrome CDP, yt-dlp, ffmpeg, Node.js
summary: A Hermes Agent SKILL that bridges the YouTube capability gap for Hermes Desktop — search videos, extract transcripts, browse channels, download content, and clip highlights via MCP (Model Context Protocol). Supports anonymous and personalized modes with Chrome CDP cookie authentication.
description: A comprehensive documentation and reference for the YouTube Viewer for Hermes Desktop — an MCP server plugin that enables Hermes Agent to search, watch, analyze, download, and clip YouTube content. Covers installation, authentication (anonymous and personalized modes), architecture analysis (InnerTube API, cookie auth via Chrome CDP, yt-dlp/ffmpeg download engine), known failures, and recommended improvements for v0.5.2.
license: Apache 2.0
status: Complete
attributions: YouTube for AI Agents by JCodesMore (Apache 2.0), Hermes Agent SKILLS Hub (Nous Research), InnerTube API (youtubei.js), youtube-transcript-plus, ytdlp-nodejs / yt-dlp, ffmpeg-static / ffmpeg, Puppeteer-core / Chrome DevTools Protocol, @modelcontextprotocol/sdk, arXiv
copyright: © Copyright 2020-2026 DigitalCoreNZ. All rights reserved.
---

# YouTube Viewer for Hermes Desktop

> **An Agent with Video Watching Abilities**

---

## Purpose

Hermes Desktop is my desktop AI companion. It is incredibly capable at text-based tasks — writing code, answering questions, generating images via ComfyUI, browsing the web — but it has one glaring blind spot:

> **Hermes Desktop cannot see YouTube videos**.

When I ask Hermes Desktop to "watch X video and transcribe what is said in English" or "copy the diagram that is displayed at Y time", it hits a wall. The **[Hermes Agent SKILLS Hub](https://hermes-agent.nousresearch.com/docs/skills/)** does not include a video viewing option at this time. There are very limited abilities with regards to YouTube, which is the second most used search engine in the world.

As my primary research tool (with arXiv following a close second), my needs as the founder of a recent (April, 2026) tech startup are severely curtailed by an inability to automate CRON jobs that:

* Search for explainer videos that have been released in the last 24-hours for recently released research papers on arXiv,
* Arrange the content my Playlists into categories based on the transcripts of those videos, and
* Arrange, every 24-hours, the Playlists themselves so that the latest additions appear at the top of the list and older entries are arranged in descending order.

This utility solves these, and other, problems. It is a **Hermes Agent SKILL** for **Hermes Desktop**, a procedural memory that Hermes Agent loads and follows, that provides a lightweight backend script to handle the heavy lifting: searches using YouTube's API, extracting and creating transcripts, downloading videos, and authenticating via Chrome's cookie extraction.

The skill installs in minutes and works immediately in **anonymous mode** (general search results, no login required). For **personalized mode** (results tailored to my YouTube account), the authentication process involves a Chrome session and an email verification — I document this flow step-by-step below.

Early in development, I ask DuckDuckGo to find an open-source GitHub solution to my issues. In return, it points me to the **[YouTube for AI Agents](https://github.com/JCodesMore/youtube-for-ai-agents)** project, that applies the Apache 2.0 license. To remain consistent, _this_ project uses the same, permissive licence.

My process, in essence, uses the following steps:

* Clone the `YouTube for AI Agents` repo to my local PC,
* Create my own repo called [YouTube Viewer for Hermes Desktop](https://github.com/DigitalCoreNZ/YouTube_Viewer_for_Hermes_Desktop), and
* Have `Hermes Agent` reverse engineer `YouTube for AI Agents` and create a version that can be used by `Hermes Desktop`.

---

## Installation Instructions (for Hermes Agent)

### Prerequisites

| Requirement | Minimum |
|---|---|
| Node.js | v18.0.0+ |
| npm | v9+ |
| Google Chrome | Any recent version |
| Hermes Agent | Any recent version (CLI or Desktop) |
| Internet connection | Required for YouTube API access |

### Step 1 — Clone the Repository

* In the terminal, change to an installation directory, e.g. Downloads:

```bash
cd ~/Downloads
```

* Clone this Repo:

```bash
git clone https://github.com/DigitalCoreNZ/YouTube_Viewer_for_Hermes_Desktop.git
```

==NOTE: The result is the `~/Downloads/YouTube_Viewer_for_Hermes_Desktop` filepath. I can use any directory, as long as the paths for the following directions are adjusted accordingly. I can even clone the repo into an existing directory by using the `git clone https://github.com/DigitalCoreNZ/YouTube_Viewer_for_Hermes_Desktop.git .` command. The space, and especially the period, at the end of the command specifically tells git that the repo should clone into _this_ directory and _not_ into a sub-directory (as was _purposely_ done in the example above.)==

### Step 2 — Install Dependencies

The utility uses `youtubei.js` for YouTube API access, `youtube-transcript-plus` for transcripts, `ytdlp-nodejs` for downloading, and `ffmpeg-static` for clipping.

* I install the requirements:

```bash
cd ~/Downloads/YouTube_Viewer_for_Hermes_Desktop
npm install youtubei.js youtube-transcript-plus ytdlp-nodejs ffmpeg-static
```

==NOTE: This installs all of the required packages, and post-install scripts, that automatically download the yt-dlp and ffmpeg binaries.==

### Step 3 — Load the Skill into Hermes Agent

The skill file lives at `~/Downloads/YouTube_Viewer_for_Hermes_Desktop/skills/youtube-viewer/SKILL.md`. Hermes Agent loads a SKILL from its SKILLS directory.

* I run the following command to register the Hermes Agent SKILL:

```bash
hermes skills add \
  --path ~/Downloads/YouTube_Viewer_for_Hermes_Desktop/skills/youtube-viewer/SKILL.md \
  --name /yt
```

Or, if my Hermes Agent config supports it, I can (-s)ymlink (symbolic link) the SKILL into the SKILLS directory:

```bash
ln -s \
  ~/Downloads/YouTube_Viewer_for_Hermes_Desktop/skills/youtube-viewer \
  ~/.hermes/skills/youtube-viewer
```

==NOTE: This option has the added benefits of (1 of 2) making any changes to the `youtube-viewer` SKILL, within the repo, automatically reflect into Hermes Agent, and (2 of 2) having a single source of truth within the repo, rather than making a copy of the SKILL that is then saved to the `~/.hermes/skills` directory before applying the copy to Hermes Agent, is a superior solution. A symlink does away with constantly synchronising the repo version and the copied version of the `youtube-viewer` SKILL whenever a change is made.==

* I restart my Hermes Agent session (and, in my case, the DwafStar V4 harness). The skill is now active.

### Step 4 — Start the MCP Server (for Desktop integration)

Hermes Desktop can connect to the MCP (Model Context Protocol) server that exposes YouTube tools.

* I start the MCP server by running the following command:

```bash
node ~/Downloads/YouTube_Viewer_for_Hermes_Desktop/dist/index.js
```

* I can also run the MCP server as a background process:

```bash
node ~/Downloads/YouTube_Viewer_for_Hermes_Desktop/dist/index.js &
```

* I run Hermes Desktop:

```bash
hermes desktop
```

* Once running, I configure the MCP settings within Hermes Desktop to point to the MCP server.

### Step 5 — Verify the Installation

* Add the following prompt to Hermes Desktop:

> "Search YouTube for 3 videos about the MCP 2026-07-28 protocol"

==Hermes Desktop should respond with three (3) YouTube search results.==

* Add the following prompt to Hermes Desktop:

> "Get the transcript of video dQw4w9WgXcQ"

==Hermes Desktop should return the transcript of a known video.==

==I have a successful installation if both prompts provide the results I expect.==

---

## Authentication — Personalized YouTube Results

By default, the utility works in **anonymous mode** — searches return general results not tailored to your account. For personalized results (your watch history, subscriptions, and preferences influence search rankings), you need to authenticate.

The authentication process uses Chrome's Remote Debug Protocol (CDP) to extract YouTube session cookies. **This is the part that involves an email from YouTube.**

### How It Works

1. The cookie extraction script launches a **dedicated Chrome window** (separate profile, not your main browser) and opens YouTube.
2. You log into your Google/YouTube account in that window.
3. **YouTube sends an authentication verification email** to your Google account's email address.
4. You must check your email and confirm the login — this is Google's standard "suspicious login" / "new device" verification.
5. Once confirmed, the script extracts the session cookies from Chrome's debug port and saves them locally.
6. The utility then passes these cookies to the YouTube API on every request, returning personalized results.

### Step-by-Step Auth Flow

#### Step A — Run the Cookie Extraction Script

```bash
node /media/brian/Apps/01_lena_v0.5.0/GitHub/Downloads/YouTube_Viewer_for_Hermes_Desktop/scripts/extract-cookies.mjs
```

#### Step B — Chrome Opens

A dedicated Chrome window launches with a fresh profile at `~/.youtube/chrome-profile/`. Navigate to `https://www.youtube.com` and click **Sign In**.

#### Step C — Google Sends an Authentication Email

After you enter your credentials, Google sends an email like:

> **"Google sign-in from a new device — YouTube"**
>
> Hi [your name],
>
> We noticed a sign-in to your Google Account from a new device. Was this you?
>
> If yes, click **Yes, it was me** to confirm this sign-in.
>
> If you didn't sign in, click **No, it wasn't me** to secure your account.

#### Step D — Verify the Email

Open your email inbox (Gmail, or whatever provider your Google account uses). Find the verification email and click **"Yes, it was me"** or follow the confirmation link.

#### Step E — Return to the Terminal

Once you have confirmed the login in the Chrome window, the script detects that authentication cookies are now present and saves them. You should see output like:

```
✓ Saved 8/8 auth cookies to /home/you/.hermes/plugins/youtube-viewer/cookies.json
  Cookie string length: 1234 chars

✓ Authentication looks good! YouTube tools will use personalized results.
```

#### Step F — Restart Hermes Agent

The MCP server caches cookies at startup. You need to restart your Hermes Agent session for the personalized mode to take effect.

#### Step G — Verify Personalized Mode

Ask Hermes Agent:

> "Search YouTube for 'machine learning'"

Check the response — it should indicate `mode: "personalized"` in the results metadata. If it still says `"anonymous"`, restart the agent again.

### Switching Back to Anonymous

If you want to return to anonymous mode at any time:

```bash
node /media/brian/Apps/01_lena_v0.5.0/GitHub/Downloads/YouTube_Viewer_for_Hermes_Desktop/scripts/extract-cookies.mjs --reset
```

Then restart your Hermes Agent session.

---

## Analysis — How This Utility Works

I reverse-engineered the `youtube-for-ai-agents` repository by JCodesMore and rebuilt the architecture for Hermes Desktop. Here is my analysis of how the system works, broken into its component layers.

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Hermes Desktop                    │
│  (Electron app — frontend UI)                       │
│                                                     │
│   ┌────────────────────────────────────┐            │
│   │       Hermes Agent (CLI)           │            │
│   │  ┌─────────┐ ┌──────────────┐     │            │
│   │  │ Skills  │ │  MCP Client  │     │            │
│   │  │ Layer   │ │  (stdin/     │     │            │
│   │  │         │ │   stdout)    │     │            │
│   │  └────┬────┘ └──────┬───────┘     │            │
│   └───────┼─────────────┼──────────────┘            │
└───────────┼─────────────┼──────────────────────────┘
            │             │
            ▼             ▼
┌─────────────────────────────────────────────────────┐
│         YouTube Viewer MCP Server (Node.js)         │
│                                                     │
│  ┌─────────────────┐  ┌───────────────────────┐     │
│  │  youtubei.js     │  │  Cookie Auth Layer    │     │
│  │  (InnerTube API) │  │  (Chrome CDP →        │     │
│  │                  │  │   cookies.json →       │     │
│  │                  │  │   Innertube.create())  │     │
│  └────┬────────────┘  └───────────────────────┘     │
│       │                      │                      │
│       ▼                      ▼                      │
│  ┌─────────────────────────────────────┐            │
│  │  yt-dlp + ffmpeg (download/clip)    │            │
│  └─────────────────────────────────────┘            │
└─────────────────────────────────────────────────────┘
```

### Layer 1 — MCP Server (Entry Point)

The server at `src/index.ts` creates an MCP (Model Context Protocol) server using the `@modelcontextprotocol/sdk`. It registers **9 tools** as JSON-RPC methods over stdio transport:

| Tool | Description |
|---|---|
| `youtube_search` | Search videos, channels, or playlists with filters |
| `youtube_get_transcript` | Get timestamped transcript of a video |
| `youtube_get_video_info` | Get detailed metadata (chapters, tags, likes) |
| `youtube_get_channel_videos` | List a channel's videos sorted by newest/popular/oldest |
| `youtube_get_channel_info` | Get channel metadata (subscribers, description, country) |
| `youtube_get_playlist` | Get playlist contents with video list |
| `youtube_download` | Download video/audio to a local file via yt-dlp |
| `youtube_clip` | Extract clips by timestamp, auto-generate highlight reel |
| `youtube_highlight_reel` | Combine existing clips into a single reel |

Each tool handler receives Zod-validated arguments, calls the appropriate library function, and returns JSON text content in the MCP response format.

### Layer 2 — InnerTube API Client (`src/lib/innertube.ts`)

This is the core YouTube API layer. It uses `youtubei.js` — a reverse-engineered JavaScript library that speaks directly to YouTube's internal API (InnerTube), bypassing the public REST API and its rate limits.

The singleton `getInstance()` function:

1. Loads cookies from `cookies.json` via `loadCookies()`
2. Sets the mode to `'personalized'` if cookies exist, `'anonymous'` otherwise
3. Creates an `Innertube` instance with the cookie string (if present), language, and locale settings
4. Caches the instance — subsequent calls reuse it

The library exposes five main operations:

- **`search()`** — Calls `yt.search(query, options)` with filters for upload date, duration, and sort. Maps the response to a normalized `SearchResult[]` with three types (video, channel, playlist).
- **`getVideoInfo()`** — Calls `yt.getInfo(videoId)`. Extracts chapters from `player_overlays.decorated_player_bar.player_bar.markers_map`, plus all basic info fields.
- **`getChannelInfo()`** — Resolves the channel identifier (handle, URL, or ID), calls `yt.getChannel(channelId)`, then optionally fetches the about tab for extended metadata.
- **`getChannelVideos()`** — Resolves channel, opens the videos tab, applies sort, and paginates through continuations up to the requested limit.
- **`getPlaylist()`** — Opens a playlist and paginates through its items.

### Layer 3 — Cookie Authentication (`src/lib/cookies.ts`, `scripts/extract-cookies.mjs`)

The authentication flow is the cleverest part of the architecture:

**The `extract-cookies.mjs` script** uses `puppeteer-core` to connect to Chrome's debugging protocol (CDP) on port 9222. It:

1. Checks if a Chrome debug port is already open on `127.0.0.1:9222`
2. If not, **launches a dedicated Chrome instance** with:
   - `--remote-debugging-port=9222`
   - `--user-data-dir=~/.youtube/chrome-profile/` (a persistent, isolated profile)
   - `--no-first-run` and `--no-default-browser-check`
3. Connects via Puppeteer, navigates to YouTube, and extracts cookies via `Network.getCookies`
4. Validates that 8 required auth cookies are present (`SID`, `HSID`, `SSID`, `APISID`, `SAPISID`, `__Secure-1PSID`, `__Secure-3PSID`, `LOGIN_INFO`)
5. Serializes cookies into a `cookie_string` and writes `cookies.json`

**The `cookies.ts` library** reads this file at runtime and passes the cookie string to `Innertube.create()`. The YouTube API then authenticates every request.

The key design insight: **the dedicated Chrome profile persists** at `~/.youtube/chrome-profile/`. The user only logs in once — subsequent extractions reuse the existing session. The main Chrome browser is never touched or modified.

### Layer 4 — Download and Clip Engine (`src/lib/download.ts`)

For destructive operations (download, clip, highlight reel), the library uses **yt-dlp** (via `ytdlp-nodejs` wrapper) and **ffmpeg** (via `ffmpeg-static`):

- **Download**: Calls `ytdlp.download(url)` with filters for audio-only, video-only, or merged video+audio. Supports quality selection from 144p to 2160p. Has a 30-minute duration guard that returns a warning instead of proceeding.
- **Clip**: Downloads to a temp file, then uses ffmpeg to cut segments by timestamp. Supports fast keyframe-aligned cuts (default) and frame-accurate re-encoding (optional). Automatically generates a highlight reel from multiple clips using ffmpeg's concat filter.
- **Highlight Reel**: Combines existing clip files across multiple videos using ffmpeg concat with re-encoding (normalizes codecs, frame rates across sources).

### Layer 5 — Configuration (`src/lib/user-config.ts`, `scripts/config.mjs`)

A user-configurable settings system that persists overrides in `config.json`. The MCP server merges these overrides onto compiled-in defaults at startup. Settings include:

- Search defaults (limit, type, upload date, duration, sort)
- Transcript settings (language, max segments, cleanup)
- Channel settings (video limit, sort order)
- Locale settings (language, location)

---

## Results — What Works (v0.5.1)

### Working Features

| Feature | Status | Notes |
|---|---|---|
| YouTube search (video, channel, playlist) | ✅ Works | Returns results with metadata; filters work |
| Transcript fetching | ✅ Works | Supports language selection, time ranges, segment limits |
| Video metadata (chapters, likes, tags) | ✅ Works | Three detail levels (brief, standard, full) |
| Channel browsing | ✅ Works | Supports @handle, URL, or channel ID |
| Channel info (subscribers, country) | ✅ Works | Falls back gracefully if about tab not available |
| Playlist enumeration | ✅ Works | Paginates through large playlists |
| Video download (720p default) | ✅ Works | yt-dlp handles format selection and muxing |
| Clip extraction with highlight reels | ✅ Works | ffmpeg keyframe and frame-accurate modes |
| Cookie extraction (Chrome CDP) | ✅ Works | Dedicated profile, persistent session |
| Anonymous mode (no login needed) | ✅ Works | Out-of-box experience |
| Personalized mode | ✅ Works | After cookie extraction + email verification |
| Configuration system | ✅ Works | User overrides merged at startup |

### Known Failures — v0.5.1

This first version has several limitations that I identified through reverse engineering and analysis of the original architecture:

#### Failure 1 — No Actual Video Viewing (No Visual Playback)

The utility is named "YouTube Viewer" but it **cannot actually show video frames**. It fetches transcripts (text), metadata, and downloads (files), but there is no frame-by-frame visual analysis capability. Hermes Agent cannot "watch" a video the way a human watches one — it reads the transcript and metadata. This is the core gap that prompted this utility, but v0.5.1 only bridges it with text.

**Impact**: The agent can tell you what a video says but cannot describe visual elements, identify objects on screen, or assess visual quality.

#### Failure 2 — Download Quality Limitations

The download tool defaults to 720p. Higher resolutions (1080p, 1440p, 2160p) are available but require explicit selection. Audio-only downloads default to m4a format even when `mp4` is requested (format fallback is `m4a` for audio downloads). There is no adaptive quality selection based on the video's actual available resolutions.

**Impact**: Users who want 4K downloads or specific audio formats must manually specify parameters.

#### Failure 3 — Cookie Extraction Reliability

The Chrome CDP extraction depends on:
- Chrome being installed at a standard path
- Port 9222 being free (conflicts with other Chrome debug sessions)
- Puppeteer-core connecting successfully on the first attempt
- Google not challenging the login with 2FA or advanced verification

**Impact**: The extraction fails if Chrome is installed at a custom path, port 9222 is occupied, or Google requires step-up authentication (2FA, security key, etc.). The email verification step adds user friction.

#### Failure 4 — No Rate-Limit Resilience

YouTube's InnerTube API has implicit rate limits. The `youtubei.js` library does not implement retry logic or backoff. Multiple rapid requests (e.g., fetching transcripts for 10 videos in quick succession) can trigger "Too many requests" errors that require a waiting period.

**Impact**: Batch research workflows (watch 5 videos and compare) may fail midway with a rate-limit error, requiring manual retry after a cooldown period.

#### Failure 5 — Transcript Not Available for All Videos

Many YouTube videos have transcripts disabled by the uploader. The tool returns an error for these videos. There is no fallback mechanism (e.g., speech-to-text on the downloaded audio) to generate transcripts for videos that lack them.

**Impact**: A significant portion of YouTube content (videos without captions/transcripts enabled) is opaque to the agent.

#### Failure 6 — No Playlist-Level Operations

The playlist tool lists videos in a playlist but does not support:
- Adding/removing videos from playlists
- Creating new playlists
- Getting transcripts for all videos in a playlist in one operation

**Impact**: Research workflows that involve "watch every video in this playlist" require manual iteration over the playlist items.

#### Failure 7 — No Search Result Caching

Every search query hits YouTube's API fresh. There is no local cache of search results or video metadata. Repeated searches for the same query waste API quota and network bandwidth.

**Impact**: If the user asks "show me what you found again", the agent must re-execute the search rather than retrieving cached results.

#### Failure 8 — Highlight Reel Quality

The highlight reel concatenation uses `libx264` with `crf 18` (near-lossless) and `aac 128k`. While this produces good quality, it does not support:
- Crossfade transitions between clips
- Audio ducking (lowering music when speech is present)
- Custom aspect ratios or resolutions
- Text overlays or title cards

**Impact**: Generated reels are functional but not production-ready for social media or polished presentations.

---

## Improvements for v0.5.2

Based on the failures identified above, I recommend these improvements for the next version:

| Priority | Improvement | Addresses Failure |
|---|---|---|
| 🔴 Critical | **Add frame-level visual analysis** — integrate with a vision-capable model (Hermes Desktop already has vision) to actually *see* video frames. Extract keyframes from downloaded videos and feed them to the vision model for visual description. | #1 |
| 🔴 Critical | **Implement transcript fallback** — when a video lacks captions, download the audio track and use a local STT model (Whisper) to generate the transcript. | #5 |
| 🟡 High | **Add adaptive quality selection** — probe available formats before downloading and pick the best match for the requested quality. Fix the audio format fallback. | #2 |
| 🟡 High | **Implement retry with exponential backoff** — wrap InnerTube API calls in retry logic that waits and retries on rate-limit errors. | #4 |
| 🟡 High | **Add search result caching** — cache recent searches and video metadata in a local SQLite store with configurable TTL. | #7 |
| 🟡 Medium | **Improve cookie extraction robustness** — add support for custom Chrome paths, fall back to manual cookie file input, handle port conflicts by trying alternative ports. | #3 |
| 🟡 Medium | **Add playlist batch operations** — implement a "watch playlist" workflow that fetches transcripts for every video in a playlist in one call. | #6 |
| 🟢 Low | **Enhance highlight reel capabilities** — add crossfade transitions, audio ducking, resolution normalization, and optional text overlays via ffmpeg filters. | #8 |
| 🟢 Low | **Add YouTube comments extraction** — fetch top-level comments and replies for community sentiment analysis alongside transcript analysis. | Enhancement |
| 🟢 Low | **Support YouTube Music** — extend the InnerTube integration to cover YouTube Music for music search and audio streaming. | Enhancement |

---

## Conclusion

v0.5.1 of YouTube Viewer for Hermes Desktop successfully bridges the largest capability gap in Hermes Agent today: the inability to search, browse, and extract content from YouTube. It provides **9 tools** covering search, transcript analysis, metadata extraction, channel exploration, download, and clip creation — all accessible from any Hermes Agent session.

The architecture is sound. The MCP server pattern means the YouTube tools are available to any MCP-compatible client, not just Hermes Desktop. The cookie extraction design is privacy-conscious — cookies live only on the local machine and are never transmitted. The dedicated Chrome profile means authentication is a one-time setup.

However, the utility is fundamentally a **text-and-download** tool, not a true **video viewer**. It reads transcripts and metadata, downloads files, and extracts clips — but it cannot actually *see* video frames. This is the central tension: the name says "Viewer" but the capability is "Researcher + Downloader."

The next version (v0.5.2) should prioritize adding visual analysis by integrating Hermes Desktop's vision capabilities with frame extraction from downloaded videos, and adding STT-based transcript fallback for videos without captions. These two changes would transform the utility from a text-only research tool into a genuine video understanding system.

---

## Document Details

**Document Title:** YouTube Viewer for Hermes Desktop

**Document Subtitle:** An Agent with Video Watching Abilities

**Document Version:** v0.5.1

**Document Author(s):** Hermes Agent, Brian King

**Document Attributions:** YouTube for AI Agents by JCodesMore (Apache 2.0), Hermes Agent SKILLS Hub (Nous Research), InnerTube API (youtubei.js), youtube-transcript-plus, ytdlp-nodejs / yt-dlp, ffmpeg-static / ffmpeg, Puppeteer-core / Chrome DevTools Protocol, @modelcontextprotocol/sdk, arXiv

**Document Creation Date:** Monday, 10 August 2026

**Last Update:** Monday, 10 August 2026

**License:** Apache 2.0

© Copyright 2020-2026 DigitalCoreNZ. All rights reserved.
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
