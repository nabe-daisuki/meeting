import os.path
import os
import sys
import struct

file_path = os.path.abspath(__file__)
root_dir = os.path.dirname(file_path)
src_text = "test2.txt"
src_audio = "sample_src.mp3"
extract_audio = "sample.mp3"

print("あいうえお".rstrip(" ") + "a")
print("あいうえお　　　　".rstrip() + "a")
sys.exit(0)

print(file_path)
print(root_dir)

src_file_path = os.path.join(root_dir, src_text)
src_audio_file_path = os.path.join(root_dir, src_audio)
giji_file_path = os.path.join(root_dir, "giji_test.giji")
extract_audio_file_path = os.path.join(root_dir, extract_audio)

with open(src_file_path, "r", encoding="utf-8") as f:
  lines = f.readlines()

with open(giji_file_path, "w", encoding="utf-8") as f:
  f.writelines(lines)

strLen = 10

with open(giji_file_path, "ab") as f, open(src_audio_file_path, "rb") as src_f:
  audio_start = f.tell()

  bytes = src_f.read()

  f.write(bytes)

  audio_end = f.tell()

  f.write("audio".encode("utf-8").ljust(strLen, b'\00'))
  f.write("save".encode("utf-8").ljust(strLen, b'\00'))
  f.write("init".encode("utf-8").ljust(strLen, b'\00'))
  f.write("config".encode("utf-8").ljust(strLen, b'\00'))
  f.write(struct.pack("<Q", audio_start))
  f.write(struct.pack("<Q", audio_end))

print(f"audio_start(書込): {audio_start}")
print(f"audio_end(書込)  : {audio_end}")
print(f"audio_data(書込) : {audio_end - audio_start}")

with open(giji_file_path, "rb") as f:
  f.seek(-8, os.SEEK_END)
  audio_end = struct.unpack("<Q", f.read(8))[0]

  f.seek(-16, os.SEEK_END)
  audio_start = struct.unpack("<Q", f.read(8))[0]
  
  f.seek(-26 , os.SEEK_END)
  sec1 = f.read(10).rstrip(b'\00').decode("utf-8")
  
  f.seek(-36, os.SEEK_END)
  sec2 = f.read(10).rstrip(b'\00').decode("utf-8")
  
  f.seek(-46, os.SEEK_END)
  sec3 = f.read(10).rstrip(b'\00').decode("utf-8")
  
  f.seek(-56, os.SEEK_END)
  sec4 = f.read(10).rstrip(b'\00').decode("utf-8")

print(f"audio_start(読込): {audio_start}")
print(f"audio_end(読込)  : {audio_end}")
print(f"audio_data(読込) : {audio_end - audio_start}")
print(f"sec1(読込)       : {sec1}")
print(f"sec2(読込)       : {sec2}")
print(f"sec3(読込)       : {sec3}")
print(f"sec4(読込)       : {sec4}")

with open(giji_file_path, "rb") as f:
  f.seek(audio_start)
  audio_data = f.read(audio_end - audio_start)

with open(extract_audio_file_path, "wb") as f:
  f.write(audio_data)