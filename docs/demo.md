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

Every push to the repo auto-redeploys it. The static GitHub Pages snapshots below still work as a
no-Vercel fallback.

## Two ways to run the demo

### 1. The hosted snapshots (nothing to install)

Self-contained snapshots of each screen, published as private pages on the owner's account.
Start at the hub and click through:

- **Demo hub** — https://claude.ai/code/artifact/a9bcd571-45dd-4b04-8cb3-7ea6f69a4ab5

Individual views:

| Role | View | Link |
| --- | --- | --- |
| District | Content library | https://claude.ai/code/artifact/e18eb03b-a05c-4cf2-957f-01bbb75c13bc |
| District | Mastery rollup dashboard | https://claude.ai/code/artifact/673b68ba-301a-4c92-92ed-3e44fde90f06 |
| District | Where objectives & content come from | https://claude.ai/code/artifact/5db49795-76f2-44f4-8c6a-966167db0359 |
| Teacher | Command center | https://claude.ai/code/artifact/c5b4f470-98a2-49cc-91f1-5874be1a0520 |
| Teacher | Baseline screener | https://claude.ai/code/artifact/49853175-da08-490f-a0b3-a2299a3a5c4b |
| Teacher | Help signals (what Navi flags) | https://claude.ai/code/artifact/e3a17c50-6e18-464f-8b55-2eb2bdcc5223 |
| Parent | Family view | https://claude.ai/code/artifact/f5cadaed-ade1-4647-a0c1-ee88be345874 |
| Student | Student app | https://claude.ai/code/artifact/eeea7b95-7f69-4e5c-8bbb-27ea8301aa69 |
| Student | Assignment-aware bot (Navi) | https://claude.ai/code/artifact/7c1ec5bf-4179-4ee5-8ae5-abbd040cad3f |

**Leadership documents** (for showing district decision-makers):

| Document | Link |
| --- | --- |
| Why FAST & i-Ready become obsolete ("After the Test") | https://claude.ai/code/artifact/044988c8-c651-4a74-835f-31031e4eb969 |
| Growth & partnership proposal ("Built by Teachers") | https://claude.ai/code/artifact/66e8df4b-8441-41ce-9d03-bb1722df7b5b |

*(These pages are private to the account that published them.)* To put the app itself on a
permanent live URL, see [`deploy.md`](deploy.md).

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
psychometric/curriculum validation the blueprint requires — plus growing the content pack
beyond the demo's 6 objectives.
