---
## **The Librarian Who Never Sleeps**

You wake up to eight new emails. Three are newsletters you'll never read. Two are calendar confirmations. One is an internal update. The eighth is from someone named David Park — a venture capitalist you've never met, reaching out about co-investing in a startup you looked at months ago.

In the old world, you'd do one of three things: ignore it, star it for later and forget, or spend twenty minutes frantically googling "David Park Ridgeline Ventures" while trying to remember what you thought about NovaTech back in February.

In a brain system with a **resolver**, something else happens entirely. By the time you see that email, your system has already searched every corner of your knowledge base, discovered David has never appeared before, determined he belongs in your `people/` directory, researched his fund's focus, found his public writing on AI infrastructure, noticed he reposted something about NovaTech last week, and cross-linked him to that company file you created two months ago. 

The notification you receive doesn't just say "New email from David Park." It says: *"David Park, GP at Ridgeline Ventures — they're enterprise SaaS focused, and he's reaching out about NovaTech, which you already have in your brain from a February meeting."*

This is what automatic filing feels like when it actually works.

## **Act 1: The Filing Problem**

Most "contact management" is a graveyard of good intentions. You meet someone at a conference. You exchange emails. You promise to "grab coffee soon." Six months later, they're just a name in your inbox — no context, no history, no connection to the rest of your knowledge. The CRM entry you half-created contains only what you manually typed while distracted.

The fundamental issue is categorization friction. Every new person or company requires a decision: *Who is this? Where do they belong? How much should I care?* These micro-decisions accumulate into decision fatigue. So most entities remain unfiled, floating in ephemeral spaces like email threads and meeting notes, disconnected from the growing body of knowledge they should enrich.

A **resolver-based entity categorization** system eliminates this friction. At its core, it's a simple promise: every unknown person or company you encounter is automatically categorized, filed in the correct brain directory, and enriched to the appropriate depth the moment they appear in your data. No manual data entry required. No "I'll get to this later."

Think of it like a librarian who instantly decides which shelf a new book belongs on and how detailed the catalog card should be, based on the book's relevance to your current research. When a name surfaces in your email, your meeting notes, or your social feed, the resolver activates. It **greps the brain** — searches through your existing markdown files — looking for any trace of this entity using names, handles, and email aliases. If it finds a match, it updates the existing record. If not, it consults a ruleset (the RESOLVER.md file) to determine whether this belongs in `people/`, `companies/`, or another categorical path.

**⚠️ Watch Out For:**
- **Assuming all entities are created equal.** The resolver doesn't just file — it assigns **enrichment tiers** based on interaction significance. A social media mention gets filed thinly; a direct business contact gets researched deeply.
- **Thinking this only works for people you already know.** The system's explicit design is for *unknown discovery* — the entities you've never encountered before are precisely who benefit most from automatic filing.

## **Act 2: The Escalation Ladder**

Not every contact deserves deep research. The person who liked your tweet about developer tools needs a lighter touch than the investor sending you a term sheet. **Tiered enrichment levels** solve this by applying escalating depth based on signal strength.

The system classifies interactions by significance. Minor social signals — a reply on X, a mention in a newsletter — trigger **Tier 3**: source extraction only. The system captures what it knows from the immediate context (the reply text, the handle, the date) and stops there. No API calls, no web searches, no creeping on LinkedIn. Just enough to remember that this person exists and where you encountered them.

Direct unsolicited contacts — emails, meeting requests, introductions — trigger **Tier 2**. Now the system activates: web searches to find their role and company, social graph analysis to understand their public voice, cross-referencing against your existing brain to find connections. If someone emails you about a company you already track, the system notices and links them.

Here's where it gets interesting: entities automatically **upgrade tiers** when new signals connect to existing thin profiles. That person who just had a Twitter handle in Tier 3? When they email you two days later, the system recognizes the connection, upgrades them to Tier 2, and fills in the gaps.

| Tier | Trigger | Depth | Cost |
|------|---------|-------|------|
| Tier 3 | Social mentions, passive signals | Handle, name, source context | Minimal — no external APIs |
| Tier 2 | Direct contact, email outreach | Web profile, social analysis, cross-links | Moderate — search and API calls |
| Tier 1 | Upcoming meetings, key relationships | Full profile, network analysis, beliefs | Higher — comprehensive research |

