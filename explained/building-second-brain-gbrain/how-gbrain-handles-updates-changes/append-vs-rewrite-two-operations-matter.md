---
You now know how information flows into gbrain and becomes searchable. But once it's there, how do you update it without losing the story of what you once knew?

## **The Correction That Nearly Erased Everything**

Sarah Chen was **not** the CTO. You were sure of it, and three different sources confirmed it. So you wrote it in your notes, marked it as fact, and moved on.

Last time you watched information clear into your account—finally becoming queryable across your federation of sources. But clearing isn't the same as being correct, and now you're holding a fact that just bounced.

Then the correction came. Sarah had just been promoted to CTO that very morning. Your "fact" was already outdated.

Now you face a choice. Do you silently edit your old note? If you do, you've erased the history of what you knew and when. Three months from now, when someone asks "how long have you known Sarah was CTO?", your answer will be a shrug. Worse, if you'd cited that old note as evidence for something else, those claims now float in space, untethered from any record of why you believed them.

Mutable history creates this trap. You lose the story of your understanding.

---

## **Act 1: The Ledger and the Summary**

Imagine you're a ship's captain crossing the Atlantic in 1847. Every evening, you open the ship's logbook and write: *"April 10. Wind from the west. Spotted vessel on horizon. Crew member Jones reported fever."*

Three days later, Jones's fever breaks. He's fine. You don't go back and scribble over the April 10 entry. That would be falsifying the record. Instead, you write a new entry: *"April 13. Jones fully recovered. Previous concern unfounded."*

But you also maintain a running letter to your owners. It's a summary of the voyage so far. *"Passage proceeding well. Crew healthy. Making good time."* When Jones gets sick, you update that letter: *"Minor crew illness, under control."* When he recovers, you update it again: *"Crew remains healthy."* You're not appending new paragraphs to the letter. You're rewriting the whole summary to reflect current reality.

**gbrain works the same way.** Every page is split into two zones by a simple `---` separator:

| Zone | Purpose | Rule |
|------|---------|------|
| **Compiled Truth** (above `---`) | Current synthesis—what you believe *now* | **REWRITE** completely when evidence changes |
| **Timeline** (below `---`) | Evidence trail—what you've learned and when | **APPEND** only—never edit existing entries |

The docs are unambiguous here: *"Compiled truth: REWRITE — Current synthesis. Changes when evidence changes. Timeline: APPEND — Evidence trail. Never edited, only added to."*

---

## **Act 2: REWRITE — The Living Synthesis**

**Compiled Truth** is your executive summary. It's the paragraph you'd write if someone asked, *"So what's the deal with Sarah Chen?"* right this second.

It contains your assessment, the synthesis that no API can provide. *"Strong technical leader, under-appreciated internally, likely to make VP Eng within 18 months."* This is your read. Your judgment. The value you add beyond what LinkedIn knows.

When new evidence arrives, you don't tack a new paragraph onto the old assessment. You **REWRITE** the entire section.

> *"REWRITE means rewrite, not append. Don't add a new paragraph to compiled truth. Rewrite the entire section with the new information integrated."*

Old assessments that no longer fit vanish from Compiled Truth. This isn't because you're hiding them. It's because they're no longer *true*. The record of them exists forever in the Timeline. But the current synthesis must be coherent, not a museum of outdated guesses.

**⚠️ Watch Out For:**
- **The patchwork mistake:** Adding *"Update: Actually, Sarah was promoted"* as a new paragraph instead of rewriting the whole assessment. Your Compiled Truth becomes a contradictory mess—part old thinking, part new. If you wouldn't show it to someone as your current opinion, it doesn't belong there.
- **Sentimental attachment:** Keeping outdated assessments because "that's what I thought at the time." That's what the Timeline is for. Compiled Truth is ruthlessly current.

---

## **Act 3: APPEND — The Immutable Record**

**Timeline** is your logbook. Every entry is dated and sourced. When you learn something new, you add it below the previous entry. When you learn something that contradicts what you knew before, you still add it. Don't edit the old one.

The docs give a perfect example: *"If information turns out to be wrong, add a NEW entry correcting it: `- 2026-04-10 | Correction: Sarah is VP Eng, not CTO. Previous entry was wrong.`"*

At first, this feels wrong. Why preserve incorrect information? The Timeline isn't about being right. It's about being **traceable**. Every claim in your Compiled Truth must point to specific Timeline entries. If you delete or edit the old entry, your current assessment floats without provenance. Worse, you lose the story of how your understanding evolved.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing a page split by '---' separator: above is Compiled Truth (single coherent paragraph about Sarah Chen), below is Timeline (dated entries showing initial belief, conflicting report, and correction)" width="600" height="350" /></p>

**⚠️ Watch Out For:**
- **The stealth edit:** Fixing a typo in an old Timeline entry. Seems harmless, but you've just falsified the record. The date on that entry now represents a state that never existed.
- **The deletion reflex:** Removing an embarrassing wrong prediction. You've just orphaned every subsequent claim that cited it as evidence. Your future self won't understand why you believed what you believed.

---

## **Act 4: How They Dance Together**

Here's the workflow. A new meeting note arrives. Sarah was indeed promoted to CTO yesterday.

**Step 1: APPEND the evidence.** Add to Timeline: `- 2026-04-15 | Meeting with board: Sarah promoted to CTO effective immediately.`

**Step 2: REWRITE the synthesis.** Replace your entire Compiled Truth assessment with fresh language that integrates this fact. Remove "likely to make VP Eng." Add "recently promoted to CTO, showing strong board confidence."

**Step 3: Verify traceability.** Every claim in your new Compiled Truth should point to a Timeline entry. "Recently promoted" maps to the April 15 meeting note. "Strong board confidence" might point to an earlier entry about board dynamics.

**Step 4: Trust the search.** When you later search for "Sarah Chen," gbrain returns Compiled Truth chunks with higher relevance than Timeline chunks. Your fresh synthesis surfaces first. But if someone digs into the provenance, the Timeline is there, immutable.

---

## **The Real-World Picture**

You're building a dossier on a potential hire. Six months ago, you noted they left their previous job "under unclear circumstances." Last week, new information arrived. They'd reported ethical violations and were pushed out for whistleblowing.

If you simply edit the old note, you've erased your initial (wrong) assessment. You've also hidden the fact that your understanding evolved. When your team reviews the file, they see only the current saint-like portrayal, with no record of your earlier skepticism or what changed your mind.

The APPEND/REWRITE separation forces you to own that evolution. The Timeline shows your initial concern and the correction. The Compiled Truth shows your current, nuanced assessment. Your team can see both what you know and how you learned.

---

## **What You Now Know**

- **How Compiled Truth differs from Timeline**—one is mutable synthesis, the other is immutable evidence
- **When to REWRITE versus APPEND**—rewrite the entire assessment when evidence changes; append new entries without editing old ones
- **Why immutability matters**—preserving the audit trail of how understanding evolved, not just current correctness
- **How to verify traceability**—ensuring every claim in Compiled Truth maps to specific Timeline entries
- **How search prioritizes**—Compiled Truth surfaces first, but Timeline provides the evidentiary foundation

---

## **Looking Ahead**

Now that you understand how to write and update pages, you need to know how gbrain keeps everything organized automatically. The next lesson covers **The RESOLVER: Automatic Filing and Tiered Enrichment**—the system that decides where new information goes and how thin pages get fleshed out while you sleep.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/compiled-truth.md (The Rules; Tricky Spots; How to Verify)