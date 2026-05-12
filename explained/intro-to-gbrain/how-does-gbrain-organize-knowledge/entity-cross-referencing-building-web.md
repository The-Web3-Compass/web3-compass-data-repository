---
## **The Museum of Forgotten Mentions**

You watch an interview. Dario makes a striking claim about compute scaling—something that directly contradicts what Ilya said at NeurIPS. You feel the connection spark in your mind. *I should look into this.*

Three months later, you remember the contradiction but not the specifics. You know you saved the video somewhere. Was it in Notion? A browser bookmark? YouTube's "Watch Later" that now holds 847 videos? You can recall the *feeling* of insight but not the insight itself.

This is bookmark rot: the slow decay of context. Without this system, media links are bookmarks that decay — you remember watching a video but can't find what was said, who said it, or why it mattered.

There's a better way. A way to transform every passing mention into a permanent, searchable thread in a vast web of knowledge—where you can always trace a claim back to its source, where entities link to every place they've been discussed, where the current understanding lives in the same house as the evidence that shaped it.

This is the art of **Entity Cross-Referencing**.

---

## **Act 1: The Two-Room House**

Imagine you're a historian maintaining a research office with two rooms separated by a thin wall.

In the front room sits your **Compiled Truth**: the current synthesis of everything you know about a person, company, or idea. This is your working draft—the assessment that "Sarah is an under-appreciated technical leader with sharp product instincts." When new information arrives, you don't tape sticky notes to the wall. You rewrite the entire assessment from scratch, incorporating what you've learned and removing outdated judgments.

Behind the wall lies the **Timeline**: an evidence trail that grows like sedimentary rock. Each layer represents a moment in time—a meeting note, a podcast mention, an email thread. These layers are immutable. You never scratch out old entries. If you were wrong about Sarah's title, you add a new layer correcting it: *"Correction: Sarah is VP Eng, not CTO. Previous entry was wrong."*

The docs call this a "dual-zone architecture" separated by a delimiter (---). Everything above the line is the living synthesis; everything below is the fossil record. As the docs note: "The --- separator matters. GBrain uses the first standalone --- after frontmatter to split compiled_truth from timeline."

This separation solves a profound tension: knowledge must be **fresh** and **trustworthy** simultaneously. Without it, you're either stuck with stale assessments or left with no way to verify where claims came from.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing two zones: Compiled Truth (top, rewrite arrow) and Timeline (bottom, append-only stack with timeline entries) separated by --- delimiter" width="600" height="350" /></p>

### **The Traceability Rule**

Here's the discipline that makes this work: **Every claim in compiled truth must trace to timeline entries.** If your assessment says someone is "under-appreciated internally," there should be timeline entries that support that claim. The synthesis isn't opinion floating in space—it's a conclusion drawn from evidence you can walk back through.

This means when you search your brain, the most relevant synthesis surfaces first. The docs note: "GBrain search weights compiled truth higher. gbrain query returns compiled truth chunks with higher relevance than timeline chunks." Current understanding gets priority; the evidence trail waits patiently if you need to dig deeper.

---

## **Act 2: Weaving the Web**

Cross-referencing isn't just about organizing one page. It's about building connections.

When you ingest a YouTube video, you're not just saving a link. You're creating a **permanent brain page** where the agent's analysis lives above the fold, key quotes with speaker attribution sit in the middle, and the full diarized transcript anchors everything below.

But the magic happens when entities emerge from that transcript. For every person mentioned—Dario, Ilya, whoever—you create **bidirectional links**. The video page links to Dario's entity page. Dario's entity page links back to the video. A new timeline entry appears on Dario's page: *"Discussed in Video Title: specific claim about compute scaling."*

Now you have a web, not a filing cabinet. Dario's page becomes a hub of every conversation he's appeared in. The video becomes a node that connects to every entity it touched. When you later wonder *"What was that thing Dario said?"* you don't search your browser history. You go to Dario's page and follow the thread.