**⚠️ Watch Out For:**
- **Treating Tier 3 records as incomplete or broken.** They're not — they're *appropriately minimal* for transient mentions. Not everyone needs a dossier.
- **Assuming tiers are permanent.** They're dynamic classifications that escalate as relationships develop. A thin social record can become a rich profile without you lifting a finger.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing entity Lena Kovac progressing from Tier 3 (X reply only) to Tier 2 (email received, web search conducted) to Tier 1 (meeting scheduled, full enrichment with mutual connections and career history)" width="600" height="350" /></p>

## **Act 3: The Compound Effect**

The resolver shines in how it handles the passage of time. Consider Lena — someone who replies to your post about developer tools on Tuesday afternoon. The social radar cron detects her reply, finds no existing match, creates a thin Tier 3 page with her handle and the reply text. Done. Appropriate for the signal.

Wednesday morning, an email arrives from `lena@kovac.dev`. The email monitor searches the brain, finds that thin page, recognizes this is the same person now making direct contact. **Upgrade to Tier 2.** The system adds her email as an alias, searches for her personal site, discovers she's building a startup called Lattice, finds her conference talks about compiler-driven UX, locates her LinkedIn, notes she's technical and founder-energy. The page grows.

Wednesday evening, the executive assistant cron notices you have a meeting with Lena tomorrow — she booked through your public link. **Upgrade to Tier 1.** Now the system pulls her full background: Stanford CS, four years on a compiler team, two mutual connections with you, her beliefs about developer tools being "stuck in 2015." Everything saves to her page.

Thursday morning, your daily briefing reads: *"2:00 PM — Lena Kovac (Lattice). Building a developer tools startup. She replied to your devtools post last Tuesday, then emailed the next morning. Her public writing argues compiler intelligence should drive the editing experience. Two mutual connections. Technical, founder energy."*

You walk into that meeting knowing exactly who she is and why she reached out — because four autonomous cron runs over 48 hours each fed the enrichment pipeline, and the pipeline knew how to escalate based on relationship signals.

**The key insight:** Knowledge compounds autonomously when the plumbing is wired correctly. Each workflow doesn't just do its job — it feeds every future workflow. The meeting ingestion cron creates pages that the morning briefing cron reads. The email monitor enriches people that the social radar first detected. The whole system becomes a flywheel.

---

## **The Real-World Picture**

You're running a venture fund and receive 400 emails weekly. Without a resolver, your partners manually research senders, create Notion pages for interesting contacts, and inevitably skip the "quick mentions" that don't seem urgent. With resolver-based categorization, every unsolicited email from a named person triggers automatic Tier 2 enrichment: the sender's fund focus, their recent investments, their connection to companies already in your pipeline, and their social presence all appear in a brain page before you finish reading the subject line. When that same person appears in a meeting six months later, their profile has already accumulated relationship history, mutual contacts, and your past thoughts from manual notes — no frantic pre-meeting googling required.

---

## **What You Now Know**

- How a resolver automatically categorizes and files people and companies by searching existing brain content and consulting rulesets for new entities
- Why tiered enrichment prevents wasted effort on transient mentions while ensuring deep context for meaningful contacts
- How entity pages dynamically upgrade from thin extracts to rich profiles as relationship signals accumulate
- The compound effect: autonomous pipelines feeding each other create a flywheel where knowledge deepens without manual intervention
- The difference between appropriate minimalism (Tier 3 for social noise) and warranted depth (Tier 1 for upcoming meetings)

## **Looking Ahead**

Now that entities are automatically filed and enriched, you'll discover how these isolated profiles weave together into a dense network of relationships. In the next lesson, *Entity Cross-Referencing: Building the Web*, you'll learn how the brain creates bi-directional links between people, companies, and concepts — turning your directory of files into a living knowledge graph where every connection is explicit and traversable.

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/GBRAIN_RECOMMENDED_SCHEMA.md (Example 2: Email Triage — Resolver + Enrichment in Action)
- https://github.com/garrytan/gbrain/blob/main/docs/GBRAIN_RECOMMENDED_SCHEMA.md (Example 3: The Compound Effect — How Context Builds Before a Meeting)