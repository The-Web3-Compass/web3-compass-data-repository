## **The Case of the Missing Receipt**

You've been there. A colleague mentions a conversation from three months ago—"Didn't Sarah say she was pivoting to infrastructure?"—and you nod along, but something feels off. *Did* she say that? When? In what context? You remember the conclusion, but the evidence has evaporated. You have the headline without the article, the verdict without the trial transcript.

This is how knowledge dies. Not in grand explosions, but in slow decay. You build an opinion about someone, a company, a technology. The opinion sticks. The reasons behind it fade. Six months later, you're acting on a judgment you can't justify, citing evidence you can't locate, trusting a version of yourself who knew things you've since forgotten.

GBrain solves this with a simple but radical structural rule: **every claim must have a receipt.**

---

## **Two Zones, One Truth**

Imagine a courtroom. The attorney stands before the jury with a summary of the case—the current theory, the narrative that explains all the evidence. But that summary is just words unless the attorney can point to specific exhibits. "Exhibit 47, the email dated March 3rd." "Exhibit 12, the contract clause." The summary can change as new evidence emerges, but the exhibits remain sealed, numbered, permanent.

GBrain pages work exactly this way. They're split into two zones by a simple horizontal line:

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing a GBrain page split by '---' separator: Compiled Truth zone (above) containing Assessment and current synthesis, and Timeline zone (below) containing dated evidence entries with sources" width="600" height="350" /></p>

| Zone | Purpose | Action |
|------|---------|--------|
| **Compiled Truth** | Current synthesis and assessment | REWRITE |
| **Timeline** | Evidence trail with dates and sources | APPEND |

Everything above the `---` separator is **Compiled Truth**—your living synthesis of what you currently believe and why it matters. Everything below is **Timeline**—the immutable record of evidence you've encountered, each entry dated and sourced.

---

## **APPEND: The Immutable Record**

The Timeline is your evidence locker. When you learn something new—a meeting note, a Slack message, a correction from an email—you **APPEND** it to the bottom of the Timeline section. You never edit existing entries. Never.

Think of it like a ship's logbook or a blockchain ledger. If the captain makes a mistake in the log—"We sighted land at dawn" when it was actually a cloud bank—they don't scratch it out. They add a new entry: *"Correction: Previous entry in error. Land sighting unconfirmed."* The original mistake stays visible. The correction adds context. The chain remains intact.

**How APPEND works:**

1. New evidence arrives—a meeting note, a tweet, a conversation
2. Add a new entry to the Timeline section (below the `---` separator) with date and source
3. If correcting prior information, explicitly note it as a correction in the new entry—never edit the old one
4. The Timeline grows downward like a sedimentary layer, oldest at top, newest at bottom

This immutability matters because **memory is unreliable**. Six months from now, when you're wondering why you think Sarah is under-appreciated internally, you won't trust your own recollection. But you will trust the dated entry: `- 2025-03-15 | Meeting: Sarah presented Q1 roadmap; zero executives attended despite critical dependencies`.

**⚠️ Watch Out For:**
- **Editing Timeline entries to fix typos.** Timeline entries are immutable. Even a typo stays—add a correction entry if the error matters, otherwise leave it. The audit trail is more important than perfect formatting.
- **Thinking old Timeline entries should be deleted.** Never delete. That "wrong" entry captures what you knew at the time. Deleting it destroys your ability to understand why you made decisions in the past.

---

## **REWRITE: The Living Synthesis**

If the Timeline is your evidence locker, the Compiled Truth is your closing argument. It changes constantly. When new evidence arrives, you don't add a paragraph to the existing summary. You **REWRITE** the entire Compiled Truth section from scratch, integrating the new information, removing outdated assessments, and producing a fresh synthesis.

Imagine maintaining a running executive summary alongside that detailed diary. When new events occur, you add an entry to the diary (Timeline) but rewrite the entire summary (Compiled Truth) to reflect the current situation. You don't tack new sentences onto an old draft—that way lies contradiction and bloat.

**How REWRITE works:**

1. New evidence arrives and gets APPENDed to Timeline
2. Read the existing Compiled Truth section
3. Rewrite the entire section to integrate the new information
4. Remove assessments that no longer hold
5. Update conclusions based on the complete evidence picture

The docs are explicit here: "**REWRITE means rewrite, not append.** Don't add a new paragraph to compiled truth. Rewrite the entire section with the new information integrated. Old assessments that are no longer accurate should be updated, not kept alongside contradictory new ones."

**⚠️ Watch Out For:**
- **Appending to Compiled Truth instead of rewriting.** This creates Frankenstein documents—contradictory assessments stacked on top of each other. "Sarah is under-appreciated" followed by "Sarah was promoted to CTO" without reconciling the two. Rewrite the whole section.
- **Skipping the Assessment section.** The docs emphasize this: "Don't skip the Assessment section. The assessment is the value. 'Strong technical leader' is something no API can provide. It's YOUR read on this person. That's what makes the brain page better than LinkedIn."

---

## **Traceability: The Receipt Check**

Here's the critical discipline: **Every compiled truth claim must trace to timeline entries.** If your Assessment says Sarah is "under-appreciated internally," there should be Timeline entries that support that claim. Maybe the meeting where executives skipped her presentation. The Slack thread where her proposal got ignored. The correction entry noting that her title change was delayed twice.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing traceability chain: Assessment claim 'under-appreciated' with arrows pointing to three specific Timeline entries: missed meeting 2025-03-15, ignored proposal 2025-04-02, delayed promotion 2025-04-20" width="600" height="350" /></p>

This traceability prevents knowledge decay. Six months from now, when you're wondering why you formed that opinion, you can follow the breadcrumbs. The conclusion is fresh in Compiled Truth. The reasoning is preserved in Timeline. You have the headline *and* the article.

**How verification works:**

1. Read the Compiled Truth section—your current assessments
2. For each claim, identify supporting Timeline entries
3. Verify every claim has evidence
4. If a claim lacks Timeline support, either add the evidence or remove the claim

The system reinforces this through search. When you query GBrain, it returns Compiled Truth chunks with higher relevance than Timeline chunks. The freshest synthesis surfaces first. But the Timeline is always there, waiting, ready to prove that the synthesis is grounded in fact.

---

## **The Real-World Picture**

You're preparing for a board meeting. A founder you haven't spoken with in eight months walks in. Your brain page on them opens: the Compiled Truth gives you the state of play in thirty seconds—"Pivoting from consumer to enterprise; strong technical depth but unproven GTM; recently hired VP Sales from competitor." But the CFO asks why you're confident about the pivot. You scroll to the Timeline: three dated entries showing the evolution—customer churn signals, the enterprise POC announcement, the correction entry when you initially misread their strategy. You have the conclusion and the receipts. The meeting moves forward with confidence instead of fog.

---

## **What You Now Know**

- How the `---` separator creates two zones with different rules: REWRITE for Compiled Truth, APPEND for Timeline
- Why Timeline immutability preserves audit trails even when information changes
- How REWRITE integrates new evidence into a fresh synthesis rather than accumulating contradictions
- Why every claim in Compiled Truth must correspond to specific Timeline entries
- How search prioritizes Compiled Truth while preserving Timeline for provenance

## **Looking Ahead**

Now that you understand how individual pages maintain their own integrity through traceability, we'll explore how GBrain handles attribution across multiple sources—what happens when information comes from different places, and how the system maintains clarity about who said what in **Sources and Federation: Brains Within Brains**.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/compiled-truth.md
- https://github.com/garrytan/gbrain/blob/main/docs/guides/content-media.md