The docs emphasize: "Cross-references make media pages alive. A YouTube page without back-links to the people and companies mentioned is a dead archive."

| Without Cross-Referencing | With Cross-Referencing |
|---------------------------|------------------------|
| Media links are bookmarks that decay | Every mention becomes a permanent, searchable node |
| You remember watching something but can't find what was said | Full diarized transcripts with speaker attribution preserved |
| Context exists only in your head | Entity pages accumulate timeline entries from every source |
| Connections between ideas fade | Bidirectional links maintain the web of relationships |

---

## **Act 3: The Dream Cycle**

Building this web manually would be exhausting. You'd have to watch every video, read every email, attend every meeting, and meticulously file every mention. You'd miss things. You'd get lazy. The web would have holes.

Enter the **Dream Cycle**: an automated entity sweep that runs during quiet hours (the docs suggest 2 AM). While you sleep, the system reads through your day's conversations, detects every mentioned entity, and maintains the web for you.

The cycle works like a night shift archivist:

1. **Entity Sweep**: Scan today's messages and transcripts. For each person, company, or idea detected, check if a brain page exists. If not, create one. If the page is "thin" (just a name, no substance), enrich it. If it's full, simply add today's mention to the timeline.

2. **Citation Repair**: Find timeline entries missing source attributions and fix them. Repair broken tweet links. The web tightens.

3. **Pattern Consolidation**: Detect patterns across conversations and promote ephemeral observations into durable knowledge.

The docs are clear: "The dream cycle is NOT optional. Without it, signal leaks out of every conversation. With it, nothing is lost. This is the difference between an agent that forgets and one that remembers."

**⚠️ Watch Out For:**
- **Don't append new paragraphs to compiled truth.** The docs warn: "REWRITE means rewrite, not append. Don't add a new paragraph to compiled truth. Rewrite the entire section with the new information integrated." When Sarah's role changes from Director to VP, don't stick "Update: She's VP now" at the bottom. Rewrite the whole assessment to reflect her current position and remove the outdated characterization.
- **Never edit timeline entries.** The timeline is immutable. If you discover Sarah isn't actually the CTO, you add a new entry correcting the record. The wrong information stays visible as a historical artifact, marked as wrong. This preserves the integrity of the evidence trail.

---

## **The Real-World Picture**

You're researching AI safety for an investment memo. Three months ago, you watched a YouTube interview where Dario made a specific claim about compute scaling. You remember it contradicted something Ilya said, but you can't recall the details. Without cross-referencing, you'd spend an hour scrolling through YouTube history, then give up and write around the gap. With it, you query "Dario compute scaling" and your brain returns the compiled assessment from Dario's page—surfacing the contradiction and linking directly to the video transcript with the exact timestamp. You verify the claim in thirty seconds, cite it in your memo, and add a new timeline entry to Ilya's page noting the disagreement. The web grows stronger with every use.

---

## **What You Now Know**

- How the dual-zone architecture separates mutable synthesis (rewrite) from immutable evidence (append)
- How bidirectional links transform isolated mentions into a connected knowledge web
- How the `---` delimiter physically separates Compiled Truth from Timeline on every page
- How the Dream Cycle automates entity detection and cross-referencing during quiet hours
- How search weighting prioritizes compiled truth while keeping the evidence trail accessible

## **Looking Ahead**

You've learned how to weave the web. Now you'll learn how to navigate it efficiently—how to query your brain so the most relevant synthesis surfaces first, before any agent takes action. Next up: **Brain-First Lookup: Query Before Acting**.

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/compiled-truth.md (The Rules, Tricky Spots, How to Verify)
- https://github.com/garrytan/gbrain/blob/main/docs/guides/content-media.md (What the User Gets, Implementation, Tricky Spots)
- https://github.com/garrytan/gbrain/blob/main/docs/guides/cron-schedule.md (What It Does, Tricky Spots)