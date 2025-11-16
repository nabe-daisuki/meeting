import re
import csv

okuri_gana_a = ["か", "さ", "た", "な", "ま", "ら", "わ", "が", "ざ", "ば"]
okuri_gana_i = ["き", "し", "ち", "に", "み", "り", "い", "ぎ", "じ", "び"]
okuri_gana_u = ["く", "す", "つ", "ぬ", "む", "る", "う", "ぐ", "ず", "ぶ"]
okuri_gana_e = ["け", "せ", "て", "ね", "め", "れ", "え", "げ", "ぜ", "べ"]
okuri_gana_o = ["こ", "そ", "と", "の", "も", "ろ", "お", "ご", "ぞ", "ぼ"]

godan_groups_split = {
  0: [], # か行
  1: [], # さ行
  2: [], # た行
  3: [], # な行
  4: [], # ま行
  5: [], # ら行
  6: [], # わ行
  7: [], # が行
  8: [], # ざ行
  9: [], # ば行
}

godan_groups_re_parts = {
  0: "", # か行
  1: "", # さ行
  2: "", # た行
  3: "", # な行
  4: "", # ま行
  5: "", # ら行
  6: "", # わ行
  7: "", # が行
  8: "", # ざ行
  9: "", # ば行
}


with open("../godan_edited.csv", newline="", encoding="utf-8") as f:
  reader = csv.DictReader(f)
  for r in reader:
    okuri_gana = re.search(r"（(.)）", r["訓読み"])
    if not okuri_gana:
      print("送り仮名なし")
      continue
    
    okuri_gana_idx = next((i for i, v in enumerate(okuri_gana_u) if v == okuri_gana.group(1)), None)
    if okuri_gana_idx == None:
      print("送り仮名インデックスなし")
      continue
    
    if r["漢字"] not in godan_groups_split[okuri_gana_idx]:
      godan_groups_split[okuri_gana_idx].append(r["漢字"])


for i, arr in godan_groups_split.items():
  godan_groups_re_parts[i] = f"({'|'.join(godan_groups_split[i])})"

godan_src_k_masu = f"{godan_groups_re_parts[0]}きます"
godan_src_s_masu = f"{godan_groups_re_parts[1]}します"
godan_src_t_masu = f"{godan_groups_re_parts[2]}ちます"
godan_src_n_masu = f"{godan_groups_re_parts[3]}にます"
godan_src_m_masu = f"{godan_groups_re_parts[4]}みます"
godan_src_r_masu = f"{godan_groups_re_parts[5]}ります"
godan_src_w_masu = f"{godan_groups_re_parts[6]}います"
godan_src_g_masu = f"{godan_groups_re_parts[7]}ぎます"
godan_src_z_masu = f"{godan_groups_re_parts[8]}じます"
godan_src_b_masu = f"{godan_groups_re_parts[9]}びます"

godan_dest_k_masu = "\\1く"
godan_dest_s_masu = "\\1す"
godan_dest_t_masu = "\\1つ"
godan_dest_n_masu = "\\1ぬ"
godan_dest_m_masu = "\\1む"
godan_dest_r_masu = "\\1る"
godan_dest_w_masu = "\\1う"
godan_dest_g_masu = "\\1ぐ"
godan_dest_z_masu = "\\1ず"
godan_dest_b_masu = "\\1ぶ"

godan_src_k_mashita = f"{godan_groups_re_parts[0]}きました"
godan_src_s_mashita = f"{godan_groups_re_parts[1]}しました"
godan_src_t_mashita = f"{godan_groups_re_parts[2]}ちました"
godan_src_n_mashita = f"{godan_groups_re_parts[3]}にました"
godan_src_m_mashita = f"{godan_groups_re_parts[4]}みました"
godan_src_r_mashita = f"{godan_groups_re_parts[5]}りました"
godan_src_w_mashita = f"{godan_groups_re_parts[6]}いました"
godan_src_g_mashita = f"{godan_groups_re_parts[7]}ぎました"
godan_src_z_mashita = f"{godan_groups_re_parts[8]}じました"
godan_src_b_mashita = f"{godan_groups_re_parts[9]}びました"

godan_dest_k_mashita = "\\1いた"
godan_dest_s_mashita = "\\1した"
godan_dest_t_mashita = "\\1った"
godan_dest_n_mashita = "\\1んだ"
godan_dest_m_mashita = "\\1んだ"
godan_dest_r_mashita = "\\1った"
godan_dest_w_mashita = "\\1った"
godan_dest_g_mashita = "\\1いだ"
godan_dest_z_mashita = "\\1じた"
godan_dest_b_mashita = "\\1んだ"

kamiichidan_split = []
with open("../kamiichidan.csv", newline="", encoding="utf-8") as f:
  reader = csv.DictReader(f)
  for r in reader:
    okuri_gana = re.search(r"（(.*)）", r["訓読み"])
    if not okuri_gana:
      print("送り仮名なし")
      continue

    prefix = f"{r['漢字'] + okuri_gana.group(1)[0:1]}"
    if prefix not in kamiichidan_split:
      kamiichidan_split.append(prefix)

print('|'.join(kamiichidan_split))
kamiichidan_src_masu = f"({'|'.join(kamiichidan_split)})ます"
kamiichidan_dest_masu = "\\1る"

kamiichidan_src_mashita = f"({'|'.join(kamiichidan_split)})ました"
kamiichidan_dest_mashita = "\\1た"


shimoichidan_split = []
with open("../shimoichidan.csv", newline="", encoding="utf-8") as f:
  reader = csv.DictReader(f)
  for r in reader:
    okuri_gana = re.search(r"（(.*)）", r["訓読み"])
    if not okuri_gana:
      print("送り仮名なし")
      continue
    
    prefix = f"{r['漢字'] + okuri_gana.group(1)[0:1]}"
    if prefix not in shimoichidan_split:
      shimoichidan_split.append(prefix)

print('|'.join(shimoichidan_split))
shimoichidan_src_masu = f"({'|'.join(shimoichidan_split)})ます"
shimoichidan_dest_masu = "\\1る"

shimoichidan_src_mashita = f"({'|'.join(shimoichidan_split)})ました"
shimoichidan_dest_mashita = "\\1た"