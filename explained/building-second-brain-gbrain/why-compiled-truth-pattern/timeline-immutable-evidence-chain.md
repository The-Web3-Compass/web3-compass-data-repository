---

Your AI assistant can only be as reliable as the knowledge you feed it. This module explores why gbrain uses the Compiled Truth Pattern—a structure that treats your notes as legal evidence rather than a mutable scratchpad.

## **The Case You Lost Because You Couldn't Prove What You Knew**

You just saw how brain-first lookup prevents your assistant from hallucinating context or ignoring yesterday's value-first messaging decision. But that assumes your brain contains trustworthy evidence—not just conclusions you can't prove. You were absolutely certain. Three months ago, Sarah from engineering told you her team was struggling with technical debt. You remember the conversation vividly. Coffee shop, Tuesday afternoon, she mentioned the legacy API was becoming unmanageable. You made a note. You acted on it. You advocated for a refactor in the leadership meeting.

Then Sarah transferred to another team. The new VP asked why you pushed for the refactor. You explained the technical debt concerns. The VP looked at you blankly. "Sarah never mentioned any of this to me," she said. "Do you have any record of this conversation?"

You open your notes. You find... "Sarah - technical debt concerns." No date. No context. No evidence. Was it even Sarah who said it? Was it really three months ago? Your stomach drops. You have a conclusion with no foundation. You know something, but you can't prove why you know it.

This is what happens when knowledge isn't chained to evidence. Let's fix that.

## **Act 1: The Permanent Record**

Imagine an old-school accountant working with a leather-bound ledger and a fountain pen. She records a transaction: "$5,000 received from Acme Corp, March 15th." Later, she realizes she made a mistake. It wasn't $5,000. It was $500.

What does she do? She doesn't scratch out the original line. She doesn't use whiteout. She adds a new entry. "$4,500 adjustment. Previous entry overstated by order of magnitude." The original remains legible forever. Anyone auditing the books can see both entries, understand the correction, and trace the full history.

This is **Timeline Entry Immutability**.

Your brain's timeline works exactly like that accounting ledger. You record every piece of evidence (the meeting note, the tweet, the email excerpt) in permanent ink. Once a timeline entry exists, you cannot edit it. You cannot delete it. You cannot modify it in any way.

This sounds rigid. It sounds annoying. Here's why it's essential: if you could quietly edit old entries, you could rewrite history without a trace. You could change "Sarah seemed uncertain about the deadline" to "Sarah was confident about the deadline" and no one would ever know. Including future-you.

**⚠️ Watch Out For:**
- **The Edit Reflex:** When you find an error in a timeline entry, your first instinct will be to fix it. Don't. Add a new entry labeled "Correction:" and explain what was wrong. The original stays exactly as it was.
- **The Draft Mentality:** Treating the timeline like a scratchpad you can clean up later. It isn't. Every entry is evidence entered into the permanent record.

When information turns out to be wrong (and it will), you don't erase the mistake. You acknowledge it. A correction entry might read: "Correction: Sarah is VP Engineering, not CTO. Previous entry based on outdated LinkedIn profile was incorrect." The false information remains visible. The correction sits beside it. The full history of your understanding is preserved.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing a timeline with original entry, then correction entry added below it, with arrows showing the chain of evidence" width="600" height="350" /></p>

## **Act 2: The Living Summary**

Now imagine a prosecutor preparing a case. She has hundreds of exhibits: emails, photographs, witness statements. Each one is sealed in a numbered envelope. Each is permanent and unchangeable. But she doesn't hand the jury a box of envelopes. She writes a summary: "The evidence shows the defendant was at the scene between 9 PM and 10 PM, contradicting their alibi."

The summary is alive. It changes as new evidence arrives. The prosecutor rewrites it constantly to incorporate the latest findings. But every claim in that summary points to specific exhibits. "Contradicting their alibi" isn't opinion. It's backed by Exhibit 17, the parking garage footage.

