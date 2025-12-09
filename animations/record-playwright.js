const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function record() {
  console.log('🎬 Starting native video recording...');

  const browser = await chromium.launch();

  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: {
      dir: path.join(__dirname, 'temp_video'),
      size: { width: 1080, height: 1920 }
    }
  });

  const page = await context.newPage();

  const htmlPath = path.join(__dirname, 'scene2-the-numbers-v4.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  // Hide controls and set full size
  await page.evaluate(() => {
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.timer').style.display = 'none';
    document.querySelector('.container').style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
  });

  await page.waitForTimeout(500);

  console.log('📹 Recording animation...');

  // Start animation
  await page.evaluate(() => startAnimation());

  // Wait for animation to complete
  await page.waitForTimeout(16000);

  console.log('⏹️ Stopping recording...');

  await page.close();
  await context.close();
  await browser.close();

  // Get the video file
  const tempDir = path.join(__dirname, 'temp_video');
  const videoFiles = fs.readdirSync(tempDir).filter(f => f.endsWith('.webm'));

  if (videoFiles.length > 0) {
    const webmPath = path.join(tempDir, videoFiles[0]);
    const outputPath = path.join(__dirname, 'scene2-the-numbers.mp4');
    const ffmpegPath = path.join(__dirname, 'ffmpeg');

    console.log('🎞️ Converting to MP4...');

    try {
      execSync(`"${ffmpegPath}" -y -i "${webmPath}" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "${outputPath}"`, { stdio: 'pipe' });
      console.log(`✅ Done! Saved to: ${outputPath}`);
    } catch (err) {
      console.error('FFmpeg error:', err.message);
    }

    // Cleanup
    fs.unlinkSync(webmPath);
    fs.rmdirSync(tempDir);
  } else {
    console.error('No video file found');
  }
}

record().catch(console.error);
