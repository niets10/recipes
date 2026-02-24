/**
 * Generates fitness-192.png and fitness-512.png from the Activity icon
 * for PWA / home screen. Uses theme background #1a1a1c.
 * Run: node scripts/generate-fitness-icons.mjs
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'icons');
const BG = '#1a1a1c';
const SIZE = 512;
// Maskable safe zone ~80%: icon scaled to fit in center
const PAD = SIZE * 0.1;
const ICON_SIZE = SIZE - PAD * 2;
const SCALE = ICON_SIZE / 24;
const OFFSET = SIZE / 2 - 12 * SCALE;

const activitySvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="${BG}"/>
  <g transform="translate(${OFFSET},${OFFSET}) scale(${SCALE})">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

async function main() {
    mkdirSync(OUT_DIR, { recursive: true });
    const buf = Buffer.from(activitySvg);
    await sharp(buf)
        .png()
        .toFile(join(OUT_DIR, 'fitness-512.png'));
    await sharp(buf)
        .resize(192, 192)
        .png()
        .toFile(join(OUT_DIR, 'fitness-192.png'));
    console.log('Generated public/icons/fitness-192.png and public/icons/fitness-512.png');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
