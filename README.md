# img2webp

A React static web app that converts images to WebP format entirely in your browser — no server, no uploads, fully private.

## Features

- **Drag & drop** or click to upload images
- **Batch conversion** — convert multiple images at once
- **Rich options:**
  - Quality slider (1–100%)
  - Lossless mode
  - Resize: target width, height, maintain aspect ratio
- **Preview toggle** — switch between original and converted image
- **File size comparison** — see exactly how much space you saved
- **Download individual** files or **Download All** at once
- Supports **JPG, PNG, GIF, BMP, SVG, TIFF, AVIF, WebP, ICO**
- All processing happens **locally in your browser** — images never leave your device

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The output is in the `dist/` directory — a fully static site.

## Deploy to Cloudflare Pages

1. Push this repository to GitHub
2. Log in to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Create a new project → Connect to your GitHub repo
4. Set the build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Deploy!

Or use the Cloudflare CLI:

```bash
npx wrangler pages deploy dist
```
