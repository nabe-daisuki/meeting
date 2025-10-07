import re

hiragana = "\\u3040-\\u309F"
katakana = "\\u30A0-\\u30FF"
kanji = "\\u3400-\\u9FFF"

print(re.sub(rf'((?=然|段)|(?![から{katakana}{kanji}]))(い)ました', r'\1た', '買いました'))
print(re.sub(rf'((?=然|段)|(?![から{katakana}{kanji}]))(い)ました', r'\1た', 'でいました'))
print(re.sub(rf'((?=然|段)|(?![から{katakana}{kanji}]))(い)ました', r'\1た', '向かいました'))
print(re.sub(rf'((?=然|段)|(?![から{katakana}{kanji}]))(い)ました', r'\1た', '弔いました'))
print(re.sub(rf'((?=然|段)|(?![から{katakana}{kanji}]))(い)ました', r'\1た', '計らいました'))
print(re.sub(rf'((?=然|段)|(?![から{katakana}{kanji}]))(い)ました', r'\1た', '当然いました'))
print(re.sub(rf'((?=然|段)|(?![から{katakana}{kanji}]))(い)ました', r'\1た', '普段いました'))
print(re.compile(rf'((?=然|段)|(?![から{katakana}{kanji}])).(い)ました').finditer('段いましたがそんなんでいました'))
print(re.compile(rf'((?=然|段)|(?![から{katakana}{kanji}])).(い)ました').search('買いました'))
print(re.compile(rf'((?=然|段)|(?![から{katakana}{kanji}])).(い)ました').search('弔いました'))
print(re.compile(rf'((?=然|段)|(?![から{katakana}{kanji}])).(い)ました').search('でいました'))
print(re.compile(rf'((?=然|段)|(?![から{katakana}{kanji}])).(い)ました').search('当然いました'))

print()

text = '普段いましたが、いつもはいましたし、買いました'
pattern = re.compile(rf'(?:然|段|[{hiragana}])いました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "いた" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("いた") - (end - ( start + 1 ) )

print(new_text)


text = '普段いましたが、いつもはいましたし、買いました'
pattern = re.compile(rf'(?!然|段|[{hiragana}]).いました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "った" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("った") - (end - ( start + 1 ) )

print(new_text)


text = '笑えましたし、魚を得ました'
pattern = re.compile(rf'(え|得)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "た" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("た") - (end - ( start + 1 ) )

print(new_text)


text = '咲きました、起きました、来ました、付きました、行きました、尽きました'
pattern = re.compile(rf'((?<=飽|生|活|起|尽)き|来|着)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "た" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("た") - (end - ( start + 1 ) )

print(new_text)


text = '咲きました、起きました、来ました、付きました、行きました、尽きました'
pattern = re.compile(rf'(?<=行)きました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+0] + "った" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("った") - (end - ( start + 0 ) )

print(new_text)


text = '咲きました、起きました、来ました、付きました、行きました、尽きました'
pattern = re.compile(rf'(?<!(?<=飽|生|活|起|尽|行)き|来|着)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    print(m)
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+-1] + "いた" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("いた") - (end - ( start + -1 ) )

print(new_text)


text = '行けました、泣けました'
pattern = re.compile(rf'(け)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "た" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("た") - (end - ( start + 1 ) )

print(new_text)


text = '指しました、屈しました、欲しました'
pattern = re.compile(rf'(し)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "た" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("た") - (end - ( start + 1 ) )

print(new_text)

text = '干せました、返せました、見せました'
pattern = re.compile(rf'(せ)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "た" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("た") - (end - ( start + 1 ) )

print(new_text)

text = '放ちました、朽ちました、打ちました'
pattern = re.compile(rf'((?<=落|堕|墜|朽|満|充)ち)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "た" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("た") - (end - ( start + 1 ) )

print(new_text)

text = '放ちました、朽ちました、打ちました'
pattern = re.compile(rf'((?<!落|堕|墜|朽|満|充)ち)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+0] + "った" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("った") - (end - ( start + 0 ) )

print(new_text)


text = '放てました、見てました、当てました'
pattern = re.compile(rf'(て)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "た" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("た") - (end - ( start + 1 ) )

print(new_text)

text = '死にました、似ました、煮ました'
pattern = re.compile(rf'(似|煮)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "た" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("た") - (end - ( start + 1 ) )

print(new_text)

text = '死にました、似ました、煮ました'
pattern = re.compile(rf'(死に)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "んだ" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("んだ") - (end - ( start + 1 ) )

print(new_text)


text = '死ねました、寝ました、跳ねました、撥ねました、刎ねました、真似ました、ごねました'
pattern = re.compile(rf'(ね|寝|似)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "た" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("た") - (end - ( start + 1 ) )

print(new_text)

text = '見ました、観ました、診ました、看ました、視ました、編みました、生みました、産みました、膿みました、倦みました、績みました、噛みました、咬みました、混みました、込みました、住みました、済みました、澄みました、棲みました、積みました、摘みました、飲みました、吞みました、食みました、揉みました、病みました、読みました、詠みました'
pattern = re.compile(rf'(見|視|観|看|診)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+1] + "た" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("た") - (end - ( start + 1 ) )

print(new_text)

text = '見ました、観ました、診ました、看ました、視ました、編みました、生みました、産みました、膿みました、倦みました、績みました、噛みました、咬みました、混みました、込みました、住みました、済みました、澄みました、棲みました、積みました、摘みました、飲みました、吞みました、食みました、揉みました、病みました、読みました、詠みました'
pattern = re.compile(rf'(み)ました')

new_text = text
offset = 0

for m in pattern.finditer(text):
    start, end = m.span()
    # offsetで文字列スライスを補正
    new_text = new_text[:start+offset+0] + "んだ" + new_text[end+offset:]
    # 置換文字数の差を加算
    offset += len("んだ") - (end - ( start + 0 ) )

print(new_text)