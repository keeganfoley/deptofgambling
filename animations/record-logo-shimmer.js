const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const FRAME_RATE = 30;
const DURATION = 4; // 4 seconds for one full loop
const TOTAL_FRAMES = FRAME_RATE * DURATION;
const OUTPUT_DIR = path.join(__dirname, 'logo-frames');
const OUTPUT_VIDEO = path.join(__dirname, '..', 'public', 'logo-animation-v2.mp4');

async function recordAnimation() {
  // Create frames directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080 });

  const htmlPath = path.join(__dirname, 'logo-shimmer.html');
  console.log(`Loading: file://${htmlPath}`);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Wait for logo to load
  await page.waitForSelector('.logo');
  await new Promise(r => setTimeout(r, 500));

  console.log(`Recording ${TOTAL_FRAMES} frames at ${FRAME_RATE}fps...`);

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const frameNum = String(frame).padStart(5, '0');
    const framePath = path.join(OUTPUT_DIR, `frame_${frameNum}.png`);

    await page.screenshot({
      path: framePath,
      clip: { x: 0, y: 0, width: 1080, height: 1080 }
    });

    // Wait for next frame timing
    await new Promise(r => setTimeout(r, 1000 / FRAME_RATE));

    if (frame % 30 === 0) {
      console.log(`Frame ${frame}/${TOTAL_FRAMES}`);
    }
  }

  await browser.close();
  console.log('Browser closed. Creating video...');

  // Use ffmpeg to create video
  const ffmpegPath = path.join(__dirname, 'ffmpeg');
  const ffmpegCmd = `"${ffmpegPath}" -y -framerate ${FRAME_RATE} -i "${OUTPUT_DIR}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 "${OUTPUT_VIDEO}"`;

  console.log('Running ffmpeg...');
  execSync(ffmpegCmd, { stdio: 'inherit' });

  console.log(`Video saved to: ${OUTPUT_VIDEO}`);

  // Cleanup frames
  fs.rmSync(OUTPUT_DIR, { recursive: true });
  console.log('Frames cleaned up.');
}

recordAnimation().catch(console.error);
