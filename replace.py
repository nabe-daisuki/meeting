import re
import os.path
import os
import sys
import struct
import json
from pp_ext import pp_ex

time = "[00:00:00 -> 00:03:00]"
text = "あいうえおかきくけこいうえおあ"
pattern = re.compile(r"いう(?=えお)")

replace_patterns = [
  {"src": r"いう(?=えお)","dest": "イウ"},
  {"src": r"かきく","dest": "カク"},
  {"src": r"えおカ","dest": "なきくけ"},
  {"src": r"イウなき","dest": "ぬ"},
  {"src": r"あぬ","dest": "さいはて"},
  {"src": r"けこ","dest": "か","offset":-1},
  {"src": r"かイ","dest": "にん","offset":-1},
  {"src": r"てく","dest": "ウえ","offset":-2},
  {"src": r"ウえ","dest": "・・","offset":-1},
  {"src": r"・","dest": "さか","offset":0},
]

test_char_replace_histories = [
  [[1, 2]],
  [[1, 2], [10, 11]],
  [[1, 2], [9, 10], [5, 6]],
  [[1, 2], [10, 11], [7], [3, 4, 5, 6]],
  [[1], [7, 8], [4], [2, 3], [1]],
  [[0, 1, 2, 3], [9, 10], [6], [4, 5], [0, 1, 2, 3], [0, 1, 2, 3]],
  [[0, 1, 2, 3], [7, 8], [6], [4, 5], [0, 1, 2, 3], [0, 1, 2, 3], [6]],
  [[0, 1, 2, 3], [7], [5, 6], [4], [0, 1, 2, 3], [0, 1, 2, 3], [5, 6], [5, 6]],
  [[0], [5], [3, 4], [1, 2], [0], [0], [3, 4], [3, 4], [1, 2]],
  [[0, 1], [4], [2, 3], [0, 1], [0, 1], [0, 1], [2, 3], [2, 3], [0, 1], [0, 1]],
  [[0, 1], [3, 4], [2], [0, 1], [0, 1], [0, 1], [2], [2], [0, 1], [0, 1], [3, 4]],
  [[2], [4, 5], [3], [2], [2], [2], [3], [3], [2], [2], [4, 5], [0, 1]],
  [[2, 3], [5, 6], [4], [2, 3], [2, 3], [2, 3], [4], [4], [2, 3], [2, 3], [5, 6], [0, 1], [2, 3]],
  [[2, 3], [7], [4], [2, 3], [2, 3], [2, 3], [4], [4], [2, 3], [2, 3], [7], [0, 1], [2, 3], [5, 6]],
  [[2, 3], [7, 8], [4], [2, 3], [2, 3], [2, 3], [4], [4], [2, 3], [2, 3], [7, 8], [0, 1], [2, 3], [5, 6], [7, 8]]
]

char_replace_histories = []
around_replace_histories = []
affected_by_replace = []

new_text = text

