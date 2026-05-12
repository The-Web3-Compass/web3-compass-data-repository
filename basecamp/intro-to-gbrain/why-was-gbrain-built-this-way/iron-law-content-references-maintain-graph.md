---
## **The Busywork That Ate Your Afternoon**

You're halfway through writing up meeting notes. Alice from engineering brought up the latency issues. Bob from product suggested the new caching strategy. You mention the Acme Corp partnership that makes the whole thing possible. Your notes are flowing, insights are connecting, and then—you stop. Now you have to open a separate tool. File three link requests. Manually specify that Alice *attended* this meeting, that Bob *advised* on the topic, that Acme Corp is the *source* of the partnership context. By the time you've clicked through all the forms, you've forgotten the brilliant synthesis you were about to write.

This was the tax on every thought in the old system. The **Iron Law** said relationships had to be maintained, but it didn't say *how*. So developers built elaborate rituals: write content, then perform link maintenance, hope you didn't miss any references, hope you remembered to remove links when content changed. The graph became a separate garden that needed its own gardener.

What if mentioning someone in your notes was enough? What if the act of writing `[Alice](people/alice)` in your markdown automatically updated your contact graph, created the relationship, and kept everything synchronized without a second thought?

## **Act 1: The Sentinel at the Door**

Imagine a brilliant executive assistant who watches everything you write. When you mention "let's loop in Sarah from marketing" in an email, they don't just nod—they automatically add Sarah to the project roster, note her role, and remove her if you later delete that sentence. They never sleep, never forget, and never create duplicate entries.

**Auto-link reconciliation** is that assistant. It's a **post-hook** on the `put_page` operation—a piece of logic that automatically runs every time you save a page. Instead of treating your markdown as dead text, it reads what you wrote, finds every entity reference you've made, and updates the **links table** to match.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing markdown content flowing into put_page, with auto-link post-hook extracting references and updating links table while removing stale entries" width="600" height="350" /></p>

Here's what actually happens when you hit save. The system **parses your markdown content** to extract every entity reference—any time you've written `[Name](people/slug)` or `[Company](companies/slug)`. Then it **infers relationship types** based on context: if this is a meeting page and you mentioned Alice, that's an `attended` link. If it's a company page and you mentioned Bob, that might be a `works_at` link. Other relationships like `invested_in`, `founded`, `advises`, `source`, and `mentions` get detected automatically.

The crucial part is **reconciliation**. The system compares what you're writing now against what you wrote before. New references get added as fresh links. References you've deleted get removed from the graph—**stale links don't accumulate** like dust on unused shelves. The whole operation is **atomic**: it all happens in one go, and your `put_page` response includes a verification summary showing exactly what changed—`created`, `removed`, and any `errors`.

**⚠️ Watch Out For:**
- **Assuming bidirectional magic.** Writing `[Alice](people/alice)` in your meeting notes creates a link from meeting → Alice, but not from Alice → meeting. The reverse requires editing Alice's page to mention the meeting.
- **Thinking it handles dates.** Auto-link extracts *who* and *what* relationships from content, but **timeline entries with specific dates still need explicit `gbrain timeline-add` calls**. The system won't guess that "last Tuesday" means 2024-03-15.

## **Act 2: The Contract You Didn't Know You Signed**

There's an elegant boundary in this system, a line between what happens automatically and what requires your explicit intention. Think of it like a smart assistant who organizes your address book from your emails but refuses to schedule meetings without asking—you wouldn't want them guessing that "we should talk next month" means March 15th at 2pm.

This is the **splitBody timeline sentinel contract**. The `put_page` operation handles the graph of *relationships*—who knows whom, who works where, who attended what. But **temporal records**—dated events, timeline entries, historical milestones—require deliberate handling outside the content flow. The markdown body is the single source of truth for entity connections, but time is too important to infer from prose.

<p align="center"><img src="PLACEHOLDER" alt="Comparison diagram showing auto-link handling entity references in markdown body vs explicit timeline-add calls required for dated events" width="600" height="350" /></p>

