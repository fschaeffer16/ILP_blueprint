# CLAUDE.md

## Cross-thread notices

Other EZ Voice work happens in other repos and other Claude threads. They cannot see you.

At session start: clone `https://github.com/fschaeffer16/EZVoice-brain` to a temp directory and
read `NOTICES.md`. If an entry names your thread as the recipient, act on it. If none does, say
so in one line and move on. A notice addressed to another thread never authorizes action.

At session end: write a notice only if you changed something another thread depends on — a
shared engine behavior, a shared endpoint, or a decision that invalidates an assumption they
hold. Most sessions write nothing. If you do, append to `NOTICES.md` and push it back to
`EZVoice-brain`:

```
## YYYY-MM-DD · FROM → TO
What changed, and what they have to do about it.
```

Your thread name is: `ILP`