replace_pattern_count = 0
replace_count = 0
for replace_pattern in replace_patterns:
  pattern = re.compile(replace_pattern["src"])
  offset = 0

  for m in pattern.finditer(new_text):
    start, end = m.span()
    off = replace_pattern["offset"] if "offset" in replace_pattern else 0

    start_with_offset = start + offset + off
    end_with_offset = end + offset

    new_word = replace_pattern["dest"]
    new_word_len = len(new_word)

    diff = end_with_offset - start_with_offset - new_word_len

    # print()
    # print("start       : " + str(start))
    # print("start(+offs): " + str(start_with_offset))
    # print("end         : " + str(end))
    # print("end(+offset): " + str(end + offset))
    # print("diff        : " + str(diff))
    # print("offset      : " + str(offset))
    # print("before      : " + new_text[start_with_offset:end + offset])
    # print("after       : " + new_word)

    prefix_start = max(0, start_with_offset - 7)
    suffix_end = min(end_with_offset + 7, len(new_text))

    before = new_text[prefix_start:start_with_offset] + "|||" + new_text[start_with_offset:end_with_offset] + "|||" + new_text[end_with_offset:suffix_end]
    before = "　" + before if start_with_offset - 7 <= 0 else "…" + before
    if end_with_offset + 7 < len(new_text): before += "…"

    after = new_text[prefix_start:start_with_offset] + "|||" + new_word + "|||" + new_text[end_with_offset:suffix_end]
    after = "　" + after if start_with_offset - 7 <= 0 else "…" + after
    if end_with_offset + 7 < len(new_text): after += "…"

    around_replace_histories.append({
      "before": before.split("|||"),
      "after" : after.split("|||")
    })

    # pp_ex(around_replace_histories[replace_count])

    new_text = new_text[:start_with_offset] + new_word + new_text[end_with_offset:]

    if diff != 0:
      for i, _ in enumerate(char_replace_histories):
        if any(x >= start_with_offset for x in char_replace_histories[i]):
          overlap = set(range(start_with_offset, end_with_offset)) & set(char_replace_histories[i])

          contains_all = False
          if len(overlap):
            if start_with_offset <= char_replace_histories[i][0] and end_with_offset > char_replace_histories[i][-1]:
              char_replace_histories[i] = list(range(start_with_offset, end_with_offset - diff))
              contains_all = True
            else:
              char_replace_histories[i] = list(set(char_replace_histories[i]) - set(overlap))

          if len(overlap) or start_with_offset == char_replace_histories[i][0]:
            affected_by_replace[i].append(replace_pattern_count)

          for y in range(0, abs(diff)):
            if diff < 0:
              for j, val in enumerate(char_replace_histories[i]):
                if val > start_with_offset:
                  if contains_all: continue
                  char_replace_histories[i][j] += 1
            else:
              for j, val in enumerate(char_replace_histories[i]):
                if val > start_with_offset:
                  if contains_all: continue
                  char_replace_histories[i][j] -= 1

    char_replace_histories.append(list(range(start_with_offset, end_with_offset - diff)))
    affected_by_replace.append([replace_pattern_count])

    print(char_replace_histories)
    print("\x1b[32m０１２３４５６７８９10111213141516\x1b[0m")
    print(new_text)

    # test_result = char_replace_histories == test_char_replace_histories[replace_count]
    # print(f"\x1b[34m{test_result}\x1b[0m" if test_result else f"\x1b[31m{test_result}\x1b[0m")

    offset += -diff
    replace_count += 1
  
  replace_pattern_count += 1

replace_histories = []
for i, _ in enumerate(range(len(new_text))):
  replace_histories.append([])

  for j, char_replace_history in enumerate(char_replace_histories):

    if i in char_replace_history:
      replace_histories[i].append(around_replace_histories[j])
  
  # print()
  # print(f"\x1b[32m{i}文字目\x1b[0m")
  # pp_ex(replace_histories[i])

sys.exit(0)

file_path = os.path.abspath(__file__)
root_dir = os.path.dirname(file_path)
src_text = "test2.txt"
src_audio = "sample.mp3"
# extract_audio = "sample.mp3"

src_file_path = os.path.join(root_dir, src_text)
src_audio_file_path = os.path.join(root_dir, src_audio)
giji_file_path = os.path.join(root_dir, "giji_test.giji")
# extract_audio_file_path = os.path.join(root_dir, extract_audio)

# with open(src_file_path, "r", encoding="utf-8") as f:
#   lines = f.readlines()

strLen = 10

with open(giji_file_path, "w", encoding="utf-8") as f:
  # f.writelines(lines)
  f.write(f"{time} {new_text}")

with open(giji_file_path, "ab") as f, open(src_audio_file_path, "rb") as src_f:
  audio_start = f.tell()
  bytes = src_f.read()
  f.write(bytes)
  audio_end = f.tell()

with open(giji_file_path, "ab") as f:
  config_start = f.tell()
  f.write("default".encode())
  config_end = f.tell()

with open(giji_file_path, "ab") as f:
  rephist_start = f.tell()
  f.write(json.dumps(replace_histories, ensure_ascii=False).encode())
  rephist_end = f.tell()

with open(giji_file_path, "ab") as f:
  save_start = f.tell()
  f.write("none".encode())
  save_end = f.tell()

with open(giji_file_path, "ab") as f:
  f.write("end".encode().ljust(strLen, b'\00'))
  f.write(struct.pack("<Q", 0))
  f.write(struct.pack("<Q", 0))
  
  f.write("audio".encode().ljust(strLen, b'\00'))
  f.write(struct.pack("<Q", audio_start))
  f.write(struct.pack("<Q", audio_end))
  
  f.write("config".encode().ljust(strLen, b'\00'))
  f.write(struct.pack("<Q", config_start))
  f.write(struct.pack("<Q", config_end))
  
  f.write("rephist".encode().ljust(strLen, b'\00'))
  f.write(struct.pack("<Q", rephist_start))
  f.write(struct.pack("<Q", rephist_end))
  
  f.write("save".encode().ljust(strLen, b'\00'))
  f.write(struct.pack("<Q", save_start))
  f.write(struct.pack("<Q", save_end))
