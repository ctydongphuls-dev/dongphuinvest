/* Screenshot helper: node shot.cjs <html> <out.png> [t=<sec>] [w=1080] [h=1920] [scale=1]
   If the page exposes window.seek(t) it is called before the screenshot. */
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const [html, out, ...rest] = process.argv.slice(2);
  const o = Object.fromEntries(rest.map(a => a.split('=')));
  const w = +(o.w || 1080), h = +(o.h || 1920), scale = +(o.scale || 1);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  page.on('console', m => { if (m.type() === 'error') console.log('[console.error]', m.text()); });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  await page.goto('file://' + path.resolve(html) + (o.q ? '?' + o.q : ''));
  await page.evaluate(() => document.fonts.ready);
  if (await page.evaluate(() => !!window.NEEDS_READY)) await page.waitForFunction(() => window.READY === true, null, { timeout: 15000 });
  const times = o.t !== undefined ? String(o.t).split(',').map(Number) : [null];
  for (const t of times) {
    if (t !== null) await page.evaluate(tt => window.seek && window.seek(tt), t);
    const f = times.length > 1 ? out.replace(/\.png$/, `_${String(t.toFixed(2)).padStart(6, '0')}.png`) : out;
    await page.screenshot({ path: f });
    console.log('wrote', f);
  }
  await browser.close();
})();
