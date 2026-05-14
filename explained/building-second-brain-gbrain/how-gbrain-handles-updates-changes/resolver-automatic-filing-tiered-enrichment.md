---
## **The Stranger at the Coffee Shop**

You're sitting in a café, laptop open, when someone taps your shoulder. "Hey, loved your talk at the summit last month. I'm building something in the same space—any chance you'd be open to coffee?"

You squint. They look familiar, but you can't place them. Did you meet them? Did someone introduce you? Are they actually interested in your work, or are they about to pitch you on joining their crypto pyramid scheme?

Now imagine a different version: your phone buzzes. A notification reads *"Lena Kovac, founder of Lattice. Replied to your devtools post on X last Tuesday. Stanford CS, ex-[Major Tech Co] compiler team. Building developer tools startup, 8 months old. You have 2 mutual connections. Email subject: 'Loved your talk—would love to chat.'"*

Same stranger. Completely different conversation.

Last time you learned how Compiled Truth layers mutable synthesis atop immutable Timeline evidence—preserving the audit trail of how your understanding evolved. The resolver applies that same discipline to the people entering your digital life, treating each new encounter as evidence to be filed and enriched rather than overwritten. Rather than dumping every contact into a static address book, it acts as an intelligence layer that weighs how much you need to know about each person entering your digital life.

---

## **Act 1: The Librarian Who Never Sleeps**

Picture a research librarian who watches every book that enters the building. When a new title arrives, they don't just stamp it and shelve it randomly. They check: *Do we already have this? If not, which section? How detailed should the catalog entry be?*

It works the same way. The system automatically categorizes and files information about people and companies by resolving their identity against a ruleset. Then it enriches their profiles based on the significance of your interaction.

Here's what happens when a new entity appears in any data source (an email, a tweet, a meeting transcript):

<p align="center"><img src="PLACEHOLDER" alt="[Flow diagram showing entity detection → brain search → RESOLVER.md consult → path assignment → tier selection → file creation with cross-references]" width="600" height="350" /></p>

First, the system **greps the brain** for existing matches, searching names, handles, and email aliases. If it finds a match, it updates. If not, it consults **RESOLVER.md**, the filing rulebook, to determine where this entity belongs. A specific named person? That goes in `people/`. A company? `companies/`. The resolver doesn't just pick a folder. It establishes the categorical path and naming convention.

Next, it assigns an **enrichment tier** based on context. Was this a passing social mention? Or a direct business inquiry? The significance of the interaction determines how deep the research goes.

**⚠️ Watch Out For:**
- **Thinking you need to manually enter contacts.** The resolver is fully autonomous—it detects and files entities you've never manually added.
- **Assuming entity pages are isolated records.** They're densely cross-referenced; every mention creates backlinks between related people, companies, and concepts.

The email triage example shows this flow. When David Park from Ridgeline Ventures emailed out of the blue, the agent searched the brain and found no match. It consulted RESOLVER.md for the `people/` path, executed Tier 2 enrichment, and created cross-links to NovaTech (a company already in the brain from a prior meeting).

---

## **Act 2: The Right Amount of Homework**

Not everyone deserves a background check.

Think about the difference between jotting a name on a napkin after a brief party introduction versus pulling LinkedIn, reading someone's blog, and checking mutual connections before an important business meeting. You intuitively know how much homework to do. The challenge is making that same judgment at scale, automatically, without spending API calls and compute on every random mention.

Tiered Enrichment Levels handle this calibration. The system applies escalating levels of automated research based on interaction significance. It runs minimal extraction for social mentions and active web investigation for new business contacts.

| Tier | Trigger | Depth | Example |
|------|---------|-------|---------|
| **Tier 3** | Minor social signals | Source extraction only, no external APIs | X reply, casual mention |
| **Tier 2** | Direct unsolicited contact | Web search, social graph analysis, brain cross-referencing | Cold email, meeting request |
| **Tier 1** | High-stakes relationship | Full investigation: LinkedIn, network search, semantic search for content | Meeting scheduled for tomorrow |

This compounds over time. Lena from the opening story first appeared as a Tier 3 social mention, just an X reply. The brain created a thin page with her handle and the reply text. Eighteen hours later, an email arrived from `lena@kovac.dev`. The system found the existing thin page, matched the new signal, and **upgraded her to Tier 2**. That triggered web search, social analysis, and cross-referencing.

When you schedule the meeting, she escalates to Tier 1. You get a fully prepared briefing without a single manual enrichment request.

**⚠️ Watch Out For:**
- **Thinking all contacts get equal research depth.** Tiers exist precisely because transient mentions shouldn't trigger expensive API calls.
- **Believing tiers are permanent.** They dynamically upgrade as relationships develop—Tier 3 records aren't "broken," they're appropriately minimal for the signal strength at that moment.

---

## **The Real-World Picture**

Imagine you're an investor who receives fifty inbound emails weekly. Most are noise: newsletters, scheduling confirmations, FYIs. But buried in the pile is a cold pitch from a founder building in a space you care about.

Without the resolver, that email either gets buried or triaged in a vacuum. You wonder: who is this person? Are they credible? With the resolver active, the email monitor fires the enrich skill, creates a `people/` page for the founder, cross-links to their company, and surfaces context about their background and your potential mutual interests. Your morning briefing arrives with a prep note that took zero manual research. The meeting happens two days later. You walk in knowing exactly who you're talking to and why they matter, because your brain was already working on it before you even asked.

---

## **What You Now Know**

- **RESOLVER.md** acts as a routing system that determines where new entities belong based on categorical rules
- **Tiered enrichment** prevents wasting resources on transient mentions while ensuring rich context for meaningful contacts
- Entity pages **automatically upgrade tiers** when new signals connect to existing thin profiles
- The system **cross-references entities bi-directionally**, creating a web of relationships rather than isolated contact cards
- Multiple cron jobs form a **flywheel** where each pipeline feeds the enrichment system, compounding knowledge autonomously

## **Looking Ahead**

Your brain is growing automatically now. But what happens when those rules need to change? When your directory structure evolves, or when you realize that "companies/" should actually split into "portfolio/" and "prospects/"? Next, we'll explore **Migrations: Evolving Your Brain Without Breaking It**, and learn how to refactor your knowledge base while keeping all those carefully enriched entities intact.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/GBRAIN_RECOMMENDED_SCHEMA.md (Example 2: Email Triage — Resolver + Enrichment in Action)
- https://github.com/garrytan/gbrain/blob/main/docs/GBRAIN_RECOMMENDED_SCHEMA.md (Example 3: The Compound Effect — How Context Builds Before a Meeting)