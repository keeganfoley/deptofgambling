const puppeteer = require('puppeteer');
const path = require('path');

async function generateScreenshots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set viewport to Instagram size
  await page.setViewport({ width: 1080, height: 1350 });

  const dateFolder = '2025-12-14';
  const baseDir = path.join(__dirname, 'social-images', dateFolder);

  // Generate daily report screenshot
  await page.goto('file://' + path.join(baseDir, 'daily-report.html'));
  await page.screenshot({ path: path.join(baseDir, '1-daily-report.png'), type: 'png' });
  console.log('Generated 1-daily-report.png');

  // Generate picks results screenshot
  await page.goto('file://' + path.join(baseDir, 'picks-results.html'));
  await page.screenshot({ path: path.join(baseDir, '2-picks-results.png'), type: 'png' });
  console.log('Generated 2-picks-results.png');

  // Generate portfolio chart screenshot
  await page.goto('file://' + path.join(baseDir, 'portfolio-chart.html'));
  await page.screenshot({ path: path.join(baseDir, '3-portfolio-chart.png'), type: 'png' });
  console.log('Generated 3-portfolio-chart.png');

  await browser.close();
  console.log('Done! Files saved to ' + baseDir);
}

generateScreenshots().catch(console.error);
