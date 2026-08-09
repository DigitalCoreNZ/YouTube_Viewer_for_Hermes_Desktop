# YouTube Authentication Flow — v0.5.1

## How Cookie Extraction Works

The YouTube Viewer uses Chrome's Remote Debug Protocol (CDP) to extract session cookies from a dedicated Chrome browser profile. This enables personalized YouTube search results without API keys or OAuth tokens.

### Step-by-Step Technical Flow

1. **Port Check**: The script checks if Chrome's debug port (127.0.0.1:9222) is already open.
2. **Chrome Launch**: If no port is available, a dedicated Chrome instance is launched with:
   - `--remote-debugging-port=9222` — enables CDP
   - `--user-data-dir=~/.youtube/chrome-profile/` — isolated, persistent profile
   - `--no-first-run`, `--no-default-browser-check` — suppresses Chrome UI distractions
3. **Puppeteer Connect**: The script connects to Chrome via `puppeteer-core` using the CDP endpoint.
4. **Navigate to YouTube**: The script opens `https://www.youtube.com` in the browser.
5. **Cookie Extraction**: Via `Network.getCookies` CDP method, the script extracts cookies from YouTube, Google Accounts, and google.com domains.
6. **Validation**: The script checks for 8 required auth cookies (SID, HSID, SSID, APISID, SAPISID, __Secure-1PSID, __Secure-3PSID, LOGIN_INFO).
7. **Save**: Cookies are serialized to a cookie string and saved as JSON to `cookies.json`.

### Cookie Storage

Cookies are stored at:
- `$HERMES_PLUGIN_DATA/cookies.json` — if `HERMES_PLUGIN_DATA` is set
- `.cookies.json` — in the current working directory (fallback)

The file contains:
```json
{
  "cookie_string": "SID=...; HSID=...; SSID=...; APISID=...; SAPISID=...; __Secure-1PSID=...; __Secure-3PSID=...; LOGIN_INFO=..."
}
```

### Cookie Usage at Runtime

The MCP server's `getInstance()` function in `src/lib/innertube.ts`:
1. Reads `cookies.json` at startup
2. Sets mode to `'personalized'` if cookies exist, `'anonymous'` otherwise
3. Passes the cookie string to `Innertube.create()` as the `cookie` option
4. Every InnerTube API call (search, getInfo, getChannel, etc.) includes these cookies

### Privacy Properties

- Cookies never leave the local machine
- The dedicated Chrome profile at `~/.youtube/chrome-profile/` is separate from the user's main Chrome profile
- Cookies are never transmitted to any third party
- Running `--reset` deletes the cookie file, switching to anonymous mode
