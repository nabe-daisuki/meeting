import re
from pp_ext import pp_ex
from typing import List, TypedDict
import textwrap
from datetime import datetime

class ReplaceData(TypedDict):
  src: str
  dest: str
  delta: int
  count: int

class AroundReplaceHistory(TypedDict):
  before: List[str]
  after: List[str]

class ReplaceResult(TypedDict):
  before: str
  after: str
  replace_histories: List[List[AroundReplaceHistory]]

# replace_table = [
#   {"src": r"いう(?=えお)","dest": "イウ"},
#   {"src": r"かきく","dest": "カク"},
#   {"src": r"えおカ","dest": "なきくけ"},
#   {"src": r"イウなき","dest": "ぬ"},
#   {"src": r"あぬ","dest": "さいはて"},
#   {"src": r"けこ","dest": "か","delta":-1},
#   {"src": r"かイ","dest": "にん","delta":-1},
#   {"src": r"てく","dest": "ウえ","delta":-2},
#   {"src": r"ウえ","dest": "・・","delta":-1},
#   {"src": r"ドイツ","dest": "インド","delta":0},
#   {"src": r"いつも","dest": "常時","delta":0},
#   {"src": r"めっちゃ","dest": "かなり","delta":0},
#   {"src": r"って","dest": "と","delta":0},
#   {"src": r"ハロー","dest": "こんにちは","delta":0},
#   {"src": r"さい","dest": "そい","delta":-1},
# ]

# test_char_replace_histories = [
#   [[1, 2]],
#   [[1, 2], [10, 11]],
#   [[1, 2], [9, 10], [5, 6]],
#   [[1, 2], [10, 11], [7], [3, 4, 5, 6]],
#   [[1], [7, 8], [4], [2, 3], [1]],
#   [[0, 1, 2, 3], [9, 10], [6], [4, 5], [0, 1, 2, 3], [0, 1, 2, 3]],
#   [[0, 1, 2, 3], [7, 8], [6], [4, 5], [0, 1, 2, 3], [0, 1, 2, 3], [6]],
#   [[0, 1, 2, 3], [7], [5, 6], [4], [0, 1, 2, 3], [0, 1, 2, 3], [5, 6], [5, 6]],
#   [[0], [5], [3, 4], [1, 2], [0], [0], [3, 4], [3, 4], [1, 2]],
#   [[0, 1], [4], [2, 3], [0, 1], [0, 1], [0, 1], [2, 3], [2, 3], [0, 1], [0, 1]],
#   [[0, 1], [3, 4], [2], [0, 1], [0, 1], [0, 1], [2], [2], [0, 1], [0, 1], [3, 4]],
#   [[2], [4, 5], [3], [2], [2], [2], [3], [3], [2], [2], [4, 5], [0, 1]],
#   [[2, 3], [5, 6], [4], [2, 3], [2, 3], [2, 3], [4], [4], [2, 3], [2, 3], [5, 6], [0, 1], [2, 3]],
#   [[2, 3], [7], [4], [2, 3], [2, 3], [2, 3], [4], [4], [2, 3], [2, 3], [7], [0, 1], [2, 3], [5, 6]],
#   [[2, 3], [7, 8], [4], [2, 3], [2, 3], [2, 3], [4], [4], [2, 3], [2, 3], [7, 8], [0, 1], [2, 3], [5, 6], [7, 8]]
# ]


def isValidReplaceData(data: List[str]) -> bool:
  return len(data) == 4