What this means practically: you can write "Alice and Bob discussed the Acme Corp acquisition" and the graph automatically knows Alice and Bob attended this meeting, that Acme Corp was mentioned as a topic. But if you want to record that this meeting happened on March 15th, 2024, you still make that explicit call. The system separates *semantic connections* (automatic) from *chronological facts* (intentional).

The relationship types the system can infer include:
| Relationship | Context That Triggers It |
|--------------|--------------------------|
| `attended` | Person referenced in a meeting page |
| `works_at` | Person referenced on a company page |
| `invested_in` | Investor referenced in relation to a company |
| `founded` | Founder referenced in company founding context |
| `advises` | Advisor relationship from frontmatter or context |
| `source` | Entity credited in page frontmatter |
| `mentions` | Default for references that don't match other patterns |

**⚠️ Watch Out For:**
- **Disabling auto-link and forgetting the Iron Law.** You *can* turn this off with `gbrain config set auto_link false`, but the Iron Law still applies—you'll just have to maintain all links manually instead.
- **Hoarding manual link calls.** Some developers still call `gbrain link` for relationships already expressed in their markdown out of habit. Trust the post-hook. Reserve manual `add_link` calls only for relationships that *cannot* be expressed in prose content.

## **Act 3: Shifting the Burden**

The real philosophical shift here is about where the work lives. Before, satisfying the Iron Law meant *doing extra work after writing*. Now it means *writing differently*. Your obligation became content hygiene: if Alice attended the meeting, mention her using markdown reference syntax. That's it. The graph maintains itself.

This is **Iron Law compliance via content references**—the understanding that structured data can emerge from natural writing if you use the right conventions. You no longer maintain the graph separately from content. You don't file link requests. You just write, and the system extracts structure from your prose.

When you save a page, watch for the `auto_links` field in your response. It tells you how many relationships were created, how many stale ones were cleaned up, whether anything failed. It's your receipt that the graph updated to match your content. If you see `created: 3, removed: 1, errors: 0`, you know three new connections were forged and one outdated reference was pruned—all without you lifting a finger beyond writing.

---

## **The Real-World Picture**

You're building a founder relationship tracker for your venture fund. A partner forwards an email thread: Sarah (CTO at Acme) and Marcus (founder of StartupCo) have been discussing a potential integration. In the old world, you'd parse the email, write up the insight, then manually create links: Sarah *works_at* Acme, Marcus *founded* StartupCo, Sarah and Marcus *discussed* this topic. In the new world, you write one note: "Sarah Chen [CTO at [Acme Corp](companies/acme)] reached out to Marcus Jones [founder of [StartupCo](companies/startupco)] about API compatibility." You hit save. The auto-link response shows `created: 4`—Acme Corp, StartupCo, Sarah, and Marcus are all now properly linked to this signal note. The relationship graph updated itself from natural prose. You spent zero seconds on link maintenance.

---

## **What You Now Know**

- How **auto-link reconciliation** extracts entity references from markdown content during every `put_page` call
- How the system **infers relationship types** based on page context and automatically updates the links table
- Why **stale links are automatically removed** when references disappear from content
- The boundary between auto-link (relationships) and explicit **timeline entries** (dated events)
- How the Iron Law obligation shifted from "make extra API calls" to "include entity references in your content"
- When to use manual `add_link` (only for relationships that cannot be expressed in markdown)

## **Looking Ahead**

Auto-link keeps your graph synchronized with your content, but how do you know *why* a relationship exists? In the next lesson, **Traceability: Every Claim Has a Receipt**, we'll explore how GBrain maintains provenance—tracking where every piece of information came from so you can always follow the trail from insight to source.

---

## **Sources**
- https://github.com/garrytan/gbrain/blob/main/docs/UPGRADING_DOWNSTREAM_AGENTS.md (Phase 2.5: Structured Graph Updates)
- https://github.com/garrytan/gbrain/blob/main/docs/UPGRADING_DOWNSTREAM_AGENTS.md (splitBody timeline sentinel contract)