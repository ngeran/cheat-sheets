---
title: Neovim
subtitle: The Editor
icon: TerminalSquare
color: primary
tags: [editor, cli, lua]
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
| `:` | Command-line mode |
| `Esc` | Return to Normal mode |
| `R` | Replace mode |

## Navigation
| Command | Description |
|---|---|
| `h j k l` | Left, down, up, right |
| `w` / `W` | Next word / WORD (punctuation-aware vs whitespace-only) |
| `b` / `B` | Previous word / WORD |
| `e` / `E` | End of word / WORD |
| `0` / `^` | Start of line / first non-blank char |
| `$` | End of line |
| `gg` / `G` | First / last line of file |
| `:{N}` | Jump to line N |
| `%` | Jump to matching bracket |
| `{` / `}` | Previous / next blank line (paragraph) |
| `Ctrl+d` / `Ctrl+u` | Half page down / up |
| `Ctrl+f` / `Ctrl+b` | Full page down / up |

## Editing
| Command | Description |
|---|---|
| `x` | Delete character under cursor |
| `dd` | Delete current line |
| `dw` | Delete to start of next word |
| `D` | Delete to end of line |
| `yy` | Yank (copy) current line |
| `Y` | Yank to end of line |
| `p` / `P` | Paste after / before cursor |
| `u` | Undo |
| `Ctrl+r` | Redo |
| `cc` / `C` | Change line / change to end of line |
| `cw` | Change to end of word |
| `r{char}` | Replace single character |
| `~` | Toggle case of character under cursor |
| `J` | Join line below with current line |
| `.` | Repeat last change |

## Text Objects
| Command | Description |
|---|---|
| `iw` / `aw` | Inner / around word |
| `is` / `as` | Inner / around sentence |
| `ip` / `ap` | Inner / around paragraph |
| `i"` / `a"` | Inner / around double quotes |
| `i'` / `a'` | Inner / around single quotes |
| `i(` / `a(` | Inner / around parentheses |
| `i[` / `a[` | Inner / around square brackets |
| `i{` / `a{` | Inner / around curly braces |
| `it` / `at` | Inner / around HTML/XML tag |

## Search & Replace
| Command | Description |
|---|---|
| `/pattern` | Search forward |
| `?pattern` | Search backward |
| `n` / `N` | Next / previous match |
| `*` / `#` | Search word under cursor forward / backward |
| `:s/old/new/` | Replace first match on current line |
| `:s/old/new/g` | Replace all matches on current line |
| `:%s/old/new/g` | Replace all matches in file |
| `:%s/old/new/gc` | Replace in file, confirm each match |
| `:noh` | Clear search highlighting |

## Splits & Windows
| Command | Description |
|---|---|
| `:sp` / `:vsp` | Horizontal / vertical split |
| `Ctrl+w s` / `Ctrl+w v` | Horizontal / vertical split |
| `Ctrl+w h j k l` | Move between splits |
| `Ctrl+w H J K L` | Move split to screen edge |
| `Ctrl+w =` | Equalize split sizes |
| `Ctrl+w _` / `Ctrl+w \|` | Maximize height / width |
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

## Files & Buffers
| Command | Description |
|---|---|
| `:e {file}` | Edit file |
| `:w` | Save |
| `:wq` / `:x` | Save and quit |
| `:q` | Quit window |
| `:q!` | Quit without saving |
| `:wqa` | Save all buffers and quit |
| `:ls` | List open buffers |
| `:bn` / `:bp` | Next / previous buffer |
| `:bd` | Delete (close) buffer |
| `Ctrl+^` | Toggle between last two buffers |

## Macros
| Command | Description |
|---|---|
| `q{a-z}` | Start recording macro into register |
| `q` | Stop recording |
| `@{a-z}` | Play macro |
| `@@` | Repeat last macro |
| `{N}@{a-z}` | Play macro N times |
| `:reg` | View all registers |

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
| `:checkhealth` | Run health diagnostics |
