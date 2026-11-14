/* Hand-drawn SVG illustration set (sticker style) for the protein price ranking video.
   Every illustration is a <symbol>; use ART.sticker(id, size) to place one. */
(function () {
  const INK = '#17171C';
  const O = `stroke="${INK}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"`;
  const Othin = `stroke="${INK}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;

  // ---- single soybean (reused a lot)
  const bean = (x, y, r = 22, rot = 0, tone = 0) => {
    const fills = ['#EFD084', '#E7C473', '#F4DA98'];
    return `<g transform="translate(${x} ${y}) rotate(${rot})">
      <ellipse rx="${r}" ry="${r * 0.88}" fill="${fills[tone % 3]}" stroke="${INK}" stroke-width="5.5"/>
      <ellipse cx="${-r * 0.32}" cy="${-r * 0.36}" rx="${r * 0.3}" ry="${r * 0.17}" transform="rotate(-28)" fill="#fff" opacity=".65"/>
      <ellipse cx="${r * 0.42}" cy="${r * 0.12}" rx="${r * 0.2}" ry="${r * 0.09}" transform="rotate(62 ${r * 0.42} ${r * 0.12})" fill="#6E4E26"/>
    </g>`;
  };

  // ---- egg shape (shared by egg + tray)
  const EGG_D = 'M150 18C226 18 284 136 284 232C284 312 224 364 150 364C76 364 16 312 16 232C16 136 74 18 150 18Z';
  const eggBody = (fill = '#F5DAB5', shade = '#E3B98B') => `
    <path d="${EGG_D}" fill="${fill}" ${O}/>
    <path d="M262 176C278 226 272 292 226 330C194 356 146 362 106 344C166 352 222 322 246 268C260 236 264 206 262 176Z" fill="${shade}"/>
    <ellipse cx="98" cy="126" rx="24" ry="44" transform="rotate(24 98 126)" fill="#fff" opacity=".8"/>
    <ellipse cx="72" cy="198" rx="9" ry="15" transform="rotate(12 72 198)" fill="#fff" opacity=".65"/>`;

  const symbols = {};

  symbols.egg = { vb: '0 0 300 382', body: eggBody() };

  // ---- egg tray: 2 rows x 3 eggs in a pulp carton
  symbols.tray = {
    vb: '0 0 560 400',
    body: `
    <path d="M40 232C40 214 54 200 72 200H488C506 200 520 214 520 232L506 352C504 370 490 384 472 384H88C70 384 56 370 54 352Z" fill="#A88E6C" ${O}/>
    ${[0, 1, 2].map(i => `<g transform="translate(${112 + i * 150} 44) scale(.44)">${eggBody('#F7E2C3', '#E6C29A')}</g>`).join('')}
    <path d="M24 250C24 232 38 218 56 218H504C522 218 536 232 536 250L520 356C518 374 504 388 486 388H74C56 388 42 374 40 356Z" fill="#C4AB88" ${O}/>
    ${[0, 1, 2].map(i => `<g transform="translate(${52 + i * 152} 96) scale(.52)">${eggBody()}</g>`).join('')}
    <path d="M24 262C24 244 38 230 56 230H112C122 262 138 282 160 290H24Z M536 262V290H400C422 282 438 262 448 230H504C522 230 536 244 536 262Z" fill="#C4AB88"/>
    <path d="M26 288H534L520 356C518 374 504 388 486 388H74C56 388 42 374 40 356Z" fill="#B99E79" ${O}/>
    <path d="M196 288C200 306 214 318 232 318C250 318 264 306 268 288M348 288C352 306 366 318 384 318C402 318 416 306 420 288" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity=".35"/>
    <rect x="62" y="340" width="436" height="14" rx="7" fill="#000" opacity=".12"/>`,
  };

  // ---- whey tub
  symbols.whey = {
    vb: '0 0 340 440',
    body: `
    <path d="M46 118H294V380C294 400 278 416 258 416H82C62 416 46 400 46 380Z" fill="#24242C" ${O}/>
    <rect x="51" y="182" width="238" height="172" fill="#E5383B"/>
    <rect x="51" y="182" width="238" height="15" fill="#FFD60A"/>
    <rect x="51" y="339" width="238" height="15" fill="#FFD60A"/>
    <text x="170" y="276" text-anchor="middle" font-family="Anton" font-size="84" fill="#fff" letter-spacing="2">WHEY</text>
    <text x="172" y="320" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="25" fill="#fff" letter-spacing="7">PROTEIN</text>
    <rect x="66" y="134" width="20" height="268" rx="10" fill="#fff" opacity=".2"/>
    <rect x="252" y="124" width="37" height="286" fill="#000" opacity=".22"/>
    <path d="M46 118H294V380C294 400 278 416 258 416H82C62 416 46 400 46 380Z" fill="none" ${O}/>
    <rect x="28" y="30" width="284" height="100" rx="24" fill="#C1121F" ${O}/>
    <g stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity=".32">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M${58 + i * 28} 62V112"/>`).join('')}</g>
    <rect x="44" y="42" width="252" height="15" rx="7.5" fill="#fff" opacity=".35"/>`,
  };

  // ---- tofu: two blocks on a plate
  const tofuBlock = (dx, dy, s = 1) => `<g transform="translate(${dx} ${dy}) scale(${s})">
      <path d="M20 96L170 52L330 96V200L170 252L20 200Z" fill="#EFE5C8" ${O}/>
      <path d="M170 142L330 96V200L170 252Z" fill="#DDD0AC"/>
      <path d="M20 96L170 52L330 96L170 142Z" fill="#FFFBEE"/>
      <path d="M20 96L170 142L330 96M170 142V252" fill="none" ${Othin}/>
      <path d="M20 96L170 52L330 96V200L170 252L20 200Z" fill="none" ${O}/>
      <g fill="#CBBE98"><circle cx="70" cy="150" r="5"/><circle cx="112" cy="196" r="4"/><circle cx="52" cy="184" r="3.5"/><circle cx="238" cy="170" r="5"/><circle cx="284" cy="150" r="4"/><circle cx="212" cy="214" r="3.5"/></g>
      <path d="M62 96L170 66" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".9"/>
    </g>`;
  symbols.tofu = {
    vb: '0 0 520 400',
    body: `
    <ellipse cx="260" cy="304" rx="244" ry="82" fill="#2D7FA8" ${O}/>
    <ellipse cx="260" cy="294" rx="196" ry="58" fill="#58B6D9"/>
    <ellipse cx="260" cy="294" rx="196" ry="58" fill="none" stroke="${INK}" stroke-width="5" opacity=".3"/>
    ${tofuBlock(150, 16, 0.86)}
    ${tofuBlock(60, 104, 0.98)}`,
  };

  // ---- chicken breast on a foam tray
  symbols.chicken = {
    vb: '0 0 520 400',
    body: `
    <path d="M36 122C36 96 56 76 82 76H438C464 76 484 96 484 122V300C484 326 464 346 438 346H82C56 346 36 326 36 300Z" fill="#F3F4F7" ${O}/>
    <path d="M70 126C70 112 82 100 96 100H424C438 100 450 112 450 126V296C450 310 438 322 424 322H96C82 322 70 310 70 296Z" fill="#DDE0E7"/>
    <path d="M112 226C96 160 150 112 228 112C312 112 398 136 420 198C438 250 392 296 318 300C270 303 244 284 204 284C160 284 124 270 112 226Z" fill="#F4A79D" ${O}/>
    <path d="M150 216C144 172 184 140 236 140C300 140 364 156 384 196C352 170 300 164 252 170C204 176 168 192 150 216Z" fill="#FBD0C8"/>
    <path d="M196 262C246 272 318 268 372 232" fill="none" stroke="#D97F77" stroke-width="9" stroke-linecap="round"/>
    <path d="M140 232C150 252 170 262 190 262" fill="none" stroke="#D97F77" stroke-width="7" stroke-linecap="round" opacity=".7"/>
    <path d="M176 164C196 148 222 142 246 142" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".9"/>
    <path d="M396 190C404 212 400 236 384 254" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>`,
  };

  // ---- peanuts: two pods + kernels
  const POD = 'M34 120C20 74 56 30 104 38C134 43 150 66 178 68C208 70 226 48 262 54C316 64 338 126 306 168C282 200 240 198 212 182C190 169 168 172 144 186C98 212 50 178 34 120Z';
  const pod = (tx, ty, rot, s, tone) => `<g transform="translate(${tx} ${ty}) rotate(${rot}) scale(${s})">
      <path d="${POD}" fill="${tone ? '#D49A4C' : '#E0AC62'}" ${O}/>
      <g fill="none" stroke="#A9742F" stroke-width="5.5" stroke-linecap="round" opacity=".85">
        <path d="M62 92C92 70 120 74 144 98"/><path d="M60 136C92 116 122 122 150 150"/><path d="M92 58C98 96 96 138 88 176"/>
        <path d="M202 94C232 76 266 84 290 110"/><path d="M204 142C236 128 268 134 292 158"/><path d="M244 66C252 100 250 142 242 180"/>
        <path d="M150 100C164 108 176 108 192 98"/><path d="M152 150C168 142 180 142 196 150"/>
      </g>
      <path d="M70 66C84 54 100 52 112 56" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".7"/>
    </g>`;
  const kernel = (x, y, rot, s = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
      <ellipse rx="40" ry="27" fill="#B4513A" ${Othin}/>
      <path d="M-30 -2C-10 -8 12 -8 32 -2" fill="none" stroke="#7E3122" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="-12" cy="-13" rx="13" ry="5" transform="rotate(-10)" fill="#fff" opacity=".55"/>
    </g>`;
  symbols.peanut = {
    vb: '0 0 520 400',
    body: `
    ${pod(172, 20, 14, 0.98, 1)}
    ${pod(24, 110, -12, 1.12, 0)}
    ${kernel(404, 300, -18, 1.05)}
    ${kernel(318, 346, 12, 0.95)}
    ${kernel(454, 228, 38, 0.82)}`,
  };

  // ---- dried soybeans in a burlap sack
  const heap = [
    [150, 190, 4], [198, 196, 1], [246, 200, 0], [294, 196, 2], [342, 190, 1],
    [126, 162, 0], [172, 160, 2], [220, 166, 1], [268, 166, 0], [316, 160, 2], [360, 164, 0],
    [150, 130, 1], [196, 126, 0], [244, 130, 2], [292, 126, 1], [336, 132, 0],
    [176, 96, 2], [222, 92, 1], [268, 94, 0], [312, 100, 2],
    [204, 62, 0], [250, 58, 1], [294, 66, 2], [230, 30, 2], [272, 34, 0],
  ];
  symbols.soy = {
    vb: '0 0 500 470',
    body: `
    <path d="M84 206C58 270 50 356 76 412C86 434 106 446 130 446H370C394 446 414 434 424 412C450 356 442 270 416 206Z" fill="#C9A069" ${O}/>
    <path d="M360 216C388 280 392 360 372 440H370C394 446 414 434 424 412C450 356 442 270 416 206Z" fill="#B0844C"/>
    <g stroke="#9B7440" stroke-width="5" stroke-linecap="round" opacity=".7">
      <path d="M112 262h26M168 262h26M224 262h26M280 262h26M336 262h26"/>
      <path d="M96 412h26M152 412h26M208 412h26M264 412h26M320 412h26M376 412h20"/>
    </g>
    <text x="246" y="366" text-anchor="middle" font-family="Anton" font-size="66" fill="#5A3E1B" opacity=".88" letter-spacing="2">ĐẬU NÀNH</text>
    <path d="M84 206C58 270 50 356 76 412C86 434 106 446 130 446H370C394 446 414 434 424 412C450 356 442 270 416 206Z" fill="none" ${O}/>
    <path d="M106 204C140 100 204 12 250 12C298 12 362 100 394 204Z" fill="#D9B45F" ${O}/>
    ${heap.map(([x, y, tone], i) => bean(x, y, 25, (i * 47) % 180 - 90, tone)).join('')}
    <path d="M58 204C58 182 76 172 100 176C150 186 350 186 400 176C424 172 442 182 442 204C442 228 424 238 400 234C350 226 150 226 100 234C76 238 58 228 58 204Z" fill="#DDB77E" ${O}/>
    <path d="M84 196C150 204 350 204 416 196" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".5"/>
    ${bean(40, 430, 22, 20, 0)}${bean(462, 438, 21, -30, 2)}${bean(86, 452, 18, 60, 1)}`,
  };
  symbols.bean = { vb: '-30 -30 60 60', body: bean(0, 0, 24, 0, 0) };
  symbols.bean2 = { vb: '-30 -30 60 60', body: bean(0, 0, 24, 0, 2) };

  // ---- gingham cloth covering the mystery item
  symbols.cloth = {
    vb: '0 0 500 470',
    defs: `<pattern id="gingham" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
        <rect width="64" height="64" fill="#fff"/><rect width="64" height="32" fill="#E5383B" opacity=".55"/><rect width="32" height="64" fill="#E5383B" opacity=".55"/>
      </pattern>
      <clipPath id="clothClip"><path d="M52 440C26 330 60 146 250 104C440 146 474 330 448 440C430 418 408 452 380 432C352 412 326 452 296 432C268 414 240 452 210 432C182 414 154 452 124 432C100 416 76 446 52 440Z"/></clipPath>`,
    body: `
    <path d="M52 440C26 330 60 146 250 104C440 146 474 330 448 440C430 418 408 452 380 432C352 412 326 452 296 432C268 414 240 452 210 432C182 414 154 452 124 432C100 416 76 446 52 440Z" fill="url(#gingham)" ${O}/>
    <g clip-path="url(#clothClip)">
      <path d="M250 104C330 180 400 300 448 440L520 440L520 60Z" fill="#000" opacity=".12"/>
      <path d="M250 110C210 200 160 320 124 434" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" opacity=".22"/>
      <path d="M262 112C284 210 296 330 296 432" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" opacity=".22"/>
      <path d="M276 116C330 200 366 320 380 430" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" opacity=".22"/>
      <path d="M150 190C120 250 100 320 92 380" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".7"/>
    </g>
    <path d="M52 440C26 330 60 146 250 104C440 146 474 330 448 440C430 418 408 452 380 432C352 412 326 452 296 432C268 414 240 452 210 432C182 414 154 452 124 432C100 416 76 446 52 440Z" fill="none" ${O}/>`,
  };

  // ---- cooking icons (boil / stew / roast / soy milk)
  const steam = (x, y) => `<path d="M${x} ${y}c-14-16 14-26 0-44M${x + 34} ${y}c-14-16 14-26 0-44M${x + 68} ${y}c-14-16 14-26 0-44" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".9"/>`;
  symbols.pot = {
    vb: '0 0 260 250',
    body: `${steam(96, 62)}
    <path d="M18 110h30M212 110h30" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M18 110h30M212 110h30" stroke="#7C8B99" stroke-width="10" stroke-linecap="round"/>
    <path d="M44 92H216V200C216 220 200 236 180 236H80C60 236 44 220 44 200Z" fill="#A9B8C6" ${O}/>
    <path d="M176 96H212V200C212 218 198 232 180 232H176Z" fill="#000" opacity=".14"/>
    <rect x="34" y="78" width="192" height="26" rx="13" fill="#C9D4DE" ${O}/>
    <rect x="62" y="110" width="14" height="96" rx="7" fill="#fff" opacity=".6"/>
    ${bean(110, 150, 15, 10, 0)}${bean(150, 172, 15, -30, 2)}${bean(124, 198, 14, 50, 1)}${bean(172, 132, 13, 80, 1)}`,
  };
  symbols.claypot = {
    vb: '0 0 260 250',
    body: `${steam(96, 52)}
    <path d="M30 132C30 112 46 104 66 104H194C214 104 230 112 230 132C230 190 200 236 130 236C60 236 30 190 30 132Z" fill="#A65A32" ${O}/>
    <path d="M182 110C206 114 226 118 228 134C226 188 198 230 136 234C176 214 196 160 182 110Z" fill="#000" opacity=".16"/>
    <path d="M40 118C40 86 80 68 130 68C180 68 220 86 220 118Z" fill="#BF6C3E" ${O}/>
    <rect x="108" y="46" width="44" height="28" rx="12" fill="#8A4725" ${O}/>
    <path d="M64 100C78 88 100 82 122 82" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".5"/>
    <path d="M20 130h22M218 130h22" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M20 130h22M218 130h22" stroke="#8A4725" stroke-width="9" stroke-linecap="round"/>`,
  };
  symbols.pan = {
    vb: '0 0 300 250',
    body: `
    <path d="M186 150L286 96" stroke="${INK}" stroke-width="34" stroke-linecap="round"/><path d="M196 144L284 97" stroke="#5B4636" stroke-width="20" stroke-linecap="round"/>
    <ellipse cx="118" cy="160" rx="106" ry="62" fill="#2B2B33" ${O}/>
    <ellipse cx="118" cy="152" rx="84" ry="44" fill="#4A4A55"/>
    ${bean(80, 150, 15, 10, 0)}${bean(118, 136, 15, -30, 2)}${bean(152, 156, 15, 50, 1)}${bean(110, 172, 14, 80, 0)}${bean(60, 172, 12, 0, 2)}${bean(160, 128, 12, 120, 0)}
    <path d="M70 70l-10-26M118 58v-30M166 70l10-26" stroke="#FFD60A" stroke-width="9" stroke-linecap="round"/>`,
  };
  symbols.milk = {
    vb: '0 0 220 260',
    body: `
    <path d="M150 18L128 150" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M150 18L128 150" stroke="#E5383B" stroke-width="12" stroke-linecap="round"/>
    <path d="M40 60H180L164 228C163 240 153 248 141 248H79C67 248 57 240 56 228Z" fill="#DFF3FA" fill-opacity=".55" ${O}/>
    <path d="M47 104H173L163 226C162 236 154 242 144 242H76C66 242 58 236 57 226Z" fill="#FFF3D2"/>
    <path d="M47 104C68 92 90 116 110 104C130 92 152 116 173 104" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
    <path d="M40 60H180L164 228C163 240 153 248 141 248H79C67 248 57 240 56 228Z" fill="none" ${O}/>
    <rect x="62" y="118" width="12" height="96" rx="6" fill="#fff" opacity=".85"/>`,
  };

  // ---- UI icons
  const PLUS_D = 'M78 8H122V78H192V122H122V192H78V122H8V78H78Z';
  symbols.cross = {
    vb: '0 0 200 200',
    body: `<g transform="rotate(45 100 100)"><path d="${PLUS_D}" fill="#FF3B30" stroke="${INK}" stroke-width="11" stroke-linejoin="round"/><path d="M90 22V70M30 90H70" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".45"/></g>`,
  };
  symbols.check = {
    vb: '-14 2 232 208',
    body: `<path d="M24 108L78 162L178 46" fill="none" stroke="${INK}" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 108L78 162L178 46" fill="none" stroke="#2EE66B" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
  symbols.warn = {
    vb: '0 0 220 200',
    body: `<path d="M110 16L208 180H12Z" fill="#FFD60A" ${O}/><rect x="98" y="70" width="24" height="60" rx="10" fill="${INK}"/><circle cx="110" cy="152" r="13" fill="${INK}"/>`,
  };
  symbols.crown = {
    vb: '0 0 240 180',
    body: `<path d="M20 160L10 46L74 98L120 14L166 98L230 46L220 160Z" fill="#FFD60A" ${O}/><path d="M32 132H208" stroke="${INK}" stroke-width="7" stroke-linecap="round" opacity=".4"/><circle cx="120" cy="112" r="13" fill="#E5383B" ${Othin}/><circle cx="66" cy="120" r="9" fill="#fff" ${Othin}/><circle cx="174" cy="120" r="9" fill="#fff" ${Othin}/>`,
  };
  symbols.bookmark = {
    vb: '0 0 160 200',
    body: `<path d="M24 28C24 16 34 8 46 8H114C126 8 136 16 136 28V186L80 142L24 186Z" fill="#FFD60A" ${O}/><path d="M48 36H98" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/>`,
  };
  symbols.bubble = {
    vb: '0 0 220 200',
    body: `<path d="M110 14C164 14 208 50 208 96C208 142 164 178 110 178C96 178 82 175 70 170L24 188L40 146C22 132 12 114 12 96C12 50 56 14 110 14Z" fill="#fff" ${O}/><circle cx="68" cy="96" r="13" fill="${INK}"/><circle cx="110" cy="96" r="13" fill="${INK}"/><circle cx="152" cy="96" r="13" fill="${INK}"/>`,
  };
  symbols.dumbbell = {
    vb: '0 0 320 160',
    body: `<rect x="60" y="64" width="200" height="32" rx="10" fill="#C9D4DE" ${O}/>
    <rect x="34" y="14" width="52" height="132" rx="16" fill="#3A3A45" ${O}/><rect x="234" y="14" width="52" height="132" rx="16" fill="#3A3A45" ${O}/>
    <rect x="6" y="40" width="34" height="80" rx="12" fill="#24242C" ${O}/><rect x="280" y="40" width="34" height="80" rx="12" fill="#24242C" ${O}/>
    <rect x="46" y="26" width="10" height="70" rx="5" fill="#fff" opacity=".3"/><rect x="246" y="26" width="10" height="70" rx="5" fill="#fff" opacity=".3"/>`,
  };
  symbols.anger = {
    vb: '0 0 200 200',
    body: `<g fill="none" stroke="${INK}" stroke-width="42" stroke-linecap="round"><path d="M30 76C62 76 76 62 76 30"/><path d="M124 30C124 62 138 76 170 76"/><path d="M170 124C138 124 124 138 124 170"/><path d="M76 170C76 138 62 124 30 124"/></g>
    <g fill="none" stroke="#FF3B30" stroke-width="24" stroke-linecap="round"><path d="M30 76C62 76 76 62 76 30"/><path d="M124 30C124 62 138 76 170 76"/><path d="M170 124C138 124 124 138 124 170"/><path d="M76 170C76 138 62 124 30 124"/></g>`,
  };
  symbols.plus = {
    vb: '0 0 200 200',
    body: `<path d="${PLUS_D}" fill="#fff" stroke="${INK}" stroke-width="11" stroke-linejoin="round"/>`,
  };
  symbols.arrow = {
    vb: '0 0 200 220',
    body: `<path d="M70 14H130V112H180L100 206L20 112H70Z" fill="#FFD60A" ${O}/>`,
  };
  symbols.coin = {
    vb: '0 0 120 120',
    body: `<circle cx="60" cy="60" r="52" fill="#FFD60A" ${Othin}/><circle cx="60" cy="60" r="38" fill="none" stroke="#C99700" stroke-width="5"/><text x="60" y="82" text-anchor="middle" font-family="Anton" font-size="62" fill="#8A6500">đ</text>`,
  };

  // ---- build the hidden <svg> with all symbols + the sticker filter
  let defs = `<filter id="stk" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="5.5" result="b"/>
      <feComponentTransfer in="b" result="d"><feFuncA type="linear" slope="26" intercept="-0.9"/></feComponentTransfer>
      <feFlood flood-color="#fff" result="w"/><feComposite in="w" in2="d" operator="in" result="border"/>
      <feOffset in="d" dx="7" dy="11" result="so"/><feFlood flood-color="#000" flood-opacity=".42" result="k"/><feComposite in="k" in2="so" operator="in" result="shadow"/>
      <feMerge><feMergeNode in="shadow"/><feMergeNode in="border"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;
  let syms = '';
  for (const [id, s] of Object.entries(symbols)) {
    if (s.defs) defs += s.defs;
    syms += `<symbol id="a-${id}" viewBox="${s.vb}" overflow="visible">${s.body}</symbol>`;
  }
  const host = document.createElement('div');
  host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  host.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>${defs}</defs>${syms}</svg>`;
  document.documentElement.appendChild(host);

  window.ART = {
    symbols,
    /** inline svg markup for an illustration; w = display width in px */
    svg(id, w, opts = {}) {
      const [, , vw, vh] = symbols[id].vb.split(' ').map(Number);
      const h = Math.round(w * vh / vw);
      const pad = opts.plain ? 0 : Math.round(w * 0.14);
      const flt = opts.plain ? '' : ' filter="url(#stk)"';
      // viewBox is padded so the sticker border / shadow are not clipped
      const pv = pad * vw / w;
      return `<svg class="art${opts.cls ? ' ' + opts.cls : ''}" width="${w + pad * 2}" height="${h + pad * 2}" viewBox="${-pv} ${-pv} ${vw + pv * 2} ${vh + pv * 2}" style="margin:${-pad}px;display:block;overflow:visible"><g${flt}><use href="#a-${id}" x="0" y="0" width="${vw}" height="${vh}"/></g></svg>`;
    },
  };
})();
