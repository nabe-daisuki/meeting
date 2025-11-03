import requests
import json
import sys
import os.path
from pp_ext import pp_ex

sys.path.append(os.path.dirname(__file__))
from replace import getReplaceTable, replaceTypo, output
from convert import numToTime
from speaker import getSpeakerTable
from to_giji import new, add, end, createTagContainer, getValidTagLen


url = "http://127.0.0.1:8000/transcribe"
audio_filename = "test_0-2.mp3"
files = {"file": open(audio_filename, "rb")}
response = requests.post(url, files=files)
json_str = response.json()
# ファイルに保存
with open("segments.json", "w", encoding="utf-8") as f:
  f.write(json_str)

chunk_len = 20
text = ""
chunk = []
start_list = []
end_list = []
tmp_end = 0

for seg in json.loads(json_str):
  if text == "": start_list.append(seg["start"]) 
  text += seg["text"]
  tmp_end = seg["end"]
  if chunk_len <= tmp_end:
    chunk_len += 20
    chunk.append(text)
    text = ""

    end_list.append(tmp_end)

if not text == "":
  chunk.append(text)
  end_list.append(tmp_end)

replace_file_path = os.path.abspath("replace_table.txt")
replace_table = getReplaceTable(replace_file_path)
formatted_lines = []
replace_infos = []

with open("text.txt", "w", encoding="utf-8") as f:
  for i, text in enumerate(chunk):
    replace_result = replaceTypo(text, replace_table)
    replace_infos.append(replace_result)
    # pp_ex(replace_result)
    formatted_line = f"[{numToTime(int(start_list[i]))} -> {numToTime(int(end_list[i]))}] {replace_result["after"]}\n"
    formatted_lines.append(formatted_line)
    f.write(formatted_line)
  
  time = "[00:02:00 -> 00:02:20]"
  text = "あいうえおかきくけこいうえおあ"
  replace_result = replaceTypo(text, replace_table)
  replace_infos.append(replace_result)
  formatted_lines.append(f"{time} {replace_result["after"]}")
  # pp_ex(replace_result)
  f.write(f"{time} {replace_result["after"]}")

giji_file_path = new(audio_filename)
tag_container = createTagContainer()

speaker_file_path = os.path.abspath("speaker.txt")
speaker_table = getSpeakerTable(speaker_file_path)

add(tag_container, giji_file_path, "giji", formatted_lines, "arr")
add(tag_container, giji_file_path, "audio", os.path.abspath(audio_filename), "audio")
add(tag_container, giji_file_path, "repinfos", replace_infos, "arr")
add(tag_container, giji_file_path, "reptbl", replace_table, "arr")
add(tag_container, giji_file_path, "speaker", speaker_table, "arr")

end(tag_container, giji_file_path)

output(replace_table)