const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function record() {
  console.log('🎬 Starting smooth recording...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  const htmlPath = path.join(__dirname, 'scene2-the-numbers-v4.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Hide controls and set full size
  await page.evaluate(() => {
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.timer').style.display = 'none';
    document.querySelector('.container').style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
  });

  // Create frames directory
  const framesDir = path.join(__dirname, 'temp_frames');
  if (fs.existsSync(framesDir)) {
    fs.readdirSync(framesDir).forEach(f => fs.unlinkSync(path.join(framesDir, f)));
  } else {
    fs.mkdirSync(framesDir);
  }

  const fps = 60;
  const duration = 16;
  const totalFrames = fps * duration;
  const frameInterval = 1000 / fps;

  console.log(`📹 Capturing ${totalFrames} frames at ${fps}fps...`);

  // Start animation
  await page.evaluate(() => startAnimation());

  const startTime = Date.now();

  for (let i = 0; i < totalFrames; i++) {
    const frameStart = Date.now();

    await page.screenshot({
      path: path.join(framesDir, `frame_${String(i).padStart(5, '0')}.png`),
      clip: { x: 0, y: 0, width: 1080, height: 1920 }
    });

    // Calculate how long to wait to maintain consistent fps
    const elapsed = Date.now() - frameStart;
    const waitTime = Math.max(0, frameInterval - elapsed);

    if (waitTime > 0) {
      await new Promise(r => setTimeout(r, waitTime));
    }

    if (i % 60 === 0) {
      const progress = Math.round((i / totalFrames) * 100);
      console.log(`   ${progress}% (frame ${i}/${totalFrames})`);
    }
  }

  console.log('   100% - All frames captured!');
  await browser.close();

  // Convert to MP4
  const ffmpegPath = path.join(__dirname, 'ffmpeg');
  const outputPath = path.join(__dirname, 'scene2-the-numbers.mp4');

  console.log('🎞️ Converting to smooth MP4...');

  try {
    execSync(`"${ffmpegPath}" -y -framerate ${fps} -i "${framesDir}/frame_%05d.png" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -r ${fps} "${outputPath}"`, { stdio: 'pipe' });
    console.log(`✅ Done! Saved to: ${outputPath}`);
  } catch (err) {
    console.error('FFmpeg error:', err.message);
  }

  // Cleanup frames
  console.log('🧹 Cleaning up...');
  fs.readdirSync(framesDir).forEach(f => fs.unlinkSync(path.join(framesDir, f)));
  fs.rmdirSync(framesDir);

  console.log('🎉 All done!');
}

record().catch(console.error);
