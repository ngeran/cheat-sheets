---
title: Hugo
subtitle: Static Site Generator
icon: LayoutTemplate
color: secondary
tags: [ssg, go, static-site]
---

## Project & CLI
| Command | Description |
|---|---|
| `hugo new site mysite` | Scaffold a new site in `mysite/` |
| `hugo new content posts/hello.md` | Create content from archetype (v0.118+ explicit form) |
| `hugo new posts/hello.md` | Legacy shorthand for `hugo new content` |
| `hugo server` | Start dev server at `http://localhost:1313/` with live reload |
| `hugo server -D` / `-F` / `-E` | Serve drafts / future / expired content |
| `hugo server --bind 0.0.0.0 --baseURL http://0.0.0.0:1313` | Expose dev server on the LAN |
| `hugo` | Build site into `public/` (production) |
| `hugo --gc --minify` | Build with garbage collection and minified output |
| `hugo --destination dist/` | Build to a custom output directory |
| `hugo --baseURL https://example.org/` | Override `baseURL` for this build |
| `hugo version` / `hugo env` | Print version / version plus environment info |
| `hugo config` | Print the resolved merged configuration |
| `hugo list drafts` / `hugo list future` / `hugo list expired` | List content in those states |

## Hugo Modules
| Command | Description |
|---|---|
| `hugo mod init github.com/me/repo` | Initialize the project as a Hugo Module |
| `hugo mod get -u` | Update all module dependencies to latest |
| `hugo mod get -u github.com/x/y` | Update a single module to latest |
| `hugo mod vendor` | Vendor dependencies into `_vendor/` for offline builds |
| `hugo mod clean` | Clean the modules cache |
| `[module] imports = [{ path = "github.com/x/y" }]` | Mount a theme or component via `hugo.toml` |

## Content & Frontmatter
| Command | Description |
|---|---|
| `draft: true` | Mark page as draft (excluded unless `--buildDrafts`) |
| `title: "Hello"` | Page title (used by templates and `<title>`) |
| `date: 2024-06-01T10:00:00Z` | Publish date in RFC3339 format |
| `lastmod` / `publishDate` / `expiryDate` | Lifecycle timestamps (RFC3339) |
| `slug: "hello-world"` / `url: "/custom/path/"` | Override the URL slug / the full URL |
| `aliases: ["/old/path/"]` | Generate HTTP redirects to this page |
| `weight: 10` / `type: "post"` / `layout: "single"` | Sort order / layout selection |
| `tags: ["a","b"]` / `categories: ["x"]` | Built-in taxonomy terms |
| `[params]` block / `cascade` | Custom params via `{{ .Params.x }}`; `cascade` propagates to descendants |
| `_index.md` | Branch / section list page (uses list template) |
| `index.md` (leaf bundle) | Page bundle root, supports co-located images and resources |

## Archetypes
| Command | Description |
|---|---|
| `archetypes/default.md` | Default template used by `hugo new` |
| `archetypes/<section>.md` | Section-specific archetype matched to content section |
| `hugo new --kind post posts/hello.md` | Create content using the `post` archetype |
| `hugo new --kind bundle posts/hello/index.md` | Use a multi-file archetype bundle |
| `{{ .Title }}` / `{{ .Date }}` | Placeholders expanded in archetype frontmatter |

## Shortcodes
| Command | Description |
|---|---|
| `{{< ref "about.md" >}}` | Resolve a page to its absolute `Permalink` |
| `{{< relref "about.md" >}}` | Resolve a page to its relative URL |
| `{{< figure src="image.jpg" alt="..." title="..." >}}` | Markdown-friendly `<figure>` with caption |
| `{{< youtube w7Ft2xyGk6g >}}` | Embed a YouTube video by ID |
| `{{< vimeo 123456789 >}}` / `{{< instagram ID >}}` | Embed Vimeo or Instagram by ID |
| `{{< highlight go "linenos=table,hl_lines=2-3" >}}...{{< /highlight >}}` | Syntax-highlighted code with options |
| `{{< gist spf13 7896402 >}}` | Embed a GitHub gist (user + ID) |
| `{{< twitter user status_id >}}` | Embed an X (Twitter) post |
| `{{< param author.name >}}` | Render a page or site param |
| `{{% shortcode %}}...{{% /shortcode %}}` | `%` delimiters process the shortcode body as Markdown |

## Page Variables
| Command | Description |
|---|---|
| `{{ .Title }}` | Page title |
| `{{ .Content }}` | Rendered HTML content |
| `{{ .Summary }}` | Auto or manual summary (controlled by `summaryLength`) |
| `{{ .Permalink }}` / `{{ .RelPermalink }}` | Absolute / relative URL |
| `{{ .Pages }}` / `{{ .Sections }}` | Child pages / subsections |
| `{{ .Params.<key> }}` | Page param from frontmatter |
| `{{ .Site.Title }}` / `{{ .Site.BaseURL }}` / `{{ .Site.Params.x }}` | Site-level values |
| `{{ .Date }}` / `{{ .Lastmod }}` | Publish / last-modified time |
| `{{ .WordCount }}` / `{{ .ReadingTime }}` | Word count / reading minutes |
| `{{ .TableOfContents }}` | Rendered TOC from headings |
| `{{ .IsHome }}` / `{{ .IsPage }}` / `{{ .IsSection }}` | Page-type flags |

