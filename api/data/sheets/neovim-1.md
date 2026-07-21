---
title: Neovim
subtitle: The Editor
icon: TerminalSquare
color: primary
tags:
- editor
- cli
- lua
---

## Modes
| Command | Description |
|---|---|
| `i` | Insert before cursor |
| `I` | Insert at first non-blank of line |
| `a` | Insert after cursor |
| `A` | Insert at end of line |
| `o` | Open line below, insert |
| `O` | Open line above, insert |
| `v` | Visual mode (character) |
| `V` | Visual mode (line) |
| `Ctrl+v` | Visual mode (block) |
| `gv` | Reselect last visual selection |
| `:` | Command-line mode |
| `Esc` / `Ctrl+[` | Return to Normal mode |
| `R` | Replace mode |
| `gi` | Insert at last insert position |

## Navigation
| Command | Description |
|---|---|
| `h j k l` | Left, down, up, right |
| `w` / `W` | Next word / WORD (punctuation-aware vs whitespace-only) |
| `b` / `B` | Previous word / WORD |
| `e` / `E` | End of word / WORD |
| `ge` / `gE` | End of previous word / WORD |
| `0` / `^` | Start of line / first non-blank char |
| `$` | End of line |
| `gg` / `G` | First / last line of file |
| `:{N}` or `{N}G` | Jump to line N |
| `%` | Jump to matching bracket |
| `{` / `}` | Previous / next blank line (paragraph) |
| `(` / `)` | Previous / next sentence |
| `H` / `M` / `L` | Top / middle / bottom of visible screen |
| `zz` / `zt` / `zb` | Center / top / bottom current line on screen |
| `Ctrl+d` / `Ctrl+u` | Half page down / up |
| `Ctrl+f` / `Ctrl+b` | Full page down / up |
| `Ctrl+e` / `Ctrl+y` | Scroll one line down / up (cursor stays) |

## Editing
| Command | Description |
|---|---|
| `x` / `X` | Delete character under / before cursor |
| `dd` | Delete current line |
| `dw` | Delete to start of next word |
| `d$` / `D` | Delete to end of line |
| `d0` | Delete to start of line |
| `dG` / `dgg` | Delete to end / start of file |
| `yy` | Yank (copy) current line |
| `Y` | Yank to end of line |
| `yw` | Yank word |
| `p` / `P` | Paste after / before cursor |
| `]p` / `[p` | Paste and adjust indent to current line |
| `u` | Undo |
| `Ctrl+r` | Redo |
| `cc` / `C` | Change line / change to end of line |
| `cw` | Change to end of word |
| `s` / `S` | Substitute character / line |
| `r{char}` | Replace single character |
| `~` | Toggle case of character under cursor |
| `guu` / `gUU` | Lowercase / uppercase current line |
| `J` / `gJ` | Join line below (with / without space) |
| `>>` / `<<` | Indent / unindent line |
| `.` | Repeat last change |
| `Ctrl+a` / `Ctrl+x` | Increment / decrement number under cursor |

## Text Objects
| Command | Description |
|---|---|
| `iw` / `aw` | Inner / around word |
| `is` / `as` | Inner / around sentence |
| `ip` / `ap` | Inner / around paragraph |
| `i"` / `a"` | Inner / around double quotes |
| `i'` / `a'` | Inner / around single quotes |
| `` i` `` / `` a` `` | Inner / around backticks |
| `i(` / `a(` | Inner / around parentheses |
| `i[` / `a[` | Inner / around square brackets |
| `i{` / `a{` | Inner / around curly braces |
| `it` / `at` | Inner / around HTML/XML tag |

## Search & Replace
| Command | Description |
|---|---|
| `/pattern` | Search forward |
| `?pattern` | Search backward |
| `n` / `N` | Repeat search forward / opposite direction |
| `*` / `#` | Search word under cursor forward / backward |
| `g*` / `g#` | Same but partial-word match |
| `:s/old/new/` | Replace first match on current line |
| `:s/old/new/g` | Replace all matches on current line |
| `:%s/old/new/g` | Replace all matches in file |
| `:%s/old/new/gc` | Replace in file, confirm each match |
| `:'<,'>s/old/new/g` | Replace within visual selection |
| `:noh` | Clear search highlighting |

## Splits & Windows
| Command | Description |
|---|---|
| `:sp` / `:vsp` | Horizontal / vertical split |
| `Ctrl+w s` / `Ctrl+w v` | Horizontal / vertical split |
| `Ctrl+w h j k l` | Move between splits |
| `Ctrl+w H J K L` | Move split to screen edge |
| `Ctrl+w =` | Equalize split sizes |
| `Ctrl+w _` | Maximize split height |
| `Ctrl+w vbar` | Maximize split width (the vertical-bar key, next to Enter) |
| `Ctrl+w r` | Rotate splits |
| `Ctrl+w q` | Close current split |
| `Ctrl+w o` | Close all other splits |

