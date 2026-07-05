# Leo

A memorial for Leo. 2018 – 2025.

Live at: https://bijinabraham.github.io/leo/

## Local preview

```bash
cd leo
python3 -m http.server 8000
```

Open http://localhost:8000

## Editing the text

Open `index.html` in any editor. The essay lives in `<section class="story-block">` blocks. Photo captions live inside `<figcaption>` tags.

## Editing photos

Photos live in `photos/`. To reprocess from originals, run `scripts/process-photos.sh`.

## Deploying

```bash
git add .
git commit -m "update"
GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null git push origin main
```

GitHub Pages auto-rebuilds within ~1 minute.
