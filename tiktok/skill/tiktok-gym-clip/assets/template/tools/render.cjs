/* Parallel frame renderer.
   node render.cjs <outDir> [from=0] [to=<duration>] [workers=4] [fps=30]
   Each frame is a pure function of time (window.seek), so workers simply split the frame range. */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');

(async () => {
  const [outDir, ...rest] = process.argv.slice(2);
  const o = Object.fromEntries(rest.map(a => a.split('=')));
  const fps = +(o.fps || 30), workers = +(o.workers || 4);
  const root = path.resolve(__dirname, '..');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const mk = async () => {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    page.on('pageerror', e => console.log('[pageerror]', e.message));
    await page.goto('file://' + path.join(root, 'src/index.html'));
    await page.waitForFunction(() => window.READY === true, null, { timeout: 20000 });
    return { page, cdp: await page.context().newCDPSession(page) };
  };
  const first = await mk();
  const duration = await first.page.evaluate(() => window.DURATION);
  const f0 = Math.round((+(o.from || 0)) * fps), f1 = Math.round((o.to !== undefined ? +o.to : duration) * fps);
  const frames = []; for (let f = f0; f < f1; f++) frames.push(f);
  const pool = [first]; for (let i = 1; i < workers; i++) pool.push(await mk());
  let next = 0, done = 0; const t0 = Date.now();
  await Promise.all(pool.map(async ({ page, cdp }) => {
    for (;;) {
      const i = next++; if (i >= frames.length) break;
      const f = frames[i];
      await page.evaluate(t => window.seek(t), f / fps);
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
      fs.writeFileSync(path.join(outDir, `f_${String(f).padStart(5, '0')}.png`), Buffer.from(data, 'base64'));
      if (++done % 200 === 0) console.log(`${done}/${frames.length} frames  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
    }
  }));
  console.log(`rendered ${frames.length} frames [${f0}..${f1 - 1}] in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  await browser.close();
})();
