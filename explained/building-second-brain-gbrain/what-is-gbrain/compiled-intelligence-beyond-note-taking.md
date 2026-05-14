Most note-taking apps force you to choose between capturing everything and finding anything useful later. This module introduces gbrain's fundamental shift: treating your knowledge as **compiled intelligence**—a system where your current understanding lives distinctly from the evidence that shaped it, letting your thinking evolve without burying itself in chronological sediment.

## **The Archaeologist's Dilemma**

Dr. Elena Voss spent fifteen years excavating a site in Anatolia. She kept meticulous field notes, leather-bound journals filled with observations, sketches, and interpretations. Each season, her understanding of the settlement evolved. The pottery she initially dated to the Hittite period turned out to be much older. The "temple" was actually a granary. 

But here's the problem: her notebooks didn't reflect her evolving understanding. Page 47 said one thing. Page 203 contradicted it. Page 412 offered a third interpretation. When a colleague asked, "So what's the current thinking on Building C?" Elena had to flip through years of marginalia, crossing out old hypotheses, hoping she hadn't missed the latest revision.

Her knowledge was there, buried in chronological sediment. What she needed was a living document: the *current best synthesis* on top, with the *complete excavation history* preserved below for auditability. Two layers. One mutable, one immutable. Both essential.

That archaeological trap illustrates the difference between a notes app and a **compiled intelligence system**.

## **The Two-Zone Architecture**

### **The Wikipedia Problem**

Think about how Wikipedia actually works. When you visit an article, you see the current consensus: "The Hittite Empire collapsed around 1180 BCE." That's the **Compiled Truth**, a living synthesis that gets rewritten as new scholarship emerges. 

But click "View history" and you'll find every single edit since 2001. That's the **Timeline**, an immutable, append-only log. When new evidence surfaces, editors don't append a contradictory paragraph to the article. They *rewrite* the article to reflect the new understanding. The old version isn't deleted. It lives on in the history.

The gbrain documentation puts it this way:

> "| Zone | Action | Explanation |
> |------|--------|-------------|
> | Compiled truth | **REWRITE** | Current synthesis. Changes when evidence changes. |
> | Timeline | **APPEND** | Evidence trail. Never edited, only added to. |"

A document uses a `---` separator to split these zones. Everything above is your current understanding. Everything below is the evidentiary bedrock.

### **Why REWRITE Feels Wrong**

Your instinct screams: "Don't delete! Add!" That reflex comes from years of note-taking habits. Traditional notes accumulate: meeting after meeting, idea after idea, stacking like geological layers. But accumulated notes create the Elena Voss problem: truth buried under obsolete interpretations.

**Compiled truth REWRITES.** When you learn Sarah is VP of Engineering, not CTO, you don't append "Correction: Sarah is VP Eng" to your assessment. You rewrite the entire Compiled Truth section to reflect current reality. The old error? It lives on in the Timeline, timestamped and preserved, but it no longer contaminates your current understanding.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing a document split by --- separator: Compiled Truth zone above showing 'Current Synthesis' with REWRITE arrow, Timeline zone below showing chronological evidence entries with APPEND-only arrows" width="600" height="350" /></p>

**⚠️ Watch Out For:**
- **The Append Trap:** Adding a new paragraph to Compiled Truth instead of rewriting the whole section. This creates the exact chronological confusion the two-zone system is designed to prevent.
- **Timeline Editing:** Never edit a Timeline entry. If information is wrong, append a correction as a new entry: `- 2026-04-10 | Correction: Sarah is VP Eng, not CTO. Previous entry was wrong.` The original mistake stays — it's evidence of what you once believed.

## **Traceability and Search**

### **The Link Decay Problem**

Without compiled intelligence, media links become "bookmarks that decay." You remember watching a video about AI safety, but you can't find what was said, who said it, or why it mattered. The documentation warns: "you remember watching a video but can't find what was said, who said it, or why it mattered."

The Compiled Truth zone solves this by requiring that **every claim trace to timeline entries.** If your assessment says someone is "under-appreciated internally," the Timeline should contain specific evidence supporting that claim.

### **Search That Surfaces Truth**

Here's where the architecture reveals its genius: **gbrain search weights compiled truth higher than timeline chunks.** When you query your system, the current synthesis surfaces first. You're not wading through every passing thought you ever had about a topic. You see your current best understanding, with the evidentiary trail available if you need to audit it.

The Timeline isn't deleted or hidden. It's demoted in search relevance, waiting patiently for the moment you need to ask, "Wait, why do I think that? What's the source?"

## **The Assessment Is The Value**

Here's the counterintuitive part: raw data isn't the product. The docs emphasize: "**The assessment is the value.** 'Strong technical leader' is something no API can provide. It's YOUR read on this person. That's what makes the brain page better than LinkedIn."

The Timeline captures what happened. The Compiled Truth captures what it means. Without the Assessment section, you've built a filing cabinet, not a second brain.

**⚠️ Watch Out For:**
- **Skipping the Assessment:** Treating the synthesis as optional raw data rather than the primary value of the page. If you're just archiving links, you're using expensive storage for a bookmarks folder.
- **Preserving Old Contradictions:** Keeping outdated assessments alongside new ones instead of replacing them. Your Compiled Truth should represent a coherent current position, not a debate between your past and present selves.

---

## **The Real-World Picture**

You're preparing for a partnership negotiation. Six months ago, you met the CTO and noted he seemed "cautious about integration." Three months later, you heard he was "actively pushing for API unification." Last week, a mutual contact mentioned he was "skeptical again after the security review." A traditional notes app shows you three contradictory observations and leaves you guessing which is current. Your compiled intelligence system shows you the current synthesis: "Skeptical post-security review; needs technical reassurance." The complete evidentiary trail remains available if anyone questions your read. You walk into that meeting knowing what you know, and knowing why you know it.

---

## **What You Now Know**

- How **Compiled Truth** (mutable synthesis) differs from **Timeline** (immutable evidence), and why the `---` separator creates a clean architectural boundary between them
- Why **REWRITE** means full rewrite — integrating new information into a coherent current assessment rather than appending contradictory claims
- How **search zone weighting** surfaces your current understanding first while preserving complete traceability to source materials
- Why the **Assessment section** is non-negotiable — your interpretation is the value that distinguishes compiled intelligence from a link hoard

## **Looking Ahead**

Now that you understand the two-zone architecture that keeps your knowledge both current and auditable, let's explore how gbrain organizes these documents into a navigable structure. In *Your Brain's File System: Directories as Knowledge Graphs*, we'll see how directory structure isn't just filing — it's the topology of your thinking.

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/compiled-truth.md (The Rules, Tricky Spots, How to Verify)
- https://github.com/garrytan/gbrain/blob/main/docs/guides/content-media.md (What the User Gets)