# OS Algorithm Lab

Interactive simulators for four classic operating system topics. Plain HTML, CSS and JavaScript: no build step, no dependencies.

| Page | File | Algorithms |
|------|------|------------|
| Home | `index.html` | Introduction and links |
| CPU scheduling | `cpu.html` | FCFS, SJF, SRTF, Priority, Round robin |
| Banker's algorithm | `banker.html` | Safety check, safe sequence, resource requests |
| Page replacement | `page-replacement.html` | FIFO, LRU, Optimal |
| Disk scheduling | `disk.html` | FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK |

Each simulator ends with a comparison table, a bar chart and a short verdict.

## Project structure

```
index.html
cpu.html
banker.html
page-replacement.html
disk.html
css/style.css          shared styles (light and dark theme)
js/common.js           shared helpers and theme toggle
js/cpu.js              CPU scheduling logic
js/banker.js           Banker's algorithm logic
js/page-replacement.js page replacement logic
js/disk.js             disk scheduling logic
```

## Run locally

Open `index.html` in any browser. To serve it over HTTP instead:

```
python3 -m http.server 8000
```

then visit http://localhost:8000.

## Publish with GitHub Pages

1. Push this repository to GitHub.
2. Open Settings, then Pages.
3. Set Source to "Deploy from a branch", choose `main` and `/ (root)`, and save.
4. The site appears at `https://<your-username>.github.io/<repository-name>/`.
