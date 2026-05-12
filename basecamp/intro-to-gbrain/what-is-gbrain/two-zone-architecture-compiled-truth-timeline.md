---
## **The Notebook That Lies to You**

You read an article six months ago. Changed your mind about something important. You bookmarked it, maybe even highlighted a passage. Now you need that insight for a decision you're making today. You open the bookmark and... it's just text. No context. No reminder of why it mattered. No connection to the three conversations you've had since that refined your thinking. The bookmark is technically correct but practically useless.

This is the rot that creeps into every knowledge system. We save things, but we don't save our *understanding* of things. And when our understanding changes — when we learn Sarah got promoted, when a startup pivots, when a technical claim gets debunked — we face an ugly choice. Either overwrite what we knew and lose the history, or preserve the history and let stale information pollute our current thinking.

GBrain solves this with an architectural pattern so simple it feels like cheating. Two zones. One separator. Two different rules for how each zone changes. The result is a knowledge system that always tells you what you currently believe while maintaining perfect receipts for why you believe it.

## **Act 1: The Two Histories**

Think about Wikipedia. There's the article — the current best explanation of what something is. Then there's the "View history" tab — an immutable record of every single change ever made. The article gets rewritten constantly. The history never does.

**Compiled Truth** is your article. It's the current synthesis: "Sarah Chen is a VP of Engineering with deep distributed systems experience, currently under-appreciated internally." This is what you believe *now*. When you learn she's actually been promoted to CTO, you don't append that fact below the old claim. You rewrite the whole assessment to reflect current reality.

**Timeline** is your edit history. It's the evidence trail: the meeting notes, the LinkedIn updates, the hallway conversations, the corrections. Each entry gets a date and a source. `- 2025-03-15 | Meeting: Sarah mentioned leading the platform team migration`. These entries never change. If you later discover she wasn't leading that migration, you don't edit the old entry. You append a correction: `- 2025-04-10 | Correction: Previous entry was wrong — James led the migration, Sarah advised`.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing a page split by --- separator: upper section labeled 'Compiled Truth' with arrows showing full rewrites, lower section labeled 'Timeline' with arrows showing only downward appends" width="600" height="350" /></p>

The docs put this bluntly: "Compiled truth is the current synthesis that gets rewritten when evidence changes, while the timeline is an immutable, append-only log of every piece of evidence." The separator between them is a standalone `---` on its own line. Everything above is mutable. Everything below is permanent.

## **Act 2: Why Two Rules?**

You might wonder why we need different rules for each zone. Why not just keep appending to everything?

Because knowledge has two jobs. Job one: tell me what I currently believe so I can act on it. Job two: prove to me (or my future self, or an auditor) that this belief has a basis in reality. These jobs conflict. If I keep appending new beliefs without removing outdated ones, I end up with "Sarah is VP Eng" and "Sarah is CTO" sitting next to each other, and I have to mentally track which one is current. That's cognitive overhead I don't need.

**REWRITE** means when Sarah gets promoted, the old assessment disappears completely. The new compiled truth reads as if written fresh: "Sarah Chen is CTO, previously VP Eng, with deep distributed systems experience." No strikethroughs. No "UPDATE:" prefixes. Just current reality.

**APPEND** means the timeline preserves the full archaeology. You can trace how your understanding evolved. You can see what you believed on March 15th and why you believed it. You can audit whether your current assessment is actually supported by the evidence you've collected.

**⚠️ Watch Out For:** Appending to compiled truth instead of rewriting it. This creates the exact confusion the two-zone system is designed to prevent — old assessments sitting alongside new ones, forcing you to guess which represents current thinking. Also, editing timeline entries directly instead of appending corrections. This destroys your audit trail and makes it impossible to verify when information was learned or who provided it.

The docs emphasize this clearly: "REWRITE means rewrite, not append. Don't add a new paragraph to compiled truth. Rewrite the entire section with the new information integrated."

## **Act 3: Search That Knows What's Current**

Here's where the architecture pays off. When you search GBrain, the system weights compiled truth chunks higher than timeline chunks. This means when you search for "Sarah Chen," you get her current role and assessment first — not a random meeting note from six months ago.

This is subtle but crucial. Most knowledge systems treat all text equally. Search for a person, get a chronological dump of every mention. You have to mentally filter out outdated information. GBrain's search knows that compiled truth represents your current best understanding, so it surfaces that first. The timeline remains accessible for when you need to dig into the evidence, but it doesn't clutter your immediate retrieval.

There's a contract between the zones that makes this work: **Every compiled truth claim must trace to timeline entries.** If your assessment says Sarah is "under-appreciated internally," there better be timeline entries — meeting notes, feedback snippets, project post-mortems — that support that read. This isn't just good hygiene. It's what makes the system trustworthy. When you read a claim, you can always drop down past the `---` and see the receipts.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing search results with compiled truth chunks at top (higher relevance score) and timeline chunks below (lower relevance score), with dotted lines connecting claims to their source timeline entries" width="600" height="350" /></p>

**⚠️ Watch Out For:** Treating the assessment section as optional raw data. The compiled truth — your analysis, your synthesis, your read on a person or topic — is the primary value of the page. "Strong technical leader" is something no API can give you. It's your judgment layered on top of the evidence. Skip this, and you've just got a fancy bookmark.

## **The Real-World Picture**

You're preparing for a board meeting. Three months ago, you met with a potential hire and noted they seemed "hesitant about remote work." That went in their timeline. Since then, you've had two more conversations, learned they were actually dealing with a family health issue, and completely revised your assessment. Their compiled truth now reads "enthusiastic about distributed teams, strong cultural fit." When you search their name before the meeting, that's what surfaces first. But if someone asks "when did we first meet them and what was the context?" you can drop into the timeline and see the full arc. The board gets your current recommendation. You get the complete history. Nobody wastes time on stale impressions, and nobody pretends the first meeting didn't happen.

---

## **What You Now Know**

- How **Compiled Truth** represents your current synthesis and gets fully rewritten when understanding changes, while **Timeline** preserves an immutable, append-only evidence trail
- Why the `---` separator creates a structural boundary between mutable assessment and permanent records
- How search result weighting ensures current understanding surfaces first while maintaining full auditability
- That traceability requires every claim in compiled truth to have supporting timeline entries with dates and sources
- That corrections happen by appending new timeline entries (labeled "Correction:"), never by editing existing ones

---

## **Looking Ahead**

The two-zone pattern gives you a powerful way to think about knowledge, but patterns need engines to run on. In **BrainEngine: Storage That Doesn't Lock You In**, we'll explore how this architecture stays portable whether you're running locally on your laptop or at scale in the cloud — without changing a line of your application logic.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/compiled-truth.md (The Rules, Tricky Spots, How to Verify)