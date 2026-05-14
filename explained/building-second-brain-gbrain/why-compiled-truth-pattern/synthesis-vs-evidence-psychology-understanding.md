Maya was drowning in her own notes.

Last time you learned that compiled truth is completely rewritten when new evidence arrives, while the timeline only grows downward. Maya's three-year wiki experiment shows exactly what happens when that separation collapses.

She'd spent three years building a personal wiki — thousands of pages about projects, people, and ideas. Every time she met someone, she'd create a page. Every interesting company got an entry. But she kept hitting the same wall: her relationships were scattered across twenty different notes, and her timeline of *actual events* was a mess of forgotten dates and duplicate entries.

One day, she realized she'd recorded her first meeting with Sarah Chen three different times. Once in her contacts note. Once in her January recap. Once in the "potential advisors" list. But her calendar still couldn't tell her *when* that meeting actually happened. The connections existed everywhere. The facts existed nowhere.

Maya didn't need more notes. She needed a system that understood the difference between *knowing someone exists* and *knowing when something happened*.

This is the psychology of compiled truth.

## **Act 1: The Universal Port**

### **Two-Layer Page Architecture Pattern**

Imagine your phone charger. Five years ago, you needed a different cable for every device. Lightning for iPhone. Micro-USB for your headphones. Some weird proprietary connector for your camera. Every time you switched devices, you threw out your cables and bought new ones. Your accessories were trapped by your choice of phone.

Then USB-C arrived. The same port works for laptops, phones, tablets, and headphones. The *interface* stayed identical whether you were plugging in a tiny thumb drive or a massive external RAID array. The physical connector didn't care about the storage underneath.

**Two-Layer Page Architecture** works the same way. It separates how your application talks to data from how that data is actually stored. Your code speaks one language: **slugs** (human-readable identifiers like `people/maya-rodriguez`). The **BrainEngine** underneath handles the messy reality of IDs, SQL dialects, and storage engines.

The engine interface defines operations using portable slugs, not database-specific numeric IDs. Concrete engines implement storage-specific details. Postgres uses recursive CTEs for graph traversal, while PGLite might use loops. Postgres uses `tsvector` and `pgvector` for search. Other engines use their equivalents. Your application sees the same USB-C port either way.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing BrainEngine interface in center with arrows to PostgresEngine and PGLiteEngine below, and application code above — all connected through a USB-C shaped connector symbol" width="600" height="350" /></p>

Behind the scenes: embedding generation lives in `src/core/embedding.ts` (an external API call to OpenAI), not in the engine. Chunking lives in `src/core/chunkers/`. The engine only stores and retrieves what's already been processed. Search ranking via RRF fusion happens above the engine layer too. It operates on standardized `SearchResult[]` arrays that any engine can produce.

**⚠️ Watch Out For:**
- **Thinking the engine generates embeddings.** It doesn't — embedding is an external service the engine consumes. The engine stores vectors and searches by similarity, but creation happens elsewhere.
- **Believing you must choose your engine upfront.** Migration commands exist to move between PGLite (local, embedded) and Postgres (cloud, managed) bidirectionally and losslessly.

You can start with PGLite (zero-config, running in WASM, perfect for your laptop) and graduate to Supabase when you hit 10,000 pages. Your code doesn't change. Your interface doesn't change. Only the engine underneath swaps out, like switching from a thumb drive to a server rack using the same cable.

## **Act 2: The Smart Assistant and the Calendar**

### **SplitBody Timeline Sentinel Contract**

Now back to Maya's problem. She had relationship data scattered everywhere, but event data missing in action. The system needed to treat these two types of knowledge differently.

Think of it like a smart assistant who reads your emails. When you mention "grabbing coffee with Sarah Chen," the assistant automatically adds Sarah to your address book. No extra work needed. The reference itself is the action. But when you want to schedule that coffee for next Tuesday at 3pm, the assistant stops and asks. It doesn't guess the date from your email tone. Time requires intention.

This mirrors how the `put_page` operation works. When you save page content containing entity references (written as `[Name](people/slug)` markdown links), an auto-link post-hook (the sentinel) extracts those references. It infers relationship types like `attended`, `works_at`, or `invested_in`. Then it updates the `links` table automatically. Remove a reference from your markdown, and the link disappears. Add one, and it appears. The graph maintains itself from the single source of truth: your content.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing markdown content on left flowing through put_page to auto-link sentinel, which updates links table automatically, while timeline-add is shown as a separate explicit path with a hand cursor clicking it" width="600" height="350" /></p>

But timeline entries — dated events with specific temporal boundaries — require you to explicitly call `gbrain timeline-add`. The system won't infer from context that "last quarter's meeting" means March 15th. Temporal precision demands explicit human (or agent) intention. The markdown body serves as the single source of truth for entity relationships, but time lives outside that flow.

| Aspect | Entity Relationships | Timeline Entries |
|--------|---------------------|------------------|
| Trigger | Automatic via `put_page` | Explicit API call |
| Source of truth | Markdown content references | Deliberate temporal record |
| Inference | Yes — extracts from text | No — dates must be specified |
| Updates | Auto-reconciles on save | Manual management |
| Types | `attended`, `works_at`, `invested_in`, etc. | Event-specific with timestamps |

**⚠️ Watch Out For:**
- **Expecting auto-link to handle your timeline.** It won't. If you write "Met Sarah in Q1 2024" in your markdown, that's a relationship link — not a dated timeline entry. You still need `gbrain timeline-add` if you want chronological search later.
- **Leaving stale manual `add_link` calls in your code.** If you're already expressing relationships in markdown content, the sentinel handles it. Manual calls are redundant and create maintenance debt.

There's a reason for this split. Relationships are *synthesis* — connections inferred from what you know. Timeline entries are *evidence* — immutable claims about when things happened, as you learned in "The Timeline as Immutable Evidence Chain." You can reconstruct relationships from content. Timeline entries must be recorded as facts.

---

## **The Real-World Picture**

You're building a startup CRM with gbrain. Your agent scans email threads and automatically creates or updates company pages. When an email mentions "our investor Sarah Chen," the page updates instantly. New link created. No code needed. But when you close a funding round, you explicitly call `gbrain timeline-add` to record the date, amount, and valuation. Six months later, when an investor asks "when did you hit that milestone?" your query hits precise temporal records, not a parsing of old emails. The synthesis stayed automatic. The evidence stayed authoritative.

---

## **What You Now Know**

- How the Two-Layer Page Architecture Pattern lets you swap between embedded PGLite and cloud Postgres without changing application code
- Why the BrainEngine interface uses slugs instead of database IDs to remain portable across storage backends
- How the splitBody timeline sentinel contract separates auto-reconciled relationship links from explicitly-managed timeline entries
- Why temporal data requires deliberate API calls while entity references maintain themselves from markdown content
- How this architecture preserves the "single source of truth" principle while respecting the different psychology of connections versus chronology

## **Looking Ahead**

Now that you understand how relationships auto-maintain themselves while timeline entries stay explicit, you're ready to learn why markdown itself (not a database schema, not a proprietary format) becomes the ultimate source of truth in this system. Next up: "Why Markdown Wins as Source of Truth."

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/ENGINES.md (The idea; Why this matters; Key design choices; How search works across engines; PGLiteEngine)