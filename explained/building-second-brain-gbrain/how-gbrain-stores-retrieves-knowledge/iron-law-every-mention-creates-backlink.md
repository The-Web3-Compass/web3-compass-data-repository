## **The Secretary Who Finally Learned to Read**

You finish a marathon meeting. Three hours of back-and-forth, four new people you've never met, two companies you've never heard of. You open your notes app—no longer trapped by the local-versus-production choice that would have stranded you in that Tokyo café—and dutifully type out what happened, who said what, which decisions got made. Then you sigh, open a second app, and start manually creating contact cards for each person. Open a third app to log which company each person works for. Open a fourth to connect the meeting to the attendees.

By the time you've finished the *administrative* work of linking everything together, you've forgotten half the actual insights from the meeting.

Before v0.12.0, agentic knowledge worked exactly this way. Agents could write beautiful markdown pages, but maintaining the graph (the web of relationships between people, companies, meetings, and ideas) required a parallel layer of manual API calls. Write the content, then call `add_link`. Update the content, then remember to remove stale links. The **Iron Law** demanded bidirectional relationships, but the work of creating them fell entirely on you.

Then something changed. The system learned to read what you were already writing.

---

## **Act 1: The Taxonomy of Tedious**

Imagine a university library in the 1950s. When a professor publishes a paper citing another researcher, the librarians don't just file the paper and call it done. They create a card in the citation catalog. They create a reverse entry so you can find who cited whom. They maintain a separate index for subjects, authors, institutions. Every new publication triggers a cascade of manual cross-referencing work.

The **Iron Law** felt like this in practice. The law itself is simple: every brain write must maintain back-links. If you mention Alice in a meeting note, Alice's person page should link back to that meeting. If you reference Acme Corp in a project writeup, the company page should know about the project.

The implementation, though? Pure friction.

You'd write your page content in markdown, carefully crafting `[Alice](people/alice)` links to make the text readable. Then you'd make separate `add_link` calls to tell the graph database about those relationships. Update the page later, remove a reference to someone who didn't actually attend, and now you had stale links pointing to ghosts. The content and the graph drifted apart, and search results started lying to you.

The docs put it plainly: "No manual `add_link` calls needed for ordinary page writes." But to understand why this matters, you have to feel the weight of what came before.

---

## **Act 2: The Post-Hook That Paid Attention**

Picture a brilliant executive assistant who finally learns to actually *read* your emails instead of just filing them. You mention you're meeting with Sarah from Marketing next Tuesday. Without being asked, your assistant adds Sarah to your calendar, pulls her recent work, and checks that you have her contact info. You didn't make extra requests. You just wrote naturally, and the system extracted what it needed.

The **auto-link reconciliation** post-hook on `put_page` works exactly this way.

Here's what actually happens when you save a page. The system parses your markdown content and extracts every entity reference, specifically the `[Name](people/slug)` and `[Company](companies/slug)` links you've been sprinkling through your prose. It infers relationship types based on context. A meeting page that mentions people gets `attended` links. A person page that mentions a company gets `works_at` or maybe `founded` if the frontmatter suggests it. Default relationships fall back to simple `mentions` or `source` when nothing else fits.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing markdown content on left with entity references highlighted, flowing through auto-link post-hook in center, resulting in populated links table on right with relationship types labeled" width="600" height="350" /></p>

Then comes the reconciliation magic. The system looks at what links currently exist for this page in the database. It compares that to what it just found in your content. New references get added as fresh links. References that disappeared from your text get removed. The graph stays perfectly synchronized with your source of truth (the actual page content) in a single atomic operation.

The response tells you exactly what happened: `auto_links: { created: 3, removed: 1, errors: 0 }`. You can verify the work without doing the work.

**⚠️ Watch Out For:**

- **Thinking auto-link handles timeline entries.** It doesn't. Dated events with specific timestamps still need explicit `gbrain timeline-add` calls. The post-hook manages relationships between pages, not chronological event logging.
- **Assuming reverse links happen automatically.** If Page A mentions Page B, the link goes A→B. For B→A, you need to edit Page B to mention Page A. The system reads what you write; it doesn't invent mentions.

---

## **Act 3: The New Iron Law**

The difference between the old and new Iron Law is the difference between a library where you file a book and fill out seventeen cross-reference cards, versus a library where you simply write a good bibliography and the catalog populates itself.

With auto-link in place, your obligation under the Iron Law transforms completely. The old contract was: write content, then make API calls to maintain the graph (filing the book, then filling out the cards). The new contract is: just include entity references in your content using normal markdown syntax (writing the bibliography).

That's it. Write `[Alice](people/alice)` when Alice comes up in your meeting notes. Write `[Acme Corp](companies/acme)` when discussing the deal. The system extracts and structures these relationships automatically. The graph maintains itself from the prose you're already writing.

The docs call this **Iron Law compliance via content references**: "The agent's Iron Law obligation is now: include the entity reference in the page content; auto-link handles the structured row."

The mental burden shifts from "remember to call the API" to "write naturally with proper references."

**⚠️ Watch Out For:**

- **Disabling auto-link and thinking you're done.** You can turn it off with `gbrain config set auto_link false`, but the Iron Law still applies. Without auto-link, you're back to manual `add_link` maintenance. The law requires back-links exist, regardless of how you comply.
- **Forgetting that some relationships can't be expressed in prose.** If you need to record that Alice "advises" Bob but there's no natural way to write that in either person's page content, you still need manual `add_link`. Auto-link handles references; it doesn't handle abstract relationship assertions that don't fit in narrative text.

---

## **The Real-World Picture**

Your investment team just wrapped a pitch meeting with a startup. You draft the meeting note, naturally linking to `[Sarah Chen](people/sarah-chen)` as the founder and `[Velocity Ventures](companies/velocity-ventures)` as her prior employer you discussed. You hit save. Auto-link creates the `attended` relationship from meeting to Sarah, a `mentions` link to Velocity Ventures, and returns the summary in the response. When you later visit Sarah's person page, the meeting appears in her linked references. When you browse Velocity Ventures, you see this meeting mentioned as context. You never made a single `add_link` call. The graph grew organically from your prose. Six months later, when you research Sarah's background, that meeting surfaces in search because the relationship was preserved automatically.

---

## **What You Now Know**

- How the auto-link post-hook parses markdown content to extract entity references during every `put_page` call
- How relationship types get inferred from page context and frontmatter, with sensible defaults when context is unclear
- How stale link reconciliation works—adding new references and removing disappeared ones in the same atomic operation
- How Iron Law compliance shifts from explicit API calls to simple content hygiene: include entity references in your markdown
- When manual `add_link` remains necessary—for relationships that cannot be naturally expressed in page content

## **Looking Ahead**

Now that you understand how relationships form automatically at write-time, the next question becomes: when do those relationships actually become visible to other agents? In **Sync States and Federation: When Knowledge Becomes Available**, we'll explore how gbrain handles the timing of knowledge propagation across distributed systems and what "eventually consistent" actually means for your agent's ability to reason about freshly-written pages.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/UPGRADING_DOWNSTREAM_AGENTS.md (Phase 2.5: Structured Graph Updates, meeting-ingestion/SKILL.md, signal-detector/SKILL.md, enrich/SKILL.md, After all four diffs are applied, v0.13.0 — Frontmatter Relationship Indexing)