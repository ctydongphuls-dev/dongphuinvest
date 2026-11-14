/* Global layers: background, wipes, flashes, camera shake, top ladder, captions + shared builders. */
(function () {
  const { make, E, pr, clamp, lerp, rnd, fitSize, textW, fmt, ALL, FPS } = ENG;
  const $ = id => document.getElementById(id);
  const C = { ink: '#17171C', white: '#FFFFFF', yellow: '#FFD60A', red: '#FF4D4D', green: '#36E37A', 6: '#FF4D4D', 5: '#FF8A2A', 4: '#FFB627', 3: '#FFE03A', 2: '#B9F03C', 1: '#36E37A' };

  // ---------------- timing helpers
  const W = TIMING.words;
  const bySent = {};
  W.forEach(w => (bySent[w.s] = bySent[w.s] || []).push(w));
  // ts(s, k): beat (vowel onset) of the k-th word of sentence s; ts(s, k, q): its q-th syllable (numbers, "video"...)
  const word = (s, k) => { const w = bySent[s] && bySent[s][k]; if (!w) throw new Error(`no word ${s}:${k} in timing`); return w; };
  const ts = (s, k, q = 0) => { const w = word(s, k); return q ? w.sub[Math.min(q, w.sub.length - 1)] : w.a; };
  const te = (s, k) => word(s, k).b;
  const LEAD = 0.06;                             // visuals land a touch before the vowel onset of the word
  const cues = [];                               // every word used as a visual cue (for the sync check sheet)
  const hit = (s, k, q = 0) => { const t = ts(s, k, q); cues.push({ s, k, q, t }); return t - LEAD; };
  // scene cut placed in the pause before a word: as late as possible, but never on top of the previous phrase
  const ipuEndBefore = t => { let e = 0; for (const [, b] of TIMING.ipus) if (b < t) e = b; return e; };
  const cutBefore = (s, k) => { const b = ts(s, k); return clamp(b - 0.16, ipuEndBefore(b) + 0.04, b - 0.07); };

  // ---------------- global fx registries
  const shakes = [];   // [t0, d, amp]
  const flashes = [];  // [t0, d, peak, id]
  const accents = [];  // [t, color]
  const wipes = [];
  const sfx = [];      // {t, type, gain} -> exported for the audio builder

  const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hex2rgb(a), B = hex2rgb(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], p))).join(',')})`; };

  function accentAt(t) {
    let cur = accents[0][1], prev = cur, tc = -1e9;
    for (const [ta, c] of accents) { if (t >= ta) { prev = cur; cur = c; tc = ta; } }
    return mix(prev, cur, clamp((t - tc) / 0.3));
  }

  /** two-band diagonal wipe that fully covers the frame at time tc */
  function wipe(tc, color, d = 0.42) {
    const mk = (col, lag, w) => {
      const o = make($('fx'), { x: 0, y: -100, anchor: 'tl', css: `width:${w}px;height:2120px;background:${col};` });
      o.base = '';
      o.span(tc - d / 2 - 0.02 + lag, tc + d / 2 + 0.02 + lag);
      o.add((t, s) => { const p = clamp((t - (tc - d / 2 + lag)) / d); s.x += lerp(-w - 600, 1700, p); });
      o.el.style.transformOrigin = '50% 50%';
      const r0 = o.render.bind(o);
      o.render = t => { r0(t); if (o._shown) o.el.style.transform += ' skewX(-13deg)'; };
      return o;
    };
    mk(C.ink, -0.035, 2200);
    mk(color, 0, 2000);
    wipes.push(tc); CAP.cuts.push(tc);
    sfx.push({ t: tc - 0.16, type: 'whoosh', gain: 1 });
  }
  const shake = (t0, amp = 16, d = 0.32) => shakes.push([t0, d, amp]);
  const flash = (t0, peak = 0.8, d = 0.3, id = 'flash') => flashes.push([t0, d, peak, id]);

  // ---------------- builders
  const scenesEl = () => $('scenes');
  function scene(a, b) {
    const o = make(scenesEl(), { x: 0, y: 0, anchor: 'tl', css: 'width:1080px;height:1920px;' });
    o.base = '';
    return o.span(a, b);
  }
  /** group anchored at a point (children are positioned relative to it) */
  const group = (parent, x, y) => make(parent, { x, y, css: 'width:0;height:0;' });
  const art = (parent, id, w, x = 0, y = 0, opts = {}) => make(parent, { x, y, html: ART.svg(id, w, opts), anchor: opts.anchor || 'c' });

  /** headline: html may contain <span class="y|r|g"> for colours. Fitted to width w. */
  function hd(parent, html, { x = 540, y = 0, w = 940, max = 260, cls = '', anchor = 'tc', rot = 0 } = {}) {
    const plain = html.replace(/<[^>]+>/g, '');
    const size = fitSize(plain, 'Anton', 400, w / 1.02, max, 0.01);
    const sw = Math.max(8, Math.round(size * 0.085));
    const o = make(parent, { x, y, anchor, html: `<div class="hd ${cls}" style="font-size:${size}px;-webkit-text-stroke-width:${sw}px;text-shadow:0 ${Math.round(size * 0.06)}px 0 var(--ink)">${html}</div>` });
    o.size = size;
    o.h = size * 1.16;
    if (rot) o.rot(rot);
    return o;
  }
  const chip = (parent, html, x, y, cls = '', rot = 0) => { const o = make(parent, { x, y, html: `<div class="chip ${cls}">${html}</div>` }); if (rot) o.rot(rot); return o; };
  const stamp = (parent, text, x, y, { cls = '', rot = -7, size = 128 } = {}) => {
    const o = make(parent, { x, y, html: `<div class="stamp ${cls}" style="font-size:${size}px;border-width:${Math.round(size * 0.09)}px">${text}</div>` });
    o.rot(rot);
    return o;
  };

  /** hanging price tag. (x,y) = position of the punch hole. Counts up from c0 to c1. */
  function tag(parent, { x, y, val, color, label = 'GIÁ 1 GRAM ĐẠM', fs = 150, rot = 5, c0 = 0, c1 = 0, prefix = '~', unit = 'đ/g', step = 0 }) {
    const finalTxt = prefix + fmt(val);
    const tw = textW(finalTxt, 'Anton', 400, fs) + textW(unit, 'Anton', 400, fs * 0.47) + fs * 0.08;
    const lw = textW(label, 'Be Vietnam Pro', 900, 27, 0.1);
    const Wt = Math.round(94 + Math.max(tw, lw + 8) + 46), H = Math.round(40 + fs * 1.12 + 22);
    const d = `M66 4H${Wt - 30}a26 26 0 0 1 26 26V${H - 30}a26 26 0 0 1-26 26H66L6 ${H / 2}Z`;
    const html = `<div class="tag" style="width:${Wt}px;height:${H}px">
      <svg width="${Wt}" height="${H}" viewBox="0 0 ${Wt} ${H}">
        <path d="M54 ${H / 2}C10 ${H / 2 - 16} -34 ${H / 2 - 96} -104 ${H / 2 - 82}" fill="none" stroke="${C.ink}" stroke-width="15" stroke-linecap="round"/>
        <path d="M54 ${H / 2}C10 ${H / 2 - 16} -34 ${H / 2 - 96} -104 ${H / 2 - 82}" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
        <path d="${d}" transform="translate(10 14)" fill="#000" opacity=".42"/>
        <path d="${d}" fill="${color}" stroke="${C.ink}" stroke-width="9" stroke-linejoin="round"/>
        <path d="M82 22H${Wt - 34}a10 10 0 0 1 10 10V${H - 32}a10 10 0 0 1-10 10H82" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-dasharray="4 11" stroke-linecap="round" opacity=".45"/>
        <circle cx="54" cy="${H / 2}" r="15" fill="${C.ink}"/><circle cx="54" cy="${H / 2}" r="6.5" fill="#fff" opacity=".9"/>
      </svg>
      <div class="tl">${label}</div><div class="tp" style="font-size:${fs}px"><span class="num">${finalTxt}</span><i>${unit}</i></div></div>`;
    const o = make(parent, { x, y, html, anchor: [54 / Wt, 0.5] });
    o.rot(rot);
    o.w = Wt; o.hh = H;
    const num = o.el.querySelector('.num');
    const st = step || (val >= 300 ? 10 : val >= 100 ? 5 : 1);
    let last = '';
    o.onRender = t => {
      let v = val;
      if (c1 > c0 && t < c1) v = Math.round(lerp(0, val, E.outCubic(clamp((t - c0) / (c1 - c0)))) / st) * st;
      const txt = prefix + fmt(v);
      if (txt !== last) { num.textContent = txt; last = txt; }
    };
    if (c1 > c0) for (let k = 0; k < 6; k++) sfx.push({ t: c0 + (c1 - c0) * k / 6, type: 'tick', gain: 0.5 });
    return o;
  }

  // ---------------- ladder
  const LAD = { show: 1e9, hide: 1e9, cur: {}, on: {}, data: {} };
  function buildLadder() {
    const L = $('ladder');
    const order = Object.keys(LAD.data).map(Number).sort((a, b) => b - a);   // e.g. 6..1 for a countdown
    LAD.order = order;
    if (!order.length) return;                   // this video has no ranking ladder
    const step = Math.min(152, 912 / order.length), x0 = 540 - (step * (order.length - 1) + 138) / 2;
    LAD.chips = {};
    order.forEach((r, i) => {
      const el = document.createElement('div');
      el.className = 'lc';
      el.style.left = x0 + i * step + 'px';
      const d = LAD.data[r];
      el.innerHTML = `<div class="rk">#${r}</div><div class="n">#${r}</div><div class="ic">${ART.svg(d.art, d.w, { plain: true })}</div><div class="p">${d.price}</div>`;
      L.appendChild(el);
      LAD.chips[r] = el;
    });
  }
  function renderLadder(t) {
    const L = $('ladder');
    if (!LAD.chips || !LAD.order.length || t < LAD.show || t >= LAD.hide) { L.style.display = 'none'; return; }
    L.style.display = '';
    const p = E.outBack(clamp((t - LAD.show) / 0.45), 1.3);
    L.style.transform = `translateY(${lerp(-340, 0, p).toFixed(1)}px)`;
    for (const r of LAD.order) {
      const el = LAD.chips[r];
      const on = t >= LAD.on[r], cur = t >= LAD.cur[r] && !on;
      el.className = 'lc' + (on ? ' on' : '') + (cur ? ' cur' : '');
      el.style.background = on ? C[r] : '';
      let s = 1;
      if (on) { const u = t - LAD.on[r]; if (u < 0.4) s = 1 + 0.28 * Math.sin(Math.PI * u / 0.4) * (1 - u / 0.6); }
      else if (cur) s = 1.06 + 0.035 * Math.sin(2 * Math.PI * t / 0.9);
      el.style.transform = `scale(${s.toFixed(3)})`;
      el.style.borderColor = cur ? C[r] : '';
    }
  }

  // ---------------- captions
  const CAP = { cur: -1, top: [[-1e9, 1250]], off: [], cuts: [] };   // top: [[t, px]...], off: [[a,b]...] ranges with captions hidden
  function renderCaptions(t) {
    const cap = $('cap');
    let ci = -1;
    const cards = TIMING.cards;
    for (let i = 0; i < cards.length; i++) {
      // a card never survives a scene cut
      let hide = i === cards.length - 1 ? 1e9 : cards[i].hide;   // the last line stays until the end
      for (const c of CAP.cuts) if (c > cards[i].a + 0.2 && c < hide) hide = c;
      if (t >= cards[i].a - 0.07 && t < hide) ci = i;
    }
    if (ci >= 0 && CAP.off.some(([a, b]) => cards[ci].a >= a && cards[ci].a < b)) ci = -1;
    if (ci !== CAP.cur) {
      CAP.cur = ci;
      if (ci < 0) { cap.innerHTML = ''; return; }
      const c = cards[ci];
      // font size: fit the longest line into 880px
      let size = 88;
      for (const ln of c.lines) {
        const txt = ln.map(i => W[i].w).join(' ');
        size = Math.min(size, fitSize(txt, 'Be Vietnam Pro', 900, 800, 88));
      }
      cap.innerHTML = c.lines.map(ln => `<div class="cl" style="font-size:${size}px">${ln.map(i => `<span class="cw ${W[i].tone}" data-i="${i}" style="-webkit-text-stroke-width:${Math.round(size * 0.15)}px">${W[i].w}</span>`).join('')}</div>`).join('');
      CAP.spans = [...cap.querySelectorAll('.cw')];
    }
    if (ci < 0) return;
    let top = 1250;
    for (const [tt, px] of CAP.top) if (t >= tt) top = px;
    cap.style.top = top + 'px';
    // every word of the card is on screen (dim) and lights up exactly when it is spoken
    const cin = E.outBack(clamp((t - (cards[ci].a - 0.07)) / 0.16), 1.6);
    cap.style.transform = `scale(${lerp(0.82, 1, cin).toFixed(3)})`;
    cap.style.opacity = clamp((t - (cards[ci].a - 0.07)) / 0.06).toFixed(2);
    for (const sp of CAP.spans) {
      const w = W[+sp.dataset.i];
      const u = t - (w.a - 0.045);
      if (u < 0) { sp.className = 'cw dim'; sp.style.transform = ''; continue; }
      const active = t < w.b - 0.02;
      sp.className = 'cw ' + w.tone + (active ? ' act' : '');
      const bump = u < 0.2 ? Math.sin(Math.PI * clamp(u / 0.2)) : 0;
      const k = 1 + 0.06 * bump + (active ? 0.025 : 0);
      sp.style.transform = `translateY(${((active ? -4 : 0) - bump * 14).toFixed(1)}px) scale(${k.toFixed(3)})`;
    }
  }

  // ---------------- per-frame global render
  function renderGlobal(t) {
    const st = $('stage');
    st.style.setProperty('--accent', accentAt(t));
    $('bg-rays').style.transform = `rotate(${(t * 5.5) % 360}deg)`;
    $('bg-dots').style.backgroundPosition = `${(t * 9) % 36}px ${(t * 14) % 36}px`;
    // camera shake
    let sx = 0, sy = 0;
    for (const [t0, d, amp] of shakes) if (t >= t0 && t < t0 + d) { const k = Math.pow(1 - (t - t0) / d, 1.5); const f = Math.round(t * FPS); sx += (rnd(f * 3.1 + t0) - 0.5) * 2 * amp * k; sy += (rnd(f * 5.3 + t0 * 7) - 0.5) * 2 * amp * k; }
    $('cam').style.transform = sx || sy ? `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)` : '';
    for (const id of ['flash', 'redflash']) {
      let o = 0;
      for (const [t0, d, peak, fid] of flashes) if (fid === id && t >= t0 && t < t0 + d) o = Math.max(o, peak * Math.pow(1 - (t - t0) / d, 1.6));
      $(id).style.opacity = o.toFixed(3);
    }
    renderLadder(t);
    renderCaptions(t);
    const pb = $('progress');
    if (pb) { pb.style.display = APP.progressBar ? '' : 'none'; pb.firstChild.style.width = (100 * clamp(t / TIMING.duration)).toFixed(2) + '%'; }
  }

  window.APP = { progressBar: false, cues, C, W, ts, te, hit, LEAD, cutBefore, scene, group, art, hd, chip, stamp, tag, wipe, shake, flash, accents, sfx, LAD, CAP, buildLadder, renderGlobal, $, mix };
})();
