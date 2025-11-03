def numToTime(num):
  h = num // 3600
  lessH = num % 3600
  m = lessH // 60
  s = lessH % 60
  return f"{h:02}:{m:02}:{s:02}"