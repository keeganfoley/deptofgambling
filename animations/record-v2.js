const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function record() {
  console.log('🎬 Starting recording...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  const htmlPath = path.join(__dirname, 'scene2-the-numbers-v4.html');
  await page.goto(`file://${htmlPath}`);

  // Hide controls
  await page.evaluate(() => {
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.timer').style.display = 'none';
    document.querySelector('.container').style.transform = 'scale(1)';
    document.querySelector('body').style.overflow = 'hidden';
  });

  // Start screencast
  const client = await page.createCDPSession();

  const frames = [];

  client.on('Page.screencastFrame', async (event) => {
    frames.push(Buffer.from(event.data, 'base64'));
    await client.send('Page.screencastFrameAck', { sessionId: event.sessionId });
  });

  await client.send('Page.startScreencast', {
    format: 'png',
    quality: 100,
    maxWidth: 1080,
    maxHeight: 1920,
    everyNthFrame: 1
  });

  // Start animation
  await page.evaluate(() => startAnimation());

  console.log('📹 Recording for 16 seconds...');
  await new Promise(r => setTimeout(r, 16000));

  await client.send('Page.stopScreencast');
  await browser.close();

  console.log(`📸 Captured ${frames.length} frames`);

  // Save frames and convert
  const framesDir = path.join(__dirname, 'temp_frames');
  if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir);

  frames.forEach((frame, i) => {
    fs.writeFileSync(path.join(framesDir, `frame_${String(i).padStart(5, '0')}.png`), frame);
  });

  const ffmpegPath = path.join(__dirname, 'ffmpeg');
  const outputPath = path.join(__dirname, 'scene2-the-numbers.mp4');

  console.log('🎞️ Converting to MP4...');

  try {
    execSync(`"${ffmpegPath}" -y -framerate 30 -i "${framesDir}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 "${outputPath}"`, { stdio: 'inherit' });
    console.log(`✅ Done! Saved to: ${outputPath}`);
  } catch (err) {
    console.error('FFmpeg error:', err.message);
  }

  // Cleanup
  fs.readdirSync(framesDir).forEach(f => fs.unlinkSync(path.join(framesDir, f)));
  fs.rmdirSync(framesDir);
}

record().catch(console.error);
