---
title: Python
subtitle: Batteries Included
icon: Code2
color: secondary
tags: [language, scripting, stdlib]
---

## Running & REPL
| Command | Description |
|---|---|
| `python3` | Launch interactive REPL |
| `python3 script.py` | Run a script |
| `python3 -i script.py` | Run then drop into the REPL |
| `python3 -m module` | Run a module as a script |
| `python3 -c "print('hi')"` | Execute a one-liner |
| `#!/usr/bin/env python3` | Portable shebang line |
| `python3 -m http.server 8000` | Serve the current dir over HTTP |
| `python3 -X dev` | Enable development-mode warnings |
| `breakpoint()` | Drop into the debugger |

## Strings
| Command | Description |
|---|---|
| `f"{x=}"` | Debug-format with name |
| `f"{x:.2f}"` | Format to two decimals |
| `f"{x:>10}"` | Right-align in width 10 |
| `s.split(',')` | Split on a delimiter |
| `'-'.join(items)` | Join an iterable with delimiter |
| `s.strip()` | Strip leading/trailing whitespace |
| `s.replace('a', 'b')` | Replace all occurrences |
| `s.find('x')` | Return index or `-1` |
| `s.upper()` / `s.lower()` | Case conversion |
| `s[::-1]` | Reverse via slice |

## Lists
| Command | Description |
|---|---|
| `lst.append(x)` | Add to end |
| `lst.extend(other)` | Append items from an iterable |
| `lst.insert(i, x)` | Insert at index |
| `lst.pop()` | Remove and return last |
| `lst.remove(x)` | Remove first matching value |
| `lst.sort()` | Sort in place |
| `lst.reverse()` | Reverse in place |
| `lst[1:3]` | Slice indices 1 through 2 |
| `lst[-1]` | Last element |
| `del lst[i]` | Delete by index |

## Dicts
| Command | Description |
|---|---|
| `d.get(k, default)` | Safe lookup with default |
| `d.keys()` | View of keys |
| `d.values()` | View of values |
| `d.items()` | View of (key, value) pairs |
| `d.update(other)` | Merge another dict in place |
| `d.setdefault(k, default)` | Set only if missing |
| `k in d` | Test key membership |
| `d.pop(k)` | Remove key, return value |
| `d1 \| d2` | Merge dicts (3.9+) |
| `{k: v for k, v in pairs}` | Dict comprehension |

## Sets & Tuples
| Command | Description |
|---|---|
| `{1, 2, 3}` | Set literal |
| `s.add(x)` | Add element |
| `s.discard(x)` | Remove if present (no error) |
| `a \| b` | Set union |
| `a & b` | Set intersection |
| `a - b` | Set difference |
| `a ^ b` | Symmetric difference |
| `t = (1, 2, 3)` | Tuple literal |
| `a, b = pair` | Tuple unpacking |

## Files & I/O
| Command | Description |
|---|---|
| `open('f.txt', encoding='utf-8')` | Open with encoding |
| `open('f.txt', 'w')` | Open for write (truncates) |
| `open('f.txt', 'a')` | Open for append |
| `with open('f.txt') as f:` | Auto-close on exit |
| `f.read()` | Read entire file |
| `f.readline()` | Read one line |
| `for line in f:` | Iterate lines lazily |
| `f.write(s)` | Write a string |
| `Path('f').read_text()` | Read whole file via pathlib |
| `Path('f').write_text(s)` | Write whole file via pathlib |

## Functions
| Command | Description |
|---|---|
| `def f(a, b=2):` | Default argument |
| `def f(*args, **kwargs):` | Variadic args |
| `lambda x: x * 2` | Anonymous function |
| `def f(x: int) -> str:` | Type hints |
| `def f(a, /, b, *, c):` | Positional, regular, keyword-only |
| `return a, b` | Return tuple implicitly |
| `from typing import Optional` | Type hint module |
| `def f(*, key=None):` | Keyword-only args |
| `@staticmethod` | Static method decorator |

## Comprehensions
| Command | Description |
|---|---|
| `[x*2 for x in xs]` | List comprehension |
| `{k: v for k, v in pairs}` | Dict comprehension |
| `{x for x in xs}` | Set comprehension |
| `(x*2 for x in xs)` | Generator expression |
| `[x for x in xs if x > 0]` | Filtered comprehension |
| `[x if c else 0 for x in xs]` | Ternary expression |
| `[x for row in m for x in row]` | Flatten nested iterables |
| `sum(x*2 for x in xs)` | Pass genexpr to a builtin |

## Modules & venv/pip
| Command | Description |
|---|---|
| `python3 -m venv .venv` | Create virtual environment |
| `source .venv/bin/activate` | Activate venv (POSIX) |
| `.venv\Scripts\activate` | Activate venv (Windows) |
| `pip install pkg` | Install a package |
| `pip install pkg==1.2.3` | Install pinned version |
| `pip install -r requirements.txt` | Install from requirements file |
| `pip list` | List installed packages |
| `pip freeze > requirements.txt` | Pin current env to file |
| `pip uninstall pkg` | Remove a package |

## Built-ins
| Command | Description |
|---|---|
| `enumerate(xs)` | Yield (index, value) pairs |
| `zip(a, b)` | Pair iterables element-wise |
| `map(f, xs)` | Apply f to each element |
| `filter(pred, xs)` | Keep matching elements |
| `sorted(xs, key=f)` | New sorted list |
| `reversed(xs)` | Reverse iterator |
| `any(xs)` | True if any element truthy |
| `all(xs)` | True if all elements truthy |
| `range(0, 10, 2)` | Start, stop, step |
| `isinstance(x, int)` | Type check |

## re (regex)
| Command | Description |
|---|---|
| `re.search(p, s)` | First match anywhere |
| `re.match(p, s)` | Match at start only |
| `re.fullmatch(p, s)` | Match entire string |
| `re.findall(p, s)` | All non-overlapping matches |
| `re.sub(p, repl, s)` | Substitute matches |
| `re.split(p, s)` | Split on a pattern |
| `re.compile(p)` | Pre-compile for reuse |
| `r'\d+'` | One or more digits |
| `r'(?P<name>\w+)'` | Named capture group |
| `m.group(1)` | Get captured group |
