import sys, json, time
sys.path.insert(0, '.')
from align import Aligner
from whisper_onnx import load_audio_16k
SP = sys.argv[1]; name = sys.argv[2]; mode = sys.argv[3]
audio = load_audio_16k(SP + '/audio_in/voice.wav')
A = Aligner(SP + '/models', name)
S = [  # (id, text) sentences as spoken
 "Trứng không phải nguồn đạm rẻ nhất.", "Whey càng không.",
 "Món đứng top 1 giá chưa tới 150 đồng 1 gam đạm,", "và hầu hết dân gym không bao giờ ăn nó.",
 "Tao đã tính giá từng gam đạm của 6 món.", "Xem tới cuối, top 1 sẽ làm mày tức.",
 "Hạng 6, whey.", "Một hũ gần 2 triệu, mỗi gam đạm hơn 1.000 đồng.", "Tiện thật, nhưng đắt nhất bảng.",
 "Hạng 5 và đây là cú sốc, trứng.", "3.000 đồng 1 quả, được 6 gam rưỡi đạm.", "Tính ra 460 đồng 1 gam. Áp chót.",
 "Hạng 4, đậu phụ, khoảng 370 đồng.", "Hạng 3, ức gà, 75.000 đồng 1 cân, 330 đồng 1 gam.", "Đúng, ức gà rẻ hơn trứng.",
 "Hạng 2, lạc.", "Chỉ khoảng 240 đồng 1 gam.", "Nhưng cẩn thận, 100 gam lạc gần 570 calo, ăn nhiều là béo chứ không phải to.",
 "Còn top 1, đậu nành khô.", "35 1 cân, 100 gam có 36 gam đạm.",
 "Mỗi gam chỉ khoảng 100 đồng, rẻ hơn trứng 4 lần, rẻ hơn whey 10 lần.",
 "Nhớ nấu chín, luộc, hầm, rang hoặc xay sữa. Đừng ăn sống.",
 "Và đừng bỏ trứng với ức gà, cứ trộn thêm đậu nành vào là tiền đạm của mày giảm 1 nửa.",
 "Lưu video này lại, mai đi chợ khỏi bị hớ.", "Mày đang ăn món hạng mấy? Comment tao xem.",
]
# window definitions: (start, end, [sentence indices])
WIN = {
 "big": [(0.0, 14.78, range(0, 6)), (14.78, 38.93, range(6, 15)), (38.93, 48.47, range(15, 18)),
         (48.47, 67.88, range(18, 23)), (67.88, 73.29, range(23, 25))],
 "small": [(0.0, 7.00, range(0, 3)), (7.00, 14.78, range(3, 6)), (14.78, 21.37, range(6, 9)),
           (21.37, 29.22, range(9, 12)), (29.22, 38.93, range(12, 15)), (38.93, 48.47, range(15, 18)),
           (48.47, 57.34, range(18, 21)), (57.34, 67.88, range(21, 23)), (67.88, 73.29, range(23, 25))],
}
allw = []
for (a, b, idx) in WIN[mode]:
    t0 = time.time()
    text = " ".join(S[i] for i in idx)
    words, M = A.align(audio, a, b, text)
    # tag sentence index per word
    k = 0
    for i in idx:
        n = len(S[i].split())
        for w in words[k:k + n]:
            w['sent'] = i
        k += n
    assert k == len(words), (k, len(words), text)
    print(f"window {a}-{b} {time.time()-t0:.1f}s words={len(words)}", flush=True)
    allw += words
json.dump(allw, open(SP + f'/work/align_{name}_{mode}.json', 'w'), ensure_ascii=False, indent=1)
print('saved', len(allw))
