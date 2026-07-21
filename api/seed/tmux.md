---
title: Tmux
subtitle: Terminal Multiplexer
icon: LayoutGrid
color: secondary
tags: [shell, multiplexer]
---

## Sessions
| Command | Description |
|---|---|
| `tmux new -s name` | Start a named session |
| `tmux attach -t name` | Attach to a session |
| `tmux ls` | List sessions |
| `Ctrl+b d` | Detach from session |

## Panes
| Command | Description |
|---|---|
| `Ctrl+b %` | Split vertically |
| `Ctrl+b "` | Split horizontally |
| `Ctrl+b arrow` | Move between panes |
| `Ctrl+b x` | Kill current pane |

## Windows
| Command | Description |
|---|---|
| `Ctrl+b c` | New window |
| `Ctrl+b n` / `p` | Next / prev window |
| `Ctrl+b ,` | Rename window |
