# Deploy the demo to a permanent live URL

The role-based demo (district, teacher, parent, student + the Navi bot) is a normal Next.js app
with **no external services** — no database, no API keys — so it hosts anywhere that runs
Next.js. This gives you a single permanent URL you can hand to anyone in the district.

> **Why I can't do this final step for you:** publishing to *your* hosting account needs *your*
> login. Everything is configured so it's a few clicks; you (or anyone with a free Vercel
> account) can finish it in about five minutes. The hosted **Artifact** pages linked in
> [`demo.md`](demo.md) already work as shareable URLs in the meantime.

## The one thing that makes it "just work"

The web app imports the engine from `@ilp/core`, which has to be compiled first. That build now
runs **automatically on install** (`@ilp/core` has a `prepare` script), so any host that does
`npm install` then `next build` will produce a working app with no special build order to
configure.

## Option A — Vercel (recommended, free tier is enough)

One-click, using the button, or by hand:

### One click

Open this URL (it pre-fills the monorepo setting):

```
https://vercel.com/new/clone?repository-url=https://github.com/fschaeffer16/ILP_blueprint&root-directory=apps/web
```

1. Sign in to Vercel with GitHub.
2. It will import `fschaeffer16/ILP_blueprint` with **Root Directory = `apps/web`** already set.
3. Framework is detected as **Next.js**. Leave Build/Install commands on their defaults.
4. Click **Deploy**. In ~2 minutes you get a permanent URL like
   `https://ilp-blueprint.vercel.app`.

### By hand (if you skip the button)

In the Vercel dashboard → **Add New… → Project** → import `ILP_blueprint`, then set:

| Setting | Value |
| --- | --- |
| **Root Directory** | `apps/web` |
| Framework Preset | Next.js (auto-detected) |
| Build Command | *default* (`next build`) |
| Install Command | *default* (`npm install`) |
| Output Directory | *default* |

Deploy. Every push to the branch redeploys automatically, so the URL always shows the latest.

> **Branch note:** the live build currently lives on the branch
> `claude/ilp-blueprint-repo-tv3e48`. In the Vercel project's **Settings → Git**, set the
> Production Branch to that branch — or merge it into `main` first and deploy from `main`.

## Option B — Netlify / Render / any Node host

Same idea. Point the host at the repo with:

- **Base / root directory:** `apps/web`
- **Build command:** `next build`
- **Install command:** `npm install` (this compiles `@ilp/core` via its `prepare` script)
- **Publish:** the Next.js adapter for that host (Netlify's Next runtime, Render's Node service).

## What the live URL will show

Every screen in [`demo.md`](demo.md): `/library`, `/dashboard`, `/class`, `/assign`,
`/grading`, `/author`, `/lesson`, `/baseline` (+ `/baseline/take`), `/parent`, `/student`, and
the assignment bot at `/navi-assignment-helper.html` — all running the real engine on synthetic
data. Nothing to install for anyone you share it with.

## Custom domain (optional)

Vercel/Netlify both let you attach a domain (e.g. `demo.ilp-something.org`) under the project's
Domains settings — useful when showing the district, so the URL reads like a product, not a
preview.
