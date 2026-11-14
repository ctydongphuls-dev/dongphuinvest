/* All scenes. Every cue is tied to the vowel onset ("beat") of a spoken word: hit(sentence, wordIndex)
   lands the visual ~2 frames before that beat. Sentence / word indices follow timing/timing.json. */
(function () {
  const { make, E, clamp, lerp, rnd, textW, fmt } = ENG;
  const { C, ts, te, hit, cutBefore, scene, group, art, hd, chip, stamp, tag, wipe, shake, flash, accents, sfx, LAD, CAP } = APP;
  const S = (t, type, gain = 1) => sfx.push({ t, type, gain });
  const END = 74.0;

  // ladder content (filled in as ranks are revealed)
  LAD.data = {
    6: { art: 'whey', w: 44, price: '1.100' }, 5: { art: 'tray', w: 84, price: '460' }, 4: { art: 'tofu', w: 80, price: '370' },
    3: { art: 'chicken', w: 80, price: '330' }, 2: { art: 'peanut', w: 80, price: '240' }, 1: { art: 'soy', w: 64, price: '100' },
  };
  for (const r of [6, 5, 4, 3, 2, 1]) { LAD.cur[r] = 1e9; LAD.on[r] = 1e9; }

  const qmark = (parent, x, y, size, rot = 0, cls = 'y') => {
    const o = make(parent, { x, y, html: `<div class="hd ${cls}" style="font-size:${size}px;-webkit-text-stroke-width:${Math.round(size * 0.09)}px;text-shadow:0 ${Math.round(size * 0.055)}px 0 var(--ink)">?</div>` });
    if (rot) o.rot(rot);
    return o;
  };

  // scene boundaries (all derived from the recording)
  const T_TEASE = cutBefore(2, 0);      // "Món đứng top 1 ..."
  const T_SETUP = cutBefore(4, 0);      // "Tao đã tính ..."
  const T_R6 = cutBefore(6, 0);         // "Hạng 6"
  const T_R5 = cutBefore(9, 0);         // "Hạng 5"
  const T_R4 = cutBefore(12, 0);        // "Hạng 4"
  const T_R3 = hit(13, 0) - 0.03;       // "Hạng 3" (hard cut, no pause in the voice)
  const T_R2 = cutBefore(15, 0);        // "Hạng 2"
  const T_R1 = te(17, 16) + 0.12;       // silence after "... không phải to."
  const T_COOK = ts(21, 0) - 0.135;     // "Nhớ nấu chín"
  const T_MIX = hit(22, 0) - 0.02;      // "Và đừng bỏ ..."
  const T_TABLE = cutBefore(23, 0);     // "Lưu video này lại"

  // =====================================================================================
  // 1. HOOK   "Trứng không phải nguồn đạm rẻ nhất. | Whey càng không."
  // =====================================================================================
  {
    const sc = scene(-1, T_TEASE);
    accents.push([-1, C.yellow]);
    const hA = hd(sc, 'TRỨNG <span style="color:var(--red)">KHÔNG RẺ</span>', { y: 232, w: 940, max: 230 });
    const hB = hd(sc, 'NHƯ MÀY NGHĨ', { y: 232 + hA.h * 0.95, w: 940, max: 230 });
    hA.slam(-0.14).pulse(hit(0, 1), 0.1, 0.3);
    hB.slam(0.02).pulse(hit(0, 5), 0.08, 0.3);

    // the egg: bounces on "Trứng", gets a red X on "không", is tossed out of frame on "nhất"
    const tossT = ts(0, 6) - 0.05;
    const eg = group(sc, 540, 925);
    eg.pop(-0.3, 0.42).float(10, 2.4).sway(3.5, 1.6).pulse(hit(0, 0), 0.12, 0.28)
      .add((t, s) => { if (t > tossT - 0.14 && t <= tossT) { const p = (t - (tossT - 0.14)) / 0.14; s.sy *= 1 - 0.1 * p; s.sx *= 1 + 0.08 * p; s.y += 26 * p; } })
      .add((t, s) => { if (t > tossT) { const p = (t - tossT) / 0.46; s.x += 1050 * p; s.y += -1750 * p + 700 * p * p; s.r += 560 * p; s.s *= 1 - 0.3 * clamp(p); if (p >= 1) s.o = 0; } });
    art(eg, 'egg', 468);
    const x1 = art(eg, 'cross', 300, 16, 56);
    x1.rot(-7).slam(hit(0, 1), 0.2, 3.2);
    shake(hit(0, 1), 20); S(hit(0, 1), 'hit', 1); S(tossT, 'whoosh', 0.9);

    // whey drops in on "Whey", gets its own X on "không"
    const wh = group(sc, 540, 925);
    wh.slam(hit(1, 0) - 0.03, 0.26, 2.3).float(8, 2.6, 0.3).sway(2, 2.1);
    art(wh, 'whey', 440);
    const x2 = art(wh, 'cross', 300, 10, 70);
    x2.rot(9).slam(hit(1, 2), 0.2, 3.2);
    shake(hit(1, 0) - 0.03, 12); S(hit(1, 0) - 0.03, 'thud', 0.9);
    shake(hit(1, 2), 20); S(hit(1, 2), 'hit', 1);
  }

  // =====================================================================================
  // 2. TEASE  "Món đứng top 1 giá chưa tới 150 đồng 1 gam đạm, | và hầu hết dân gym không bao giờ ăn nó."
  // =====================================================================================
  {
    const a = T_TEASE, b = T_SETUP, B2 = hit(3, 3) - 0.08;
    wipe(a, C.yellow);
    const sc = scene(a, b);
    accents.push([a, C.yellow]);
    const crown = art(sc, 'crown', 200, 540, 322);
    crown.pop(hit(2, 2) - 0.06).sway(4, 1.5).float(6, 2).out(B2, 0.12);
    const h1 = hd(sc, 'TOP 1', { y: 410, w: 600, max: 250, cls: 'y' });
    h1.slam(hit(2, 2)).out(B2, 0.12);
    S(hit(2, 2), 'hit', 0.8); shake(hit(2, 2), 10);

    const cl = group(sc, 540, 975);
    cl.pop(a + 0.05, 0.4).sway(2.2, 0.85).float(7, 2.3)
      .shake(hit(3, 8), 0.5, 10)
      .move(hit(2, 4) - 0.1, 0.4, -120, -40);
    art(cl, 'cloth', 600);
    qmark(cl, 0, 50, 290).breathe(0.06, 0.9);
    S(a + 0.05, 'pop', 0.9);

    // price tag: counts up while "một trăm năm mươi" is spoken
    const c0 = ts(2, 7) - 0.1, c1 = ts(2, 8) - 0.12;
    const tg = tag(sc, { x: 486, y: 1110, val: 150, color: C.yellow, label: 'CHƯA TỚI', fs: 150, rot: 6, c0, c1, prefix: '' });
    tg.swing(hit(2, 4)).pulse(c1, 0.12, 0.3).sway(1.4, 2.6);
    S(hit(2, 4), 'swish', 0.8); S(c1, 'ding', 0.8);

    // beat 2: gym people never eat it
    const h2 = hd(sc, 'DÂN GYM', { y: 232, w: 620, max: 230 });
    const h3 = hd(sc, 'KHÔNG BAO GIỜ ĂN', { y: 232 + h2.h * 0.95, w: 940, max: 230, cls: 'r' });
    h2.slam(hit(3, 3));
    h3.slam(hit(3, 5));
    S(hit(3, 3), 'thud', 0.8); S(hit(3, 5), 'hit', 1); shake(hit(3, 5), 18);
    const db = group(sc, 800, 800);
    db.rot(16).pop(hit(3, 4), 0.3).float(6, 2.2, 0.4);
    art(db, 'dumbbell', 380);
    art(db, 'cross', 190, 0, 0).slam(hit(3, 5) + 0.05, 0.2, 3);
  }

  // =====================================================================================
  // 3. SETUP  "Tao | đã tính giá từng gam đạm của 6 món. | Xem tới cuối, top 1 sẽ làm mày tức."
  // =====================================================================================
  {
    const a = T_SETUP, b = T_R6, B = hit(5, 0) - 0.02;
    wipe(a, C.white, 0.34);
    const sc = scene(a, b);
    accents.push([a, C.yellow]);
    const h1 = hd(sc, '<span style="color:var(--yellow)">GIÁ</span> / 1 GRAM ĐẠM', { y: 232, w: 940, max: 220 });
    h1.slam(hit(4, 0) + 0.02).out(B - 0.04, 0.14);
    S(hit(4, 0) + 0.02, 'thud', 0.8);
    const f = chip(sc, 'TIỀN MUA <span style="color:#E5383B;margin:0 6px">÷</span> SỐ GRAM ĐẠM', 540, 232 + h1.h + 66, 'y', -2);
    f.pop(hit(4, 1) - 0.12).out(B - 0.04, 0.14);

    // the six items pop one per syllable: "đã - tính - giá - từng - gam - đạm"
    const items = [['whey', 168], ['tray', 270], ['tofu', 270], ['chicken', 270], ['peanut', 270], ['cloth', 240]];
    const pos = [[215, 810], [540, 810], [865, 810], [215, 1085], [540, 1085], [865, 1085]];
    items.forEach(([id, w], i) => {
      const g = group(sc, pos[i][0], pos[i][1]);
      const t0 = hit(4, 1 + i);
      g.pop(t0, 0.28).float(6, 2.2, i * 0.17);
      S(t0, 'pop', 0.75);
      if (i < 5) g.add((t, s) => { const p = clamp((t - B) / 0.3); s.o *= lerp(1, 0.2, p); s.s *= lerp(1, 0.9, p); });
      else g.add((t, s) => { const p = E.outBack(clamp((t - B) / 0.5), 1.2); s.x += (540 - pos[i][0]) * p; s.y += (945 - pos[i][1]) * p; s.s *= lerp(1, 2.15, p); })
        .sway(2.4, 0.8).shake(hit(5, 8), 0.5, 5);
      art(g, id, w);
      if (id === 'cloth') qmark(g, 0, 22, 120).breathe(0.06, 0.9);
    });
    const six = make(sc, { x: 842, y: 232 + h1.h + 196, html: '<div class="chip dark" style="font-family:Anton;font-weight:400;font-size:100px;padding:0 34px 10px;border-radius:30px">6 MÓN</div>' });
    six.rot(8).pop(hit(4, 8)).out(B - 0.04, 0.14);
    S(hit(4, 8), 'ding', 0.7);

    // beat B: watch till the end
    const h2 = hd(sc, 'XEM TỚI CUỐI', { y: 338, w: 900, max: 210 });
    h2.slam(B + 0.02);
    S(B + 0.02, 'thud', 0.8);
    art(sc, 'crown', 210, 540, 660).pop(hit(5, 3)).sway(4, 1.4);
    S(hit(5, 3), 'ding', 0.8);
    const ang = art(sc, 'anger', 190, 842, 752);
    ang.pop(hit(5, 8), 0.26, 3).breathe(0.12, 0.34);
    shake(hit(5, 8), 16); flash(hit(5, 8), 0.5, 0.5, 'redflash'); S(hit(5, 8), 'hit', 0.9);
    LAD.show = B + 0.04;
  }

  // =====================================================================================
  // rank scene template:  "#" lands on "Hạng", the digit on the number, name + hero on the item's name
  // =====================================================================================
  function rankScene({ a, b, rank, name, artId, artW, tHash, tNum, tName, heroX = 540, heroY = 885, nameMax = 250, silhouette = true }) {
    const sc = scene(a, b);
    accents.push([a, C[rank]]);
    const rk = hd(sc, `#<span class="dg" style="display:inline-block;transform-origin:50% 60%">${rank}</span>`, { x: 74, y: 326, w: 420, max: 250, anchor: 'tl' });
    rk.el.firstChild.style.color = C[rank];
    rk.slam(tHash, 0.22, 2.6);
    const dg = rk.el.querySelector('.dg');
    rk.onRender = t => {
      const u = t - tNum;
      if (u < 0) { dg.style.opacity = '0'; return; }
      dg.style.opacity = '1';
      dg.style.transform = `scale(${lerp(2.8, 1, E.outExpo(clamp(u / 0.22))).toFixed(3)})`;
    };
    shake(tNum, 14); S(tHash, 'tick', 1); S(tNum, 'hit', 0.95);
    const rw = textW('#' + rank, 'Anton', 400, rk.size);
    const nx = 74 + rw + 38;
    const nm = hd(sc, name, { x: nx, y: 326, w: 1004 - nx, max: nameMax, anchor: 'tl' });
    nm.el.style.top = 326 + (rk.size - nm.size) * 0.6 + 'px';
    nm.slam(tName, 0.22, 2.3);
    // mystery silhouette while "Hạng N" is spoken, replaced by the real thing on its name
    if (tName - tHash > 0.3 && silhouette) {
      const sil = group(sc, heroX, heroY);
      sil.pop(tHash - 0.02, 0.3, 1.8).breathe(0.035, 0.7).sway(1.6, 1.1).out(tName - 0.05, 0.08);
      const so = art(sil, artId, Math.round(artW * 0.92));
      so.el.style.filter = 'brightness(0) invert(0.16)';
      qmark(sil, 0, 0, Math.round(artW * 0.42)).breathe(0.07, 0.6);
    }
    const hero = group(sc, heroX, heroY);
    hero.pop(tName - 0.03, 0.42, 2.5).float(8, 2.8);
    art(hero, artId, artW);
    S(tName - 0.03, 'pop', 1);
    LAD.cur[rank] = a;
    return { sc, rk, nm, hero };
  }
  const priceTag = (sc, rank, val, tSwing, c0, c1, opts = {}) => {
    const tg = tag(sc, Object.assign({ x: 404, y: 1104, val, color: C[rank], fs: val >= 1000 ? 132 : 150, rot: 5, c0, c1 }, opts));
    tg.swing(tSwing).pulse(c1, 0.14, 0.32).sway(1.3, 2.6);
    S(tSwing, 'swish', 0.8); S(c1, 'ding', 0.9);
    LAD.on[rank] = c1;
    return tg;
  };

  // =====================================================================================
  // 4. #6 WHEY   "Hạng 6, whey. | Một hũ gần 2 triệu, mỗi gam đạm hơn 1.000 đồng. | Tiện thật, | nhưng đắt nhất bảng."
  // =====================================================================================
  {
    const a = T_R6, b = T_R5;
    wipe(a, C[6], 0.36);
    const R = rankScene({ a, b, rank: 6, name: 'WHEY', artId: 'whey', artW: 392, tHash: hit(6, 0), tNum: hit(6, 1), tName: hit(6, 2), heroY: 880 });
    R.hero.move(hit(7, 8) - 0.1, 0.4, -150, -30);
    chip(R.sc, '<small>1 HŨ ≈</small>2 TRIỆU', 800, 700, '', 6).pop(hit(7, 3)).out(hit(8, 0) - 0.06, 0.12);
    S(hit(7, 3), 'pop', 0.8);
    priceTag(R.sc, 6, 1100, hit(7, 8), ts(7, 9) - 0.12, ts(7, 10) - 0.03);
    const ok = chip(R.sc, `TIỆN ${ART.svg('check', 50, { plain: true })}`, 800, 690, 'g', 5);
    ok.pop(hit(8, 0));
    S(hit(8, 0), 'pop', 0.8);
    const st = stamp(R.sc, 'ĐẮT NHẤT BẢNG', 540, 878, { rot: -8, size: 146 });
    st.slam(hit(8, 3), 0.2, 3.2);
    shake(hit(8, 3), 22); S(hit(8, 3), 'stamp', 1);
  }

  // =====================================================================================
  // 5. #5 TRỨNG   "Hạng 5 và đây là | cú sốc, | trứng. | 3.000 đồng 1 quả, được 6 gam rưỡi đạm. | Tính ra 460 đồng 1 gam. | Áp chót."
  // =====================================================================================
  {
    const a = T_R5, b = T_R4, tN = hit(9, 7);
    wipe(a, C[5], 0.36);
    const R = rankScene({ a, b, rank: 5, name: 'TRỨNG', artId: 'tray', artW: 520, tHash: hit(9, 0), tNum: hit(9, 1), tName: tN, heroY: 900, silhouette: false });
    // suspense before the name: a big "?" then the "CÚ SỐC" stamp
    qmark(R.sc, 540, 880, 420).pop(hit(9, 0) + 0.04, 0.3).breathe(0.07, 0.5).pulse(hit(9, 2), 0.1, 0.25).out(hit(9, 5) - 0.02, 0.1);
    const cs = stamp(R.sc, 'CÚ SỐC!', 540, 880, { rot: -6, size: 230 });
    cs.slam(hit(9, 5), 0.2, 3.4).shake(hit(9, 5), 0.45, 8).pulse(hit(9, 6), 0.1, 0.25).out(tN - 0.05, 0.1);
    shake(hit(9, 5), 26); flash(hit(9, 5), 0.6, 0.5, 'redflash'); S(hit(9, 5), 'stamp', 1);
    shake(tN, 14);
    // "???" around the eggs
    [[212, 742, -18, 150], [862, 716, 14, 170], [900, 968, 24, 120]].forEach(([x, y, r, sz], i) =>
      qmark(R.sc, x, y, sz, r).pop(tN + 0.05 + i * 0.09, 0.28, 3).sway(7, 0.9, i * 0.3).out(hit(10, 0) - 0.05, 0.12));
    chip(R.sc, '3.000đ<small>/ QUẢ</small>', 270, 712, '', -6).pop(hit(10, 0));
    chip(R.sc, '6,5g<small>ĐẠM</small>', 822, 712, '', 6).pop(hit(10, 5));
    S(hit(10, 0), 'pop', 0.8); S(hit(10, 5), 'pop', 0.8);
    R.hero.move(hit(11, 2) - 0.1, 0.4, -40, -36);
    priceTag(R.sc, 5, 460, hit(11, 2), ts(11, 2), ts(11, 3) - 0.05);
    const st = stamp(R.sc, 'ÁP CHÓT', 540, 846, { rot: -8, size: 200 });
    st.slam(hit(11, 6), 0.2, 3.2).pulse(hit(11, 7), 0.08, 0.25);
    shake(hit(11, 6), 22); S(hit(11, 6), 'stamp', 1);
  }

  // =====================================================================================
  // 6. #4 ĐẬU PHỤ + #3 ỨC GÀ   (quick cut between the two)
  // =====================================================================================
  {
    const a = T_R4, m = T_R3, b = T_R2;
    wipe(a, C[4], 0.36);
    const R4 = rankScene({ a, b: m, rank: 4, name: 'ĐẬU PHỤ', artId: 'tofu', artW: 540, tHash: hit(12, 0), tNum: hit(12, 1), tName: hit(12, 2), heroY: 880 });
    R4.hero.move(hit(12, 4) - 0.1, 0.4, -30, -40);
    priceTag(R4.sc, 4, 370, hit(12, 4), ts(12, 5), ts(12, 6) - 0.03);

    // hard cut to #3 with a quick flash
    flash(m, 0.5, 0.2); S(m - 0.08, 'whoosh', 0.8);
    const R3 = rankScene({ a: m, b, rank: 3, name: 'ỨC GÀ', artId: 'chicken', artW: 540, tHash: hit(13, 0), tNum: hit(13, 1), tName: hit(13, 2), heroY: 880 });
    chip(R3.sc, '75.000đ<small>/ KG</small>', 286, 706, '', -6).pop(hit(13, 4)).out(hit(14, 3) - 0.1, 0.12);
    S(hit(13, 4), 'pop', 0.8);
    R3.hero.move(hit(13, 8) - 0.1, 0.4, -30, -40);
    priceTag(R3.sc, 3, 330, hit(13, 8), ts(13, 8), ts(13, 9) - 0.03);
    // "Đúng, ức gà rẻ hơn trứng."
    R3.hero.pulse(hit(14, 0), 0.1, 0.3);
    const st = stamp(R3.sc, 'RẺ HƠN TRỨNG', 560, 806, { rot: -7, size: 140, cls: 'g' });
    st.slam(hit(14, 3), 0.2, 3.2);
    shake(hit(14, 3), 20); S(hit(14, 3), 'stamp', 1);
    const eg = group(R3.sc, 196, 1010);
    eg.rot(-10).pop(hit(14, 5), 0.3, 2.6);
    art(eg, 'tray', 250);
    chip(eg, '460đ', 30, 92, 'r', 4).scale(0.78);
    S(hit(14, 5), 'pop', 0.9);
  }

  // =====================================================================================
  // 7. #2 LẠC   "Hạng 2, lạc. | Chỉ khoảng 240 đồng 1 gam. | Nhưng cẩn thận, | 100 gam lạc gần 570 calo, ăn nhiều là béo chứ không phải to."
  // =====================================================================================
  {
    const a = T_R2, b = T_R1, tW = hit(17, 0), tF = hit(17, 9);
    wipe(a, C[2], 0.36);
    const R = rankScene({ a, b, rank: 2, name: 'LẠC', artId: 'peanut', artW: 540, tHash: hit(15, 0), tNum: hit(15, 1), tName: hit(15, 2), heroY: 880 });
    R.hero.move(hit(16, 1) - 0.1, 0.4, -30, -40).shake(tW, 0.5, 9)
      .add((t, s) => { const p = clamp((t - tF) / 0.3); s.o *= lerp(1, 0.4, p); });
    const tg = priceTag(R.sc, 2, 240, hit(16, 1), ts(16, 2), ts(16, 3) - 0.03);
    tg.out(hit(17, 7) - 0.12, 0.14);

    // warning: calories
    accents.push([tW, C.red]);
    flash(tW, 0.75, 0.6, 'redflash'); S(tW, 'alarm', 0.9); shake(tW, 12);
    const wn = art(R.sc, 'warn', 220, 846, 712);
    wn.pop(hit(17, 1), 0.3, 3).sway(6, 0.5).breathe(0.06, 0.45).out(tF - 0.02, 0.14);
    chip(R.sc, '100g LẠC', 262, 706, '', -6).pop(hit(17, 3)).out(tF - 0.02, 0.14);
    S(hit(17, 3), 'pop', 0.8);
    // 570 kcal card (counts up while "năm trăm bảy mươi" is spoken)
    const k0 = ts(17, 7), k1 = ts(17, 8) - 0.04;
    const kc = make(R.sc, { x: 540, y: 1092, html: `<div class="chip r" style="font-family:Anton;font-weight:400;font-size:176px;line-height:1.08;padding:0 44px 14px;border-radius:38px;border-width:9px;gap:18px"><span class="n">570</span><span style="font-size:.5em;line-height:1.05;text-align:left">KCAL<br><span style="opacity:.85">/100g</span></span></div>` });
    const kn = kc.el.querySelector('.n');
    kc.rot(-4).slam(hit(17, 7), 0.22, 3).pulse(k1, 0.12, 0.3)
      .add((t, s) => { const p = E.inOutCubic(clamp((t - (tF - 0.08)) / 0.4)); s.y += -334 * p; s.s *= lerp(1, 0.8, p); });
    kc.onRender = t => { const v = t >= k1 ? 570 : Math.round(lerp(0, 570, E.outCubic(clamp((t - k0) / (k1 - k0)))) / 10) * 10; kn.textContent = v; };
    shake(hit(17, 7), 22); S(hit(17, 7), 'stamp', 1); flash(hit(17, 7), 0.5, 0.5, 'redflash'); S(k1, 'ding', 0.7);
    for (let i = 0; i < 6; i++) S(k0 + (k1 - k0) * i / 6, 'tick', 0.5);

    // "ăn nhiều là BÉO chứ không phải TO"
    const beo = hd(R.sc, 'BÉO', { x: 316, y: 1085, w: 420, max: 250, anchor: 'c', cls: 'r' });
    beo.slam(hit(17, 12), 0.22, 3).add((t, s) => { const p = E.outBack(clamp((t - (hit(17, 12) + 0.16)) / 0.5), 2.2); s.sx *= lerp(1, 1.3, p); });
    shake(hit(17, 12), 18); S(hit(17, 12), 'thud', 1);
    art(R.sc, 'cross', 104, 608, 1096).rot(8).pop(hit(17, 14), 0.24, 3);
    const to = group(R.sc, 826, 1090);
    to.slam(hit(17, 16), 0.2, 2.6);
    hd(to, 'TO', { x: 0, y: 0, w: 300, max: 220, anchor: 'c' });
    const strike = make(to, { x: 0, y: 6, html: '<div style="width:300px;height:30px;border-radius:15px;background:#FF3B30;border:7px solid #17171C"></div>' });
    strike.rot(-14).add((t, s) => { const u = t - (hit(17, 16) + 0.1); if (u < 0) { s.o = 0; return; } s.sx *= E.outExpo(clamp(u / 0.2)); });
    S(hit(17, 14), 'pop', 0.8); S(hit(17, 16), 'thud', 0.9); S(hit(17, 16) + 0.1, 'swish', 0.8);
  }

  // =====================================================================================
  // 8. #1 ĐẬU NÀNH   (suspense -> reveal -> price -> comparison)
  //    "Còn top 1, | đậu nành khô. | 35 1 cân, 100 gam | có 36 gam đạm. | Mỗi gam chỉ khoảng 100 đồng, rẻ hơn trứng 4 lần, | rẻ hơn whey 10 lần."
  // =====================================================================================
  {
    const a = T_R1, b = T_COOK, R0 = ts(18, 3) - 0.05, tCmp = hit(20, 6) - 0.12;
    const sc = scene(a, b);
    CAP.cuts.push(a);
    accents.push([a, '#3A3A48']);
    accents.push([R0, C[1]]);
    LAD.cur[1] = a;
    // darkness + spotlight before the reveal
    const dark = make(sc, { x: 0, y: 0, anchor: 'tl', css: 'width:1080px;height:1920px;background:radial-gradient(520px 560px at 50% 49%, rgba(0,0,0,0) 0%, rgba(0,0,0,.82) 100%);' });
    dark.base = '';
    dark.fadeOut(R0, 0.12);

    const crown0 = art(sc, 'crown', 200, 540, 372);
    crown0.pop(hit(18, 1) - 0.04).sway(4, 1.3).out(R0 - 0.02, 0.1);
    const h0 = hd(sc, 'TOP 1', { y: 440, w: 520, max: 220, cls: 'y' });
    h0.slam(hit(18, 1)).pulse(hit(18, 2), 0.08, 0.2).out(R0 - 0.02, 0.1);
    S(hit(18, 1), 'thud', 0.9); sfx.push({ t: a + 0.02, type: 'riser', gain: 1, dur: R0 - (a + 0.02) - 0.04 });

    // everything about the winner lives in one group so it can fold into the comparison panel
    const G = group(sc, 540, 930);
    G.add((t, s) => { const p = E.inOutCubic(clamp((t - tCmp) / 0.34)); s.x += (130 - 540) * p; s.y += (702 - 930) * p; s.s *= lerp(1, 0.1, p); if (p >= 1) s.o = 0; });
    const sack = group(G, 0, 0);
    sack.pop(R0, 0.44, 2.8).float(8, 2.8);
    art(sack, 'soy', 540);
    art(sack, 'crown', 170, 150, -262).rot(18).pop(R0 + 0.28, 0.3, 3);
    // cloth: trembles harder and harder, then is whipped away on "đậu"
    const cl = group(G, 0, 30);
    cl.zoom(a, R0, 1, 1.13)
      .add((t, s) => { if (t < R0) { const k = clamp((t - a) / (R0 - a)); s.r += (1 + 4 * k) * Math.sin(2 * Math.PI * t / 0.13); s.x += 5 * k * Math.sin(2 * Math.PI * t / 0.09); } })
      .add((t, s) => { if (t >= R0) { const p = (t - R0) / 0.36; s.x += 900 * E.outQuad(clamp(p)); s.y += -1500 * p + 300 * p * p; s.r += 75 * p; if (p >= 1) s.o = 0; } });
    art(cl, 'cloth', 590);
    qmark(cl, 0, 50, 280).breathe(0.08, 0.5);
    flash(R0, 0.95, 0.3); shake(R0, 30, 0.5); S(R0, 'reveal', 1); S(R0 - 0.02, 'whoosh', 1);

    // beans burst out
    for (let i = 0; i < 44; i++) {
      const vx = (rnd(i * 3.7) - 0.5) * 1900, vy = -700 - rnd(i * 9.1 + 2) * 1500, sp = (rnd(i * 5.3 + 1) - 0.5) * 1500, sz = 34 + rnd(i * 2.2 + 5) * 30;
      const bn = make(sc, { x: 540 + (rnd(i * 1.1) - 0.5) * 200, y: 860, html: ART.svg(i % 3 ? 'bean' : 'bean2', Math.round(sz), { plain: true }) });
      bn.span(R0, R0 + 1.5).add((t, s) => { const u = t - R0; s.x += vx * u; s.y += vy * u + 0.5 * 3400 * u * u; s.r += sp * u; s.o *= clamp((1.45 - u) / 0.3); });
    }

    // title after the reveal: "#1" on "đậu", the name right after
    const rk = hd(sc, '#1', { x: 74, y: 326, w: 420, max: 250, anchor: 'tl', cls: 'g' });
    rk.slam(R0 + 0.02, 0.24, 3.2);
    const rw = textW('#1', 'Anton', 400, rk.size), nx = 74 + rw + 38;
    const nm = hd(sc, 'ĐẬU NÀNH', { x: nx, y: 326, w: 1004 - nx, max: 250, anchor: 'tl' });
    nm.el.style.top = 326 + (rk.size - nm.size) * 0.6 + 'px';
    nm.slam(R0 + 0.07, 0.22, 2.3).pulse(hit(18, 5), 0.06, 0.25);

    chip(G, '35.000đ<small>/ KG</small>', -270, -222, '', -6).pop(hit(19, 0)).out(tCmp - 0.02, 0.14);
    const c2 = chip(G, '36g ĐẠM<small>/ 100g</small>', 232, -84, 'g', 5);
    c2.pop(hit(19, 5)).pulse(hit(19, 6), 0.12, 0.3).out(tCmp - 0.02, 0.14);
    S(hit(19, 0), 'pop', 0.8); S(hit(19, 5), 'pop', 0.9);
    const c0 = ts(20, 4) - 0.14, c1 = ts(20, 5) - 0.03;
    const tg = tag(G, { x: -112, y: 196, val: 100, color: C[1], fs: 168, rot: 5, c0, c1 });
    tg.swing(hit(20, 2)).pulse(c1, 0.16, 0.34).sway(1.3, 2.6);
    S(hit(20, 2), 'swish', 0.8); S(c1, 'ding', 1);
    LAD.on[1] = c1;

    // comparison bars: 100 vs 460 vs 1.100  (bar lengths are proportional to the price)
    const PY = 824, RG = 128;
    const P = make(sc, { x: 540, y: PY, html: '<div style="width:968px;height:412px;border-radius:36px;background:rgba(16,16,21,.86);border:6px solid rgba(255,255,255,.2)"></div>' });
    P.slide(tCmp, 0.36, 0, 420);
    S(tCmp, 'whoosh', 0.7);
    const rows = [['soy', 86, 100, 1], ['tray', 104, 460, 5], ['whey', 62, 1100, 6]];
    const FULL = 590, X0 = 198;
    rows.forEach(([id, w, val, rank], i) => {
      const y = PY - RG + i * RG;
      art(sc, id, w, 130, y, { plain: true }).pop(tCmp + 0.2 + i * 0.06, 0.26);
      const bw = Math.max(54, FULL * val / 1100);
      const bar = make(sc, { x: X0, y, anchor: 'cl', html: `<div style="width:${bw}px;height:80px;border-radius:20px;background:${C[rank]};border:7px solid #17171C;box-shadow:6px 8px 0 rgba(0,0,0,.4)"></div>` });
      bar.add((t, s) => { const u = t - (tCmp + 0.2 + i * 0.07); if (u < 0) { s.o = 0; return; } s.sx *= E.outExpo(clamp(u / 0.5)); });
      const lb = make(sc, { x: X0 + bw + 20, y: y - 2, anchor: 'cl', html: `<div class="hd thin" style="font-size:64px;-webkit-text-stroke-width:9px;text-shadow:0 5px 0 var(--ink);color:${C[rank]}">${fmt(val)}<span style="font-size:.6em">đ</span></div>` });
      lb.pop(tCmp + 0.5 + i * 0.07, 0.26);
    });
    const x4 = stamp(sc, '×4', 836, PY, { rot: 8, size: 100, cls: 'g' });
    x4.slam(hit(20, 9), 0.2, 3.2);
    shake(hit(20, 9), 14); S(hit(20, 9), 'stamp', 0.9);
    // "rẻ hơn whey" -> "10 lần"
    const w1 = stamp(sc, 'RẺ HƠN WHEY', 336, 1142, { rot: -4, size: 92, cls: 'g' });
    w1.slam(hit(20, 11), 0.2, 2.8);
    const w2 = stamp(sc, '10 LẦN', 776, 1130, { rot: 5, size: 112, cls: 'y' });
    w2.slam(hit(20, 14), 0.2, 3.4);
    S(hit(20, 11), 'thud', 0.8); shake(hit(20, 14), 22); S(hit(20, 14), 'stamp', 1); flash(hit(20, 14), 0.3, 0.25);
  }

  // =====================================================================================
  // 9. COOK IT   "Nhớ nấu chín, luộc, | hầm, rang hoặc xay sữa. Đừng ăn sống. Và đừng bỏ trứng với ức gà, cứ trộn thêm đậu nành vào | là tiền đạm của mày giảm 1 nửa."
  // =====================================================================================
  {
    const a = T_COOK, m = T_MIX, b = T_TABLE;
    wipe(a, C.yellow, 0.3);
    // ---- 9a: must be cooked
    {
      const sc = scene(a, m);
      accents.push([a, C.yellow]);
      const h = hd(sc, 'PHẢI <span style="color:var(--yellow)">NẤU CHÍN</span>', { y: 330, w: 940, max: 230 });
      h.slam(hit(21, 0) + 0.02).pulse(hit(21, 2), 0.07, 0.25);
      S(hit(21, 0) + 0.02, 'thud', 0.9);
      const tRaw = hit(21, 9);
      const tiles = [['pot', 264, 'LUỘC', hit(21, 3)], ['claypot', 264, 'HẦM', hit(21, 4)], ['pan', 296, 'RANG', hit(21, 5)], ['milk', 196, 'XAY SỮA', hit(21, 7)]];
      const pos = [[290, 728], [790, 728], [290, 1026], [790, 1026]];
      tiles.forEach(([id, w, label, t0], i) => {
        const g = group(sc, pos[i][0], pos[i][1]);
        g.pop(t0, 0.3, 2.6).float(6, 2.4, i * 0.21).add((t, s) => { const p = clamp((t - tRaw) / 0.25); s.o *= lerp(1, 0.22, p); });
        art(g, id, w, 0, -40);
        chip(g, label, 0, 116, 'y', i % 2 ? 3 : -3).scale(0.96);
        S(t0, 'pop', 0.9);
      });
      // don't eat them raw
      const raw = group(sc, 540, 790);
      raw.slam(tRaw, 0.22, 2.6);
      art(raw, 'bean', 250, 0, 0);
      art(raw, 'cross', 300, 0, 0).rot(6).slam(hit(21, 11), 0.2, 3);
      const st = stamp(sc, 'ĐỪNG ĂN SỐNG', 540, 1046, { rot: -5, size: 140 });
      st.slam(tRaw + 0.02, 0.2, 3);
      shake(tRaw, 20); S(tRaw, 'stamp', 1); S(hit(21, 11), 'hit', 0.9); shake(hit(21, 11), 14); flash(tRaw, 0.45, 0.4, 'redflash');
    }
    // ---- 9b: keep eggs + chicken, add soybeans -> protein bill halves
    {
      const sc = scene(m, b);
      accents.push([m, C[1]]);
      flash(m, 0.4, 0.2); S(m - 0.06, 'whoosh', 0.7);
      const RY = 640;
      // headline follows the voice: "đừng bỏ ..." -> "... trộn thêm đậu nành"
      const hK = hd(sc, 'ĐỪNG BỎ', { y: 322, w: 520, max: 150 });
      hK.slam(hit(22, 1), 0.22, 2.4).out(hit(22, 8) - 0.06, 0.1);
      const hM = hd(sc, 'TRỘN THÊM <span style="color:var(--green)">ĐẬU NÀNH</span>', { y: 322, w: 940, max: 150 });
      hM.slam(hit(22, 8), 0.22, 2.4);
      S(hit(22, 1), 'thud', 0.8); S(hit(22, 8), 'thud', 0.8);
      const keep = `GIỮ ${ART.svg('check', 44, { plain: true })}`;
      const eg = group(sc, 205, RY); eg.pop(hit(22, 3), 0.3, 2.6).float(6, 2.3); art(eg, 'tray', 292);
      chip(sc, keep, 205, RY + 192, '', -3).scale(0.9).pop(hit(22, 3) + 0.1, 0.26);
      const ck = group(sc, 540, RY); ck.pop(hit(22, 5), 0.3, 2.6).float(6, 2.3, 0.3); art(ck, 'chicken', 292);
      chip(sc, keep, 540, RY + 192, '', 2).scale(0.9).pop(hit(22, 5) + 0.1, 0.26);
      const sy = group(sc, 872, RY - 8); sy.pop(hit(22, 10), 0.36, 3).float(6, 2.3, 0.6).pulse(hit(22, 12), 0.1, 0.3); art(sy, 'soy', 270);
      chip(sc, '+ THÊM', 872, RY + 192, 'g', -3).scale(0.9).pop(hit(22, 10) + 0.1, 0.26);
      art(sc, 'plus', 64, 372, RY).pop(hit(22, 4), 0.24);
      art(sc, 'plus', 80, 708, RY).pop(hit(22, 8), 0.26, 3).pulse(hit(22, 9), 0.3, 0.3);
      S(hit(22, 3), 'pop', 0.9); S(hit(22, 5), 'pop', 0.9); S(hit(22, 8), 'pop', 0.7); S(hit(22, 10), 'ding', 0.9);
      // result
      const lab = hd(sc, 'TIỀN ĐẠM', { x: 268, y: 1020, w: 400, max: 170, anchor: 'c' });
      lab.slam(hit(22, 14), 0.22, 2.4);
      S(hit(22, 14), 'thud', 0.8);
      const t50 = hit(22, 18), tEnd = ts(22, 20) + 0.08;
      const pc = hd(sc, '−50%', { x: 716, y: 1066, w: 430, max: 290, anchor: 'c', cls: 'g' });
      const pn = pc.el.firstChild;
      pc.slam(t50, 0.22, 3).pulse(tEnd, 0.14, 0.34);
      pc.onRender = t => { const v = t >= tEnd ? 50 : Math.round(lerp(0, 50, E.outCubic(clamp((t - t50) / (tEnd - t50))))); pn.textContent = '−' + v + '%'; };
      shake(t50, 20); S(t50, 'stamp', 1); S(tEnd, 'ding', 1);
      for (let i = 0; i < 5; i++) S(t50 + (tEnd - t50) * i / 5, 'tick', 0.5);
      // coins: half of them fly away
      for (let i = 0; i < 6; i++) {
        const cn = art(sc, 'coin', 74, 104 + i * 64, 1172, { plain: true });
        cn.pop(hit(22, 14) + 0.04 * i, 0.24);
        if (i >= 3) cn.add((t, s) => { const u = t - (t50 + 0.07 * (i - 3)); if (u > 0) { const p = clamp(u / 0.5); s.y += -260 * p + 700 * p * p; s.x += 160 * p; s.r += 300 * p; s.o *= 1 - E.inCubic(p); } });
      }
    }
  }

  // =====================================================================================
  // 10. FINAL TABLE   (builds fast, then stands still for screenshots)
  //     "Lưu video này lại, mai đi chợ khỏi bị hớ. | Mày đang ăn món hạng mấy? Comment tao xem."
  // =====================================================================================
  {
    const a = T_TABLE;
    wipe(a, C.yellow, 0.3);
    const sc = scene(a, END + 1);
    accents.push([a, C.yellow]);
    LAD.hide = a;
    CAP.top.push([a, 1262]);
    const h = hd(sc, '<span style="color:var(--yellow)">GIÁ</span> 1 GRAM ĐẠM', { x: 496, y: 196, w: 896, max: 230 });
    h.slam(a + 0.05, 0.22, 2);
    const data = [[1, 'ĐẬU NÀNH', 100, 'soy', 96], [2, 'LẠC', 240, 'peanut', 124], [3, 'ỨC GÀ', 330, 'chicken', 124], [4, 'ĐẬU PHỤ', 370, 'tofu', 124], [5, 'TRỨNG', 460, 'tray', 126], [6, 'WHEY', 1100, 'whey', 74]];
    const y0 = 196 + h.h + 14, RH = 126, GAP = 12;
    data.forEach(([rank, name, val, id, w], i) => {
      const TW = 896, bw = Math.round(18 + (TW - 124 - 18) * val / 1100);
      const row = make(sc, { x: 48, y: y0 + i * (RH + GAP), anchor: 'tl', html: `<div class="trow" style="width:${TW}px;height:${RH}px;margin:0">
          <div class="rk" style="background:${C[rank]};align-self:stretch;display:flex;align-items:center;justify-content:center;border-right:5px solid #17171C">${rank}</div>
          <div style="position:absolute;left:124px;bottom:0;height:14px;width:${bw}px;background:${C[rank]};border-radius:0 8px 0 0"></div>
          <div class="ic">${ART.svg(id, w, { plain: true })}</div>
          <div class="nm">${name}</div>
          <div class="pr" style="color:${C[rank]}">~${fmt(val)}<i>đ/g</i></div></div>` });
      row.slide(a + 0.08 + i * 0.06, 0.34, 760, 0);
      S(a + 0.08 + i * 0.06, 'tick', 0.9);
    });
    const yEnd = y0 + 6 * (RH + GAP);
    const note = make(sc, { x: 940, y: yEnd - 4, anchor: 'tr', html: '<div style="font-weight:700;font-size:27px;color:rgba(255,255,255,.62);letter-spacing:.02em">* Giá ước tính · tiền mua ÷ số gram đạm</div>' });
    note.fade(a + 0.5, 0.3);
    // save + comment cues (outside the table, so the table itself stays still)
    const bm = art(sc, 'bookmark', 84, 172, 1380);
    bm.pop(hit(23, 0), 0.3, 3).add((t, s) => { const u = t - hit(23, 0); if (u > 0 && t < hit(24, 0)) s.y += -14 * Math.abs(Math.sin(Math.PI * u / 0.5)); }).out(hit(24, 0) - 0.1, 0.14);
    S(hit(23, 0), 'ding', 0.9);
    const bb = art(sc, 'bubble', 104, 196, 1380);
    bb.pop(hit(24, 6), 0.3, 3).add((t, s) => { const u = t - hit(24, 6); if (u > 0) s.y += -14 * Math.abs(Math.sin(Math.PI * u / 0.5)); });
    S(hit(24, 6), 'pop', 1);
  }

  window.SCENES_END = END;
  window.CUTS = { T_TEASE, T_SETUP, T_R6, T_R5, T_R4, T_R3, T_R2, T_R1, T_COOK, T_MIX, T_TABLE };
})();
