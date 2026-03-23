const { chromium } = require("playwright");
const path = require("path");

const HTML_PATH = path.resolve(__dirname, "../_posts/flex-visual-demo.html");
const OUTPUT_DIR = path.resolve(__dirname, "../assets/images/flex");

const SECTIONS = [
  "flex-direction",
  "justify-content",
  "justify-content-col",
  "align-items-col",
  "align-items",
  "item-size",
  "wrap-gap",
  "align-self",
  "patterns",
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1000, height: 800 },
    deviceScaleFactor: 2, // retina 품질
  });

  await page.goto(`file://${HTML_PATH}`);
  await page.waitForLoadState("networkidle");

  const sections = await page.$$(".section");

  for (let i = 0; i < sections.length; i++) {
    const name = SECTIONS[i] || `section-${i}`;
    const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
    await sections[i].screenshot({ path: outputPath });
    console.log(`✓ ${name}.png`);
  }

  await browser.close();
  console.log(`\nDone! ${sections.length} images saved to assets/images/flex/`);
})();