## Template Actions & Partials
| Command | Description |
|---|---|
| `{{ range .Pages }}...{{ end }}` | Iterate child pages |
| `{{ range $i, $p := .Pages }}...{{ end }}` | Iterate with index and value |
| `{{ with .Params.author }}...{{ end }}` | Block-scoped binding when non-empty |
| `{{ if eq .Type "post" }}...{{ else }}...{{ end }}` | Conditional |
| `{{ partial "head.html" . }}` | Include partial, passing context (`.`) |
| `{{ partialCached "header.html" . "header" }}` | Cache partial by key for performance |
| `{{ block "main" . }}...{{ end }}` | Define an overridable block in a base template |
| `{{ define "main" }}...{{ end }}` | Override a block from another template |

## Template Functions
| Command | Description |
|---|---|
| `{{ where .Pages "Section" "eq" "posts" }}` | Filter slice by field (operator optional) |
| `{{ sort .Pages "Date" "desc" }}` | Sort by field, optional order |
| `{{ delimit .Params.tags ", " }}` | Join slice to string with separator |
| `{{ first 5 .Pages }}` / `{{ last 5 .Pages }}` / `{{ after 10 .Pages }}` | Slice helpers |
| `{{ default "fallback" .Params.title }}` | Use fallback if value is empty |
| `{{ cond (eq .Type "post") "yes" "no" }}` | Ternary helper |
| `{{ urlize "Hello World" }}` | Convert string to a URL-safe slug |
| `{{ truncate 100 "..." .Summary }}` | Truncate string to N characters |
| `{{ printf "%s/%d" .Slug .Year }}` | Format a string |
| `{{ safeHTML "<em>x</em>" }}` / `safeURL` / `safeCSS` | Mark a string safe for output |

## Taxonomies & Menus
| Command | Description |
|---|---|
| `tags: ["a","b"]` / `categories: ["x"]` | Built-in taxonomy terms in frontmatter |
| `[taxonomies] tag = "tags"` | Define taxonomies in `hugo.toml` |
| `{{ range .Site.Taxonomies.tags }}` | Iterate all tag terms |
| `{{ range $term, $pages := .Site.Taxonomies.tags }}` | Term plus weighted pages |
| `{{ range .Site.Taxonomies.tags.go }}` | Pages tagged `go` |
| `/tags/` / `/categories/` | Auto-generated taxonomy list pages |
| `menu: main` (frontmatter) | Add a page to the `main` menu |
| `[[menus.main]] name = "About" pageRef = "/about/" weight = 10` | Define a menu in `hugo.toml` |
| `{{ range .Site.Menus.main }}` | Iterate menu entries |
| `{{ .URL }}` / `{{ .Name }}` / `{{ .Pre }}` / `{{ .Identifier }}` | Menu entry fields |

## Configuration
| Command | Description |
|---|---|
| `baseURL = "https://example.org/"` | Absolute base URL |
| `languageCode = "en-us"` / `title = "My Site"` | Site language and title |
| `theme = ["mytheme"]` | One or more themes (applied in order) |
| `enableRobotsTXT = true` / `enableGitInfo = true` / `enableEmoji = true` | Common build flags |
| `summaryLength = 70` / `paginate = 10` | Summary word count / list page size |
| `[params]` block | Site-wide params via `{{ .Site.Params.x }}` |
| `[permalinks] posts = "/:year/:month/:slug/"` | Permalink format tokens |
| `[markup.goldmark.renderer] unsafe = true` | Allow raw HTML in Markdown |
| `[markup.highlight] style = "monokai" lineNos = true` | Chroma syntax highlight config |
| `[markup.tableOfContents]` / `[outputs]` | TOC levels / output formats per page kind |

## Assets & Pipes
| Command | Description |
|---|---|
| `{{ $scss := resources.Get "scss/main.scss" }}` | Load an asset from `assets/` |
| `{{ $css := css.Sass $scss }}` | Compile SCSS/Sass to CSS |
| `{{ $js := js.Build (resources.Get "js/main.js") }}` | Bundle JS with esbuild |
| `{{ $out := fingerprint (minify $css) }}` | Minify and add integrity hash + versioned URL |
| `{{ $out.Permalink }}` / `{{ $out.RelPermalink }}` / `{{ $out.Content }}` | Resource URL / content |
| `{{ resources.Concat "bundle.js" (slice $a $b) }}` | Concatenate multiple resources |
| `{{ $img.Resize "800x" }}` / `{{ $img.Fit "200x200" }}` / `{{ $img.Fill "100x100" }}` | Image processing methods |
| `{{ resources.ExecuteAsTemplate "out.css" . }}` | Execute a resource as a Go template |
| `{{ resources.GetRemote "https://example.com/data.json" }}` | Fetch a remote resource (gated by `[security]`) |

## Build & Deploy
| Command | Description |
|---|---|
| `public/` directory | Default build output, deploy this folder |
| `hugo --gc --minify --cleanDestinationDir` | Recommended production build command |
| `hugo deploy --target mytarget` | Deploy via a configured target (S3/GCS/Azure/CloudFront) |
| `[[deployment.targets]] URL = "s3://bucket?region=us-east-1"` | Deployment target config in `hugo.toml` |
| `[[deployment.matchers]] pattern = "..." cacheControl = "..."` | Set `Cache-Control` headers per path pattern |
| `sitemap.xml` / `robots.txt` / `index.xml` | Auto-generated sitemap, robots (when enabled), and RSS feeds |
| `enableGitInfo = true` | Populate `.Lastmod` and `.GitInfo` from Git history |
