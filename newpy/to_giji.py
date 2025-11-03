import os.path
import json
import textwrap
import struct
from typing import List, Any, TypedDict

__all__ = [
  "new",
  "add",
  "end",
  "createTagContainer",
  "getValidTagLen"
]

MAX_TAG_LEN = 10
TARGET_TYPES = ["str", "arr", "audio"]

class FileRange(TypedDict):
  start: int
  end: int

class TagInfo(TypedDict):
  tag: bytes
  range: FileRange


def hasExt(filename: str) -> bool:
  _, ext = os.path.splitext(filename)
  return bool(ext)


def removeExt(filename: str) -> str:
  name, _ = os.path.splitext(filename)
  return name  


def new(audio_filename) -> str:
  root_dir = os.path.dirname(__file__)
  filename = audio_filename if not hasExt(audio_filename) else removeExt(audio_filename)
  giji_file_path = os.path.join(root_dir, f"{filename}.giji")
  with open(giji_file_path, "w") as f:
    pass
  return giji_file_path


def addStr(file_path: str, text: str) -> FileRange:
  with open(file_path, "w", encoding="utf-8") as f:
    start_pos = f.tell()
    f.write(text)
    end_pos = f.tell()
  
  return FileRange(start=start_pos, end=end_pos)


def addArr(file_path: str, arr: List[Any]) -> FileRange:
  with open(file_path, "ab") as f:
    start_pos = f.tell()
    encoded_data = json.dumps(arr, ensure_ascii=False).encode()
    f.write(encoded_data)
    end_pos = f.tell()
  
  return FileRange(start=start_pos, end=end_pos)


def addAudio(file_path: str, audio_file_path: str) -> FileRange:
  with open(file_path, "ab") as f, open(audio_file_path, "rb") as f_a:
    start_pos = f.tell()
    audio_bytes = f_a.read()
    f.write(audio_bytes)
    end_pos = f.tell()
  
  return FileRange(start=start_pos, end=end_pos)


def isValidTargetType(type: str) -> bool:
  return type in TARGET_TYPES


def isValidTagLen(tag: str) -> bool:
  return len(tag) <= MAX_TAG_LEN


def add(tag_container: List[TagInfo], file_path: str, tag: str, target: Any, target_type: str) -> List[TagInfo]:
  if not isValidTargetType(target_type):
    raise ValueError(textwrap.dedent(f"""\
      タイプ（{target_type}）が有効ではありません。 
      有効なタイプは以下です。
      　{", ".join(TARGET_TYPES)}
    """))
  
  if not isValidTagLen(tag):
    raise ValueError(f"タグが長すぎます（最大 {MAX_TAG_LEN} 文字）: {tag}")
  
  if target_type == "str":
    tag_container.append(TagInfo(
      tag=toTagFormat(tag),
      range=addStr(file_path, target)
    ))
  elif target_type == "arr":
    tag_container.append(TagInfo(
      tag=toTagFormat(tag),
      range=addArr(file_path, target)
    ))
  elif target_type == "audio":
    tag_container.append(TagInfo(
      tag=toTagFormat(tag),
      range=addAudio(file_path, target)
    ))
  
  return tag_container
  

def getValidTagLen() -> int:
  return MAX_TAG_LEN


def createTagContainer() -> List[TagInfo]:
  return []


def toTagFormat(tag: str) -> bytes:
  return tag.encode().ljust(MAX_TAG_LEN, b'\00')


def isValidTagContainer(tag_container: List[TagInfo]) -> bool:
  for t in tag_container:
    if not isinstance(t, dict) and "tag" in t and "range" in t:
      return False
    r = t["range"]
    if not isinstance(r, dict) and "start" in r and "end" in r:
      return False
  return True


def isEmptyTagContainer(tag_container: List[TagInfo]) -> bool:
  return len(tag_container) == 0


def containsGijiTag(tag_container: List[TagInfo]) -> bool:
  for t in tag_container:
    if t["tag"].rstrip(b'\00').decode() == "giji": return True
  return False


def end(tag_container: List[TagInfo], file_path: str) -> None:
  if isEmptyTagContainer(tag_container):
    raise ValueError(f"tag_containerが空です。少なくともgijiタグを追加してください。")
  
  if not containsGijiTag(tag_container):
    raise ValueError(f"tag_containerにgijiタグが含まれていません。少なくともgijiタグを追加してください。")

  if not isValidTagContainer(tag_container):
    raise ValueError(textwrap.dedent(f"""\
      tag_containerが壊れています。tag_containerには以下の型のみ格納できます。
      　TagInfo(
      　　tag: bytes
      　　range: FileRange(
      　　　start: int
      　　　end: int
      　　)
      　)
    """))
  
  with open(file_path, "ab") as f:
    f.write(toTagFormat("end"))
    f.write(struct.pack("<Q", 0))
    f.write(struct.pack("<Q", 0))

    for t in tag_container:
      f.write(t["tag"])
      f.write(struct.pack("<Q", t["range"]["start"]))
      f.write(struct.pack("<Q", t["range"]["end"]))

