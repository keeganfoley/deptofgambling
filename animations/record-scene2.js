const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function recordAnimation() {
  console.log('Starting recording...');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1080,1920']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  const htmlPath = path.join(__dirname, 'scene2-the-numbers-v4.html');
  await page.goto(`file://${htmlPath}`);

  // Create frames directory
  const framesDir = path.join(__dirname, 'frames');
  if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir);
  } else {
    // Clear existing frames
    fs.readdirSync(framesDir).forEach(f => fs.unlinkSync(path.join(framesDir, f)));
  }

  // Set to full size
  await page.evaluate(() => {
    document.querySelector('.container').style.transform = 'scale(1)';
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.timer').style.display = 'none';
  });

  // Wait a moment
  await new Promise(r => setTimeout(r, 500));

  // Start animation
  await page.evaluate(() => {
    startAnimation();
  });

  // Capture frames at 30fps for 16 seconds
  const fps = 30;
  const duration = 16;
  const totalFrames = fps * duration;

  console.log(`Capturing ${totalFrames} frames at ${fps}fps...`);

  for (let i = 0; i < totalFrames; i++) {
    const frameNum = String(i).padStart(5, '0');
    await page.screenshot({
      path: path.join(framesDir, `frame_${frameNum}.png`),
      clip: { x: 0, y: 0, width: 1080, height: 1920 }
    });

    if (i % 30 === 0) {
      console.log(`Frame ${i}/${totalFrames}`);
    }

    await new Promise(r => setTimeout(r, 1000 / fps));
  }

  console.log('Frames captured. Converting to MP4...');

  await browser.close();

  // Convert to MP4 using ffmpeg
  const outputPath = path.join(__dirname, 'scene2-the-numbers.mp4');
  const ffmpegPath = path.join(__dirname, 'ffmpeg');
  const ffmpegCmd = `"${ffmpegPath}" -y -framerate ${fps} -i "${framesDir}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 "${outputPath}"`;

  exec(ffmpegCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('FFmpeg error:', error);
      console.log('Make sure ffmpeg is installed: brew install ffmpeg');
      return;
    }
    console.log(`Done! Video saved to: ${outputPath}`);

    // Clean up frames
    fs.readdirSync(framesDir).forEach(f => fs.unlinkSync(path.join(framesDir, f)));
    fs.rmdirSync(framesDir);
  });
}

recordAnimation().catch(console.error);
