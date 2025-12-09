const puppeteer = require('puppeteer');
const path = require('path');

async function generateScreenshots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to Instagram size
  await page.setViewport({ width: 1080, height: 1350 });
  
  // Generate picks screenshot
  await page.goto('file://' + path.join(__dirname, 'public/picks-dec8.html'));
  await page.screenshot({ path: 'public/picks-dec8.png', type: 'png' });
  console.log('Generated picks-dec8.png');

  // Generate exposure screenshot
  await page.goto('file://' + path.join(__dirname, 'public/exposure-dec8.html'));
  await page.screenshot({ path: 'public/exposure-dec8.png', type: 'png' });
  console.log('Generated exposure-dec8.png');
  
  await browser.close();
  console.log('Done!');
}

generateScreenshots().catch(console.error);
