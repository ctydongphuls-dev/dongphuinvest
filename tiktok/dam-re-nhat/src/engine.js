/* Tiny deterministic animation engine: everything on screen is a pure function of time t (seconds).
   No CSS animations / timers, so any frame can be rendered independently. */
(function () {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const E = {
    lin: p => p,
    inQuad: p => p * p,
    outQuad: p => 1 - (1 - p) * (1 - p),
    inOutQuad: p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
    inCubic: p => p * p * p,
    outCubic: p => 1 - Math.pow(1 - p, 3),
    inOutCubic: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    outQuart: p => 1 - Math.pow(1 - p, 4),
    outExpo: p => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
    inExpo: p => (p <= 0 ? 0 : Math.pow(2, 10 * p - 10)),
    inBack: p => { const c = 1.70158; return (c + 1) * p * p * p - c * p * p; },
    outBack: (p, c = 1.70158) => 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2),
    outElastic: p => (p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
    outBounce: p => {
      const n = 7.5625, d = 2.75;
      if (p < 1 / d) return n * p * p;
      if (p < 2 / d) return n * (p -= 1.5 / d) * p + 0.75;
      if (p < 2.5 / d) return n * (p -= 2.25 / d) * p + 0.9375;
      return n * (p -= 2.625 / d) * p + 0.984375;
    },
  };
  /** eased 0..1 progress of a tween starting at t0 lasting d */
  const pr = (t, t0, d, ease = E.outCubic) => ease(clamp((t - t0) / d));
  /** deterministic pseudo random in [0,1) */
  const rnd = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  const FPS = 30;

  /** An animated element. Modifiers are layered: each receives (t, state) and mutates state. */
  class Obj {
    constructor(el) { this.el = el; this.mods = []; this.base = ''; this.vis = null; }
    add(fn) { this.mods.push(fn); return this; }
    /** visible only inside [a, b) */
    span(a, b = 1e9) { this.vis = [a, b]; return this; }

    // ---------- entrances
    pop(t0, d = 0.36, c = 2.2) {
      return this.add((t, s) => { if (t < t0) { s.o = 0; return; } const p = clamp((t - t0) / d); s.s *= E.outBack(p, c); s.o *= clamp((t - t0) / 0.05); });
    }
    slam(t0, d = 0.24, from = 2.6) {
      return this.add((t, s) => { if (t < t0) { s.o = 0; return; } const p = E.outExpo(clamp((t - t0) / d)); s.s *= lerp(from, 1, p); s.o *= clamp((t - t0) / 0.07); });
    }
    drop(t0, d = 0.5, dy = -900) {
      return this.add((t, s) => { if (t < t0) { s.o = 0; return; } const p = E.outBounce(clamp((t - t0) / d)); s.y += lerp(dy, 0, p); });
    }
    slide(t0, d = 0.4, dx = 0, dy = 0, ease = E.outExpo) {
      return this.add((t, s) => { if (t < t0) { s.o = 0; return; } const p = ease(clamp((t - t0) / d)); s.x += lerp(dx, 0, p); s.y += lerp(dy, 0, p); s.o *= clamp((t - t0) / 0.08); });
    }
    fade(t0, d = 0.25) { return this.add((t, s) => { s.o *= clamp((t - t0) / d); }); }
    /** pendulum swing-in around the transform origin (deg) */
    swing(t0, amp = 60, freq = 2.2, damp = 4.5) {
      return this.add((t, s) => { if (t < t0) { s.o = 0; return; } const u = t - t0; s.r += amp * Math.exp(-damp * u) * Math.cos(2 * Math.PI * freq * u); s.s *= E.outBack(clamp(u / 0.22), 1.4); });
    }
    // ---------- exits
    out(t1, d = 0.16) {
      return this.add((t, s) => { if (t >= t1 + d) { s.o = 0; return; } if (t > t1) { const p = E.inCubic((t - t1) / d); s.s *= lerp(1, 0.4, p); s.o *= 1 - p; } });
    }
    fadeOut(t1, d = 0.2) { return this.add((t, s) => { if (t > t1) s.o *= 1 - clamp((t - t1) / d); }); }
    fly(t1, d, dx, dy, rot = 0, ease = E.inQuad) {
      return this.add((t, s) => { if (t > t1) { const p = ease(clamp((t - t1) / d)); s.x += dx * p; s.y += dy * p; s.r += rot * p; if (t >= t1 + d) s.o = 0; } });
    }
    // ---------- continuous / accents
    float(amp = 8, period = 3, ph = 0) { return this.add((t, s) => { s.y += amp * Math.sin(2 * Math.PI * (t / period + ph)); }); }
    sway(amp = 3, period = 2.6, ph = 0) { return this.add((t, s) => { s.r += amp * Math.sin(2 * Math.PI * (t / period + ph)); }); }
    breathe(amp = 0.03, period = 2.2, ph = 0) { return this.add((t, s) => { s.s *= 1 + amp * Math.sin(2 * Math.PI * (t / period + ph)); }); }
    pulse(t0, amt = 0.18, d = 0.3) {
      return this.add((t, s) => { if (t >= t0 && t < t0 + d) { const p = (t - t0) / d; s.s *= 1 + amt * Math.sin(Math.PI * p) * (1 - p * 0.3); } });
    }
    shake(t0, d = 0.3, amp = 14) {
      return this.add((t, s) => { if (t >= t0 && t < t0 + d) { const k = 1 - (t - t0) / d; const f = Math.round(t * FPS); s.x += (rnd(f * 1.3) - 0.5) * 2 * amp * k; s.y += (rnd(f * 2.7 + 9) - 0.5) * 2 * amp * k; } });
    }
    rot(deg) { return this.add((t, s) => { s.r += deg; }); }
    scale(k) { return this.add((t, s) => { s.s *= k; }); }
    /** slow continuous zoom from k0 to k1 across [a,b] */
    zoom(a, b, k0, k1, ease = E.lin) { return this.add((t, s) => { s.s *= lerp(k0, k1, ease(clamp((t - a) / (b - a)))); }); }
    move(a, d, dx, dy, ease = E.inOutCubic) { return this.add((t, s) => { const p = ease(clamp((t - a) / d)); s.x += dx * p; s.y += dy * p; }); }
    turn(a, d, deg, ease = E.inOutCubic) { return this.add((t, s) => { s.r += deg * ease(clamp((t - a) / d)); }); }
    grow(a, d, k, ease = E.outBack) { return this.add((t, s) => { s.s *= lerp(1, k, ease(clamp((t - a) / d))); }); }
    dim(a, d, to = 0.35) { return this.add((t, s) => { s.o *= lerp(1, to, clamp((t - a) / d)); }); }

    render(t) {
      if (this.vis && (t < this.vis[0] || t >= this.vis[1])) { if (this._shown !== false) { this.el.style.display = 'none'; this._shown = false; } return; }
      const s = { x: 0, y: 0, s: 1, r: 0, o: 1, sx: 1, sy: 1 };
      for (const m of this.mods) m(t, s);
      if (s.o <= 0.001) { if (this._shown !== false) { this.el.style.display = 'none'; this._shown = false; } return; }
      if (this._shown !== true) { this.el.style.display = ''; this._shown = true; }
      this.el.style.opacity = s.o >= 0.999 ? '' : s.o.toFixed(3);
      this.el.style.transform = `${this.base} translate(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px) rotate(${s.r.toFixed(3)}deg) scale(${(s.s * s.sx).toFixed(4)},${(s.s * s.sy).toFixed(4)})`;
      if (this.onRender) this.onRender(t, s);
    }
  }

  const ALL = [];
  /** Create an absolutely positioned element anchored at (x, y) in stage px.
      anchor: 'c' center (default), 'tl', 'tc', 'bc', 'cl', 'cr', or [fx, fy] fractions. */
  function make(parent, { x = 0, y = 0, html = '', cls = '', anchor = 'c', css = '', origin = null } = {}) {
    const el = document.createElement('div');
    el.className = 'o ' + cls;
    el.innerHTML = html;
    const A = { c: [0.5, 0.5], tl: [0, 0], tc: [0.5, 0], tr: [1, 0], bc: [0.5, 1], bl: [0, 1], br: [1, 1], cl: [0, 0.5], cr: [1, 0.5] };
    const [fx, fy] = Array.isArray(anchor) ? anchor : A[anchor];
    el.style.cssText = `left:${x}px;top:${y}px;transform-origin:${origin || `${fx * 100}% ${fy * 100}%`};${css}`;
    (parent.el || parent).appendChild(el);
    const o = new Obj(el);
    o.base = `translate(${-fx * 100}%,${-fy * 100}%)`;
    ALL.push(o);
    return o;
  }

  /** Fit a single text line to a target width by adjusting font-size (measured with canvas). */
  const cvs = document.createElement('canvas').getContext('2d');
  function fitSize(text, family, weight, targetW, maxSize = 400, letter = 0) {
    cvs.font = `${weight} 100px "${family}"`;
    const w = cvs.measureText(text).width + letter * 100 * Math.max(0, text.length - 1);
    return Math.min(maxSize, Math.floor(targetW / w * 100));
  }
  function textW(text, family, weight, size, letter = 0) {
    cvs.font = `${weight} ${size}px "${family}"`;
    return cvs.measureText(text).width + letter * size * Math.max(0, text.length - 1);
  }
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  window.ENG = { clamp, lerp, E, pr, rnd, FPS, Obj, make, ALL, fitSize, textW, fmt };
})();
