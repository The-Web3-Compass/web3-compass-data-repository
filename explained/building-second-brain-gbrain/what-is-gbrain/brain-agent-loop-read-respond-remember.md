---
## **The Assistant Who Forgot to Check Its Notes**

You're midway through planning a product launch with your AI assistant. You mentioned the target demographic three weeks ago, outlined the budget constraints in an email last Tuesday, and refined the messaging strategy during yesterday's voice call. Now you ask: *"Should we lead with pricing or value proposition?"*

The assistant confidently suggests leading with aggressive pricing, completely ignoring that you explicitly decided on value-first messaging yesterday. It generates a beautiful, coherent, and *totally wrong* answer because it never checked what you actually said. It hallucinated a response from general training rather than reading your specific context.

Last time you learned how gbrain organizes knowledge into cross-linked entity files—markdown records that deepen automatically as relationships strengthen. Yet all that structure is useless if the assistant tries to *remember* when it should have *read*. This isn't a failure of intelligence. It's a failure of sequence.

---

## **Act 1: The Triage Nurse**

Imagine walking into a busy emergency room. Before you ever see a doctor, a triage nurse intercepts your paperwork, scans for red-flag keywords—*chest pain, allergic reaction, trauma*—and routes you appropriately. The nurse doesn't diagnose you. They don't block the doctor's current patient. They simply flag what matters and move on.

This is exactly how the **signal-to-brain data pipeline** works.

When a message arrives, whether from a voice call, email, or chat, the system doesn't dump it straight into the main agent's lap. Instead, it spawns a lightweight sub-agent that runs in parallel. Think of this sub-agent as that triage nurse. It scans for entities, patterns, and signals using a fast, inexpensive model, then routes anything important to the brain for processing. Meanwhile, the main agent responds to you immediately.

Pattern matching and deep reasoning require different computational resources. Detection is about recognizing shapes: names, dates, version numbers, trigger phrases. Reasoning is about synthesizing meaning. Using a heavyweight reasoning model for simple pattern detection is like hiring a brain surgeon to take your blood pressure. It's expensive, slow, and unnecessary.

The pipeline flows like this: signal arrives → lightweight detector scans asynchronously → signals route to brain → main agent responds without waiting. You get a response in under five seconds while the system captures every important detail in the background.

**⚠️ Watch Out For:**
- **Using expensive models for detection.** The docs explicitly warn against running entity detection on Opus-class models. Detection is pattern matching, not reasoning. Sonnet-class models are 5-10x cheaper and fast enough. Using Opus for detection across fifty messages a day costs $100+ more per month than necessary.
- **Blocking the main thread.** If your signal detector runs synchronously, users wait 30-120 seconds while you scan every message for entities. The whole point is "spawn and forget"—the sub-agent runs independently while the main conversation continues.

---

## **Act 2: The Research Librarian**

Now picture two different research assistants. The first walks into the library, skims the card catalog, and writes your report from what they *think* they know. The second consults specific collections. They pull the exact books, journals, and archives relevant to your question before writing a single word. The first is faster. The second is right.

This is the difference between generating from context and the **brain-first lookup pattern**.

In gbrain, your knowledge isn't dumped into a single chaotic pile. Multiple independent sources coexist within the same database. Each maintains its own namespace, sync state, and federation policies. When the agent needs to answer a question, it doesn't guess. It queries.

Sometimes it broadcasts across all sources, searching your emails, calendar, meeting notes, and project docs simultaneously for comprehensive recall. Other times it deliberately restricts search to a single source, keeping your portfolio analysis strictly separate from your personal journal to prevent cross-contamination.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing multiple brain sources (email, calendar, notes) feeding into a lookup router that can either federate across all sources or target a specific one, with the result flowing to the agent" width="600" height="350" /></p>

The lookup pattern determines scope first: *Do I need unified recall or purpose-separated isolation?* Then it executes within that boundary, retrieving authoritative knowledge before the agent constructs its response. This eliminates redundant computation. You don't re-derive facts you already recorded. It also prevents the confusion that happens when unrelated domains leak into each other.

**⚠️ Watch Out For:**
- **Assuming multiple brains need multiple databases.** They don't. A single gbrain database hosts multiple independent sources, each maintaining distinct sync states and federation policies.
- **Skipping the brain lookup before shell execution.** The docs emphasize that brain-first lookup precedes shell jobs to avoid permission and validation errors. Check what you know before trying to execute.

---

## **Act 3: Why Sequence Matters**

Put these two patterns together and something powerful happens. The triage nurse continuously feeds the library. New signals become searchable knowledge without interrupting conversations. The research librarian always checks the stacks before answering, grounding responses in compiled truth rather than probabilistic guesswork.

The result is an assistant that actually *knows* what you've told it. Not because it has perfect memory, but because it has perfect habits. Read first. Then respond. Then let the background pipeline handle remembering for next time.

---

## **The Real-World Picture**

You're managing a venture portfolio and writing personal essays. Without domain isolation, a query about your latest investment accidentally surfaces details from your draft essay about childhood trauma. That's awkward, unprofessional, and potentially damaging. With brain-first lookup and strict source separation, your portfolio queries stay in the portfolio brain. Your personal writing stays in its own domain. The system never confuses the two. Meanwhile, async signal detection means that when your portfolio company emails you material updates, the system captures and indexes them within minutes. You don't wait for a response.

---

## **What You Now Know**

- How the signal-to-brain pipeline uses lightweight async sub-agents to detect patterns without blocking the main conversation thread
- Why separating pattern detection (cheap, fast) from reasoning (expensive, deep) saves 50-80% on API costs while maintaining responsiveness
- How brain-first lookup grounds agent responses in authoritative knowledge rather than hallucinated context
- The difference between unified cross-source recall and purpose-separated domain isolation
- Why reading from the brain before responding produces more accurate answers than generating from context alone

---

## **Looking Ahead**

Now that you understand how signals flow into the brain and how the agent retrieves them, we need to examine what happens to that information once it's stored. In *The Timeline as Immutable Evidence Chain*, we'll explore why gbrain maintains not just what you know, but when you knew it—and why that chronological integrity matters more than you might think.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/sub-agent-routing.md (Tricky Spots, How to Verify)
- https://github.com/garrytan/gbrain/blob/main/docs/guides/upgrades-auto-update.md (What the User Gets, The Upgrade Message, The Full Upgrade Flow, Migration Files, How to Verify)
- https://github.com/garrytan/gbrain/blob/main/docs/integrations/README.md (How Data Flows In, Self-Installing Recipes, How to Read a Recipe, Recipe trust boundary)