This is **Traceability of Claims to Evidence**.

Your brain has two zones, separated by a simple `---` line:

| Zone | Action | Purpose |
|------|--------|---------|
| **Compiled Truth** | REWRITE | Your current synthesis. Changes when evidence changes. |
| **Timeline** | APPEND | The evidence trail. Never edited, only added to. |

The compiled truth is your prosecutor's summary. It's your current best understanding of a person, a project, an idea. When new evidence arrives, you don't just tack on a new paragraph. You completely rewrite the compiled truth section, integrating the new information into a coherent whole. You update old assessments rather than preserving them alongside contradictory new ones.

Meanwhile, the timeline grows downward like a glacier, layer upon layer, never retreating.

The magic is the connection between them. Every claim in compiled truth must correspond to timeline entries. If your assessment says someone is "under-appreciated internally," there should be timeline entries to support that claim: meeting notes, Slack messages, project outcomes. The assessment provides the insight. The timeline provides the proof.

**⚠️ Watch Out For:**
- **The Append Trap:** Adding new paragraphs to compiled truth instead of rewriting the whole section. This leaves you with contradictory assessments sitting side by side. "Strong performer" from March and "struggling with delivery" from June sit there with no synthesis of how the picture changed.
- **The Orphaned Claim:** Writing assessments in compiled truth without adding corresponding timeline entries. You end up with conclusions that feel true but have no evidentiary foundation.

## **The Search Hierarchy**

When you search your brain, the system weights compiled truth higher than timeline entries. Your synthesized understanding surfaces first; raw evidence appears later.

This matters because it shapes how you write. The compiled truth isn't just a convenience. It's the primary value. "Strong technical leader" is something no API can provide. It's your read. That's what makes your brain page better than a LinkedIn profile or a company directory.

But that read is only trustworthy because you've chained it to immutable evidence. Anyone (including future-you) can trace from the assessment down through the `---` separator into the timeline and verify: Where did this conclusion come from? What did Sarah actually say? When did I learn this?

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing search results with compiled truth entries weighted higher (larger, at top) and timeline entries below, with bidirectional arrows showing traceability between claims and evidence" width="600" height="350" /></p>

---

## **The Real-World Picture**

You're evaluating a startup for potential investment. Your compiled truth assessment says: "Founder has deep domain expertise but struggles with delegation. Engineering team has high turnover."

This isn't gossip. It's backed by timeline entries. You have three LinkedIn posts from departed engineers (dated). You have a Calendly history showing the founder booking 1:1s with every junior developer (dated, source-attributed). You have a podcast interview where they described their hands-on coding approach (quoted, timestamped).

A year later, when the founder claims they've "always believed in empowering teams," you can check the timeline. The evidence hasn't changed. Only your interpretation evolves, which you capture in the rewritten compiled truth.

## **What You Now Know**

- **How immutability works:** Timeline entries are append-only; corrections are added as new entries, not edits to existing ones.
- **Why traceability matters:** Every claim in compiled truth must correspond to specific evidence in the timeline, creating an auditable chain from conclusion to source.
- **The REWRITE vs. APPEND distinction:** Compiled truth is completely rewritten when new evidence arrives; timeline only grows downward.
- **How search prioritizes:** Compiled truth surfaces first because it represents your synthesized understanding, not raw data.
- **What makes the assessment valuable:** Your read—the synthesis that no automated tool can provide—is what differentiates your brain from a database.

## **Looking Ahead**

You've learned how to structure evidence and synthesis—but how do you actually *write* the assessment? In **Synthesis vs. Evidence: The Psychology of Understanding**, we'll explore why human judgment adds value that transcripts and data dumps cannot, and how to cultivate the skill of insightful summarization.

## **Sources**
- https://github.com/garrytan/gbrain/blob/main/docs/guides/compiled-truth.md (The Rules, Tricky Spots, How to Verify)