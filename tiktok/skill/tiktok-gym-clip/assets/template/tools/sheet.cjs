/* Contact sheet: node sheet.cjs <html> <out.png> t=1,2,3 [cols=4] [scale=0.3]  -> one image with all the frames */
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [html, out, ...rest] = process.argv.slice(2);
  const o = Object.fromEntries(rest.map(a => a.split('=')));
  const times = String(o.t).split(',').map(Number);
  const cols = +(o.cols || 4), sc = +(o.scale || 0.3);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: sc });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  page.on('console', m => { if (m.type() === 'error') console.log('[console.error]', m.text()); });
  await page.goto('file://' + path.resolve(html));
  await page.waitForFunction(() => window.READY === true, null, { timeout: 15000 });
  const shots = [];
  for (const t of times) { await page.evaluate(tt => window.seek(tt), t); shots.push((await page.screenshot({ type: 'png' })).toString('base64')); }
  const w = Math.round(1080 * sc), h = Math.round(1920 * sc), rows = Math.ceil(times.length / cols);
  const p2 = await browser.newPage({ viewport: { width: cols * (w + 6) + 6, height: rows * (h + 30) + 6 }, deviceScaleFactor: 1 });
  await p2.setContent(`<body style="margin:0;background:#333;font:14px monospace;color:#fff"><div style="display:grid;grid-template-columns:repeat(${cols},${w}px);gap:6px;padding:6px">${shots.map((b, i) => `<div><div style="height:22px;line-height:22px">t=${times[i].toFixed(2)}</div><img src="data:image/png;base64,${b}" width="${w}" height="${h}" style="display:block"></div>`).join('')}</div></body>`);
  await p2.screenshot({ path: out });
  await browser.close();
  console.log('wrote', out);
})();
