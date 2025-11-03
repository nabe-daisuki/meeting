from typing import List, TypedDict
import textwrap

class SpeakerData(TypedDict):
  name: str
  count: int


def isValidSpeakerData(data: List[str]) -> bool:
  return len(data) == 2


def getSpeakerTable(file_path: str) -> List[SpeakerData]:
  speaker_table = []
  with open(file_path, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
      data = line.rstrip().split("|||")

      if(not isValidSpeakerData(data)):
        raise ValueError(textwrap.dedent(f"""\
          以下の無効な行を読み取りました。
          {i}行目 : {line}
        """))
      
      name = data[0]
      count = data[1]

      speaker_table.append(SpeakerData(
        name= name,
        count = int(count)
      ))
  
  return speaker_table