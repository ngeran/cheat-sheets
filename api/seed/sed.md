---
title: sed
subtitle: Stream Editor
icon: Regex
color: secondary
tags: [cli, regex, text-processing]
---

## Basics
| Command | Description |
|---|---|
| `sed 's/old/new/' file` | Replace first match per line, print to stdout |
| `sed 's/old/new/g' file` | Replace all matches per line |
| `sed -n 'p' file` | Suppress default output (use with `p` to print explicitly) |
| `sed -i 's/old/new/g' file` | Edit file in place |
| `sed -i.bak 's/old/new/g' file` | Edit in place, keep a `.bak` backup |
| `sed -e 'cmd1' -e 'cmd2' file` | Run multiple sed commands |
| `sed -f script.sed file` | Run commands from a script file |

## Substitution Flags
| Command | Description |
|---|---|
| `s/old/new/g` | Replace all occurrences on each line |
| `s/old/new/2` | Replace only the 2nd occurrence per line |
| `s/old/new/2g` | Replace from the 2nd occurrence onward |
| `s/old/new/i` | Case-insensitive match |
| `s/old/new/p` | Print the line if a substitution occurred |
| `s/pattern/\U&/` | Uppercase the matched text |
| `s/pattern/\L&/` | Lowercase the matched text |

## Addressing (which lines to act on)
| Command | Description |
|---|---|
| `sed '3s/old/new/' file` | Act only on line 3 |
| `sed '2,5s/old/new/' file` | Act on lines 2 through 5 |
| `sed '/pattern/s/old/new/' file` | Act on lines matching pattern |
| `sed '/start/,/end/s/old/new/' file` | Act between two pattern matches |
| `sed '$s/old/new/' file` | Act only on the last line |
| `sed '1!s/old/new/' file` | Act on all lines except line 1 |

## Deleting Lines
| Command | Description |
|---|---|
| `sed '3d' file` | Delete line 3 |
| `sed '2,4d' file` | Delete lines 2 through 4 |
| `sed '/pattern/d' file` | Delete lines matching pattern |
| `sed '/^$/d' file` | Delete blank lines |
| `sed '$d' file` | Delete the last line |

## Printing & Selection
| Command | Description |
|---|---|
| `sed -n '5p' file` | Print only line 5 |
| `sed -n '2,4p' file` | Print lines 2 through 4 |
| `sed -n '/pattern/p' file` | Print lines matching pattern |
| `sed -n '1~2p' file` | Print every other line, starting at line 1 |
| `sed -n '$=' file` | Print total number of lines |

## Regex Reference (BRE, used by default)
| Command | Description |
|---|---|
| `.` | Any single character |
| `*` | Zero or more of the previous character |
| `^` / `$` | Start / end of line |
| `[abc]` | Any one of a, b, c |
| `[^abc]` | Any character except a, b, c |
| `\(...\)` | Capture group (BRE requires escaping) |
| `\1` | Backreference to capture group 1 |
| `sed -E` | Enable extended regex (unescaped `()`, `+`, `?`, `\|`) |

## Advanced (hold space & multi-line)
| Command | Description |
|---|---|
| `h` / `H` | Copy / append pattern space to hold space |
| `g` / `G` | Copy / append hold space to pattern space |
| `x` | Swap pattern space and hold space |
| `N` | Append next line to pattern space |
| `sed 'N;s/\n/ /'` | Join every pair of lines with a space |
| `sed -z 's/\n/,/g'` | Treat whole input as one line, join with commas |
