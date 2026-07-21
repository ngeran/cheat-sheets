---
title: Tailwind CSS
subtitle: Utility-First CSS
icon: Wind
color: primary
tags: [css, utility, frontend]
---

## Layout & Display
| Command | Description |
|---|---|
| `flex` | Flexbox container |
| `inline-flex` | Inline flexbox container |
| `grid` | CSS grid container |
| `block` | display: block |
| `inline-block` | display: inline-block |
| `inline` | display: inline |
| `hidden` | display: none |
| `contents` | display: contents (children join parent layout) |

## Flexbox & Grid Alignment
| Command | Description |
|---|---|
| `flex-row` | Main axis horizontal (default) |
| `flex-col` | Stack children vertically |
| `flex-wrap` | Allow children to wrap to new lines |
| `flex-1` | flex: 1 1 0% (grow to fill space) |
| `flex-auto` | flex: 1 1 auto |
| `flex-none` | flex: none (do not grow/shrink) |
| `items-center` | Align items on cross axis center |
| `items-start` | Align items on cross axis start |
| `items-end` | Align items on cross axis end |
| `justify-center` | Justify items on main axis center |
| `justify-between` | Max space between items |
| `place-content-center` | Align & justify content together |

## Grid Columns & Gap
| Command | Description |
|---|---|
| `grid-cols-1` | Single column grid |
| `grid-cols-2` | Two equal columns |
| `grid-cols-3` | Three equal columns |
| `grid-cols-12` | Twelve column grid |
| `col-span-2` | Span element across two columns |
| `gap-4` | 1rem gap between rows and columns |
| `gap-x-4` | 1rem column gap only |

## Spacing
| Command | Description |
|---|---|
| `p-4` | 1rem padding on all sides |
| `px-4` | 1rem horizontal padding (left/right) |
| `py-4` | 1rem vertical padding (top/bottom) |
| `pt-4` | 1rem top padding |
| `m-4` | 1rem margin on all sides |
| `mx-auto` | Center block horizontally |
| `mt-4` | 1rem top margin |
| `-mt-4` | Negative 1rem top margin |
| `space-y-4` | 1rem vertical space between children |
| `space-x-4` | 1rem horizontal space between children |

## Sizing
| Command | Description |
|---|---|
| `w-full` | width: 100% |
| `w-screen` | width: 100vw |
| `w-1/2` | width: 50% |
| `w-16` | width: 4rem |
| `h-full` | height: 100% |
| `h-screen` | height: 100vh |
| `min-h-screen` | min-height: 100vh |
| `max-w-md` | max-width: 28rem (content cap) |
| `max-w-7xl` | max-width: 80rem |

## Typography
| Command | Description |
|---|---|
| `text-sm` | 0.875rem font size |
| `text-base` | 1rem font size (default) |
| `text-lg` | 1.125rem font size |
| `text-xl` | 1.25rem font size |
| `text-2xl` | 1.5rem font size |
| `font-medium` | font-weight: 500 |
| `font-bold` | font-weight: 700 |
| `leading-tight` | Tight line height (1.25) |
| `tracking-tight` | Tight letter spacing (-0.025em) |
| `truncate` | Single-line ellipsis overflow |

## Colors & Background
| Command | Description |
|---|---|
| `text-gray-500` | Gray text color (500 shade) |
| `bg-white` | White background |
| `bg-blue-500` | Blue background (500 shade) |
| `bg-black/50` | Black background at 50% opacity |
| `text-blue-600` | Blue text (600 shade) |
| `border-gray-200` | Gray border color |
| `bg-gradient-to-r` | Horizontal gradient (Tailwind v3) |
| `from-blue-500` | Gradient start color |
| `to-purple-500` | Gradient end color |

## Borders & Radius
| Command | Description |
|---|---|
| `border` | 1px solid border on all sides |
| `border-2` | 2px border width |
| `border-t` | Top border only |
| `border-dashed` | Dashed border style |
| `rounded` | 0.25rem border radius |
| `rounded-md` | 0.375rem border radius |
| `rounded-lg` | 0.5rem border radius |
| `rounded-full` | Fully rounded (pill or circle) |

## Effects & Transitions
| Command | Description |
|---|---|
| `shadow` | Default box shadow |
| `shadow-md` | Medium box shadow |
| `shadow-lg` | Large box shadow |
| `opacity-50` | 50% element opacity |
| `blur` | Default blur filter |
| `backdrop-blur` | Blur content behind element |
| `ring` | Default 3px outline ring |
| `ring-blue-500` | Blue colored ring |
| `transition` | Transition common properties |
| `duration-200` | 200ms transition duration |

## Position & Overflow
| Command | Description |
|---|---|
| `relative` | position: relative |
| `absolute` | position: absolute |
| `fixed` | position: fixed |
| `sticky` | position: sticky |
| `top-0` | top: 0 |
| `z-10` | z-index: 10 |
| `overflow-hidden` | Clip overflowing content |
| `overflow-auto` | Scrollbars when content overflows |

## Responsive & State Variants
| Command | Description |
|---|---|
| `sm:` | min-width: 640px breakpoint |
| `md:` | min-width: 768px breakpoint |
| `lg:` | min-width: 1024px breakpoint |
| `xl:` | min-width: 1280px breakpoint |
| `hover:` | Apply on mouse hover |
| `focus:` | Apply on keyboard focus |
| `group-hover:` | Apply when parent group is hovered |
| `dark:` | Apply in dark color scheme |
| `focus-within:` | Apply when any child is focused |

## Configuration
| Command | Description |
|---|---|
| `tailwind.config.js` | Main config file (Tailwind v3) |
| `content` | Array of paths to scan for class names |
| `theme.extend` | Extend default theme without replacing it |
| `@tailwind base` | Inject Preflight base styles in CSS |
| `@apply` | Compose utility classes inside custom CSS |
| `@theme` | Define design tokens in CSS (Tailwind v4) |
