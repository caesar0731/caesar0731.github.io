# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean-language tech blog (caesar0731.github.io) built with Jekyll and hosted on GitHub Pages. Uses the **minimal-mistakes** remote theme with a custom dark mode toggle.

## Build & Development Commands

```bash
# Install dependencies
bundle install

# Run local dev server (http://localhost:4000)
bundle exec jekyll serve

# Build static site (output to _site/)
bundle exec jekyll build
```

No CI/CD pipeline — GitHub Pages builds automatically from `main` branch on push.

## Blog Post Conventions

- File naming: `_posts/YYYY-MM-DD-Title.md` (Korean titles allowed)
- Required frontmatter:

```yaml
---
title: "제목"
tags: TagName
lastmod: YYYY-MM-DD HH:MM:SS
sitemap:
    changefreq: daily
    priority: 0.5
comments: true
---
```

- `published: false` can be added for drafts
- Layout defaults to "single" via `_config.yml`; no need to specify in frontmatter

## Architecture

**Theme**: minimal-mistakes-jekyll (loaded as remote theme — no local layout files; overrides only)

**Dark mode toggle** — custom implementation across three files:
- `_includes/masthead.html` — toggle checkbox in navigation header
- `assets/js/custom/dark-theme.js` — toggle logic with localStorage persistence + `prefers-color-scheme` detection
- `assets/css/main_dark.scss` — alternate dark stylesheet swapped at runtime

**Custom styling**:
- `_sass/custom/customImport.scss` — Google Fonts (Nanum Gothic) and Material Icons
- `_sass/custom/toggle.scss` — dark mode toggle button styles
- `_sass/custom/customOverride.scss` — general theme overrides

**Comments**: utterances (GitHub issues-based), configured in `_config.yml`
