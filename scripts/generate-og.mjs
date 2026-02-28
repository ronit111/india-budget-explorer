import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VARIANTS = [
  {
    filename: 'og-logo.png',
    title: 'Indian Data Project',
    tagline: 'Open government data, made accessible and visual',
    accentFrom: '#FF6B35',
    accentTo: '#FFC857',
    cornerTL: 'rgba(255,107,53,0.2)',
    cornerBR: 'rgba(74,234,220,0.2)',
    glowColor: 'rgba(255,107,53,0.06)',
  },
  {
    filename: 'og-budget.png',
    title: 'Union Budget 2025-26',
    tagline: 'Where your tax money goes — visualized from primary sources',
    accentFrom: '#FF6B35',
    accentTo: '#FFC857',
    cornerTL: 'rgba(255,107,53,0.25)',
    cornerBR: 'rgba(255,200,87,0.2)',
    glowColor: 'rgba(255,107,53,0.08)',
  },
  {
    filename: 'og-economy.png',
    title: 'Economic Survey 2025-26',
    tagline: "India's economic report card — GDP, inflation, trade, and more",
    accentFrom: '#4AEADC',
    accentTo: '#FFC857',
    cornerTL: 'rgba(74,234,220,0.25)',
    cornerBR: 'rgba(255,200,87,0.2)',
    glowColor: 'rgba(74,234,220,0.08)',
  },
  {
    filename: 'og-rbi.png',
    title: 'RBI Data',
    tagline: 'Monetary policy, repo rate decisions, forex reserves — from primary sources',
    accentFrom: '#FFC857',
    accentTo: '#FF6B35',
    cornerTL: 'rgba(255,200,87,0.25)',
    cornerBR: 'rgba(255,107,53,0.2)',
    glowColor: 'rgba(255,200,87,0.08)',
  },
  {
    filename: 'og-states.png',
    title: 'State Finances',
    tagline: 'GSDP, revenue, fiscal health across 28 states and 8 union territories',
    accentFrom: '#4ADE80',
    accentTo: '#86EFAC',
    cornerTL: 'rgba(74,222,128,0.25)',
    cornerBR: 'rgba(134,239,172,0.2)',
    glowColor: 'rgba(74,222,128,0.08)',
  },
];

function buildHTML(variant) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=JetBrains+Mono:wght@500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; background: #06080f;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; position: relative;
  }
  .glow {
    position: absolute; width: 500px; height: 500px;
    left: 50%; top: 45%; transform: translate(-50%, -50%);
    background: radial-gradient(circle, ${variant.glowColor} 0%, transparent 70%);
    border-radius: 50%;
  }
  .card {
    position: relative; display: flex; flex-direction: column;
    align-items: center; gap: 32px;
  }
  .logo-row { display: flex; align-items: center; gap: 28px; }
  .title {
    font-family: 'Inter', system-ui, sans-serif; font-weight: 800;
    font-size: 52px; letter-spacing: -0.03em;
    background: linear-gradient(135deg, ${variant.accentFrom}, ${variant.accentTo});
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .tagline {
    font-family: 'Inter', system-ui, sans-serif; font-weight: 400;
    font-size: 22px; color: #b0b8c4; letter-spacing: -0.01em;
    max-width: 800px; text-align: center;
  }
  .url {
    font-family: 'JetBrains Mono', monospace; font-weight: 500;
    font-size: 14px; color: #5c6a7e; letter-spacing: 0.02em;
  }
  .corner { position: absolute; width: 48px; height: 48px; }
  .corner-tl { top: 48px; left: 48px; border-top: 1px solid ${variant.cornerTL}; border-left: 1px solid ${variant.cornerTL}; }
  .corner-br { bottom: 48px; right: 48px; border-bottom: 1px solid ${variant.cornerBR}; border-right: 1px solid ${variant.cornerBR}; }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="corner corner-tl"></div>
  <div class="corner corner-br"></div>
  <div class="card">
    <div class="logo-row">
      <svg width="72" height="72" viewBox="0 0 100 100">
        <rect x="5" y="5" width="26" height="26" rx="3" fill="#FF6B35"/>
        <rect x="37" y="5" width="26" height="26" rx="3" fill="#FF6B35"/>
        <rect x="69" y="5" width="26" height="26" rx="3" fill="#FF6B35"/>
        <rect x="5" y="37" width="26" height="26" rx="3" fill="#FFC857"/>
        <rect x="37" y="37" width="26" height="26" rx="3" fill="#FFC857"/>
        <rect x="69" y="37" width="26" height="26" rx="3" fill="#FFC857"/>
        <rect x="5" y="69" width="26" height="26" rx="3" fill="#4AEADC"/>
        <rect x="37" y="69" width="26" height="26" rx="3" fill="#4AEADC"/>
        <rect x="69" y="69" width="26" height="26" rx="3" fill="#4AEADC"/>
      </svg>
      <span class="title">${variant.title}</span>
    </div>
    <p class="tagline">${variant.tagline}</p>
    <p class="url">indiandataproject.org</p>
  </div>
</body>
</html>`;
}

async function generateOGCards() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

  for (const variant of VARIANTS) {
    await page.setContent(buildHTML(variant), { waitUntil: 'load', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));

    const outputPath = path.join(__dirname, '..', 'public', variant.filename);
    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });
    console.log(`Generated: ${outputPath}`);
  }

  await browser.close();
  console.log(`\nAll ${VARIANTS.length} OG cards generated.`);
}

generateOGCards().catch(console.error);
