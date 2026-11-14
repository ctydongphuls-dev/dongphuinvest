"""Vietnamese text helpers for the aligner: reading numbers aloud, parsing the spoken transcript."""
import re
import unicodedata

DIG = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]


def _group(n, pad):
    """read 0..999; pad=True when it is a non-leading group (so 5 -> 'không trăm linh năm')"""
    h, t, u = n // 100, (n // 10) % 10, n % 10
    out = []
    if h or pad:
        out += [DIG[h], "trăm"]
    if t == 0:
        if u and (h or pad):
            out += ["linh", DIG[u]]
        elif u:
            out += [DIG[u]]
    elif t == 1:
        out += ["mười"]
        if u:
            out += ["lăm" if u == 5 else DIG[u]]
    else:
        out += [DIG[t], "mươi"]
        if u:
            out += ["mốt" if u == 1 else "lăm" if u == 5 else DIG[u]]
    return out


def num2vi(n, thousand="nghìn"):
    """integer -> list of syllables as read aloud, e.g. 1100 -> một nghìn một trăm"""
    n = int(n)
    if n == 0:
        return ["không"]
    names = ["", thousand, "triệu", "tỷ"]
    groups = []
    while n:
        groups.append(n % 1000)
        n //= 1000
    out = []
    for i in range(len(groups) - 1, -1, -1):
        g = groups[i]
        if g == 0:
            continue
        out += _group(g, pad=(i != len(groups) - 1))
        if names[i]:
            out.append(names[i])
    return out


NUM_RE = re.compile(r"^\d{1,3}(?:[.\s]\d{3})+$|^\d+$")
PUNCT = ".,!?:;…\"'“”‘’()[]–—-"


def strip_punct(tok):
    return tok.strip(PUNCT)


def parse_spoken(path_or_text):
    """Transcript of what is actually said: one sentence per line.
    A token is one syllable unless it is a number written with digits (read with num2vi)
    or carries an explicit count, e.g. video{3}, comment{2}.
    A stand-alone "||" marks a pause of the recording (manual mode, when no recognizer is available).
    Lines starting with // are comments.
    Returns [{s, k, text, nsyl, brk}] with text kept as written (punctuation included)."""
    text = open(path_or_text, encoding="utf-8").read() if "\n" not in path_or_text and path_or_text.endswith(".txt") else path_or_text
    toks = []
    s = 0
    brk = False
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("//"):
            continue
        k = 0
        for raw in line.split():
            if raw == "||":            # manual mode: "a pause of the recording is here"
                brk = True
                continue
            m = re.match(r"^(.*?)\{(\d+)\}(.*)$", raw)
            if m:
                word, n = m.group(1) + m.group(3), int(m.group(2))
            else:
                word = raw
                core = strip_punct(raw)
                n = len(num2vi(core.replace(".", "").replace(" ", ""))) if NUM_RE.match(core) else 1
            if not strip_punct(word):
                continue  # a lone punctuation mark
            toks.append(dict(s=s, k=k, text=word, nsyl=n, brk=brk and bool(toks)))
            brk = False
            k += 1
        s += 1
    return toks


def norm_words(text, thousand="nghìn"):
    """words for fuzzy text matching (ASR output vs transcript): lower-case, no punctuation, digits spelled out"""
    out = []
    for raw in text.split():
        raw = re.sub(r"\{\d+\}", "", raw)
        core = strip_punct(raw).lower()
        if not core:
            continue
        if NUM_RE.match(core):
            out += num2vi(core.replace(".", "").replace(" ", ""), thousand)
        else:
            core = {"gram": "gam", "ngàn": "nghìn", "calo": "ca-lo", "kg": "cân"}.get(core, core)
            out += core.split("-")
    return [unicodedata.normalize("NFC", w) for w in out]


if __name__ == "__main__":
    for n in (0, 5, 10, 15, 21, 35, 36, 100, 105, 110, 150, 240, 330, 370, 460, 570, 1000, 1100, 3000, 7700, 35000, 75000, 2000000, 1005, 1050):
        print(n, " ".join(num2vi(n)))
