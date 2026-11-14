---
name: "tiktok-gym-clip"
description: "Làm clip TikTok về gym, dinh dưỡng, giảm cân: tìm hook, viết kịch bản, viết bản đọc cho OmniVoice Studio, đọc bản đọc bằng OmniVoice Studio, và dựng video dọc 9:16 khớp từng từ với bản thu âm người dùng gửi. Dùng kĩ năng này mỗi khi người dùng nhắc tới clip/video TikTok, kịch bản, hook, bản đọc, OmniVoice, file thu âm .wav cần dựng hình, hoặc muốn làm tiếp một clip gym/ăn uống, kể cả khi họ không nói tên kĩ năng."
---

# TikTok gym clip: hook → kịch bản → bản đọc → giọng đọc → video

The user makes short Vietnamese TikTok clips about gym, nutrition and fat loss. Reply in Vietnamese, in the casual register the user uses ("mày/tao" is fine when they use it). The work has five stages; the user usually asks for them one at a time, so do only the stage asked for and offer the next one in a line.

## 1. Hook and topic

- A good hook breaks a common belief with a concrete number (price per gram of protein, calories in a drink vs. kilometres of running).
- Give one main pick with the reason it holds attention, gets saved and gets shared, then up to five short backups.
- Every number must be true or clearly an estimate. Do the arithmetic. Do not invent statistics such as "90% dân gym"; write "hầu hết" instead.
- Do not state absolutes that are false ("đừng chạy bộ"); soften to what is true ("đừng CHỈ dựa vào chạy bộ").
- List which numbers are estimates and tell the user to check local prices before filming.

## 2. Script (kịch bản)

- 45 to 55 seconds, 8 or so scenes.
- Table with columns: Giây | Lời thoại | Hình và chữ trên màn hình.
- Structure: hook in the first 3 to 5 seconds, a promise to stay, the build-up or countdown, the payoff, practical steps, then a call to save and share. End on a still summary frame people can screenshot (hold it at least 2 seconds).
- Add a caption line with hashtags.

## 3. Voiceover text for OmniVoice Studio

Give one plain-text block in a code fence, ready to paste. Rules:

- Spell every number out in words.
- Write "ngàn", never "nghìn" (OmniVoice cannot read "nghìn").
- Write sounds the way they should be read: "ca lo", "tóp một", "gam".
- Short sentences. Use commas and full stops for pauses, a blank line between scenes.
- No emoji, no symbols, no digits.
- Mention words the voice may misread ("whey", "gym", "comment") and give a phonetic fallback ("quây", "dim", "com men").

Save the block as `ban-doc.txt` too when you have a filesystem, so stage 4 can use it directly.

## 4. Read it with OmniVoice Studio (only on the user's own computer)

OmniVoice Studio (now also called VoiceStudio) serves a local API at `http://localhost:3900` while the desktop app is open. `scripts/omnivoice_tts.py` calls it with the Python standard library only:

```bash
python3 SKILL/scripts/omnivoice_tts.py --check            # app reachable?
python3 SKILL/scripts/omnivoice_tts.py --voices           # pick a voice
python3 SKILL/scripts/omnivoice_tts.py ban-doc.txt -o voice.wav --voice <voice> --split
```

- This works only where the app runs. A cloud session cannot reach the user's `localhost`: then say so in one line, give the exact command for them to run (or suggest continuing in a session on their computer: Claude desktop app or Remote Control), and continue with what does not need it.
- `--split` reads each scene (blank line) separately and joins them with a short silence; it keeps long texts stable.
- If a call fails the script prints the server's answer: read it and adjust `--model`, `--voice` or `--extra '{"language":"vi"}'` rather than guessing. The app also has a built-in MCP server (`http://localhost:3900/mcp/`) the user can add to Claude on that computer.
- Listen for misread words before going on; fix them in `ban-doc.txt` and read again.

## 5. Video from the recording

Output: 1080×1920, 30 fps, H.264 + AAC MP4 with the user's audio untouched in time. The full procedure, with every command, is in `references/video-pipeline.md` — read it before starting. The short version:

1. **Project from the template**: `cp -r SKILL/assets/template PROJ`. A finished example clip (scenes, transcript, captions) is in `SKILL/assets/example-gia-1-gram-dam/`; read its `scenes.js` first.
2. **Timing** with `scripts/align/align_voice.py` (`transcribe`, then `align` with a `spoken.txt` of what was actually said). It places every syllable on its vowel onset measured from the recording; speech-recognition timestamps alone are 50–150 ms early and confuse breaths, which viewers notice. Models: `scripts/align/fetch_models.sh` (Hugging Face is blocked in the cloud sandbox; this host is not). Without models, use the manual `||` mode.
3. **Check the alignment by eye** on `work/plots/` (spectrogram pages) and pin any wrong beat. Do not skip this: it is what makes "khớp với bản thu" true.
4. **Captions + timing.js** with `tools/build_timing.py`, then write `src/scenes.js`: every effect hangs on `hit(sentence, word)`, never on hand-typed seconds. One idea on screen per sentence; numbers count up while they are spoken, crosses slam on the word, items pop when named; scene cuts go in the pause before a sentence (`cutBefore`).
5. **Preview** the busiest frame of each scene (`tools/sheet.cjs`), fix overlaps, keep content inside the TikTok safe zone (y 150–1500, ~130 px clear on the right below y 880).
6. **Audio, render, encode**: `tools/export_sfx.cjs` → `tools/make_audio.py` (voice to ~-14 LUFS, synthesized light effects, processing latency removed) → `tools/render.cjs` (parallel, ~3 min per minute of video) → `tools/encode.sh`. Also make a voice-only version.
7. **Verify before handing over**: `tools/sync_sheet.py` strips around every cue word, MP4 properties, loudness, and voice offset vs. the original = 0 ms.

A new recording always needs new timing and a full re-render, even when the script is unchanged.

Look: the template is the dark "sticker" style of the example (dark rays background, accent colour per scene, Anton headlines, Be Vietnam Pro captions, hand-drawn SVG items with thick outlines). Colours are tokens in `src/style.css :root`; change them there if the user wants another look.

### Hand-over

- Send the MP4 (main) and the voice-only MP4.
- Say how the timing was obtained, which spoken words differ from the script, and ask the user to report any second that is off.
- Never promise a view count. Say plainly that views depend on the algorithm, posting time and the account, and name what the video does to help (hook in the first second, countdown, captions, screenshot frame).
- Remind the user to add trending music at low volume inside TikTok.
- The cloud machine is temporary: tell the user to download the files.

## Optional: spreadsheet

When asked for a sheet of the script, make a Sheet with one row per scene (Cảnh, Giây, Lời thoại, Hình ảnh, Chữ trên màn hình) and a second sheet with the calculation as formulas so the user can change the inputs.
