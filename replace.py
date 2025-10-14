import re
import os.path
import os
import sys
import struct
import json

time = "[00:00:00 -> 00:03:00]"
text = "あいうえおかきくけこいうえおあ"
pattern = re.compile(r"いう(?=えお)")

replace_patterns = [
  {"src": r"いう(?=えお)","dest": "イウ"},
  {"src": r"かきく","dest": "カク"},
  {"src": r"えおカ","dest": "なきくけ"},
  {"src": r"イウなき","dest": "ぬ"},
  {"src": r"イウ","dest": "とらとら"},
  {"src": r"あぬ","dest": "さいはて"},
  {"src": r"クけ","dest": "えおあ"},
  {"src": r"えお","dest": "ノリ"},
]

replace_historys = []
affected_by_replace = []

new_text = text

replace_pattern_count = 0
for replace_pattern in replace_patterns:
  pattern = re.compile(replace_pattern["src"])
  offset = 0
  for m in pattern.finditer(new_text):
    start, end = m.span()
    # print(str(start) + "-" + str(end) + " : " + m.group() + " -> " + replace_pattern["dest"])
    
    new_word = replace_pattern["dest"]
    new_word_len = len(new_word)

    new_text = new_text[:start + offset] + new_word + new_text[end + offset:]

    diff = end - start - new_word_len
    offset += -diff

    if diff != 0:
      for i, _ in enumerate(replace_historys):
        if any(x >= start for x in replace_historys[i]):
          overlap = set(range(start, end)) & set(replace_historys[i])
          contains_all = False
          if len(overlap):
            if start <= replace_historys[i][0] and end > replace_historys[i][-1]:
              replace_historys[i] = list(range(start, end - diff))
              contains_all = True
            else:
              replace_historys[i] = list(set(replace_historys[i]) - set(overlap))

          if len(overlap) or start == replace_historys[i][0]:
            affected_by_replace[i].append(replace_pattern_count)

          for y in range(0, abs(diff)):
            if diff < 0:
              for j, val in enumerate(replace_historys[i]):
                if val > start:
                  if contains_all: continue
                  replace_historys[i][j] += 1
            else:
              for j, val in enumerate(replace_historys[i]):
                if val > start:
                  replace_historys[i][j] -= 1

    replace_historys.append(list(range(start, end - diff)))
    affected_by_replace.append([replace_pattern_count])

    # print(replace_historys)

    # print()
  
  replace_pattern_count += 1

  # print(new_text)
  # print(affected_by_replace)


file_path = os.path.abspath(__file__)
root_dir = os.path.dirname(file_path)
src_text = "test2.txt"
src_audio = "sample_src.mp3"
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
  f.write(json.dumps(replace_historys, ensure_ascii=False).encode())
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


# with open(giji_file_path, "rb") as f:
#   f.seek(-8, os.SEEK_END)
#   audio_end = struct.unpack("<Q", f.read(8))[0]

#   f.seek(-16, os.SEEK_END)
#   audio_start = struct.unpack("<Q", f.read(8))[0]
  
#   f.seek(-26 , os.SEEK_END)
#   sec1 = f.read(10).rstrip(b'\00').decode("utf-8")
  
#   f.seek(-36, os.SEEK_END)
#   sec2 = f.read(10).rstrip(b'\00').decode("utf-8")
  
#   f.seek(-46, os.SEEK_END)
#   sec3 = f.read(10).rstrip(b'\00').decode("utf-8")
  
#   f.seek(-56, os.SEEK_END)
#   sec4 = f.read(10).rstrip(b'\00').decode("utf-8")

# print(f"audio_start(読込): {audio_start}")
# print(f"audio_end(読込)  : {audio_end}")
# print(f"audio_data(読込) : {audio_end - audio_start}")
# print(f"sec1(読込)       : {sec1}")
# print(f"sec2(読込)       : {sec2}")
# print(f"sec3(読込)       : {sec3}")
# print(f"sec4(読込)       : {sec4}")

# with open(giji_file_path, "rb") as f:
#   f.seek(audio_start)
#   audio_data = f.read(audio_end - audio_start)

# with open(extract_audio_file_path, "wb") as f:
#   f.write(audio_data)
