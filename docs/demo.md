# ILP demo guide

How to show ILP end-to-end. Everything runs the real `@ilp/core` engine on **synthetic
data** — no real student information anywhere.

## ▶ The live system (share this)

The full app is deployed and public — anyone can click through it, no account:

- **App:** <https://ilp-blueprint-web.vercel.app>
- **Guided front door** (all role apps + the pitch pages in one place): <https://ilp-blueprint-web.vercel.app/demo.html>
- Direct routes: `/` Today · `/library` · `/dashboard` · `/class` · `/assign` · `/grading` ·
  `/flags` Help signals · `/author` · `/lesson` · `/baseline` (+ `/baseline/take`) · `/parent` ·
  `/student` · `/navi-assignment-helper.html` the assignment bot.
- Leadership pages on the same domain: `/what-comes-next.html` (the pitch) · `/ixl-vs-ilp.html` ·
  `/after-the-test.html` · `/built-by-teachers.html` · `/sourcing.html`.

Every push to the repo auto-redeploys it.

## Two ways to run the demo

### 1. The live pages (nothing to install)

The real app screens and the leadership pages, all public on the Vercel domain — no account,
nothing to install. Start at the hub and click through:

- **Demo hub** — https://ilp-blueprint-web.vercel.app/demo.html

Individual views:

| Role | View | Link |
| --- | --- | --- |
| District | Content library | https://ilp-blueprint-web.vercel.app/library |
| District | Mastery rollup dashboard | https://ilp-blueprint-web.vercel.app/dashboard |
| District | Where objectives & content come from | https://ilp-blueprint-web.vercel.app/sourcing.html |
| Teacher | Command center | https://ilp-blueprint-web.vercel.app/ |
| Teacher | Baseline screener | https://ilp-blueprint-web.vercel.app/baseline |
| Teacher | Help signals (what Navi flags) | https://ilp-blueprint-web.vercel.app/flags |
| Parent | Family view | https://ilp-blueprint-web.vercel.app/parent |
| Student | Student app | https://ilp-blueprint-web.vercel.app/student |
| Student | Assignment-aware bot (Navi) | https://ilp-blueprint-web.vercel.app/navi-assignment-helper.html |

**Leadership documents** (for showing district decision-makers):

| Document | Link |
| --- | --- |
| Why FAST & i-Ready become obsolete ("After the Test") | https://ilp-blueprint-web.vercel.app/after-the-test.html |
| Growth & partnership proposal ("Built by Teachers") | https://ilp-blueprint-web.vercel.app/built-by-teachers.html |

*(All public — anyone with the link can open them, no account.)*

### 2. The full app (the real, wired Next.js app)

```bash
git clone https://github.com/fschaeffer16/ILP_blueprint.git
cd ILP_blueprint
git checkout claude/ilp-blueprint-repo-tv3e48
npm install
npm run build --workspace @ilp/core   # the web app imports the built engine
npm run dev --workspace @ilp/web       # http://localhost:3000
```

Screens: `/` Today · `/library` Content library · `/class` My class · `/assign` Assign once ·
`/grading` Grading review · `/flags` Help signals (what Navi flags) · `/author` Objective builder ·
`/lesson` Lesson builder · `/baseline` Baseline screener · `/baseline/take` Take the baseline ·
`/dashboard` Dashboard · `/parent` Family view · `/student` Student app · the bot at
`/navi-assignment-helper.html`.

To host it for others, deploy `apps/web` to any Next.js host (build command should build
`@ilp/core` first). The app is fully server-renderable and has no external service
dependencies for the demo.

## A suggested 8-minute walk-through

1. **District — content library** (`/library`): open an objective, show the authored lesson,
   items, sources, and the green "passes every gate" badge. *Everything on the shelf is
   guardrail-clean.*
2. **Baseline** (`/baseline` → **Take the baseline**): answer the reading tasks wrong and the
   number tasks right, then screen. *Early signals route to a specialist referral and a family
   notification — screening, never a diagnosis.*
3. **Teacher — assign once** (`/assign`): one objective → individualized for every student,
   objective locked.
4. **Grading** (`/grading`): AI shows evidence and flags; only the teacher releases a grade.
   Trip the **75% rule** to show the class-failure audit.
5. **District — dashboard** (`/dashboard`): the same evidence rolled up district → school →
   grade → class → student. Point out the school gap.
6. **Parent — family view** (`/parent`): real-time progress, time in collaboration and
   simulations, growth, safety — with the privacy line.
7. **Student app** (`/student`): the student's today board and study guides, then post to a
   channel — try an answer-dump (held + solo check) or an unkind message (a trusted adult is
   notified). *The safe, verified "social" layer, moderated before anything is shared.*
8. **Assignment-aware bot** (the Navi link above, or `/navi-assignment-helper.html`): open a
   grade-3 fractions assignment and tap **Navi**. Ask "what is a unit fraction?" (it coaches),
   then try "just tell me the answer" or "is it 1/4" — *it refuses and offers a scaffold: the
   idea, a first step, or a worked example with different numbers.* Ask about dinosaurs — *it
   stays in its lane.* See [`assignment-bot.md`](assignment-bot.md).

## What's built vs. what's next

See [`roadmap.md`](roadmap.md) for the full status. All four role apps now have a working
first version (district, teacher, parent, and student — the student app includes the today
board, study guides, and verified/moderated subject channels), and the **assignment-aware help
bot** (Navi) now runs as a grounded, answer-protecting helper docked on the assignment
(see [`assignment-bot.md`](assignment-bot.md)). The remaining gaps before a live pilot are the
**FAST/i-Ready import adapters**, the bot's **red-team release suite**, and the
psychometric/curriculum validation the blueprint requires. The content pack is **complete for
grade 3** — all 60 Florida B.E.S.T. benchmarks (34 math + 26 ELA) authored and gate-validated.