## Tabs
| Command | Description |
|---|---|
| `:tabnew` | Open new tab |
| `:tabnew {file}` | Open file in new tab |
| `gt` / `gT` | Next / previous tab |
| `:tabclose` | Close current tab |
| `:tabonly` | Close all other tabs |
| `{N}gt` | Jump to tab N |
| `:tabmove {N}` | Move current tab to position N |

## Files & Buffers
| Command | Description |
|---|---|
| `:e {file}` | Edit file |
| `:w` | Save |
| `:w {file}` | Write a copy to a new file |
| `:wq` / `:x` | Save and quit |
| `:q` | Quit window |
| `:q!` | Quit without saving |
| `:wqa` | Save all buffers and quit |
| `:ls` / `:buffers` | List open buffers |
| `:bn` / `:bp` | Next / previous buffer |
| `:bd` | Delete (close) buffer |
| `:b {N}` | Switch to buffer N |
| `Ctrl+^` | Toggle between last two buffers |

## Marks & Jumps
| Command | Description |
|---|---|
| `m{a-z}` | Set local mark |
| `m{A-Z}` | Set global (cross-file) mark |
| `` '{mark} `` | Jump to mark's line, first non-blank |
| `` `{mark} `` | Jump to mark's exact position |
| `` '' `` | Jump to position before last jump |
| `Ctrl+o` / `Ctrl+i` | Back / forward through jump list |
| `:marks` | List all marks |

## Registers
| Command | Description |
|---|---|
| `"{reg}y` | Yank into named register |
| `"{reg}p` | Paste from named register |
| `"+y` / `"+p` | Yank / paste from system clipboard |
| `"0p` | Paste from the yank register (last yank, not delete) |
| `"_d` | Delete into the black-hole register (no register overwrite) |
| `:reg` | View contents of all registers |

## Macros
| Command | Description |
|---|---|
| `q{a-z}` | Start recording macro into register |
| `q` | Stop recording |
| `@{a-z}` | Play macro |
| `@@` | Repeat last macro |
| `{N}@{a-z}` | Play macro N times |

## Folding
| Command | Description |
|---|---|
| `zf{motion}` | Create a fold over motion |
| `zo` / `zc` | Open / close fold under cursor |
| `za` | Toggle fold under cursor |
| `zR` / `zM` | Open all / close all folds |
| `zj` / `zk` | Move to next / previous fold |
| `zd` | Delete fold under cursor |

## Quickfix & Location List
| Command | Description |
|---|---|
| `:copen` / `:cclose` | Open / close quickfix window |
| `:cn` / `:cp` | Next / previous quickfix item |
| `:lopen` / `:lclose` | Open / close location list |
| `:ln` / `:lp` | Next / previous location list item |
| `:grep {pattern}` | Populate quickfix with grep results |
| `:vimgrep /pattern/ **/*.py` | Search files, populate quickfix |

## Diff Mode
| Command | Description |
|---|---|
| `nvim -d file1 file2` | Open two files in diff mode |
| `]c` / `[c` | Next / previous diff hunk |
| `do` | Diff-obtain (pull change from other buffer) |
| `dp` | Diff-put (push change to other buffer) |
| `:diffupdate` | Recompute diff highlighting |

## Command-line & Ex Ranges
| Command | Description |
|---|---|
| `:%` | Whole file range |
| `:1,10` | Lines 1 through 10 |
| `:.,$` | Current line to end of file |
| `:'<,'>` | Visual selection range |
| `Ctrl+f` (in cmdline) | Open command-line window for editing |
| `q:` | Open command-line history window |
| `:g/pattern/d` | Delete every line matching pattern |
| `:g/pattern/normal @a` | Run macro `a` on every matching line |

## LSP & Diagnostics
| Command | Description |
|---|---|
| `K` | Hover documentation |
| `gd` | Go to local declaration |
| `grr` | Find references |
| `gri` | Go to implementation |
| `grn` | Rename symbol |
| `gra` | Code action |
| `gO` | Document symbols |
| `]d` / `[d` | Next / previous diagnostic |
| `Ctrl+S` (Insert) | Signature help |
| `:checkhealth` | Run health diagnostics |

## Terminal & Sessions
| Command | Description |
|---|---|
| `:terminal` | Open built-in terminal |
| `Ctrl+\ Ctrl+n` | Exit terminal mode to Normal mode |
| `:mksession {file}` | Save current session (windows, buffers, layout) |
| `nvim -S {file}` | Restore a saved session |
| `:set spell` | Enable spell check |
| `]s` / `[s` | Next / previous misspelled word |
| `z=` | Suggest spelling corrections |
