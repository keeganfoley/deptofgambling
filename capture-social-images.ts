import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

async function captureImages() {
  const date = '2025-12-23';
  const socialDir = path.join(process.cwd(), 'social-images', date);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Capture 1080x1350 images (daily-report, picks-results, portfolio-chart)
  const images1350 = [
    { html: 'merry-christmas.html', png: 'merry-christmas.png' },
  ];

  for (const img of images1350) {
    const htmlPath = path.join(socialDir, img.html);
    if (fs.existsSync(htmlPath)) {
      await page.setViewport({ width: 1080, height: 1350 });
      await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      const outputPath = path.join(socialDir, img.png);
      await page.screenshot({
        path: outputPath,
        type: 'png',
        clip: { x: 0, y: 0, width: 1080, height: 1350 }
      });
      console.log(`✓ Captured: ${img.png}`);
    }
  }

  // Capture 1080x1920 cumulative candle (disabled for now)
  // const candleHtml = path.join(socialDir, 'cumulative-candle.html');
  // if (fs.existsSync(candleHtml)) {
  //   await page.setViewport({ width: 1080, height: 1920 });
  //   await page.goto(`file://${candleHtml}`, { waitUntil: 'networkidle0' });
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   const candleOutput = path.join(process.cwd(), 'daily-images', 'cumulative-candles', 'day50-2025-12-23.png');
  //   await page.screenshot({ path: candleOutput, type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  //   console.log(`✓ Captured: day50-2025-12-23.png`);
  // }

  await browser.close();
  console.log('\nAll images captured!');
}

captureImages().catch(console.error);
