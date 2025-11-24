import puppeteer from 'puppeteer';
import path from 'path';

async function captureChart() {
  const date = process.argv[2] || '2025-11-21';
  const dayNum = process.argv[3] || '19';

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1080 });

  const url = `http://localhost:3000/chart-export?date=${date}`;
  console.log(`Navigating to: ${url}`);

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for chart to render
  await new Promise(resolve => setTimeout(resolve, 2000));

  const outputPath = path.join(process.cwd(), 'story-images', `day-${dayNum}-${date}.png`);

  await page.screenshot({
    path: outputPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1080, height: 1080 }
  });

  console.log(`Chart saved to: ${outputPath}`);

  await browser.close();
}

captureChart().catch(console.error);
