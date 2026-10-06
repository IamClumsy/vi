# Void Idle Tools

A static site: eight tool pages plus a hub page. There is no build step.

## Deploy to Vercel

From the dashboard: push this folder to a GitHub repo. In Vercel choose Add New, then Project, import the repo, set Framework Preset to Other, leave the build command empty and keep the root as the output directory. Then deploy.

From the command line: run `npx vercel` in this folder, then `npx vercel --prod` to publish.

## Pages

| Path | Page |
| --- | --- |
| `/` | Hub with links to every tool |
| `/new-player` | New Player Build |
| `/bow-planner` | Bow Planner |
| `/bow-roadmap` | Bow Roadmap |
| `/bow-endgame` | Bow Endgame |
| `/bow-build` | Bow Build Guide |
| `/general-planner` | General Planner |
| `/general-roadmap` | General Roadmap |
| `/general-endgame` | General Endgame |

`vercel.json` turns on clean URLs, so `/bow-planner` serves `bow-planner.html`. Shared styling and behaviour live in `site.css` and `site.js`. Planner settings and the light or dark choice are saved in each visitor's own browser.