def getReplaceTable(file_path: str) -> List[ReplaceData]:
  replace_table = []
  with open(file_path, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
      data = line.rstrip().split("|||")

      if(not isValidReplaceData(data)):
        raise ValueError(textwrap.dedent(f"""\
          以下の無効な行を読み取りました。
          {i}行目 : {line}
        """))
    
      replace_table.append(ReplaceData(
        src=data[0],
        dest=data[1],
        delta=int(data[2]),
        count=int(data[3])
      ))
  return replace_table


def replaceTypo(text: str, replace_table: List[ReplaceData]) -> ReplaceResult:
  char_replace_histories = []
  around_replace_histories = []

  new_text = text

  replace_count = 0
  for replace_data in replace_table:
    pattern = re.compile(replace_data["src"])

    border = 7
    offset = 0

    delta = replace_data["delta"] if "delta" in replace_data else 0

    dest = replace_data["dest"]
    dest_len = len(dest)

    for m in pattern.finditer(new_text):
      m_start, m_end = m.span()

      start = m_start + offset + delta
      end = m_end + offset

      diff = end - start - dest_len

      # print()
      # print("start       : " + str(start))
      # print("start(+offs): " + str(start))
      # print("end         : " + str(end))
      # print("end(+offset): " + str(end + offset))
      # print("diff        : " + str(diff))
      # print("offset      : " + str(offset))
      # print("before      : " + new_text[start:end + offset])
      # print("after       : " + dest)

      prefix_start = max(0, start - border)
      suffix_end = min(end + border, len(new_text))

      before = new_text[prefix_start:start] + "|||" + new_text[start:end] + "|||" + new_text[end:suffix_end]
      before = "　" + before if start - border <= 0 else "…" + before
      if end + border < len(new_text): before += "…"

      after = new_text[prefix_start:start] + "|||" + dest + "|||" + new_text[end:suffix_end]
      after = "　" + after if start - border <= 0 else "…" + after
      if end + border < len(new_text): after += "…"

      around_replace_histories.append({
        "before": before.split("|||"),
        "after" : after.split("|||")
      })

      # pp_ex(around_replace_histories[replace_count])

      new_text = new_text[:start] + dest + new_text[end:]

      if diff != 0:
        for i, _ in enumerate(char_replace_histories):
          if any(x >= start for x in char_replace_histories[i]):
            overlap = set(range(start, end)) & set(char_replace_histories[i])

            contains_all = False
            if len(overlap):
              if start <= char_replace_histories[i][0] and end > char_replace_histories[i][-1]:
                char_replace_histories[i] = list(range(start, end - diff))
                contains_all = True
              else:
                char_replace_histories[i] = list(set(char_replace_histories[i]) - set(overlap))

            for y in range(0, abs(diff)):
              if diff < 0:
                for j, val in enumerate(char_replace_histories[i]):
                  if val > start:
                    if contains_all: continue
                    char_replace_histories[i][j] += 1
              else:
                for j, val in enumerate(char_replace_histories[i]):
                  if val > start:
                    if contains_all: continue
                    char_replace_histories[i][j] -= 1

      char_replace_histories.append(list(range(start, end - diff)))

      # print(char_replace_histories)
      # print("\x1b[32m０１２３４５６７８９10111213141516\x1b[0m")
      # print(new_text)

      # test_result = char_replace_histories == test_char_replace_histories[replace_count]
      # print(f"\x1b[34m{test_result}\x1b[0m" if test_result else f"\x1b[31m{test_result}\x1b[0m")

      offset += -diff
      replace_count += 1
      replace_data["count"] += 1

  replace_histories = []
  for i, _ in enumerate(range(len(new_text))):
    replace_histories.append([])

    for j, char_replace_history in enumerate(char_replace_histories):

      if i in char_replace_history:
        replace_histories[i].append(around_replace_histories[j])
    
    # print()
    # print(f"\x1b[32m{i}文字目\x1b[0m")
    # pp_ex(replace_histories[i])
  
  return {
    "before": text,
    "after": new_text,
    "replace_histories": replace_histories
  }


def output(replace_table: List[ReplaceData]) -> None:
  with open(f"replace_counter_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt", "w", encoding="utf-8") as f:
    for replace_data in replace_table:
      data = f"{replace_data['src']}|||{replace_data['dest']}|||{replace_data['delta']}|||{replace_data['count']}\n"
      f.write(data)


# result = replaceTypo(text)
# pp_ex(result)

# with open("replace_result.json", "w", encoding="utf-8") as f:
#     json.dump(result, f, ensure_ascii=False, indent=2)